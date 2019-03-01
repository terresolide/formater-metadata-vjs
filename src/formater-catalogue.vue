<i18n>{
   "en":{
   },
   "fr":{
   }
}
</i18n>
<template>
 <span class="fmt-catalogue">
  <aeris-theme primary="#dd9946" :active="true" emphasis="#dd9946"></aeris-theme>
  <div v-if="metadata === null">
   <div class="fmt-column-left" >
    <formater-form :lang="lang" :nb-record="nbRecord"></formater-form>
    </div>
   
    <div class="fmt-column-right" >
     <formater-paging :lang="lang" :nb-record="nbRecord"></formater-paging>
     <formater-list-metadata :lang="lang"></formater-list-metadata>

    </div>
  </div>
  <div v-if="metadata">
    <formater-metadata :metadata="metadata" :lang="lang" @close="resetMetadata"></formater-metadata>
  </div>
 </span>
</template>
<script>
import FormaterForm from './formater-form.vue';
import FormaterListMetadata from './formater-list-metadata.vue';
import FormaterMetadata from './formater-metadata.vue';
import FormaterPaging from './formater-paging.vue';
import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue'
export default {
  name: 'FormaterCatalogue',
  components: {
    FormaterForm,
    FormaterListMetadata,
    FormaterMetadata,
    FormaterPaging,
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
      metadataListener: null
    }
  },
  
  created () {
    console.log(this.nbRecord)
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
	  console.log(event)
	  this.metadata = event.detail
	},
	resetMetadata (event) {
	  this.metadata = null
	}
  }
}
</script>
<style>
.fmt-catalogue{
  font-size: 12px;
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