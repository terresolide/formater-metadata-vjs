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
      api: process.env.GEONETWORK + '/srv/api/',
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
      // listen a global reset event
      resetListener: null,
      facet: []
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
//     this.metadataWithChildListener = this.getRecords.bind(this)
//     document.addEventListener('fmt:metadataWithChildEvent', this.metadataWithChildListener)
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
//     document.removeEventListener('fmt:metadataWithChildEvent', this.metadataWithChildListener)
//     this.metadataWithChildListener = null
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
    }, 
    getRecords (event) {
      console.log('REQUESTER')
      console.log(event)
      // trigger search event like breadcrumb
      if (event.detail && typeof event.detail.depth == 'number') {
        var depth = event.detail.depth
      } else {
        var depth = this.depth
      }
      this.initParameters()
      var e = new CustomEvent("aerisSearchEvent", { detail: {depth: depth}});
      console.log(e)
	  document.dispatchEvent(e);
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
	  delete e.detail.depth
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
	 
	  //delete(e.detail.extTo)
	  //delete(e.detail.extFrom)
	  var headers =  {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': this.lang === 'fr' ? 'fre': 'eng'
        }
	 
     	  
      var self = this
      this.parameters.sortOrder =  this.parameters.sortBy === 'title' ? 'ordering': 'reverse';
      var url = this.srv + 'q?' + Object.keys(this.parameters).map(function (prop) {
        return prop + '=' + self.parameters[prop]
      }).join('&');

      this.$http.get(url, {headers: headers, parameters: this.parameters}).then(
          response => { this.fill(response.body, depth);}
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
<style>
/*.fmt-form{
  padding: 0px 0px 30px 0px;
 border: 1px solid #ccc;
  box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.1);
}
.fmt-form .formater-input-group {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 5px 0;
    width: 100%;
    overflow: hidden;
   background: #f8ebda;
    margin: 0 0 10px 0;
}
.fmt-form .formater-search-box{
  margin: 5px 0;
  width:100%;
  box-shadow: 0 2px 5px -5px rgba(0, 0, 0, 0.2);
}
.fmt-form  .formater-input-group input {
    border: none;
    background-color: transparent;
    padding: 0 10px;
    outline: none;
}
.fmt-form input[type="button"] {
    margin: 0 0 3px 7px;
    padding: 3px 12px;
    text-align: center;
    border-width: 1px;
    border-style: solid;
    border-radius: 1px;
    font-size: 16px;
    line-height: 1.7;
    border-color: #e5b171 #cb8025 #cb8025;
    background:#754a15;
    color: #fff;
    text-decoration: none;
    vertical-align: top;
    cursor: pointer;
    pointer-events: auto;
    box-sizing: border-box;
    box-shadow: 0 1px 5px rgba(0,0,0,.65);
}
.fmt-form  .formater-input-group input[name="any"] {
    line-height:35px;
    height:35px;
    width: calc(100% - 40px);
}*/
/*.fmt-form main.box-body > div > div.fmt-dimension{
   margin-left: 15px;
}*/
</style>