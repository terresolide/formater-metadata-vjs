<i18n>{
   "en":{
     "contact": "Contact | Contacts",
     "children": "Children",
     "localize": "Localize on the map",
     "display_layer": "Display the layer on the map",
     "download_data": "Download data",
     "now": "Now",
     "obsolete": "Obsolete",
     "completed": "Completed",
     "historicalArchive": "Archived",
     "planned": "Planned",
     "onGoing": "On going",
     "underDevelopment": "Under development"
   },
   "fr":{
     "contact": "Contact | Contacts",
     "children": "Fiches Enfants",
     "localize": "Localiser sur la carte, cliquer pour garder la position",
     "display_layer": "Afficher sur la carte",
     "download_data": "Télécharger les données",
     "now": "Maintenant",
     "obsolete": "Obsolète",
     "completed": "Finalisé",
     "historicalArchive": "Archivé",
     "planned": "Planifié",
     "onGoing": "En cours",
     "underDevelopment": "En cours de création"
   }
}
</i18n>
<template>
 <div class="mtdt-cartouche-metadata mtdt-capsule" :class="{'mtdt-child': depth > 0}" :style="{width: width + 'px'}">
     <div class="mtdt-header" @click="displayMetadata" @dblclick="displayMetadata" :style="{backgroundColor: emphasis}">
        <i class="fa" :class="meta.type === 'series' ? 'fa-files-o' : 'fa-file'" v-if="['dataset','series'].indexOf(meta.type) >= 0" :title="$gn.t(meta.type)"></i>
        <div>{{meta.title ? meta.title: meta.defaultTitle}}</div>
     </div>
     <div class="mtdt-description">
        <div v-if="meta.thumbnail || meta.status" style="display:block;float:left;max-width:120px;">
        <img :src="meta.thumbnail" v-if="meta.thumbnail"/>
         <div class="mtdt-status" v-if="meta.status"  
         :style="{color: $store.state.style.primary, borderColor: $store.state.style.primary}">
         {{$t(meta.status)}}
         </div>
       
        </div>
         <formater-temporal-extent :start="meta.tempExtentBegin" :end="meta.tempExtentEnd"></formater-temporal-extent>
         
         <div v-if="meta.description" v-html="meta.description" style="padding:5px 0"></div>
         <formater-parameters type="cartouche" :metadata="meta"></formater-parameters>
     </div>
      
     <div class="mtdt-resource" v-if="depth > 0 && meta.related && meta.related.onlines">
       <!--   <formater-online v-for="(item, index) in meta.related.onlines" :key="index" :online="item"></formater-online> -->
     </div>
     <div class="mtdt-footer"  v-if="">
       <div class="mtdt-group" v-if="depth === 0">
         <a v-if="meta.groupWebsite" :href="meta.groupWebsite" :title="$gn.t('group-'+ meta.groupOwner)" target="_blank" class="mtdt-group-logo">
             <img :src="meta.logo"/>
          </a>
          <a v-else href="#" :alt="$gn.t('group-'+ meta.groupOwner)" :title="$gn.t('group-'+ meta.groupOwner)" class="mtdt-group-logo">
              <img :src="meta.logo"  />
          </a>
       </div>
       <formater-related type="cartouche"  :id="meta.id" :cds="dataCenter" :download="meta.download" :order="meta.order" :has-bbox-layer="hasBboxLayer" :layers="meta.layers"  :links="meta.links" :related="meta.related"></formater-related>
     </div>
 </div>
