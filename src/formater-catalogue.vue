<i18n>{
   "en":{
   },
   "fr":{
   }
}
</i18n>
<template>
 <div class="mtdt-catalogue">
  <aeris-theme :primary="primary" :active="true" :emphasis="emphasis"></aeris-theme>
  <formater-requester :lang="lang"  :depth="metadatas.length"></formater-requester>
 <!-- <formater-draggable-block :show="true">  -->
  <formater-draw-bbox color="#fff" :lang="lang" :background="primary"></formater-draw-bbox>
 <!--  </formater-draggable-block>  -->
  <div >
   <div class="mtdt-column-left" >
    <formater-form :lang="lang" :disableLevel="metadatas.length > 0 ? 1 : 0" ></formater-form>
    </div>
   
    <div class="mtdt-column-right" >
    <div id="fmtLargeMap"></div>
     <div v-show="metadatas.length === 0">
       <formater-paging :lang="lang" :nb-record="nbRecord" :record-by-line="recordByLine" :depth="0" :orders="['title','changeDate']" order-by="title"></formater-paging>
       <formater-list-metadata :lang="lang" :depth="0" :capsule-width="capsuleWidth"></formater-list-metadata>
     </div>
     <div  v-if="metadatas.length > 0" >
	    	<formater-metadata v-for="(meta, index) in metadatas" :key="index" v-show="index === metadatas.length-1" :depth="index" :metadata="meta" :lang="lang" :capsule-width="capsuleWidth - 10" :record-by-line="recordByLine" @close="resetMetadata" ></formater-metadata>
	    	
	 </div>
	  	 
     </div>
    </div>
   
  </div>
  
 </div>
</template>
<script>

import FormaterForm from './formater-form.vue';
import FormaterListMetadata from './formater-list-metadata.vue';
// import FormaterMetadata from './formater-metadata.vue';
const FormaterMetadata = () => import('./formater-metadata.vue')
import FormaterPaging from './formater-paging.vue';
// import {FormaterDraggableBlock} from 'formater-commons-components-vjs';
//import FormaterDraggableBlock from './formater-draggable-block.vue';
import FormaterDrawBbox from './formater-draw-bbox.vue';
import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue'
import FormaterRequester from './formater-requester.vue';

export default {
  name: 'FormaterCatalogue',
  components: {
    FormaterDrawBbox,
    FormaterForm,
    FormaterListMetadata,
    FormaterMetadata,
    FormaterPaging,
    FormaterRequester,
    // FormaterDraggableBlock,
    AerisTheme
  },
  props: {
//     geonetwork: {
//       type: String,
//       default: null
//     },
    lang: {
      type: String,
      default: 'en'
    },
//     nbRecord: {
//       type: Number,
//       coerce: str => parseInt(str),
//       default:12
//     },
    primary: {
      type: String,
      default: '#754a15'
    },
    emphasis: {
      type: String,
      default: '#dd9946'
    }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue
    	this.$setGnLocale(this.lang)
    }
  },
  data() {
    return {
      currentUuid: null,
      depth: null,
      metadatas: [],
      metadataListener: null,
      drawing: false,
      aerisSearchListener: null,
      aerisResetListener: null,
      resizeListener: null,
      recordByLine: 4,
      nbRecord: 24,
      capsuleWidth: 300
    }
  },
  
  created () {
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    this.metadataListener = this.receiveMetadata.bind(this)
    document.addEventListener('fmt:metadataEvent', this.metadataListener);
    this.aerisSearchListener = this.handleSearch.bind(this)
    document.addEventListener('aerisSearchEvent', this.aerisSearchListener)
    this.aerisResetListener = this.handleReset.bind(this)
    document.addEventListener('aerisResetEvent', this.aerisResetListener)
    this.resizeListener = this.resize.bind(this)
    window.addEventListener('resize', this.resizeListener);
    console.log('formater-catalogue CREATED')
    this.resize()
    console.log('capsuleWidth dans catalogue = ' + this.capsuleWidth)
  },
  mounted () {
    var evt = new CustomEvent('fmt:pageChangedEvent')
    document.dispatchEvent(evt)
  },
  destroyed () {
    document.removeEventListener('fmt:metadataEvent', this.metadataListener);
    this.metadataListener = null;
    document.removeEventListener('aerisSearchEvent', this.aerisSearchListener)
    this.aerisSearchListener = null
    document.removeEventListener('aerisResetEvent', this.aerisResetListener)
    this.aerisResetListener = null
  },
  methods: {
	receiveMetadata (event) {
	  console.log(event.detail)
	    this.metadatas.push(event.detail.meta)
	    

	
	  //this.metadata =  event.detail.meta
	  this.currentUuid = event.detail.meta['geonet:info'].uuid
	  
	  console.log(this.currentUuid)
	},
	resetMetadata (event) {
	  
	    this.metadatas.pop()
	    if (this.metadatas.length > 0) {
	      this.currentUuid = this.metadatas[this.metadatas.length - 1]['geonet:info'].uuid
	    } else {
	      this.currentUuid = null
	    }
	    console.log(this.currentUuid)
	    console.log(this.metadatas.length)
// 	    var previous = this.metadatas.length-1 ? this.metadatas[this.metadatas.length-1]:null
// 	  if (previous) {
// 		this.metadata = previous
// 		this.currentUuid = this.metadata['geonet:info'].uuid
		
// 	  } else {
// 	    this.metadata = null
// 		  this.currentUuid = null
 	    var event = new CustomEvent('fmt:closeMetadataEvent', {detail:  {depth: this.metadatas.length}})
 		  document.dispatchEvent(event)
		
// 	  }
	},
  resize () {
//     if (this.$el) {
//       var node = this.$el
//       while (node.offsetWidth === 0) {
//         node = node.parentNode
//       }
      console.log('resize')
      var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      width -= 330
      var count = parseInt(width/334)
      this.capsuleWidth = parseInt(width / count - 16)
      console.log(this.capsuleWidth)
      this.recordByLine = count
  	  this.nbRecord = count * 4
    //}
  },
// 	recordsPerLineChange (count) {
// 	  this.recordByLine = count
// 	  this.nbRecord = count * 4
// // 	  var evt = new CustomEvent('fmt:pageChangedEvent')
// // 	  document.dispatchEvent(evt)
// 	},
	handleReset (event) {
	  console.log('reset')
	  this.metadatas = []
	  this.metadatas.length = 0
	  this.currentUuid = null
	},
	handleSearch (event) {
	  if (this.metadatas.length > 0) {
	    event.detail.parentUuid = this.currentUuid
	  }
	}
  }
}
</script>
<style src="formater-commons-components-vjs/src/assets/css/formater-icon.css"></style>
<style>
.mtdt-catalogue{
  font-size: 12px;
  height:auto;
  width:100%;
  }
 .mtdt-catalogue .fa{
  font-size: inherit;
 }

.mtdt-capsule{
  border: 1px solid #ccc;
  border-radius: 0 0 5px 5px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
.mtdt-catalogue .mtdt-column-left{
  width:300px;
  float:left;
}
.mtdt-catalogue .mtdt-column-right{
  width:calc(100% - 310px);
  float:right;
  margin-bottom:120px;
}
</style>