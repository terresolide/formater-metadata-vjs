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
 <div class="fmt-list">
    <div v-if="!metadatas" style="width:calc(100% - 150px);">{{$t('no_result')}}</div>
    <formater-cartouche-metadata :depth="depth" v-for="(meta, index) in metadatas" :key="index" :metadata="meta" v-if="meta" :lang="lang"></formater-cartouche-metadata>
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
      metadataListListener: null
    }
  },
  created: function() {
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    this.metadataListListener = this.receiveMetadatas.bind(this)
    document.addEventListener('fmt:metadataListEvent', this.metadataListListener);
  },
  destroyed () {
    document.removeEventListener('fmt:metadataListEvent', this.metadataListListener);
    this.metadataListListener = null;
  },
  mounted () {
  },
  methods: {
     receiveMetadatas (event) {
       
       if (event.detail.depth != this.depth) {
         return;
       }
       var self = this
       var metadatas = {}
       if (!event.detail.metadata){
         metadatas = null
       } else if (event.detail.metadata && !event.detail.metadata.forEach) {
         var uuid = event.detail.metadata['geonet:info'].uuid
         metadatas[uuid] = self.treatment(event.detail.metadata ,uuid)
       } else {
	       event.detail.metadata.forEach( function (meta, index) {
	         var uuid = meta['geonet:info'].uuid
	         metadatas[uuid] = self.treatment(meta ,uuid)
	       })
       }
       this.metadatas = metadatas;
       this.searchRelated()
     },
     treatment (meta) {
       meta.logo = process.env.GEONETWORK + meta.logo
       if (meta.abstract) {
         meta.abstract = meta.abstract.replace(/(?:\\[rn]|[\r\n])/g, '<br />');
       }
       if (meta.defaultAbstract) {
         meta.defaultAbstract = meta.defaultAbstract.replace(/(?:\\[rn]|[\r\n])/g, '<br />');
       }
       meta.description = meta.abstract ? meta.abstract: meta.defaultAbstract
       
       if (meta.image) {
           meta.images =  this.$gnToArray(meta.image)
           meta.images.forEach( function (image, index) {
             if(image[0] === 'thumbnail') {
               meta.thumbnail = image[1]
             }
           })
       }
       return meta;
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
            }).then( response => { self.addRelated(response.body)})
         
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
.fmt-list{
  width: 100%;
  text-align:center;
  margin: 20px auto;
}
</style>