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
    depth: {
      type: Number,
      default:0
    }
  },
  data() {
    return {
      srv: null,
      api: null,
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
      textChangedListener: null,
      selectChangedListener: null,
      closeMetadataListener: null,
      // listen a global reset event
      resetListener: null,
      facet: [],
       type: 'geonetwork'
     }
  },
  created () {
    if (this.$store.state.geonetwork) {
        this.srv = this.$store.state.geonetwork +  'srv/' + (this.$i18n.locale === 'fr'? 'fre' : 'eng') + '/'
    }
    if (this.$store.state.metadata) {
      this.searchSimpleMetadata()
    }

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
//     this.closeMetadataListener = this.getRecords.bind(this)
//     document.addEventListener('fmt:closeMetadataEvent', this.closeMetadataListener)
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
//     document.addEventListener('fmt:closeMetadataEvent', this.closeMetadataListener)
//     this.closeMetadataListener = null
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
          to: this.$store.state.size.nbRecord,
          //  resultType: 'subtemplate',
          // resultType: 'details',
          sortBy: 'title',
          sortOrder: 'reverse',
          type:'dataset+or+series+or+publication'
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
      delete e.detail.box
     // delete e.detail.depth
      delete e.detail.recordPerPage
      if (e.detail.parentUuid) {
        this.parameters.resultType = this.$store.state.summaryType.step2
      } else {
        this.parameters.isChild = false
        this.parameters.resultType = this.$store.state.summaryType.step1
      }
      if (this.depth > 0) {
        // voir plutôt les key à éliminer centre de données, variable, instruments, gemet, types?
        for(var key in e.detail) {
          if (['any', 'geometry', 'extTo', 'extFrom', 'from', 'to', 'parentUuid', 'type'].indexOf(key) >=0){
            this.parameters[key] = e.detail[key]
          }
        }
      } else {
        this.prepareFacet(e)
        this.parameters = Object.assign(this.parameters, e.detail)
      }
    },
    prepareRequestOpensearch(e) {
      this.initParameters()
       if (e.detail.startDefault) {
        delete e.detail.start
      }
      if (e.detail.endDefault) {
        delete e.detail.end
      } 
      this.mapParameters(e)
      this.parameters = Object.assign(this.parameters, e.detail)   

    },
    searchSimpleMetadata() {
      this.$http.get(this.$store.state.metadata).then(
          response => {  
            var data = response.body
            var uuid = data['geonet:info'].uuid
            var meta = this.treatmentSingleGeonetwork(data, uuid);
            meta.appRoot = true
            var event = new CustomEvent('fmt:metadataEvent', {detail: {meta:meta, depth: 0 } })
            document.dispatchEvent(event)
         }
        )
    },
    mapParameters(e) {
      // transform the name of parameter from this application to the opensearch api for the predefined parameter
      // or test if it is an opensearch parameter
      var specificParameters = this.$store.state.parameters.others
      var mappingParameters = this.$store.state.parameters.mapping
      for(var name in e.detail){
        var isSpecific = specificParameters.find(function (obj) {
          if (obj.name === name) {
            return true
          }
        })
        if (typeof mappingParameters[name] !== 'undefined') {
          e.detail.renameProperty(name, mappingParameters[name])
        } else if (!isSpecific) {
          delete e.detail[name]
        } 
      }
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
          'Accept-Language': this.$i18n.locale === 'fr' ? 'fre': 'eng'
       }

      var self = this
      this.parameters.sortOrder =  this.parameters.sortBy === 'title' ? 'ordering': 'reverse';
      var url = this.srv + 'q?' + Object.keys(this.parameters).map(function (prop) {
        return prop + '=' + self.parameters[prop]
      }).join('&');
      this.$http.get(url, {headers: headers}).then(
        response => {  this.treatmentGeonetwork(response.body, depth);}
      )
    },
    requestApiOpensearch () {
      var depth = (typeof this.parameters.depth != 'undefined') ? this.parameters.depth : this.depth
      var self = this
      var url = this.api + (this.api.indexOf('?') > 0 ? '&' :'?');
      url += Object.keys(this.parameters).map(function (prop) {
        return prop + '=' + self.parameters[prop]
      }).join('&');
      this.$http.get(url).then(
          response => {   this.treatmentGeojson(response.body, depth);}
       )
    },
    treatmentGeojson (data, depth) {
      var metadatas = {}
      var self = this
      var features = []
      data.features.forEach( function (feature) {
        feature.properties.id = feature.id
        metadatas[feature.id] =  self.mapToGeonetwork(feature.properties)
        features.push({type: feature.type, id: feature.id, geometry: feature.geometry})
       
      })
      if (data.features.length === 0) {
        metadatas = null
      }
      this.fill({ type: 'opensearch', properties: data.properties, features: features, metadata:metadatas}, depth)
    },
    treatmentGeonetwork (data, depth) {
      var metadatas = {}
      var features = []
      var self = this
      if (!data.metadata){
        var metadatas = null
      } else if (data.metadata && !data.metadata.forEach) {
        var uuid = data.metadata['geonet:info'].uuid
        metadatas[uuid] = self.treatmentSingleGeonetwork(data.metadata ,uuid)
        var feature = self.extractBboxGeonetwork(data.metadata.geoBox, uuid)
        if (feature) {
            features.push(feature)
        }
      } else {
           data.metadata.forEach( function (meta, index) {
             var uuid = meta['geonet:info'].uuid
             metadatas[uuid] = self.treatmentSingleGeonetwork(meta ,uuid)
              var feature = self.extractBboxGeonetwork(meta.geoBox, uuid)
              if (feature) {
                    features.push(feature)
              }
           })
      }
      data.metadata = metadatas
      data.type = 'geonetwork'
      data.features = features
      this.fill(data, depth);
      // this.searchRelated()
    },
    updateGeonetworkContacts (data) {
      data.responsibleParty.forEach( function (contact)  {
          var fields = contact.split('|');
          if (fields[1] === 'metadata' || fields[1] === 'metadonnées') {
           if (_this.contacts.metadata[fields[0]]){
             _this.contacts.metadata[fields[0]].push(fields)
           } else {
             _this.contacts.metadata[fields[0]] = [fields]
           }
          }else{
            if (_this.contacts.resource[fields[0]]){
               _this.contacts.resource[fields[0]].push(fields)
            } else {
               _this.contacts.resource[fields[0]] = [fields]
            }
          }
                
      })
    },
    mapToGeonetwork (properties) {
      var properties = Object.assign({}, properties)
      properties.fromOs = true
      if (properties.productIdentifier) {
        properties.renameProperty('productIdentifier', 'identifier')
      }
      if (properties.startDate) {
        properties.renameProperty('startDate', 'tempExtentBegin')
      }
      if (properties.completionDate) {
        properties.renameProperty('completionDate', 'tempExtentEnd')
      }
      if (properties.updated) {
        properties.renameProperty('updated', 'revisionDate')
      }
      if (properties.published) {
        properties.renameProperty('published', 'publicationDate')
      }
      if (properties.produced) {
        properties.renameProperty('produced', 'creationDate')
      }
      if (!properties.type) {
        properties.type = 'dataset'
      }
      if (properties.quicklook) {
        properties.images = [['', properties.quicklook, '']]
        delete properties.quicklook
      }
      if (properties.license) {
        properties.legalConstraints = [properties.license.licenseId]
        delete properties.license
      }
      properties.osParameters = []
      properties.mapping = []
      if (properties.services) {
        // @todo cas très très particulier de flatsim
        if(properties.services.browse && properties.services.browse.layers) {
          properties.layers = []
          properties.services.browse.layers.forEach(function (flatsimLayer, index) {
            var type = 'OGC:' + flatsimLayer.type
            var layer = {
                id: properties.id + '_' + index,
                name: flatsimLayer.name,
                description:  flatsimLayer.name,
                href: flatsimLayer.url,
                type: 'OGC:WMS',
                checked: false
            }
            properties.layers.push(layer)
          })
        }
        if(properties.services.download && properties.services.download.url) {
          if (!properties.download) {
            properties.download = []
          }
          properties.download.push(properties.services.download)
          
        }
        delete properties.services
      }
      if( !properties.exportLinks) {
        properties.exportLinks = {}
      }
      // @todo Flatsim cas particulier des LIENS D'EXPORT qui se trouve dans link
      if (properties.links) {
        var i = properties.links.length
        while (i--) {
          if (properties.links[i].type === 'application/json' && !properties.exportLinks.json) {
            properties.exportLinks.json = properties.links[i].href
            properties.links.splice(i,1)
          }
          if (properties.links[i].type === 'application/xml' && !properties.exportLinks.xml) {
            properties.exportLinks.xml = properties.links[i].href
            properties.links.splice(i,1)
          }
        }
        delete properties.links
      }

      if (!properties.contacts) {
        properties.contacts = {metadata: {}, resource: {}}
        if (properties.organisationName) {
          if (typeof properties.organisationName === 'string') {
            var responsible = new Array(10)
            responsible[0] = 'Point of contact'
            responsible[2] = properties.organisationName
            properties.contacts.metadata['Point of contact'] = [responsible]
            delete properties.organisationName
          }
        }
      }
     /* if (properties.keywords) {
        properties.keywordGroup = {}
        properties.keywords.forEach(function (keyword) {
          if (!properties.keywordGroup[keyword.type]) {
            properties.keywordGroup[keyword.type] = [{value: keyword.name}]
          } else {
            properties.keywordGroup[keyword.type].push({value: keyword.name})
          }
        })
        delete properties.keywords
      }*/
      if (properties.keywords) {
        properties.keyword = []
        properties.keywords.forEach(function (keyword) {
          properties.keyword.push(keyword.name)
        })
        delete properties.keywords
      }
      return properties
    },
    treatmentSingleGeonetwork (meta, uuid) {
      meta.id = uuid
      if (this.$store.state.geonetwork) {
          meta.logo = this.$store.state.geonetwork + meta.logo
          meta.exportLinks = {
              xml: this.$store.state.geonetwork + 'srv/api/records/'+ uuid + '/formatters/xml?attachment=true',
              pdf: this.$store.state.geonetwork + 'srv/api/records/'+ uuid + '/formatters/xsl-view?root=div&output=pdf'
          }
      }
      if (meta.abstract) {
        meta.abstract = meta.abstract.replace(/(?:\\[rn]|[\r\n])/g, '<br />');
      }
      if (meta.defaultAbstract) {
        meta.defaultAbstract = meta.defaultAbstract.replace(/(?:\\[rn]|[\r\n])/g, '<br />');
      }
      
      meta.description = meta.abstract ? meta.abstract: meta.defaultAbstract
      
      meta.osParameters = []
      meta.mapping = []
      if (meta.image) {
          meta.images =  this.$gn.strToArray(meta.image)
          meta.images.forEach( function (image, index) {
            if(image[0] === 'thumbnail') {
              meta.thumbnail = image[1]
            }
          })
      }
      var self = this
      // constraints
      this.$store.state.constraintList.forEach (function (constraint) {
        if (meta[constraint] && typeof meta[constraint] === 'string') {
          meta[constraint] = [meta[constraint]]
        }
      }) 
      
      // contacts
      var contacts = {metadata: {}, resource: {}}
      if (meta.responsibleParty) {
            if (typeof meta.responsibleParty === 'string') {
              meta.responsibleParty = [meta.responsibleParty]
            }
           meta.responsibleParty.forEach( function (contact)  {
              var fields = contact.split('|');
              if (fields[1] === 'metadata' || fields[1] === 'metadonnées') {
               if (contacts.metadata[fields[0]]){
                 contacts.metadata[fields[0]].push(fields)
               } else {
                 contacts.metadata[fields[0]] = [fields]
               }
              }else{
                if (contacts.resource[fields[0]]){
                   contacts.resource[fields[0]].push(fields)
                } else {
                   contacts.resource[fields[0]] = [fields]
                }
              }
          })
      }
      delete meta.responsibleParty
      meta.contacts = contacts
      
      if (!meta.link) {
        return meta;
      }
      // links
      var links = this.$gn.strToArray(meta.link)

      links.forEach(function (link, index) {
        switch (link[3]) {
        case 'OpenSearch':
          meta.api = {}
          meta.api.http = link[2]
          meta.api.name = link[0].length > 0 ? link[0] : link[1]
          break;
        case 'OGC:WMS': 
          if (!meta.layers) {
            meta.layers = []
          }
          var id = meta.id + '_' + index
          meta.layers.push(self.$gn.linkToLayer(link, id))
          break;
        case 'WWW:DOWNLOAD-1.0-link--download':
        case 'telechargement':
          if (!meta.download) {
            meta.download = []
          }
          meta.download.push(self.$gn.linkToDownload(link))
          break;
        case 'WWW:LINK-1.0-http--link':
        default:
          if (!meta.links) {
            meta.links = []
          }
          meta.links.push(self.$gn.linkToLink(link))
          break;
        }
      })
      return meta;
    },
    extractBboxGeonetwork(bbox, id) {
      if (!bbox) {
        return null
      }
      switch (typeof bbox) {
      case 'string':
        var geometryType = 'Polygon'
        var path = this.bboxString2Array(bbox)
        break;
      case 'object':
        var geometryType = 'MultiPolygon'
        var self = this
        var path = []
        bbox.forEach(function(box) {
          path.push(self.bboxString2Array(box))
        })
        break;
      }
      
      if (path) {
       var feature = {
              type: 'Feature',
              id: id,
              geometry: {
                type: geometryType,
                coordinates:path
              }
            }
      }
      return feature
    },
    bboxString2Array (bbox) {
      var bboxList = this.$gn.strToArray(bbox)
      var path = []
      //trouble with rectangle ??? add polygon!
      bboxList.forEach(function (tab){
        tab = tab.map(x => parseFloat(x))
        var latmin = Math.min(tab[3], tab[1])
        var latmax = Math.max(tab[3], tab[1])
        var lngmin = Math.min(tab[0], tab[2])
        var lngmax = Math.max(tab[0], tab[2])
        path.push([[lngmin, latmin], [lngmin, latmax], [lngmax, latmax], [lngmax, latmin], [lngmin, latmin]])
        
      })
      return path
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
      data.depth = depth
      var event = new CustomEvent('fmt:metadataListEvent', {detail:  data})
      document.dispatchEvent(event)
    },
    handleReset () {
      var event = new CustomEvent('aerisResetEvent')
      document.dispatchEvent(event)
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
