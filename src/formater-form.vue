<i18n>{
   "en":{
     "search": "Search ...",
     "reset": "Reset search",
     "time_slot": "Time slot",
     "spatial_extend": "Spatial extend",
     "groupOwners": "Data center",
     "gemetKeywords": "Inspire Gemet Keywords",
     "formaterVariable": "Variables",
     "parameters": "Parameters"
   },
   "fr":{
      "search": "Rechercher ...",
      "reset": "Initialiser",
      "time_slot": "Intervalle temporel",
      "spatial_extend": "Zone géographique",
      "groupOwners": "Centre de données",
      "gemetKeywords": "Inspire Gemet Keywords",
      "formaterVariable": "Variables",
      "parameters": "Paramètres"
   }
}
</i18n>
<template>
 <div class="mtdt-form">
  <div style="text-align:center;margin: 10px 0 30px 0;"><input id="globalReset" type="button" @click="reset" :value="$t('reset')"/></div>
  <div class="formater-input-group" :class="{disable: $store.state.disable.searchTerm}" style="margin:10px; width:calc(100% - 20px);">
     <input id="any" name="any" v-model="fulltextSearch" :placeholder="$t('search')" @change="changeText" @keypress="changeTextOnEnter"  /><i class="fa fa-search"></i>
 </div>
 <formater-map></formater-map>
 <formater-search-box header-icon-class="fa fa-globe" open-icon-class="fa fa-caret-right" :title="$t('spatial_extend')" :deployed="false" type="empty" :disable-level="+ $store.state.disable.spatial">
 <formater-spatial-search :disable="$store.state.disable.spatial"></formater-spatial-search>
 </formater-search-box>
 
<formater-search-box header-icon-class="fa fa-calendar" open-icon-class="fa fa-caret-right" :title="$t('time_slot')" :deployed="true" type="empty" :disable-level="+ $store.state.disable.temporal">
  <formater-temporal-search :lang="$i18n.locale" :daymin="$store.state.temporalExtent.min" :daymax="$store.state.temporalExtent.max" :disable="$store.state.disable.temporal"></formater-temporal-search>
</formater-search-box>

<formater-search-box header-icon-class="fa fa-thermometer-3" v-if="$store.state.parameters.others.length > 0" open-icon-class="fa fa-caret-right" :title="$t('parameters')" :deployed="true" type="empty">
 <formater-parameters-form :parameters="$store.state.parameters.others" ></formater-parameters-form>
 </formater-search-box>
 
<formater-search-box v-if="dimension.category" :header-icon-class="facetToIcon(index)" open-icon-class="fa fa-caret-right" :disable-level="disableLevel" :title="titleDimension(index)" type="empty" v-for="(dimension, index) in dimensions" :key="index">
  <formater-dimension-block v-if="!isFacet(index)"   :dimension="dimension.category" :name="dimensions[index]['@name']" :disable="disableLevel > 0"></formater-dimension-block>
  <formater-facet-block v-if="isFacet(index)"   :dimension="dimension.category" :name="dimensions[index]['@name']" :disable="disableLevel > 0"></formater-facet-block>
 </formater-search-box>

 </div>

</template>
<script>
var iconClass = {
    type: 'fa fa-object-group',
    groupOwner: 'fa fa-database',
    facetGemet: 'fa fa-navicon',
    facetGemetFre: 'fa fa-navicon',
    facetFormater: 'fa fa-thermometer-half',
    facetFormaterFre: 'fa fa-thermometer-half',
    facetPlatform: 'fa fa-rocket',
    facetInstrument: 'fa fa-calculator'
}
// import {FormaterSearchBox} from 'formater-commons-components-vjs'
//  import FormaterTemporalSearch from './formater-temporal-search.vue'

import {FormaterTemporalSearch, FormaterSearchBox} from 'formater-commons-components-vjs'
import FormaterSpatialSearch from './formater-spatial-search.vue'
import FormaterMap from './formater-map.vue'
import FormaterDimensionBlock from './formater-dimension-block.vue'
import FormaterFacetBlock from './formater-facet-block.vue'
const FormaterParametersForm = () => import('./formater-parameters-form.vue')
// import FormaterSearchBox from './formater-search-box.vue'


