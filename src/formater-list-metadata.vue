<i18n>{
   "en":{
     "no_result": "No record for this request"
   },
   "fr":{
     "no_result": "Aucune fiche ne correspond!"
   }
}
</i18n>
<template>
 <div class="mtdt-list" >
    <div v-if="!metadatas" style="width:calc(100% - 150px);">{{$t('no_result')}}</div>
    <formater-cartouche-metadata :width="capsuleWidth" :color="color" :depth="depth" :type="type" v-for="(meta, index) in metadatas" :key="index" :metadata="meta" v-if="meta" :lang="lang"></formater-cartouche-metadata>
  </div>
</template>
<script>
import FormaterCartoucheMetadata from './formater-cartouche-metadata.vue'
export default {
  name: 'FormaterListMetadata',
  components: {
    FormaterCartoucheMetadata
  },
  props: {
    list: {
      type: Array,
      default: null
    },
    lang: {
      type: String,
      default: 'en'
    },
    depth: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#dd9946'
    },
    capsuleWidth: {
      type: Number,
      default: 300
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
      metadatas: {},
      // list of children
      related: [],
      metadataListListener: null,
      type: null,
      flatsimLayerList: ['CLASSIFICATION', 'CONFIDENCE', 'PIXELS_VALIDITY'],
    }
  },
  created: function() {
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    this.metadataListListener = this.receiveMetadatas.bind(this)
    document.addEventListener('fmt:metadataListEvent', this.metadataListListener)
  },
  destroyed () {
    document.removeEventListener('fmt:metadataListEvent', this.metadataListListener);
    this.metadataListListener = null;
  },
  methods: {

     receiveMetadatas (event) {
       if (event.detail.depth != this.depth) {
         return;
       }
       this.type = event.detail.type
       this.metadatas = event.detail.metadata
       if (this.type === 'geonetwork') {
         this.searchRelated()
       }
     },

     searchRelated () {
       if (!this.metadatas) {
         return
       }
        var headers =  {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': this.lang === 'fr' ? 'fre': 'eng'
        }
        var url = process.env.GEONETWORK + 'srv/api/related?type=children'
        url += '&uuid=' + Object.keys(this.metadatas).join('&uuid=')
        var self = this
        this.$http.get(url, {
              headers: headers
            }).then( response => {self.addRelated(response.body)})
     },
     addRelated (related) {
       var self = this
       for(var key in this.metadatas){
         if (related[key]) {
           this.$set(this.metadatas[key],'related', related[key])
         }
       }
     }
  }
}
</script>
<style scoped>
.mtdt-list{
  width: 100%;
  text-align:center;
  margin: 10px auto;
}
</style>