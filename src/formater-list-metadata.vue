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
     getType (obj) {
       if (obj.type === 'FeatureCollection' || obj.type === 'Feature') {
         this.type = 'geojson'
       } else {
         this.type = 'geonetwork'
       }
     },
     receiveMetadatas (event) {
       if (event.detail.depth != this.depth) {
         return;
       }
       var type = this.getType(event.detail)
       switch (this.type) {
       case 'geojson':
         this.treatmentGeojson(event.detail)
         break;
       case 'geonetwork':
         this.treatmentGeonetwork(event.detail)
         break;
       }
      
     },
     mapToGeonetwork (properties) {
       if (properties.startDate) {
         properties.renameProperty('startDate', 'tempExtentBegin')
       }
       if (properties.completionDate) {
         properties.renameProperty('completionDate', 'tempExtentEnd')
       }
      
       if (properties.services) {
         if(properties.services.browse && properties.services.browse.layer && properties.services.browse.layer.type === "WMS") {
           var url = properties.services.browse.layer.url.substr(0, properties.services.browse.layer.url.indexOf('?')) 
           properties.layers = []
           this.flatsimLayerList.forEach( function (name, index) {
             var layer = {
                 id: properties.id + '_' + index,
                 name: name,
                 description:  name,
                 href: url + '/' + name + '?',
                 type: 'OGC:WMS',
                 checked: false
             }
             properties.layers.push(layer)
           })
         }
         if(properties.services.download && properties.services.download.url) {
           if (!properties.download) {
             properties.download = []
           }
           properties.download.push(properties.services.download)
         }
       }
       return properties
     },
     treatmentGeojson (data) {
       var metadatas = {}
       var self = this
       data.features.forEach( function (feature) {
         feature.properties.id = feature.id
         metadatas[feature.id] =  self.mapToGeonetwork(feature.properties)
        
       })
       this.metadatas = metadatas
       
       console.log(this.metadatas)
     },
     treatmentGeonetwork (data) {
       var metadatas = {}
       var self = this
       if (!data.metadata){
         var metadatas = null
       } else if (data.metadata && !data.metadata.forEach) {
         var uuid = data.metadata['geonet:info'].uuid
         metadatas[uuid] = self.treatment(event.detail.metadata ,uuid)
       } else {
	       data.metadata.forEach( function (meta, index) {
	         var uuid = meta['geonet:info'].uuid
	         metadatas[uuid] = self.treatment(meta ,uuid)
	       })
       }
       this.metadatas = metadatas;
       this.searchRelated()
     },
     treatment (meta, uuid) {
       meta.logo = process.env.GEONETWORK + meta.logo
       meta.id = uuid
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
       if (!meta.link) {
         return meta;
       }
       var links = this.$gnToArray(meta.link)
       var self = this
       links.forEach(function (link, index) {
         switch (link[3]) {
         case 'OpenSearch':
           meta.api = {}
           meta.api.http = link[2]
           meta.api.name = link[0].length > 0 ? link[0] : link[1]
           break;
         case 'OGC:WMS': 
           if (!meta.layers) {
             meta.layers = []
           }
           var id = meta.uuid + '_' + index
           meta.layers.push(self.$gnLinkToLayer(link, id))
           break;
         case 'WWW:DOWNLOAD-1.0-link--download':
         case 'telechargement':
           if (!meta.download) {
             meta.download = []
           }
           meta.download.push(self.$gnLinkToDownload(link))
           break;
         case 'WWW:LINK-1.0-http--link':
         default:
           if (!meta.links) {
             meta.links = []
           }
           meta.links.push(link)
           break;
         }
       }) 
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