export default {
  name: 'FormaterForm',
  components: {
    FormaterMap,
    FormaterTemporalSearch,
    FormaterSpatialSearch,
    FormaterSearchBox,
    FormaterDimensionBlock,
    FormaterFacetBlock,
    FormaterParametersForm
  },
  props: {
    disableLevel: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      fulltextSearch: '',
      first: true,
      parameters: [],
      dimensions: [],
      aerisSearchListener: null,
      aerisResetListener: null,
      metadataListListener: null,
      closeMetadataListener: null,
    }
  },

  created () {
    this.aerisSearchListener = this.handleSearch.bind(this)
    document.addEventListener('aerisSearchEvent', this.aerisSearchListener)
    this.aerisResetListener = this.handleReset.bind(this)
    document.addEventListener('aerisResetEvent', this.aerisResetListener)
    this.metadataListListener = this.fill.bind(this)
    document.addEventListener('fmt:metadataListEvent', this.metadataListListener)
  },
  mounted () {
    this.handleTheme()
  },
  destroyed () {
    document.removeEventListener('aerisSearchEvent', this.aerisSearchListener)
    this.aerisSearchListener = null
    document.removeEventListener('aerisResetEvent', this.aerisResetListener)
    this.aerisResetListener = null
    document.removeEventListener('fmt:metadataListEvent', this.metadataListListener)
    this.metadataListListener = null;
  },
 
  methods: {
    facetToIcon (index) {
      return iconClass[this.dimensions[index]['@name']]
    },
    titleDimension (index) {
      return this.$i18n.t(this.dimensions[index]['@label'])
    },
    isFacet (index) {
      if (this.dimensions[index]['@name'].indexOf('facet') >=0) {
        return true;
      } else {
        return false;
      }
    },
    isInCurrentLang (index) {
      if (!this.isFacet(index)) {
        return true;
      }
      var name = this.dimensions[index]['@name'];
      var lang = name.substring(name.length -3, name.length)
      if (this.$i18n.locale === 'fr' && lang === 'Fre') {
        return true;
      } else if (this.$i18n.locale != 'fr' && lang != 'Fre') {
        return true;
      } else {
        return false;
      }

    },

    fill (e) {
      if (!e.detail.summary) {
        this.first = false
        return
      }
      if (this.first ) {
        this.dimensions = this.initializeDimensions(e.detail.summary.dimension)
        this.first = false
      } else if( this.depth === 0 ){
         var  newdimensions = this.initializeDimensions(e.detail.summary.dimension)
         this.dimensions = this.updateDimensions(this.dimensions, newdimensions)
      }

    },
    initializeDimensions(dimensions){
      var dimension = null
      if (dimensions.length > 0) {
        dimension = dimensions
      } else {
        dimension = [dimensions]
      }
      var _this = this
      dimension.forEach( function (obj, index){
        if (obj.category){
          dimension[index].category = _this.initializeDimensions(obj.category)
        }
      })
      return dimension
    },

    updateDimensions (dimensions, newdimensions) {
      if (!dimensions) {
        return null
      }
     
      var _this = this
      dimensions.forEach(function(dimension, index){
        var found = newdimensions.find( function (obj) {
          if (obj['@name']) {
            return obj['@name'] === dimension['@name'] 
          } else if (obj['@value']){
            return obj['@value'] === dimension['@value'] 
          } 
        })
        if (typeof found === 'undefined') {
          _this.$set(dimensions[index], '@count', 0)
        } else {
          _this.$set(dimensions[index], '@count', found['@count'])
        }
        if (dimensions[index].category) {
	        var subDimension = []
	        if ( typeof found !== 'undefined' && found.category) {
	          subDimension = found.category
	        }
	        dimensions[index].category = _this.updateDimensions(dimensions[index].category, subDimension)
        }
      })
      return dimensions
    },
    reset () {
      var event = new CustomEvent('fmt:resetEvent')
      document.dispatchEvent(event)
    },
    handleReset () {
      this.fulltextSearch = ''  

    },
    handleSearch (e) {
      if (this.fulltextSearch.length > 0) {
      	e.detail.any = this.fulltextSearch
      } 
      if (this.$store.state.group) {
        e.detail._groupOwner = this.$store.state.group
      }
    },
    handleTheme() {
      var node = this.$el.querySelector('#globalReset')
      node.style.backgroundColor = this.$store.state.style.primary
      var color1 = this.$shadeColor(this.$store.state.style.primary, 0.2)
      node.style.borderColor = color1
      var node = this.$el.querySelector('.formater-input-group')
      node.style.backgroundColor = this.$shadeColor(this.$store.state.style.emphasis, 0.8)
    },
    changeTextOnEnter (event) {
      if (event.which == 13 || event.keyCode == 13) {
        this.changeText()
        return false;
      }
    },
    changeText(event) {
       // trigger event change text
       var e = new CustomEvent('fmt:textChangeEvent')
       document.dispatchEvent(e)
    }//,
  }
}
</script>
<style>
.mtdt-form{
  padding: 0px 0px 30px 0px;
 border: 1px solid #ccc;
  box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.1);
 /* max-height: 95vh;
  overflow-y: auto;*/
}
.mtdt-form h4{
  word-break: break-all;
}
.mtdt-form .formater-input-group {
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
.mtdt-form .formater-input-group.disable{
   opacity: 0.8;
   pointer-events: none;
   
}
.mtdt-form .formater-search-box{
  margin: 5px 0;
  width:100%;
  box-shadow: 0 2px 5px -5px rgba(0, 0, 0, 0.2);
}
.mtdt-form  .formater-input-group input {
    border: none;
    background-color: transparent;
    padding: 0 10px;
    outline: none;
}
.mtdt-form input[type="button"] {
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
.mtdt-form  .formater-input-group input[name="any"] {
    line-height:35px;
    height:35px;
    width: calc(100% - 40px);
}
/*.mtdt-form main.box-body > div > div.mtdt-dimension{
   margin-left: 15px;
}*/
</style>