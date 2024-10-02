<i18n>{
   "en":{
     "search": "Search ...",
     "reset": "Reset search",
     "time_slot": "Time slot",
     "spatial_extent": "Spatial extent",
     "groupOwners": "Data center",
     "gemetKeywords": "Inspire Gemet Keywords",
     "formaterVariable": "Variables",
     "formaterDiscipline": "Disciplines",
     "formaterPlatform": "Platforms",
     "formaterFoi": "Feature of interest",
     "formaterProduct": "Product types",
     "parameters": "Parameters"
   },
   "fr":{
      "search": "Rechercher ...",
      "reset": "Initialiser",
      "time_slot": "Intervalle temporel",
      "spatial_extent": "Zone géographique",
      "groupOwners": "Centre de données",
      "gemetKeywords": "Inspire Gemet Keywords",
      "formaterVariable": "Variables",
      "formaterDiscipline": "Disciplines",
      "formaterPlatform": "Plateformes",
      "formaterFoi": "Objets d'intérêt",
      "formaterProduct": "Types de produit",
      "parameters": "Paramètres"
   }
}
</i18n>
<template>
 <div class="mtdt-form">
  <div style="text-align:center;margin: 10px 0 30px 0;"><input id="globalReset" type="button" @click="reset" :value="$t('reset')"/></div>
  <div class="formater-input-group" :class="{disable: $store.state.disable.searchTerm}" style="margin:10px; width:calc(100% - 20px);">
     <input id="any" name="any" v-model="fulltextSearch" :placeholder="$t('search')" @keypress="changeTextOnEnter"  /><i class="fa fa-search"></i>
 </div>
 <formater-map :depth="depth"></formater-map>
 <formater-search-box :color="$store.state.style.primary" header-icon-class="fa fa-globe" open-icon-class="fa fa-caret-right" :title="$t('spatial_extent')" :deployed="false" type="empty" :disable-level="+ $store.state.disable.spatial">
   <formater-spatial-search :disable="$store.state.disable.spatial"
   :color="$store.state.style.emphasis" :lang="$store.state.lang"></formater-spatial-search>
 </formater-search-box>
 
<formater-search-box :color="$store.state.style.primary" header-icon-class="fa fa-calendar" open-icon-class="fa fa-caret-right" :title="$t('time_slot')" :deployed="true" type="empty" :disable-level="+ $store.state.disable.temporal">
  <formater-temporal-search :lang="$i18n.locale" name="ext" :daymin="$store.state.temporalExtent.min"
   :daymax="$store.state.temporalExtent.max" :color="$store.state.style.emphasis" :disable="$store.state.disable.temporal"
   :default-from="temp.from" :default-to="temp.to"></formater-temporal-search>
</formater-search-box>
<!--  opensearch parameters -->
<formater-search-box :color="$store.state.style.primary" header-icon-class="fa fa-thermometer-3" v-if="$store.state.parameters.others.length > 0" open-icon-class="fa fa-caret-right" :title="$t('parameters')" :deployed="true" type="empty">
 <formater-parameters-form :parameters="$store.state.parameters.others" :depth="depth"></formater-parameters-form>
 </formater-search-box>
<!--  end opensearch -->
<!-- step1 only dimension -->
 <div v-for="dim in dimensions" :disable="depth > 0">
<formater-search-box  v-if="dim.category" 
:color="$store.state.style.primary" :header-icon-class="facetToIcon(dim['@name'])" open-icon-class="fa fa-caret-right" :title="titleDimension(dim['@name'])"  
:disable-level="depth > 0 ? 1 : 0" type="empty">
  <formater-dimension-block v-if="!isFacet(dim['@name'])"   :dimension="dim.category" :name="dim['@name']" :disable="depth > 0"></formater-dimension-block>
  <formater-facet-block v-if="isFacet(dim['@name'])"   :dimension="dim.category" :name="dim['@name']" 
  :disable="depth > 0" :defaut="dim['@name']"></formater-facet-block>
 </formater-search-box>
</div>
-
<!-- step 1 and step 2 -->
 <!--
