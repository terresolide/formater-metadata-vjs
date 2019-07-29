<i18n>{
   "en":{
     "contact": "Contact | Contacts",
     "children": "Children",
     "localize": "Localize on the map",
     "display_layer": "Display the layer on the map",
     "download_data": "Download data"
   },
   "fr":{
     "contact": "Contact | Contacts",
     "children": "Fiches Enfants",
     "localize": "Localiser sur la carte, cliquer pour garder la position",
     "display_layer": "Afficher sur la carte",
     "download_data": "Télécharger les données"
   }
}
</i18n>
<template>
 <div class="mtdt-cartouche-metadata mtdt-capsule" :class="{'mtdt-child': depth > 0}" :style="{width: width + 'px'}">
     <div class="mtdt-header" @click="displayMetadata" @dblclick="displayMetadata" :style="{backgroundColor: emphasis}">
        <i class="fa" :class="meta.type === 'series' ? 'fa-files-o' : 'fa-file'" v-if="['dataset','series'].indexOf(meta.type) >= 0" :title="$gn(meta.type)"></i>
        <div>{{meta.title ? meta.title: meta.defaultTitle}}</div>
     </div>
     <div class="mtdt-description">
        <img :src="meta.thumbnail" v-if="meta.thumbnail"/>
        <div v-if="meta.tempExtentBegin || meta.tempExtentEnd" class="mtdt-cartouche-elt">
                <span v-if="meta.tempExtentBegin">{{date2str(meta.tempExtentBegin)}}</span>
                <i class="fa fa-long-arrow-right" :style="{color:primary}" ></i>
                <span v-if="meta.tempExtentEnd">{{date2str(meta.tempExtentEnd)}}</span>
        </div>
         <span v-html="meta.description"></span>
         <div v-for="(item, key) in meta" :key="key" v-if="type === 'geojson' && flatsimSingleFields.indexOf(key) >=0">
           <label style="text-transform:capitalize;" :style="{color:primary}">{{key}}: </label> {{item}}
         </div>
     </div>
      
     <div class="mtdt-resource" v-if="depth > 0 && meta.related && meta.related.onlines">
       <!--   <formater-online v-for="(item, index) in meta.related.onlines" :key="index" :online="item"></formater-online> -->
     </div>
     <div class="mtdt-footer"  v-if="">
       <div class="mtdt-group" v-if="depth === 0">
         <a v-if="meta.groupWebsite" :href="meta.groupWebsite" :title="$gn('group-'+ meta.groupOwner)" target="_blank" class="mtdt-group-logo">
             <img :src="meta.logo"/>
          </a>
          <a v-else href="#" :alt="$gn('group-'+ meta.groupOwner)" :title="$gn('group-'+ meta.groupOwner)" class="mtdt-group-logo">
              <img :src="meta.logo"  />
          </a>
       </div>
       <div class="mtdt-related" >
           <div v-if="meta.download && meta.download.length === 1">
              <div class="mtdt-related-type fa fa-download" @click="download(0)" :style="{backgroundColor: primary}" :title="$t('download_data')">
             </div> 
           </div>
           <div v-if="meta.download && meta.download.length >1">
              <div class="mtdt-related-type fa fa-download"  :style="{backgroundColor: primary}" :title="$t('download_data')">
                <span class="fa fa-caret-down"></span>
             </div> 
             <div class="mtdt-expand">
                  <ul class="mtdt-layers">
                  <li v-for="(download, index) in meta.download" :key="index" @click="download(index);">
                   <div  :title="download.description">{{download.name}}</div>
                 </li>
                 </ul>    
             </div>  
           </div>
           <div v-if="hasBboxLayer" style="display:inline-block;" >
            <div class="mtdt-related-type fa fa-dot-circle-o" :style="{backgroundColor:primary}" 
            :title="$t('localize')"   @click="fixBbox">
             </div>
           
         </div>
          <div v-if="meta.layers && meta.layers.length === 1">
            <div class="mtdt-related-type fa fa-globe" @click="changeLayer(meta.layers[0])" :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" :title="$t('display_layer')">
                
             </div> 
         </div>
          <div v-if="meta.layers && meta.layers.length > 1">
            <div class="mtdt-related-type fa fa-globe" :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" >
                <span class="fa fa-caret-down" ></span>
             </div>
             <div class="mtdt-expand">
                  <ul class="mtdt-layers">
                  <li v-for="(layer, index) in meta.layers" :key="index" @click="changeLayer(layer);">
                   <i class="fa fa-square-o"   :data-layer="index"></i>
                   <div  :title="layer.description">{{layer.name}}</div>
                 </li>
                 </ul>    
             </div>  
         </div>
    
         <div v-if="meta.related && (meta.related.children || meta.related.parent)" style="position:relative;">
             <div class="mtdt-related-type fa fa-code-fork" :style="{backgroundColor:primary}">
                <span class="fa fa-caret-down"></span>
             </div>
             <div class="mtdt-expand">
                 <label v-if="meta.related.parent">{{$t('parent')}}</label>
                 <ul v-if="meta.related.parent">
                  <li v-for="(item,index) in meta.related.children">
                    {{item.title[(lang === 'fr'? 'fre' : 'eng')]}}
                 </li>
                 </ul>    
                 <label v-if="meta.related.children">{{$t('children')}}</label>
                 <ul v-if="meta.related.children">
                  <li v-for="(item,index) in meta.related.children">
                   {{item.title[(lang === 'fr'? 'fre' : 'eng')]}}
                 </li>
                 </ul>        
             </div>
         </div>
       </div>
     </div>
 </div>
