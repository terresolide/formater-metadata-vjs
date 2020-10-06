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
    <formater-cartouche-metadata  :depth="depth" :type="type" v-for="(meta, index) in metadatas" :key="index" :metadata="meta"  v-if="meta" ></formater-cartouche-metadata>
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
//     list: {
//       type: Array,
//       default: null
// //     },
//     auth: {
//       type: String,
//       default: null
//     },
    depth: {
      type: Number,
      default: 0
    },
    service: {
      type: Number,
      default: -1
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
  created () {
    //this.$i18n.locale = this.lang
   // this.$setGnLocale(this.lang)
    this.metadataListListener = this.receiveMetadatas.bind(this)
    document.addEventListener('fmt:metadataListEvent', this.metadataListListener)
  },
  destroyed () {
    document.removeEventListener('fmt:metadataListEvent', this.metadataListListener);
    this.metadataListListener = null;
  },
  methods: {

     receiveMetadatas (event) {
       
//        if (event.detail.depth != this.depth) {
//          return;
//        }
       this.type = event.detail.type
       this.metadatas = event.detail.metadata
       if (this.metadatas)

       if (this.type === 'geonetwork') {
         this.searchRelated()
       }
     },

     searchRelated () {
       if (!this.metadatas) {
         return
       }
       this.$store.commit('searchingChange', true)
        var headers =  {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': this.$i18n.locale === 'fr' ? 'fre': 'eng'
        }
        var url = this.$store.state.geonetwork + 'srv/api/related?type=children&type=parent&type=associated&type=siblings'
        url += '&uuid=' + Object.keys(this.metadatas).join('&uuid=')
        var self = this
        this.$http.get(url, {
              headers: headers
            }).then( response => {self.addRelated(response.body)},
                     response => {this.$store.commit('searchingChange', false)})
     },
     addRelated (related) {
       var self = this
       for(var key in this.metadatas){
         if (related[key]) {
           var count = 0
           for(var name in related[key]) {
             if (related[key][name] === null) {
                 delete related[key][name]
             } else {
               count++
             }
           }
           if (count > 0) {
             this.$set(this.metadatas[key],'related', related[key])
           }
         }
       }
       this.$store.commit('searchingChange', false)
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