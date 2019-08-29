<i18n>{
   "en":{
      "all_box": "All bbox"
   },
   "fr":{
	  "all_box": "Les bbox"
   }
}
</i18n>
<template>
 <span id="fmtLitleMap">
  <div id="fmtMap" class="mtdt-small"></div>
 </span>
</template>
<script>
var L = require("leaflet");
L.Control.Fmtlayer = require('./leaflet.control.fmtlayer.js')
L.Control.Reset = require('./leaflet.control.reset.js')
L.Control.Fullscreen = require('./leaflet.control.fullscreen.js')
// import {Map, Control, LatLng, tileLayer, TileLayer} from 'leaflet'
// import L from 'leaflet'
export default {
  name: 'FormaterMap',
  components: {
  },
  props: {
    lang: {
      type: String,
      default: 'en'
    }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue 
    	this.resetControl.setLang(newvalue)
    }
  },
  created: function() {
    this.$i18n.locale = this.lang
    this.metadataListListener = this.receiveMetadatas.bind(this)
    document.addEventListener('fmt:metadataListEvent', this.metadataListListener);
    this.metadataListener = this.receiveMetadata.bind(this)
    document.addEventListener('fmt:metadataEvent', this.metadataListener);
    this.selectBboxListener = this.selectBbox.bind(this)
    document.addEventListener('fmt:selectBboxEvent', this.selectBboxListener)
    this.unselectBboxListener = this.unselectBbox.bind(this)
    document.addEventListener('fmt:unselectBboxEvent', this.unselectBboxListener)
    this.closeMetadataListener = this.back.bind(this)
    document.addEventListener('fmt:closeMetadataEvent', this.closeMetadataListener);
    this.aerisResetListener = this.handleReset.bind(this)
    document.addEventListener('aerisResetEvent', this.aerisResetListener)
    this.addLayerListener = this.addLayer.bind(this)
    document.addEventListener('fmt:addLayerEvent', this.addLayerListener)
    this.removeLayerListener = this.removeLayer.bind(this)
    document.addEventListener('fmt:removeLayerEvent', this.removeLayerListener)
  },
  destroyed () {
    document.removeEventListener('fmt:metadataListEvent', this.metadataListListener);
    this.metadataListListener = null;
    document.removeEventListener('fmt:metadataEvent', this.metadataListener);
    this.metadataListener = null;
    document.removeEventListener('fmt:selectBboxEvent', this.selectBboxListener)
    this.selectBboxListener = null
    document.removeEventListener('fmt:unselectBboxEvent', this.unselectBboxListener)
    this.unselectBboxListener = null
    document.removeEventListener('fmt:closeMetadataEvent', this.closeMetadataListener);
    this.closeMetadataListener = null
    document.removeEventListener('aerisResetEvent', this.aerisResetListener)
    this.aerisResetListener = null
    document.removeEventListener('fmt:addLayerEvent', this.addLayerListener)
    this.addLayerListener = null
    document.removeEventListener('fmt:removeLayerEvent', this.removeLayerListener)
    this.removeLayerListener = null
  },
  mounted: function () {
    this.init()
  },
  data() {
    return {
     fullscreen: false,
     map: null,
     type: null,
     metadataListListener: null,
     metadataListener: null,
     closeMetadataListener: null,
     aerisResetListener: null,
     addLayerListener: null,
     removeLayerListener: null,
     bboxLayer: [],
     layers: [],
     selected: [],
     depth: 0,
     // bounds of all records display for a depth
     bounds: [],
     // bounds for the displayed record
     metadataBoundsList: [],
     defaultRectangleOptions: {
       interactive: false,
     //  fillColor:'orange', 
       fillOpacity:0.05, 
       stroke: true, 
       weight:1, 
     //  color: 'orange'
     },
     selectedOptions: {
       color: 'red',
       fillColor: 'red',
       fillOpacity: 0.4
     },
     colors: ['orange', 'purple', 'green'],
     controlLayer: null,
     resetControl: null
    }
  },
  
  methods: {
   init () {
     var container = this.$el.querySelector('#fmtMap');
     this.map = L.map( container).setView([51.505, -0.09], 1);
     this.bounds[0] = this.map.getBounds()
 		
//    L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
// 			{
// 			  attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
// 		      maxZoom: 18,
// 		      minZoom:2
		      
// 		    }).addTo( this.map );
   /*  L.tileLayer('//www.thegraceplotter.com/data/maps/CNES.RL03.monthly.NONE/trend/{z}/{x}/{y}.png',
   			{
   			  attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
   		      maxZoom: 18,
   		      minZoom:1,
   		      opacity: 0.3,
   		      tms: false
   		      
   		    }).addTo( this.map );*/
   		    
   		//   https://muscatemaj-pp.theia-land.fr/atdistrib/resto2/collections/GRENADE/e3514f6a-ce72-5d15-b5f5-94c5c6d72137/wms?map=/nfs/muscate_data/maja//muscate.map&idProduit=SENTINEL1_20180628-180704-000_L2D_GRND-VV-IW2-2018_D&versionProduit=0-0&idProjet=GRENADE&anneeProduit=ANNEEPRODUIT&moisProduit=MOISPRODUIT&jourProduit=JOURPRODUIT&LAYERS=oso&typeOSO=TYPEOSO&FORMAT=image%2Fpng&TRANSITIONEFFECT=resize&TRANSPARENT=true&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetMap&STYLES=&SRS=EPSG%3A3857&BBOX={:bbox3857:}&WIDTH=256&HEIGHT=256
   	 
//     this.layers = L.layerGroup()
//     this.layers.addTo(this.map)
    this.resetControl = new L.Control.Reset(this.bounds[0], this.lang)
    this.resetControl.addTo(this.map)
     this.controlLayer = new L.Control.Fmtlayer()
    this.controlLayer.tiles.arcgisTopo.layer.addTo(this.map)
     this.controlLayer.addTo(this.map)
    var fullscreen = new L.Control.Fullscreen('fmtLargeMap', this.lang)
    fullscreen.addTo(this.map)
//      var wmsLayer = L.tileLayer.wms('https://muscatemaj-pp.theia-land.fr/atdistrib/resto2/collections/GRENADE/e3514f6a-ce72-5d15-b5f5-94c5c6d72137/wms/CLASSIFICATION?', {
//         opacity: 0.8,
//         format: 'image/png'
//    	 }).addTo(this.map);
// 	wmsLayer.bringToFront()
// 	 var wmsLayer = L.tileLayer.wms('https://services.data.shom.fr/INSPIRE/wms/r?', {
//         service: 'WMS',
//         layers: 'MNT_ATL100m_HOMONIM_PBMA_3857_WMSR',
//         format: 'image/png',
//         ESPG: 4326,
//         opacity: 0.5
//    	 }).addTo(this.map);
// 	wmsLayer.bringToFront()
   },
   addLayer (event) {
     var layer = event.detail.layer
     var bounds = this.searchBboxById(event.detail.id)
     switch (layer.type) {
     case 'OGC:WMS':
       var extract = layer.href.match(/^(.*\?).*$/)
       var options = {
         service: 'WMS',
         layers: layer.name,
         format: 'image/png',
         opacity: 0.5
        }
       var url = extract[1]
       var wmsLayer = L.tileLayer.wms(url, options).addTo(this.map);
       wmsLayer.bringToFront()
       if (!this.layers[this.depth]) {
         this.layers[this.depth] = new Map()
       }
       this.layers[this.depth].set(layer.id, wmsLayer)
       var bounds = this.searchBboxById(event.detail.id)
       if (bounds) {
         this.map.fitBounds(bounds, {animate: true,  padding: [30,30]})
       }
       break;
     }
   },
   removeLayer (event) {
     var layer = this.layers[this.depth].get(event.detail.id)
     if (layer) {
       layer.remove()
     }
     this.layers[this.depth].delete(event.detail.id)
   },
   hideLayers () {
     for (var depth in this.layers) {
       this.layers[depth].forEach(function (layer) {
         layer.remove()
       })
     }
   },
   hideBboxLayers () {
     for (var i in this.bboxLayer){
       this.bboxLayer[i].remove()
     }
   },
   getOptionsLayer () {
     var options = Object.assign(this.defaultRectangleOptions, {fillColor: this.colors[this.depth], color: this.colors[this.depth]})
     return options
   },
//    getType (data) {
//       if (data.type === 'FeatureCollection' || data.type === 'Feature') {
//         this.type = 'geojson'
//       } else {
//         this.type = 'geonetwork'
//       }
//       return this.type
//    },
   receiveMetadata(event) {
     var bounds = this.selectBbox(event)
     this.$store.commit('searchAreaChange', bounds)
   },
   receiveMetadatas (event) {
     if (this.bboxLayer[this.depth]) {
       this.controlLayer.removeLayer(this.bboxLayer[this.depth])
     }
     if (this.layers[this.depth]) {
       this.layers[this.depth].forEach(function (layer) {
         layer.remove()
       })
     }
     if (this.depth === event.detail.depth   && this.bboxLayer[this.depth]) {
          this.bboxLayer[this.depth].clearLayers();
          this.layers[this.depth] = new Map()
          this.bounds[this.depth] = null
          
     } else {
       this.hideBboxLayers()
       this.hideLayers()
       this.depth = event.detail.depth;
     }
     this.type = event.detail.type
     //this.type = this.getType(event.detail)
    // console.log('TYPE = ' + this.type)
     this.bboxLayer[this.depth] = L.geoJSON(event.detail.features, {style:this.getOptionsLayer()})
     
     this.bounds[this.depth] = this.bboxLayer[this.depth].getBounds()
    
     this.bboxLayer[this.depth].addTo(this.map);
     if (this.bboxLayer[this.depth]) {
       this.controlLayer.addOverlay(this.bboxLayer[this.depth], this.$t('all_box'))
     }

     if (this.bounds[this.depth]) {
      this.map.fitBounds(this.bounds[this.depth])
      this.resetControl.setBounds(this.bounds[this.depth])
     }
     // this.bboxLayer[this.depth].addTo(this.map)
   },
  
   selectBbox (event) {
     console.log('select Bbox')
     this.unselectBbox()
     var bounds = null
     var id = null
     if (event.detail.id) {
       id = event.detail.id
     } else if (event.detail.meta && event.detail.id) {
       id = event.detail.meta.id
     } 
     if (id) {
       bounds =this.selectBboxById(id, event.detail.temporaly)
       this.metadataBoundsList.push(bounds)
     }
     return bounds

   },
 
   unselectBbox () {
     var self = this
     var options = this.getOptionsLayer()
     for(var i in this.selected) {
       this.selected[i].setStyle(
           {
             color: options.color, 
             fillColor: options.fillColor,
             fillOpacity: options.fillOpacity
           })
      
     }
      this.selected = []
   },
   clearLayers (depth) {
     if (!this.layers[depth]) {
       return
     }
     this.layers[depth].forEach(function (layer) {
       layer.remove()
     })
     this.layers[depth].clear()
   },
   back (event) {
     var bounds = null
     if (this.metadataBoundsList.length > 0) {
        this.metadataBoundsList.pop()
        var bounds = this.metadataBoundsList.length > 0 ? this.metadataBoundsList[this.metadataBoundsList.length - 1] : null
        
     }
     this.$store.commit('searchAreaChange', bounds)

     this.unselectBbox()
     if (this.depth > event.detail.depth) {
        if (this.bboxLayer[this.depth]) {
          this.controlLayer.removeLayer(this.bboxLayer[this.depth])
        }
        this.bboxLayer[this.depth].remove()
        this.bboxLayer.pop()
        this.bounds.pop()
        this.clearLayers(this.depth)
        
        this.depth = event.detail.depth
        this.resetControl.setBounds(this.bounds[this.depth])
        var self = this
        this.bboxLayer[this.depth].eachLayer(function (layer) {
          layer.setStyle({fillColor: self.colors[self.depth], color: self.colors[self.depth]})
        })
        this.bboxLayer[this.depth].addTo(this.map)
        this.controlLayer.addOverlay(this.bboxLayer[this.depth], this.$t('all_box'))
      } 
       if (this.bounds[this.depth]) {
         this.map.fitBounds(this.bounds[this.depth])
       }
   },
   searchBboxById (id) {
     var self = this
     var bounds = null
     this.bboxLayer[this.depth].eachLayer(function(layer) {
       if (layer.options.id === id || (layer.feature && layer.feature.id === id)) {
         var bds = layer.getBounds()
         if (!bounds) {
           bounds = bds
         } else  {
           bounds.extend(bds)
         }
        
       }
     })
     return bounds
   },
   selectBboxById (id, temporaly) {

     var self = this
     var bounds = null
     this.bboxLayer[this.depth].eachLayer(function(layer) {
       if (layer.options.id === id || (layer.feature && layer.feature.id === id)) {
         self.setSelected(layer)
         var bds = layer.getBounds()
         if (!bounds) {
           bounds = bds
         } else  {
           bounds.extend(bds)
         }
        
       }
     })
     if (bounds) {
      self.map.fitBounds(bounds, {animate: true, duration:100, padding: [50,50]})
     }
     if (temporaly) {
         setTimeout(() => {
	        self.unselectBbox()
	     }, 2000);
       return null
     } else {
       return bounds
     }
    
   },
   setSelected (layer) {
     this.selected.push(layer)
     layer.setStyle(this.selectedOptions)
   },
   handleReset (event) {
     this.unselectBbox()
     for (var i in this.bboxLayer){
       this.bboxLayer[i].remove()
     }
     this.bboxLayer = []
     this.bounds = []
     this.depth = 0
   }
  }
}
</script>
<style>
/* @import "../node_modules/leaflet/dist/leaflet.css";*/
div[id="fmtMap"]{
  width:100%;
  margin:0;
  padding:0;
  height:200px;
}
div[id="fmtMap"].mtdt-small{
  max-height: 200px;
}

