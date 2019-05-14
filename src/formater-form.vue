<i18n>{
   "en":{
     "search": "Search ...",
     "reset": "Reset search",
     "time_slot": "Time slot",
     "spatial_extend": "Spatial extend",
     "groupOwners": "Data center",
     "gemetKeywords": "Inspire Gemet Keywords",
     "formaterVariable": "Variables"
   },
   "fr":{
      "search": "Rechercher ...",
      "reset": "Initialiser",
      "time_slot": "Intervalle temporel",
      "spatial_extend": "Zone géographique",
      "groupOwners": "Centre de données",
       "gemetKeywords": "Inspire Gemet Keywords",
     "formaterVariable": "Variables"
   }
}
</i18n>
<template>
 <div class="fmt-form">
  <div style="text-align:center;margin: -10px 0 30px 0;"><input type="button" @click="handleReset" :value="$t('reset')"/></div>
  <div class="formater-input-group" style="margin:10px; width:calc(100% - 20px);">
     <input id="any" name="any" v-model="fulltextSearch" :placeholder="$t('search')" @change="changeSearch"  /><i class="fa fa-search"></i>
 </div>
 <formater-map></formater-map>
 <formater-search-box header-icon-class="fa fa-globe" open-icon-class="fa fa-caret-right" :title="$t('spatial_extend')" :deployed="false" type="empty">
 <formater-spatial-search></formater-spatial-search>
 </formater-search-box>
<formater-search-box header-icon-class="fa fa-calendar" open-icon-class="fa fa-caret-right" :title="$t('time_slot')" :deployed="true" type="empty">
  <formater-temporal-search :lang="lang" daymin="1900-01-01" daymax="2020-02-01"></formater-temporal-search>
</formater-search-box>
<formater-search-box v-if="dimension.category" :header-icon-class="facetToIcon(index)" open-icon-class="fa fa-caret-right" :title="titleDimension(index)" type="empty" v-for="(dimension, index) in dimensions" :key="index">
  <formater-dimension-block v-if="!isFacet(index)"  :dimension="dimension.category" :name="dimensions[index]['@name']" ></formater-dimension-block>
  <formater-facet-block v-if="isFacet(index)"  :defaut="facet[dimensions[index]['@name']]" :dimension="dimension.category" :name="dimensions[index]['@name']" ></formater-facet-block>
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
import {FormaterTemporalSearch, FormaterSearchBox} from 'formater-commons-components-vjs'
import FormaterSpatialSearch from './formater-spatial-search.vue'
import FormaterMap from './formater-map.vue'
import FormaterDimensionBlock from './formater-dimension-block.vue'
import FormaterFacetBlock from './formater-facet-block.vue'
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
    FormaterDimensionBlock,
    FormaterFacetBlock
  },
  props: {

    lang: {
      type: String,
      default: 'en'
    }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue
    	this.$setGnLocale(newvalue)

    }
  },
  data() {
    return {

      fulltextSearch: '',
      first: true,
      dimensions: [],
       facet: [],
       aerisSearchListener: null
    }
  },
  created () {
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    this.metadataListListener = this.fill.bind(this)
    document.addEventListener('fmt:metadataListEvent', this.metadataListListener);

  },
  destroyed () {

    document.removeEventListener('fmt:metadataListEvent', this.metadataListListener);
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
      if (this.lang === 'fr' && lang === 'Fre') {
        return true;
      } else if (this.lang != 'fr' && lang != 'Fre') {
        return true;
      } else {
        return false;
      }

    },

    fill (e) {
      if (this.first) {
        this.dimensions = this.initializeDimensions(e.detail.summary.dimension)
        this.first = false
      } else {
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
          console.log('not found')
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
    handleReset () {
      console.log('reset')
      this.fulltextSearch = ''
      this.facet = []
      var event = new CustomEvent('fmt:resetEvent')
      document.dispatchEvent(event)

    },
    changeSearch (event) {
       // trigger event change text
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