</template>
<script>
import FormaterOnline from './formater-online.vue'
import FormaterRelated from './formater-related.vue'
import FormaterTemporalExtent from './formater-temporal-extent.vue'
const FormaterParameters = () => import('./formater-parameters.vue')
export default {
  name: 'FormaterCartoucheMetadata',
  components: {
    FormaterOnline,
    FormaterRelated,
    FormaterParameters,
    FormaterTemporalExtent
  },
  props: {

    metadata: {
      type: Object,
      default: null
    },
    cds: {
      type: String,
      default: null
    },
    depth: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: null
    }
  },
  computed: {
    width() {
      var depth = this.depth ? 3 : 0
      return this.$store.state.size.capsuleWidth - depth
    },
    primary() {
      return this.$store.state.style.primary
    },
    emphasis() {
      return this.$store.state.style.emphasis
    }
  },
  data() {
    return {
     meta: {},
     uuid: null,
     dataCenter: null,
     hasBboxLayer: false,
     layerAdded: false
    }
  },
  created () {
   moment.locale(this.$i18n.locale)
   this.meta = this.metadata
   if (!this.meta.treatment) {
     this.meta.treatment = {}
   }
   this.meta.treatment.layerAdded = false
   if (this.meta.geoBox  || this.meta.id) {
     this.hasBboxLayer = true
   }
   if (!this.cds) {
     if (this.metadata.groupOwner) {
       this.dataCenter = this.$gn.t('group-'+ this.metadata.groupOwner)
     }
   } else {
     this.dataCenter = this.cds
   }
  },
  methods: {
    displayMetadata () {
      if (this.type === 'geonetwork') {
	      var query = {}
	      if (this.$route.query.box) {
	       query.box = this.$route.query.box
	      }
	      if (this.$route.query.start) {
	        query.start = this.$route.query.start
	      }
	      if (this.$route.query.end) {
	        query.end = this.$route.query.end
	      }
	      this.$store.commit('newRoute', this.$route)
        this.$router.push({name:'Metadata', params: {uuid: this.meta.id}, query: query})
      } else {
        var event = new CustomEvent('fmt:metadataEvent', {detail: {meta:this.meta, depth: -1 } })
        document.dispatchEvent(event)
        this.$store.commit('selectMetadata', this.meta)
      }
//       var event = new CustomEvent('fmt:metadataEvent', {detail: {meta:this.meta, depth: this.depth } })
//       document.dispatchEvent(event)
    }
  /*  changeLayer (layer) {
     // console.log(index)
      // this.$set(this.meta.layers[index], 'checked', !this.meta.layers[index].checked)
      this.$set(layer, 'checked', !layer.checked)
        //   this.meta.layers[index].checked = !this.meta.layers[index].checked
      if (layer.checked) {
        var event = new CustomEvent('fmt:addLayerEvent', {detail: {layer: layer, id: this.meta.id}})
        document.dispatchEvent(event)
        this.layerAdded = true
      } else {
        var event = new CustomEvent('fmt:removeLayerEvent', {detail: {id: layer.id}})
        document.dispatchEvent(event)
        var self = this
        self.layerAdded = false
        this.meta.layers.forEach(function (layer) {
          self.layerAdded = self.layerAdded || layer.checked
        })
      }
      this.updateClass()
    },
    download (index) {
      var url = this.meta.download[index].url
      // var url = 'SENTINEL1.zip'
      headers = { "Upgrade-Insecure-Requests": 1}
      this.$http.get(url, {credentials: true}).then(
        response => {console.log(response);}
      )
    },
    updateClass() {
      var node = this.$el.querySelector('.mtdt-layers')
      if (!node) {
        return
      }
      var nodes = node.querySelectorAll('i')
      var self = this
      nodes.forEach( function (node) {
        var index = node.dataset.layer
        if (self.meta.layers[index].checked) {
          node.className = 'fa fa-check-square-o'
        } else {
          node.className = 'fa fa-square-o'
        }
      })
      
    },
    fixBbox (e) {
      e.target.fixed = true
      e.target.style.backgroundColor = '#8c0209'
      this.selectBbox(e, true)
      setTimeout(() => {
        e.target.style.backgroundColor = this.primary;
        e.target.fixed = false
        }, 2000);
    },
    selectBbox (e, temporaly) {
      var event = new CustomEvent('fmt:selectBboxEvent', {detail: {meta: this.meta, temporaly: temporaly ? true: false}})
      document.dispatchEvent(event)
    },
    unselectBbox (e) {
      if (e.target.fixed) {
        e.target.fixed = !e.target.fixed
        return
      }
      var event = new CustomEvent('fmt:unselectBboxEvent', {detail: {meta: this.meta}})
      document.dispatchEvent(event)
    }*/
  }
}
</script>
<style>

.mtdt-cartouche-metadata{
  position: relative;
  font-size: 15px;
/*  width: calc(30% - 15px);*/
  max-width: 450px;
  min-width: 320px;
  margin: 5px;
  height: 250px;
  max-height:250px;
  text-align:left;
  display: inline-block;
  float:left;
}

.mtdt-cartouche-metadata div.mtdt-header{
  color: white;
  background-color: #dd9946;
  margin: 0;
  font-weight:600;
  font-size: 1.1em;
  min-height:34px;
  max-height:36px;
  padding: 5px;
  cursor: pointer;
  overflow: hidden;
}
/*.mtdt-cartouche-metadata.mtdt-child div.mtdt-header{
  color: #9e631d;
  background-color: white;
}*/
.mtdt-cartouche-metadata div.mtdt-header div{
    display:inline-block;
    float:left;
    width:calc(100% - 15px);
    margin-left: 7px;
    
    overflow: hidden;
    max-height:34px;
    word-break: break-all;
}
.mtdt-cartouche-metadata div.mtdt-header i + div {
    width:calc(100% - 28px); 
}
.mtdt-cartouche-metadata div.mtdt-header i.fa{
    float:left;
    vertical-align:middle;
    font-size: 18px;
    margin-right: 0;

}
.mtdt-cartouche-metadata div.mtdt-description{
    max-height:157px;
    overflow:hidden;
    padding: 5px;
    font-size:15px;
}
.mtdt-cartouche-metadata.mtdt-child div.mtdt-description{
   max-height: 170px;
}
.mtdt-cartouche-metadata div.mtdt-description img {
  position: relative;
   max-width: 110px;
   max-height:80px;
   display:block;
   background: #ddd;
   margin: 0px 15px 3px 0;
}
.mtdt-cartouche-metadata .mtdt-cartouche-elt{
   margin-bottom: 0px;
}
.mtdt-cartouche-metadata .mtdt-footer{
  position: absolute;
  margin: 0 2px;
  bottom:0;
  width:100%;
  min-height: 28px;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}
.mtdt-cartouche-metadata .mtdt-footer > div{
  display: inline-block;
}
.mtdt-cartouche-metadata .mtdt-footer .mtdt-group-logo img{
  max-width:80px;
  max-height:25px;
}

.mtdt-cartouche-metadata .mtdt-resource{
   background:white;
   position:absolute;
   padding: 3px 5px;
   max-height: 100px;
   overflow: hidden;
   z-index:8000;
}
.mtdt-cartouche-metadata .mtdt-resource:hover {
  max-height:none;
}
.mtdt-cartouche-metadata .mtdt-status {
     display:inline-block;
     padding:2px 5px;
     border:1px solid black;
     border-radius:3px;
     box-sizing:border-box;
     margin-right:10px;
     text-align:center;
     font-size:0.9em;
     background:#F3F3F3;
}
</style>