</template>
<script>
import FormaterOnline from './formater-online.vue'
export default {
  name: 'FormaterCartoucheMetadata',
  components: {
    FormaterOnline
  },
  props: {
    lang: {
      type: String,
      default: 'en'
    },
    metadata: {
      type: Object,
      default: null
    },
    depth: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: 300
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
        moment.locale(newvalue)
    }
  },
  data() {
    return {
     meta: {},
     uuid: null,
     hasBboxLayer: false,
     flatsimSingleFields: ['productType', 'processingLevel', 'processingMode', 'sensorMode', 'polarisation', 'subswath'],
     layerAdded: false
    }
  },
  created () {
   this.$i18n.locale = this.lang
   this.$setGnLocale(this.lang)
   moment.locale(this.lang)
   this.meta = this.metadata
   if (this.meta.geoBox  || this.meta.id) {
     this.hasBboxLayer = true
   }
  },
  methods: {
    displayMetadata () {
      var event = new CustomEvent('fmt:metadataEvent', {detail: {meta:this.meta, depth: this.depth } })
      document.dispatchEvent(event)
    },
    date2str (date) {
      //return 'hello';
      return moment(date, 'YYYY-MM-DD').format('ll')
    },
    changeLayer (layer) {
     // console.log(index)
      // this.$set(this.meta.layers[index], 'checked', !this.meta.layers[index].checked)
      this.$set(layer, 'checked', !layer.checked)
        //   this.meta.layers[index].checked = !this.meta.layers[index].checked
      if (layer.checked) {
        var event = new CustomEvent('fmt:addLayerEvent', {detail: {layer: layer, uuid: this.meta.uuid}})
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
    }
  }
}
</script>
<style>

.mtdt-cartouche-metadata{
  position: relative;
  font-size: 12px;
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
  min-height:29px;
  padding: 5px;
  cursor: pointer;
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
    max-height:29px;
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
    max-height:170px;
    overflow:hidden;
    padding: 5px;
    font-size:0.9em;
}
.mtdt-cartouche-metadata.mtdt-child div.mtdt-description{
   max-height: 170px;
}
.mtdt-cartouche-metadata div.mtdt-description img {
  position: relative;
   float:left;
   max-width: 150px;
   max-height:80px;
   background: #ddd;
   margin: 0px 15px 10px 0;
}
.mtdt-cartouche-metadata .mtdt-cartouche-elt{
   margin-bottom: 5px;
}
.mtdt-cartouche-metadata .mtdt-footer{
  position: absolute;
  margin: 0 2px;
  bottom:0;
  width:100%;
  min-height: 28px;
}
.mtdt-cartouche-metadata .mtdt-footer > div{
  display: inline-block;
}
.mtdt-cartouche-metadata .mtdt-footer .mtdt-group-logo img{
  max-width:80px;
  max-height:25px;
}
.mtdt-cartouche-metadata .mtdt-footer .mtdt-related{
 float: right;
 margin-right:3px;
 max-height: 25px;
 max-width: 50%;
}
.mtdt-cartouche-metadata .mtdt-footer .mtdt-related > div {
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