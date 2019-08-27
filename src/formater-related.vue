<i18n>{
   "en":{
     "children": "Children",
     "localize": "Localize on the map",
     "display_layer": "Display the layer on the map",
     "download_data": "Download data"
   },
   "fr":{
     "children": "Fiches Enfants",
     "localize": "Localiser sur la carte, cliquer pour garder la position",
     "display_layer": "Afficher sur la carte",
     "download_data": "Télécharger les données"
   }
}
</i18n>
<template>
  <span class="mtdt-related" :class="'mtdt-related' + type">
    <div v-if="download && download.length === 1">
       <div class="mtdt-related-type fa fa-download" @click="triggerDownload(0)" :style="{backgroundColor: primary}" :title="$t('download_data')">
      </div> 
    </div>
    <div v-if="download && download.length >1">
       <div class="mtdt-related-type fa fa-download"  :style="{backgroundColor: primary}" :title="$t('download_data')">
         <span class="fa fa-caret-down"></span>
      </div> 
      <div class="mtdt-expand">
           <ul class="mtdt-layers">
           <li v-for="(download, index) in download" :key="index" @click="triggerDownload(index);">
            <div  :title="download.description">{{download.name}}</div>
          </li>
          </ul>    
      </div>  
    </div>
    <div v-if="type === 'cartouche' && hasBboxLayer" style="display:inline-block;" >
      <div class="mtdt-related-type fa fa-dot-circle-o" :style="{backgroundColor:primary}" 
     :title="$t('localize')"   @click="fixBbox">
      </div>
    
    </div>
    <div v-if="layers && layers.length === 1">
      <div class="mtdt-related-type fa fa-globe" @click="changeLayer(layers[0])" :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" :title="$t('display_layer')">
          
       </div> 
   </div>
    <div v-if="layers && layers.length > 1">
      <div class="mtdt-related-type fa fa-globe" :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" >
          <span class="fa fa-caret-down" ></span>
       </div>
       <div class="mtdt-expand">
            <ul class="mtdt-layers">
            <li v-for="(layer, index) in layers" :key="index" @click="changeLayer(layer);">
             <i class="fa fa-square-o"   :data-layer="index"></i>
             <div  :title="layer.description">{{layer.name}}</div>
           </li>
           </ul>    
       </div>  
   </div>
   
   <div v-if="related && (related.children || related.parent)" style="position:relative;">
   <div class="mtdt-related-type fa fa-code-fork" :style="{backgroundColor:primary}">
      <span class="fa fa-caret-down"></span>
         </div>
         <div class="mtdt-expand">
             <label v-if="related.parent">{{$t('parent')}}</label>
             <ul v-if="related.parent">
              <li v-for="(item,index) in related.children">
                {{item.title[($i18n.locale === 'fr'? 'fre' : 'eng')]}}
             </li>
             </ul>    
             <label v-if="related.children">{{$t('children')}}</label>
             <ul v-if="related.children">
              <li v-for="(item,index) in related.children">
               {{item.title[($i18n.locale === 'fr'? 'fre' : 'eng')]}}
             </li>
             </ul>        
         </div>
     </div>
  </span>
  </template>>
  <script>
  export default {
    props: {
      id: {
        type: String,
        default: null
      },
      type: {
        type: String,
        default: 'cartouche'
      },
      download: {
        type: Array,
        default: null
      },
      hasBboxLayer: {
        type: Boolean,
        default: false
      },
      layers: {
        type: Array,
        default: null
      },
      related: {
        type: Object,
        default: null
      }
    },
    mounted () {
      console.log(this.id)
    },
    computed: {
      primary() {
        return this.$store.state.style.primary
      },
      emphasis() {
        return this.$store.state.style.emphasis
      }
    },
    data () {
      return {
        layerAdded: false
      }
    },
    methods: {
      changeLayer (layer) {
         console.log(layer.id)
        // console.log(index)
         // this.$set(this.meta.layers[index], 'checked', !this.meta.layers[index].checked)
         this.$set(layer, 'checked', !layer.checked)
           //   this.meta.layers[index].checked = !this.meta.layers[index].checked
         if (layer.checked) {
           var event = new CustomEvent('fmt:addLayerEvent', {detail: {layer: layer, id: this.id}})
           document.dispatchEvent(event)
           this.layerAdded = true
         } else {
           var event = new CustomEvent('fmt:removeLayerEvent', {detail: {id: layer.id}})
           document.dispatchEvent(event)
           var self = this
           self.layerAdded = false
           this.layers.forEach(function (layer) {
             self.layerAdded = self.layerAdded || layer.checked
           })
         }
         this.updateClass()
       },
       triggerDownload (index) {
         var url = this.download[index].url
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
           if (self.layers[index].checked) {
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
         var event = new CustomEvent('fmt:selectBboxEvent', {detail: {id: this.id, temporaly: temporaly ? true: false}})
         document.dispatchEvent(event)
       },
       unselectBbox (e) {
         if (e.target.fixed) {
           e.target.fixed = !e.target.fixed
           return
         }
         var event = new CustomEvent('fmt:unselectBboxEvent', {detail: {id: this.id}})
         document.dispatchEvent(event)
       }
    }
    
  }
  </script>
  <style>
  .mtdt-cartouche-metadata .mtdt-footer .mtdt-related{
 float: right;
 margin-right:3px;
 max-height: 25px;
 max-width: 50%;
}
 .mtdt-related > div {
 display:inline-block;
}
.mtdt-cartouche-metadata .mtdt-footer .mtdt-related-type{
 text-align:center;
 min-width:20px;
 vertical-align:bottom;
 cursor:pointer;
 border-radius:3px;
 /*background:#8c0209;*/
 background:#754a15;
 padding:3px 5px;
 color:white;
 font-size:1.3em;
 margin-right:3px;
 opacity:0.9;
}
.mtdt-cartouche-metadata .mtdt-footer .mtdt-related-type:hover{
  opacity:1;
}
.mtdt-related-type + .mtdt-expand{
    display:none;
    position:absolute;
    bottom: 21px;
    right:0;
    z-index:100;
    height:auto;
    min-width:200px;
    background:white;
    padding:5px;
    border-radius:3px;
    border:1px dotted grey;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.5);
    width:auto;
    text-align:left;
}
.mtdt-expand:hover {
  display: block;
}
.mtdt-cartouche-metadata .mtdt-footer .mtdt-related-type:hover + .mtdt-expand{
  display:block;
}
.mtdt-cartouche-metadata .mtdt-footer .mtdt-related-type span{
 font-size:0.8em;
 margin-left:3px;
}
.mtdt-cartouche-metadata .mtdt-expand label{
  font-weight: 500;
}
 
.mtdt-cartouche-metadata .mtdt-expand ul {
  padding:0;
  list-style-position: outside;
  margin:  5px 3px 5px 9px;
}
.mtdt-cartouche-metadata .mtdt-expand ul li {
  padding: 0px;
  margin:  0;
}
.mtdt-cartouche-metadata ul.mtdt-layers{
  list-style-type: none;
  margin-left:0px;
}
.mtdt-cartouche-metadata ul.mtdt-layers li{
  cursor: pointer;
}
.mtdt-cartouche-metadata ul.mtdt-layers li {
  vertical-align:text-top;
}
.mtdt-cartouche-metadata ul.mtdt-layers li div{
      display: inline-block;
    text-overflow: clip;
    margin:0;
    padding:0;
    width: calc(100% - 28px);
    overflow: hidden;
    word-break: break-all;
    vertical-align: top;
    max-height:26px;
}
  </style>