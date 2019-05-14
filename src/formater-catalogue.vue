<i18n>{
   "en":{
   },
   "fr":{
   }
}
</i18n>
<template>
 <div class="fmt-catalogue">
  <aeris-theme :primary="primary" :active="true" :emphasis="emphasis"></aeris-theme>
  <formater-requester :lang="lang" :nb-record="nbRecord"></formater-requester>
 <!-- <formater-draggable-block :show="true">  -->
  <formater-draw-bbox color="#fff" :lang="lang" :background="primary"></formater-draw-bbox>
 <!--  </formater-draggable-block>  -->
  <div >
   <div class="fmt-column-left" >
    <formater-form :lang="lang" :nb-record="nbRecord"></formater-form>
    </div>
   
    <div class="fmt-column-right" >
     <div v-show="metadata === null">
       <formater-paging :lang="lang" :nb-record="nbRecord"></formater-paging>
       <formater-list-metadata :lang="lang" ></formater-list-metadata>
     </div>
      <div v-if="metadata">
    	<formater-metadata :metadata="metadata" :lang="lang" @close="resetMetadata"></formater-metadata>
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
    nbRecord: {
      type: Number,
      coerce: str => parseInt(str),
      default:12
    },
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
      metadata: null,
      metadataListener: null,
      drawing: false
    }
  },
  
  created () {
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    this.metadataListener = this.receiveMetadata.bind(this)
    document.addEventListener('fmt:metadataEvent', this.metadataListener);
  },
  destroyed () {
    document.removeEventListener('fmt:metadataEvent', this.metadataListener);
    this.metadataListener = null;
  },
  methods: {
	receiveMetadata (event) {
	  this.metadata = event.detail
	},
	resetMetadata (event) {
	  var event = new CustomEvent('fmt:closeMetadataEvent')
	  document.dispatchEvent(event)
	  this.metadata = null
	}
  }
}
</script>
<style>
.fmt-catalogue{
  font-size: 12px;
  height:auto;
  width:100%;
  }
.fmt-capsule{
  border: 1px solid #ccc;
  border-radius: 0 0 5px 5px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
.fmt-catalogue .fmt-column-left{
  width:300px;
  float:left;
}
.fmt-catalogue .fmt-column-right{
  width:calc(100% - 330px);
  float:right;
  margin-bottom:120px;
}
</style>