<div v-for="(key, index) in $store.state.gnParameters.step1step2" >
<formater-search-box  v-if="dimensions[nameToIndex[key]] && dimensions[nameToIndex[key]].category" 
:color="$store.state.style.primary" :header-icon-class="facetToIcon(key)" open-icon-class="fa fa-caret-right" :title="titleDimension(key)"
:disable-level="$store.state.disable.other ? 1 : 0" type="empty">
  <formater-dimension-block v-if="!isFacet(key)"   :dimension="dimensions[nameToIndex[key]].category" :disable="$store.state.disable.other" :name="key" ></formater-dimension-block>
  <formater-facet-block v-if="isFacet(key)"   :dimension="dimensions[nameToIndex[key]].category" :disable="$store.state.disable.other" 
  :name="key" :defaut="facets[key]" ></formater-facet-block>
 </formater-search-box>
</div>

<div v-for="(key, index) in $store.state.gnParameters.step2" v-if="depth > 0" >
<formater-search-box v-if="dimensions[nameToIndex[key]] && dimensions[nameToIndex[key]].category"
:color="$store.state.style.primary"  :header-icon-class="facetToIcon(key)" open-icon-class="fa fa-caret-right" :title="titleDimension(key)" 
:disable-level="$store.state.disable.other ? 1 : 0" type="empty">
  <formater-dimension-block :ref="key" v-if="!isFacet(key)"   :dimension="dimensions[nameToIndex[key]].category" :disable="$store.state.disable.other":name="key" ></formater-dimension-block>
  <formater-facet-block v-if="isFacet(key)"   :dimension="dimensions[nameToIndex[key]].category" :disable="$store.state.disable.other" 
  :name="key" :defaut="facets[key]"></formater-facet-block>
 </formater-search-box>
</div>
-->
<!--  <div v-for="(dim, k) in dimensions" v-if="k <= depth">
<formater-search-box v-if="dimension.category" :header-icon-class="facetToIcon(k, index)" open-icon-class="fa fa-caret-right" :disable-level="dimension.disableLevel" :title="titleDimension(k, index)" type="empty" v-for="(dimension, index) in dim" :key="index">
  <formater-dimension-block v-if="!isFacet(k, index)"  :summary-type="dimension.step" :dimension="dimension.category" :name="dimensions[k][index]['@name']" :disable="dimension.disableLevel > 0"></formater-dimension-block>
  <formater-facet-block v-if="isFacet(k, index)"  :summary-type="dimension.step"  :dimension="dimension.category" :name="dimensions[k][index]['@name']" :disable="dimension.disableLevel > 0"></formater-facet-block>
 </formater-search-box>
</div> -->
 </div>

</template>
<script>
var iconClass = {
    type: 'fa fa-object-group',
    groupOwner: 'fa fa-database',
    facetGemet: 'fa fa-navicon',
    facetGemetFre: 'fa fa-navicon',
    facetVariable: 'fa fa-thermometer-half',
    facetVariableFre: 'fa fa-thermometer-half',
    facetPlatform: 'fa fa-rocket',
    facetPlatformFre: 'fa fa-rocket',
    facetDiscipline: 'fa fa-graduation-cap',
    facetDisciplineFre: 'fa fa-graduation-cap',
    facetFoi: 'fa fa-map-marker',
    facetFoiFre: 'fa fa-map-marker',
    facetProduct: 'fa fa-file-image-o', 
    facetProductFre: 'fa fa-file-image-o', 
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
    depth: {
    	type: Number,
    	default: null
    }
  },
  data() {
    return {
      fulltextSearch: '',
      temp: {
        from: null,
        to: null
      },
      facets: {},
      first: true,
      parameters: [],
      dimensions: [],
      nameToIndex: [],
      // aerisSearchListener: null,
      // aerisResetListener: null,
      dimensionListener: null,
      temporalChangedListener: null,
      pageChangedListener: null
     // closeMetadataListener: null
    }
  },
  watch: {
    $route (newroute) {
      this.initValues(newroute)
    }
  },
  created () {
	  // add new facet in geonetwork facets
	 
	  this.addNewFacets()
	
	  this.initValues(this.$route)
	  this.temporalChangedListener = this.changeDate.bind(this)
    document.addEventListener('temporalChangeEvent', this.temporalChangedListener)
    this.pageChangedListener = this.changePage.bind(this)
    document.addEventListener('fmt:pageChangedEvent', this.pageChangedListener);

// 	  this.dimensionChangedListener = this.changeDimension.bind(this);
//     document.addEventListener('fmt:dimensionChangeEvent', this.dimensionChangedListener);

//    
//     this.aerisSearchListener = this.handleSearch.bind(this)
//     document.addEventListener('aerisSearchEvent', this.aerisSearchListener)
//     this.aerisResetListener = this.handleReset.bind(this)
//     document.addEventListener('aerisResetEvent', this.aerisResetListener)
    this.dimensionListener = this.fill.bind(this)
    document.addEventListener('fmt:dimensionEvent', this.dimensionListener)
  },
  mounted () {
    this.handleTheme()
  },
  destroyed () {
//     document.removeEventListener('aerisSearchEvent', this.aerisSearchListener)
//     this.aerisSearchListener = null
//     document.removeEventListener('aerisResetEvent', this.aerisResetListener)
//     this.aerisResetListener = null
    document.removeEventListener('fmt:pageChangedEvent', this.pageChangedListener);
    this.pageChangedListener = null;
    document.removeEventListener('temporalChangeEvent', this.temporalChangedListener);
    this.temporalChangedListener = null;

    document.removeEventListener('fmt:dimensionEvent', this.dimensionListener)
    this.dimensionListener = null;
  },
