<i18n>{
   "en":{
   },
   "fr":{
      
   }
}
</i18n>
<template>
 <div class="fmt-list">
    <formater-cartouche-metadata v-for="(meta, index) in metadatas" :key="index" :metadata="meta" v-if="meta" :lang="lang"></formater-cartouche-metadata>
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
    document.addEventListener('metadataListEvent', this.metadataListListener);
  },
  destroyed () {
    document.removeEventListener('metadataListEvent', this.metadataListListener);
    this.metadataListListener = null;
  },
  mounted () {
  },
  methods: {
     receiveMetadatas (event) {
       console.log(event)
       var self = this
       var metadatas = {}
       event.detail.forEach( function (meta, index) {
         var uuid = meta['geonet:info'].uuid
         metadatas[uuid] = self.treatment(meta ,uuid)
       })
       this.metadatas = metadatas;
       console.log(this.metadatas)
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
        var headers =  {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': this.lang === 'fr' ? 'fre': 'eng'
        }
        var url = process.env.GEONETWORK + 'srv/api/related?type=parent&type=children&type=services&type=datasets'
        url += '&uuid=' + Object.keys(this.metadatas).join('&uuid=')
        var self = this
        this.$http.get(url, {
              headers: headers
            }).then( response => { self.addRelated(response.body)})
         
     },
     addRelated (related) {
       var self = this
       for(var key in related){
         
         this.$set(this.metadatas[key],'related', related[key])
       }
       console.log(this.metadatas)
     }
  }
}
</script>
<style>
.fmt-list{
  max-width:1200px;
  width: 100%;
  text-align:center;
}
</style>