div[id="fmtMap"].mtdt-small .leaflet-top .leaflet-control{
   margin-top: 3px;
}
div[id="fmtMap"].mtdt-small .leaflet-left .leaflet-control{
   margin-left: 3px;
}
div[id="fmtMap"].mtdt-small .leaflet-control .leaflet-control-zoom-in, 
div[id="fmtMap"].mtdt-small .leaflet-control .leaflet-control-zoom-out{
  font-size:16px;
}
div[id="fmtMap"].mtdt-small .leaflet-bar a,
div[id="fmtMap"].mtdt-small .leaflet-control a{

 width: 15px;
 height:15px;
 line-height:15px;
 }
 
 div[id="fmtMap"] a.leaflet-control-layers-toggle{
  background-image: none;
  color: black;
  text-decoration: none;
  text-align:center;
 }
  div[id="fmtMap"] a.leaflet-control-layers-toggle::before{
   font-family:Formater;
   content: "\e806";
  }
  

    div[id="fmtMap"] .leaflet-control-layers-expanded {
          padding: 3px 5px;
   }
    div[id="fmtMap"] section.leaflet-control-layers-list input[type=radio],
     div[id="fmtMap"] section.leaflet-control-layers-list input[type=checkbox]{
     display:none;
 }
    div[id="fmtMap"] section.leaflet-control-layers-list  input[type=radio] + span:before {
     font-family: FontAwesome;
     content: "\f10c";
     opacity:0.8;
     cursor: pointer;
     
  }
  div[id="fmtMap"] section.leaflet-control-layers-list input[type=radio]:checked + span:before {
     content: "\f111";
     opacity:1;
     
  }
  div[id="fmtMap"] section.leaflet-control-layers-list  input[type=checkbox] + span:before {
     font-family: FontAwesome;
     content: "\f096";
     opacity:0.8;
     cursor: pointer;
  }
    
  div[id="fmtMap"] section.leaflet-control-layers-list input[type=checkbox]:checked + span:before {
     content: "\f046";
     opacity:1;
     
  }

 div[id="fmtMap"] .leaflet-control-layers-base label span{
   vertical-align: middle;
 }
 
 div[id="fmtMap"].mtdt-fullscreen{
   min-height:300px;
   font-size: 16px;
 }
 div[id="fmtMap"].mtdt-fullscreen a.leaflet-control-layers-toggle{
   width: 30px;
   height: 30px;
   border-radius: 2px;
   line-height: 30px;
 }
 div[id="fmtMap"].mtdt-fullscreen a..leaflet-control-layers{
   border-radius: 2px;
 }
</style>