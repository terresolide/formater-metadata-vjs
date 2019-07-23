<i18n>{
   "en":{
     "search": "Search ..."
   },
   "fr":{
      "search": "Rechercher ..."
   }
}
</i18n>
<template></template>
<script>


export default {
  name: 'FormaterRequester',
  props: {
    lang: {
      type: String,
      default: 'en'
    },
    depth: {
      type: Number,
      default:0
    }
  },
  watch: {
    lang (newvalue) {
      this.$i18n.locale = newvalue
      this.$setGnLocale(newvalue)
      this.srv = process.env.GEONETWORK + 'srv/' + (newvalue === 'fr' ? 'fre' : 'eng') + '/'
      this.headers['Accept-Language'] =  newvalue === 'fr' ? 'fre': 'eng'
    },
    depth (newvalue) {
      console.log('nouvelle valeur depth = ' + this.depth)
    }
  },
  data() {
    return {
      srv: process.env.GEONETWORK + 'srv/' + (this.lang === 'fr'? 'fre' : 'eng') + '/',
      api: null,
     // api: process.env.GEONETWORK + '/srv/api/',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': this.lang === 'fr' ? 'fre': 'eng'
      },
      first: true,
      dimensions: [],
      parameters: {},
      changePageListener:null,
      temporalChangedListener: null,
      spatialChangedListener: null,
      dimensionChangedListener: null,
      // metadataWithChildListener: null,
      textChangedListener: null,
      selectChangedListener: null,
      // listen a global reset event
      resetListener: null,
      facet: [],
//       // use for opensearch api
//       geographic: ['geometry', 'box', 'lat', 'lon', 'radius'],
//       paging: ['maxRecords', 'index', 'page'],
//       removedFields: ['lang', 'name', 'q'],
//       osParameters: [],
//       geoParameters: [],
//       pagingParameters: [],
       type: 'geonetwork'
     }
  },
  created () {
    this.parameters.from = 1
    this.parameters.to = this.nbRecord
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    // this.getRecords() done when <formater-paging> is mounted with its pageChangeEvent on order control change
    this.pageChangedListener = this.changePage.bind(this)
    document.addEventListener('fmt:pageChangedEvent', this.pageChangedListener);
    this.temporalChangedListener = this.getRecords.bind(this)
    document.addEventListener('temporalChangeEvent', this.temporalChangedListener);
    this.spatialChangedListener = this.getRecords.bind(this)
    document.addEventListener('fmt:spatialChangeEvent', this.spatialChangedListener);
    this.dimensionChangedListener = this.getRecords.bind(this);
    document.addEventListener('fmt:dimensionChangeEvent', this.dimensionChangedListener);
    this.textChangedListener = this.getRecords.bind(this);
    document.addEventListener('fmt:textChangeEvent', this.textChangedListener);
    this.selectChangedListener = this.getRecords.bind(this);
    document.addEventListener('fmt:selectChangeEvent', this.selectChangedListener)
     this.metadataWithChildListener = this.getRecords.bind(this)
    document.addEventListener('fmt:metadataWithChildEvent', this.metadataWithChildListener)
    this.resetListener = this.handleReset.bind(this);
     document.addEventListener('fmt:resetEvent', this.resetListener);
  },
  destroyed () {
    document.removeEventListener('fmt:pageChangedEvent', this.pageChangedListener);
    this.pageChangedListener = null;
    document.removeEventListener('temporalChangeEvent', this.temporalChangedListener);
    this.temporalChangedListener = null;
    document.removeEventListener('fmt:spatialChangeEvent', this.spatialChangedListener);
    this.spatialChangedListener = null;
    document.addEventListener('fmt:dimensionChangeEvent', this.dimensionChangedListener);
    this.dimensionChangedListener = null
    document.removeEventListener('fmt:textChangeEvent', this.textChangedListener)
    this.textChangedListener = null
    document.removeEventListener('fmt:selectChangeEvent', this.selectChangedListener)
    this.selectChangedListener = null
    document.removeEventListener('fmt:metadataWithChildEvent', this.metadataWithChildListener)
    this.metadataWithChildListener = null
    document.addEventListener('fmt:resetEvent', this.resetListener);
    this.resetListener = null
  },
  mounted () {
//     this.facet.facetFormaterFre = []
//     this.facet.facetFormaterFre.push('https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fsolid_earth/https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fgeothermal/https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fgeothermal-geothermal_temperature')
//     this.facet.facetFormaterFre.push( 'https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fsolid_earth/https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fnon_solid/https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fnon_solid-hydrogen_gas')
   
    // url="http://demo.formater/geonetwork/srv/fre/qi?_content_type=json&bucket=2365825987452666&fast=index&from=1&to=41"
  },
  methods: {
    initParameters () {
      switch (this.type) {
      case 'geonetwork':
        this.parameters = {
          _content_type: 'json',
           fast: 'index',
        //  'facet.q': '',
          bucket: '26041996',
          from: 1,
          to: this.nbRecord,
          //  resultType: 'subtemplate',
          // resultType: 'details',
          sortBy: 'title',
          sortOrder: 'reverse'
         }
        break;
        
      case 'opensearch':
        this.parameters = {
          index: 1,
          maxRecords: 20
        }
        break;
      }
    }, 
    getRecords (event) {
      // trigger search event like breadcrumb
      if (event.detail && typeof event.detail.depth == 'number') {
        var depth = event.detail.depth
      } else {
        var depth = this.depth
      }
      
      var e = new CustomEvent("aerisSearchEvent", { detail: {depth: depth}});
      document.dispatchEvent(e);
      
      if (e.detail.api) {
        this.api = e.detail.api
        delete e.detail.api
        this.type = 'opensearch'
        
      } else {
        this.type = 'geonetwork'
        this.api = null
      }

      this.prepareRequest(e)
      this.requestApi()
    },
    prepareRequest (e) {
      switch (this.type) {
      case 'geonetwork':
        this.prepareRequestGeonetwork(e)
        break;
      case 'opensearch':
        this.prepareRequestOpensearch(e)
        break
      }
    },
    prepareRequestGeonetwork(e) {
      
      this.initParameters()
      if (!e.detail.startDefault) {
        e.detail.renameProperty('start', 'extFrom')
      } else {
        delete e.detail.start
      }
      if (e.detail.endDefault) {
        delete e.detail.endDefault
        delete e.detail.end
        
      } else {
        e.detail.renameProperty('end', 'extTo')
      }
      delete e.detail.startDefault
      delete e.detail.endDefault
     // delete e.detail.depth
      delete e.detail.recordPerPage
      if (e.detail.parentUuid) {
        this.parameters.resultType = 'subtemplate'
      } else {
        this.parameters.isChild = false
        this.parameters.resultType = 'details'
      }
      if (this.depth > 0) {
        // voir plutôt les key à éliminer centre de données, variable, instruments, gemet, types?
        for(var key in e.detail) {
          if (['any', 'geometry', 'extTo', 'extFrom', 'from', 'to', 'parentUuid'].indexOf(key) >=0){
            this.parameters[key] = e.detail[key]
          }
        }
        if (event.detail && event.detail.nbRecords) {
          this.parameters.from = 1
          this.parameters.to = event.detail.nbRecords
        }
      } else {
        this.prepareFacet(e)
        this.parameters = Object.assign(this.parameters, e.detail)
      }
    },
    prepareRequestOpensearch(e) {
      
      this.initParameters()
      if (!e.detail.startDefault) {
      e.detail.renameProperty('start', 'firstDateMin')
    } else {
      delete e.detail.start
    }
    if (e.detail.endDefault) {
      delete e.detail.endDefault
      delete e.detail.end
      
    } else {
      e.detail.renameProperty('end', 'secondDateMax')
     }
    delete e.detail.startDefault
    delete e.detail.endDefault
    delete e.detail.depth
    
    this.parameters = Object.assign(this.parameters, e.detail)   

    },
    requestApi ()  {
        switch (this.type) {
        case 'geonetwork':
          this.requestApiGeonetwork()
          break;
        case 'opensearch':
          this.requestApiOpensearch()
          break;
        }
    },
    requestApiGeonetwork () {
      var depth = (typeof this.parameters.depth != 'undefined') ? this.parameters.depth : this.depth

      delete this.parameters.depth
      var headers =  {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': this.lang === 'fr' ? 'fre': 'eng'
       }

      var self = this
      this.parameters.sortOrder =  this.parameters.sortBy === 'title' ? 'ordering': 'reverse';
      var url = this.srv + 'q?' + Object.keys(this.parameters).map(function (prop) {
        return prop + '=' + self.parameters[prop]
      }).join('&');
      this.$http.get(url, {headers: headers}).then(
        response => {  this.fill(response.body, depth);}
      )
    },
    requestApiOpensearch () {
      var depth = (typeof this.parameters.depth != 'undefined') ? this.parameters.depth : this.depth
      delete this.parameters.depth
      delete this.parameters.geometry
      console.log(this.parameters)
      var self = this
      var url = this.api + (this.api.indexOf('?') > 0 ? '&' :'?');
      url += Object.keys(this.parameters).map(function (prop) {
        return prop + '=' + self.parameters[prop]
      }).join('&');
      this.$http.get(url).then(
          response => {   this.fill(response.body, depth);}
       )
    },
    // @todo DEPLACER DANS FORM VOIR MÊME DANS formater-dimension-block/ formater-facet-block!!
    prepareFacet (e) {
      var facet = ''
     
      for(var key in e.detail.facet) {
        if (e.detail.facet[key].length > 0) {
          if (facet === '') {
            facet = key +'/' + e.detail.facet[key]
          } else {
            facet += '&' + key + '/' + e.detail.facet[key]
          }
        }
      }
      if (facet !== '') {
       e.detail['facet.q'] = encodeURIComponent(facet)
       delete e.detail.facet
      }
      return e;
    },
    fill (data, depth) {
      console.log(this.depth)
      console.log(depth)
      data.depth = depth
      var event = new CustomEvent('fmt:metadataListEvent', {detail:  data})
      document.dispatchEvent(event)
    },
  /*  receiveChilds (data) {
      data.depth =  this.depth + 1
        var event = new CustomEvent('fmt:metadataListEvent', {detail:  data})
        document.dispatchEvent(event)
    },*/
   /* searchDescribe(detail) {
      console.log(detail.describe)
      this.$http.get(detail.describe.http)
      .then(
          response => { this.extractDescribeParameters(response.body, detail);}
       )
    },
    extractDescribeParameters (parameters, searchParameters) {
      var parser = new DOMParser()
      var xml = parser.parseFromString(parameters, 'text/xml')
      console.log(xml)
      var urls = xml.firstChild.childNodes
     var url = null
     console.log(urls)
      urls.forEach(function (node) {
         if (node.tagName && node.tagName.toLowerCase() === 'url' && node.getAttribute('type').indexOf('json') >= 0) {
             url = node
         }
      })
      if (!url)  {
        return
      }
      var template = url.getAttribute('template')
      var extract = template.match(/^(.*?search.json).*$/)
      console.log(extract[1])
      if (!extract[1]) {
        return
      } else {
        this.api = extract[1]
        console.log(extract[1])
      }
      var parameters = url.getElementsByTagName('parameters:Parameter')
      console.log(parameters)
      var self = this
      for(var i=0; i < parameters.length; i++){
        var name = parameters[i].getAttribute('name')
        var obj= {
            name: name,
            title: parameters[i].getAttribute('title')
        }
        var pattern = parameters[i].getAttribute('pattern')
        if (pattern) {
          obj = Object.assign(obj, {pattern: pattern})
        }
        var min = parameters[i].getAttribute('minInclusive')
        if (min) {
          obj= Object.assign(obj, {min: min})
        }
        var max = parameters[i].getAttribute('maxInclusive')
        if (max) {
          obj = Object.assign(obj, {max: max})
        }
        var nodes = parameters[i].getElementsByTagName('parameters:Options')
        if (nodes) {
          var options= []
          for(var k=0; k < nodes.length; k++) {
            options.push(nodes[k].getAttribute('value'))
          }
          if (options.length > 0)
          obj = Object.assign(obj, {options: options})
        }
        if (self.removedFields.indexOf(name) >=0) {
          
//         }else if (name.toLowerCase() === 'platform') {
//           this.platform = obj
//         } else if (name.toLowerCase() === 'q'){
//           this.hasQ = true
        } else if (self.geographic.indexOf(name) >=0) {
          self.geoParameters.push(obj)
        } else if (self.paging.indexOf(name) >= 0) {
           self.pagingParameters.push(obj)
        }else if (name.indexOf('Date') === -1 && name.indexOf('Cover') === -1) {
          self.osParameters.push(obj)
        }
        
      }
     
      this.requestApi(searchParameters)
    },*/
    handleReset () {
      console.log('reset')
      var event = new CustomEvent('aerisResetEvent')
      document.dispatchEvent(event)
      console.log(this.depth)
      this.getRecords({detail: {depth:0}})
    },
    changePage (event) {
      this.getRecords(event)
    },
    changeSearch (event) {
      this.parameters.any = event.target.value
      this.getRecords()
    }
  }
}
</script>
