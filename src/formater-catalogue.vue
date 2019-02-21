<i18n>{
   "en":{
   },
   "fr":{
      
   }
}
</i18n>
<template>
 <span class="fmt-catalogue">
  <div v-if="metadata === null">
   <div style="width:300px;float:left;">
    <formater-form :lang="lang"></formater-form>
    </div>
    <div style="width:calc(100% - 300px);float:left;">
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
export default {
  name: 'FormaterCatalogue',
  components: {
    FormaterForm,
    FormaterListMetadata,
    FormaterMetadata
  },
  props: {
//     geonetwork: {
//       type: String,
//       default: null
//     },
    lang: {
      type: String,
      default: 'en'
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
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    this.metadataListener = this.receiveMetadata.bind(this)
    document.addEventListener('metadataEvent', this.metadataListener);
  },
  destroyed () {
    document.removeEventListener('metadataEvent', this.metadataListener);
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
  border-radius: 10px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
</style>