<i18n>{
   "en":{
     "search": "Search ...",
     "reset": "Reset search",
     "time_slot": "Time slot",
     "spatial_extend": "Spatial extend",
     "groupOwner": "Data center"
   },
   "fr":{
      "search": "Rechercher ...",
      "reset": "Initialiser",
      "time_slot": "Intervalle temporel",
      "spatial_extend": "Zone géographique",
      "groupOwner": "Centre de données"
   }
}
</i18n>
<template>
 <div class="fmt-form">
  <div style="text-align:center;margin: -10px 0 30px 0;"><input type="button" @click="handleReset" :value="$t('reset')"/></div>
  <div class="formater-input-group" style="margin:10px; width:calc(100% - 20px);">
     <input id="any" name="any" v-model="parameters.any" :placeholder="$t('search')" @change="changeSearch"  /><i class="fa fa-search"></i>
 </div>
 <formater-map></formater-map>
 <formater-search-box header-icon-class="fa fa-globe" open-icon-class="fa fa-caret-right" :title="$t('spatial_extend')" :deployed="false" type="empty">
 <formater-spatial-search></formater-spatial-search>
 </formater-search-box>
<formater-search-box header-icon-class="fa fa-calendar" open-icon-class="fa fa-caret-right" :title="$t('time_slot')" :deployed="true" type="empty">
  <formater-temporal-search :lang="lang" daymin="1900-01-01" daymax="2020-02-01"></formater-temporal-search>
</formater-search-box>
<formater-search-box open-icon-class="fa fa-caret-right" :title="titleDimension(index)" type="empty" v-if="dimension.category" v-for="(dimension, index) in dimensions" :key="index">
 <formater-dimension-block :dimension="dimension.category" ></formater-dimension-block>
 </formater-search-box>

 </div>

</template>
<script>

import {FormaterTemporalSearch, FormaterSearchBox} from 'formater-commons-components-vjs'
import FormaterSpatialSearch from './formater-spatial-search.vue'
import FormaterMap from './formater-map.vue'
import FormaterDimensionBlock from './formater-dimension-block.vue'
// import FormaterSearchBox from './formater-search-box.vue'

Object.defineProperty(
    Object.prototype, 
    'renameProperty',
    {
        writable : false, // Cannot alter this property
        enumerable : false, // Will not show up in a for-in loop.
        configurable : false, // Cannot be deleted via the delete operator
        value : function (oldName, newName) {
            // Do nothing if the names are the same
            if (oldName == newName) {
                return this;
            }
            // Check for the old property name to 
            // avoid a ReferenceError in strict mode.
            if (this.hasOwnProperty(oldName)) {
                this[newName] = this[oldName];
                delete this[oldName];
            }
            return this;
        }
    }
);

export default {
  name: 'FormaterForm',
  components: {
    FormaterMap,
    FormaterTemporalSearch,
    FormaterSpatialSearch,
    FormaterSearchBox,
    FormaterDimensionBlock
  },
  props: {
    nbRecord: {
      type: Number,
      default: 12
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue
    	this.$setGnLocale(newvalue)
    	this.srv = process.env.GEONETWORK + 'srv/' + (newvalue === 'fr' ? 'fre' : 'eng') + '/'
    	this.headers['Accept-Language'] =  newvalue === 'fr' ? 'fre': 'eng'
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
      dimensions: [],
      parameters: {},
      changePageListener:null,
      temporalChangedListener: null,
      spatialChangedListener: null
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
    document.addEventListener('fmt:spatialChangeEvent', this.spatialChangedListener)
  },
  destroyed () {
    document.removeEventListener('fmt:pageChangedEvent', this.pageChangedListener);
    this.pageChangedListener = null;
    document.removeEventListener('temporalChangeEvent', this.temporalChangedListener);
    this.temporalChangedListener = null;
    document.removeEventListener('fmt:spatialChangeEvent', this.spatialChangedListener);
    this.spatialChangedListener = null;
  },
  mounted () {
  
    // url="http://demo.formater/geonetwork/srv/fre/qi?_content_type=json&bucket=2365825987452666&fast=index&from=1&to=41"
  },
  methods: {
    titleDimension (index) {
      return this.$i18n.t(this.dimensions[index]['@name'])
    },
    initParameters () {
      this.parameters = {
        _content_type: 'json',
        fast: 'index',
        'facet.q': '',
        bucket: '26041996',
        isChild: false,
        from: 1,
        to: 18,
        resultType: 'details',
        sortBy: 'title',
        sortOrder: 'reverse'
      }
    },
    getRecords () {
      // trigger search event like breadcrumb
      this.initParameters()
      var e = new CustomEvent("aerisSearchEvent", { detail: {}});
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
	  delete e.detail.endDefautl
	  
	  //delete(e.detail.extTo)
	  //delete(e.detail.extFrom)
      this.parameters = Object.assign(this.parameters, e.detail)	  
      var self = this
      this.parameters.sortOrder =  this.parameters.sortBy === 'title' ? 'ordering': 'reverse';
      var url = this.srv + 'q?' + Object.keys(this.parameters).map(function (prop) {
        return prop + '=' + encodeURI(self.parameters[prop])
      }).join('&');
      this.$http.get(url).then(
          response => { this.fill(response.body);}
       )
    },
    fill (data) {
      this.dimensions = data.summary.dimension
      var event = new CustomEvent('fmt:metadataListEvent', {detail:  data})
      document.dispatchEvent(event)
    },
    handleReset () {
      console.log('reset')
      this.parameters.any = ""
      var event = new CustomEvent('aerisResetEvent')
      document.dispatchEvent(event)
      this.getRecords()
    },
    changePage (event) {
      this.getRecords()
    },
    changeSearch (event) {
      this.parameters.any = event.target.value
      this.getRecords()
    }
  }
}
</script>
<style>
.fmt-form{
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
    /* background: #e3dbd0;*/
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
}
/*.fmt-form main.box-body > div > div.fmt-dimension{
   margin-left: 15px;
}*/
</style>