//   beforeRouteUpdate (to, from, next) {
//     console.log(to)
//     console.log(from)
//     next();
  
//   },
  methods: {
    initFacets (route) {
      // extract facets
      var facets = []
      if (route.query['facet.q']) {
        var tabs = decodeURIComponent(route.query['facet.q']).split('&')
        tabs.forEach(function (tab) {
          var x = tab.split('/')
          var key = x[0]
          x.slice(1)
          facets[x[0]] = x.join('/')
        })
      }
      this.facets = facets
    },
    initValues (newroute) {
      this.initFacets(this.$route)
      if (!newroute.query.any) {
        this.fulltextSearch = null
      } else {
        this.fulltextSearch = newroute.query.any
      }
      if (!newroute.query.end) {
        this.temp.to = null
      } else {
        this.temp.to = newroute.query.end
      }
      if (!newroute.query.start) {
        this.temp.from = null
      } else {
        this.temp.from = newroute.query.start
      }
  
    },
    changeDate (event) {
      var query = {}
      for (var prop in this.$route.query) {
        query[prop] = this.$route.query[prop]
      }
      if (event.detail.name === "extto") {
        if (event.detail.value && event.detail.value !== 'Invalid date') {
          query.end = event.detail.value
        } else {
          delete query.send
        }
      } 
      if (event.detail.name === "extfrom") {
         if( event.detail.value && event.detail.value !== 'Invalid date') {
	        query.start = event.detail.value
	      } else {
	        delete query.start
	      }
      }
      this.$router.push({name: this.$route.name, params: this.$route.params, query: query})
    },
    changePage (event) {
      var query = {}
      for (var prop in this.$route.query) {
        query[prop] = this.$route.query[prop]
      }
      query = Object.assign(query, event.detail)
      this.$router.push({name: this.$route.name, params: this.$route.params, query: query})
    },
	  addNewFacets () {
		  var self = this
		  this.$store.state.facets.forEach(function (facet) {
			  self.$gn.addFacet(facet)
		  })
	  },
    facetToIcon (key) {
      return iconClass[key]
    },
    titleDimension (key) {
      return this.$i18n.t(this.dimensions[this.nameToIndex[key]]['@label'])
    },
    isFacet (key) {
      if (key.indexOf('facet') >=0 
    		  || this.$gn.facets.indexOf(key) >= 0) {
        return true;
      } else {
        return false;
      }
    },
//     isInCurrentLang (key) {
//       if (!this.isFacet(key)) {
//         return true;
//       }
//       var lang = name.substring(key.length -3, key.length)
//       if (this.$i18n.locale === 'fr' && lang === 'Fre') {
//         return true;
//       } else if (this.$i18n.locale != 'fr' && lang != 'Fre') {
//         return true;
//       } else {
//         return false;
//       }

//     },

    fill (e) {
      if (!e.detail.dimension) {
        this.first = false
        return
      }
     
      var  newdimensions = this.initializeDimensions(e.detail.dimension)
      this.updateDimensions(this.dimensions, newdimensions, true)  
      console.log(this.dimensions)
      if (e.detail.depth === 0) {
        // remove all step2 dimension
        this.removeStep2Dimensions()
      }
      this.reverseKeyDimensions()
      console.log(this.dimensions)
    },
    removeStep2Dimensions() {
      for(var i=this.dimensions.length - 1; i >= 0; i--) {
        if (this.$store.state.gnParameters.step2.indexOf(this.dimensions[i]['@name']) >= 0) {
          delete this.nameToIndex[this.dimensions[i]['@name']]
          this.dimensions.splice(i,1)
        }
      }
    },
    // fill the array nameToIndex which associated dimension name to index in array dimensions
    reverseKeyDimensions() {
      var self = this
      this.dimensions.forEach(function (dim, index) {
        self.nameToIndex[dim['@name']] = index
      })
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
//         	if (root) {
//         		dimension[index].disableLevel = 0
//         	}
          dimension[index].category = _this.initializeDimensions(obj.category, false)
        }
      })
      return dimension
    },
    updateDimensions (dimensions, newdimensions, root) {
      console.log(dimensions)
      console.log(newdimensions)
      if (!dimensions) {
        return null
      }
      if (!Array.isArray(newdimensions)) {
        newdimensions = [newdimensions]
      }
      
      var _this = this
      dimensions.forEach(function (dimension, index) {
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
        if (dimensions[index].category || (typeof found !== 'undefined' && found.category && found.category.length > 0)) {
	        var subDimension = []
	        if (typeof found !== 'undefined' && found.category && found.category.length > 0) {
	          subDimension = found.category
	        }
	        if (typeof dimensions[index].category === 'undefined' || dimensions[index].category.length === 0) {
	          dimensions[index].category = []
	        } else {
	          dimensions[index].category = _this.updateDimensions(dimensions[index].category, subDimension, false)
          }
        } 
      })
     
      newdimensions.forEach(function (newdimension, index) {
        var found = dimensions.find( function (obj) {
          if (obj['@name']) {
            return obj['@name'] === newdimension['@name'] 
          } else if (obj['@value']){
            return obj['@value'] === newdimension['@value'] 
          } 
        })
        if (!found || (found['@count'] === 'undefined' && root)) {
          dimensions.push(newdimension)
        } 
      })
      console.log(dimensions)
      console.log(newdimensions)
      // order dimension by name
      dimensions.sort(function (a, b) {
        if (a['@label']) {
          return a['@label'] > b['@label'] ? 1 : -1
        } else if (a['@name']) {
          return a['@name'] > b['@name'] ? 1 : -1
        } else if (a['@value']) {
          return a['@value'] > b['@value'] ? 1 : -1
        }
      })
      return dimensions
    },
    reset () {
      this.$router.push({
        name: this.$route.name,
        params: this.$route.params,
        query: {}
      })
      // remove all layers
      // this.$store.commit('layers/init')
      var event = new CustomEvent('aerisResetEvent')
      document.dispatchEvent(event)
    },
    handleReset () {
      this.fulltextSearch = ''  
      // INIT SELECT AREA
      this.$store.commit('selectAreaChange', null)

    },
    handleSearch (e) {
      e.detail.lang = this.$i18n.locale
      if (this.fulltextSearch.length > 0) {
      	e.detail.any = this.fulltextSearch
      } 
      if (this.$store.state.group) {
        var groupOwner = ''
        this.$store.state.group.forEach(function (group) {
          groupOwner += group + '+or+'
        })
        if (groupOwner.length > 4) {
          e.detail._groupOwner = groupOwner.substr(0, groupOwner.length -4)
        }
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
        this.changeText(event)
        return false;
      }
    },
    changeText(event) {
      var route = this.$route
      var query = {}
      for (var prop in route.query) {
        query[prop] = route.query[prop]
      }
      query.any = this.fulltextSearch
      if (query.any === '') {
        delete query.any
      }
      this.$router.push({name: this.$route.name, params: this.$route.params, query: query})
    }
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