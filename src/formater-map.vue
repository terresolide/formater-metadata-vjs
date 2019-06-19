<i18n>{
   "en":{

   },
   "fr":{

   }
}
</i18n>
<template>
 <span class="mtdt-map">
  <div id="fmtMap" class="mtdt-small"></div>
 </span>
</template>
<script>
var L = require("leaflet");
L.Control.Fmtlayer = require('./leaflet.control.fmtlayer.js')
L.Control.Reset = require('./leaflet.control.reset.js')
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
    this.metadataListener = this.selectLayer.bind(this)
    document.addEventListener('fmt:metadataEvent', this.metadataListener);
    this.selectLayerListener = this.selectLayer.bind(this)
    document.addEventListener('fmt:selectLayerEvent', this.selectLayerListener)
    this.unselectLayerListener = this.unselectLayer.bind(this)
    document.addEventListener('fmt:unselectLayerEvent', this.unselectLayerListener)
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
    document.removeEventListener('fmt:selectLayerEvent', this.selectLayerListener)
    this.selectLayerListener = null
    document.removeEventListener('fmt:unselectLayerEvent', this.unselectLayerListener)
    this.unselectLayerListener = null
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
     map: null,
     type: null,
     metadataListListener: null,
     metadataListener: null,
     closeMetadataListener: null,
     aerisResetListener: null,
     addLayerListener: null,
     removeLayerListener: null,
     bboxLayer: [],
     layers: null,
     selected: [],
     depth: 0,
     bounds: [],
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
   	 
    this.layers = L.layerGroup()
   
  
    this.resetControl = new L.Control.Reset(this.bounds[0], this.lang)
    this.resetControl.addTo(this.map)
     this.controlLayer = new L.Control.Fmtlayer()
    this.controlLayer.tiles.arcgisTopo.layer.addTo(this.map)
     this.controlLayer.addTo(this.map)

     var wmsLayer = L.tileLayer.wms('https://muscatemaj-pp.theia-land.fr/atdistrib/resto2/collections/GRENADE/e3514f6a-ce72-5d15-b5f5-94c5c6d72137/wms/CLASSIFICATION?', {
        opacity: 0.8,
        format: 'image/png'
   	 }).addTo(this.map);
	wmsLayer.bringToFront()
	 var wmsLayer = L.tileLayer.wms('https://services.data.shom.fr/INSPIRE/wms/r?', {
        service: 'WMS',
        layers: 'MNT_ATL100m_HOMONIM_PBMA_3857_WMSR',
        format: 'image/png',
        opacity: 0.8
   	 }).addTo(this.map);
	wmsLayer.bringToFront()
   },
   addLayer (event) {
     
   },
   removeLayer (event) {
     
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
   getType (data) {
      if (data.type === 'FeatureCollection' || data.type === 'Feature') {
        this.type = 'geojson'
      } else {
        this.type = 'geonetwork'
      }
      return this.type
   },
   receiveMetadatas (event) {
     if (this.depth === event.detail.depth   && this.bboxLayer[this.depth]) {
          this.bboxLayer[this.depth].clearLayers();
          this.bounds[this.depth] = null
          
     } else {
       this.hideBboxLayers()
       this.depth = event.detail.depth;
     }
     
     this.type = this.getType(event.detail)
     switch (this.type) {
	     case 'geojson':
	       this.addLayerGeojson(event.detail)
	       break;
	     case 'geonetwork':
	       this.addLayerGeonetwork(event.detail)
	       break;
     }


     if (this.bounds[this.depth]) {
       this.map.fitBounds(this.bounds[this.depth])
       this.resetControl.setBounds(this.bounds[this.depth])
     }
     // this.bboxLayer[this.depth].addTo(this.map)
   },
   addLayerGeojson (data) {
     this.bboxLayer[this.depth] = L.geoJSON(data, {style:this.getOptionsLayer()})
     
     this.bounds[this.depth] = this.bboxLayer[this.depth].getBounds()
    
     this.bboxLayer[this.depth].addTo(this.map);
     
   },
   addLayerGeonetwork (data) {
     this.bboxLayer[this.depth] = L.layerGroup();
     this.bboxLayer[this.depth].addTo(this.map);
     if (!data.metadata) {
       // no record
       return
     }
     var self = this
     if (!data.metadata.forEach) {
       // only one record
       var uuid = data.metadata['geonet:info'].uuid
       this.extractBbox(data.metadata.geoBox, uuid)
       
     } else {
       // array of records
       data.metadata.forEach( function (meta, index) {
         var uuid = meta['geonet:info'].uuid
         self.extractBbox(meta.geoBox, uuid)
       })
     }
   },
   extractBbox(bbox, uuid) {
     if (!bbox) {
       return
     }
     
     var bboxList = this.$gnToArray(bbox)
     //trouble with rectangle ??? add polygon!
     var self = this;
     var options = this.getOptionsLayer()
     bboxList.forEach(function (tab){
       
	    // var tab = geoBox.split('|') 
	     tab = tab.map(x => parseFloat(x))
	     var latmin = Math.min(tab[3], tab[1])
	     var latmax = Math.max(tab[3], tab[1])
	     var lngmin = Math.min(tab[0], tab[2])
	     var lngmax = Math.max(tab[0], tab[2])
	     var path = [[latmin, lngmin], [latmax, lngmin], [latmax, lngmax], [latmin, lngmax], [latmin, lngmin]]
	     var bounds = L.latLngBounds(L.latLng(latmax, lngmin), L.latLng(latmin, lngmax));
	     options = Object.assign(options, {uuid:uuid})
	     var rectangle = L.polygon(path,options)
	//      rectangle.on('mouseover', function(layer) {
	//        console.log(layer.target.options.id)
	//      })
	    self.bboxLayer[self.depth].addLayer(rectangle)
	     if (!self.bounds[self.depth]) {
	       self.bounds[self.depth] = bounds
	     } else {
	       self.bounds[self.depth].extend(bounds)
	     }
     })
      
   },
   selectLayer (event) {
     this.unselectLayer()
     if (!event.detail.meta) {
       return;
     }

     console.log(event.detail.meta.uuid)
     if (event.detail.meta.uuid) {
       console.log(event.detail.meta.uuid)
       this.selectLayerByUuid(event.detail.meta.uuid)

     } else if (event.detail.meta.id) {
        this.selectLayerByUuid(event.detail.meta.id)
     }

   },
   unselectLayer () {
    // console.log('depth dans metadata tout seul = ' + event.detail.depth)
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
      if (this.bounds[this.depth]) {
        this.map.fitBounds(this.bounds[this.depth])
      }
       
   },
   back (event) {
     this.unselectLayer()
     if (this.depth > event.detail.depth) {
        this.bboxLayer[this.depth].remove()
        this.bboxLayer.pop()
        this.bounds.pop()
        this.depth = event.detail.depth
        this.resetControl.setBounds(this.bounds[this.depth])
        var self = this
        this.bboxLayer[this.depth].eachLayer(function (layer) {
          layer.setStyle({fillColor: self.colors[self.depth], color: self.colors[self.depth]})
        })
        this.bboxLayer[this.depth].addTo(this.map)
        console.log(this.depth)
      } 
       if (this.bounds[this.depth]) {
         this.map.fitBounds(this.bounds[this.depth])
       }
   },
   selectLayerByUuid (uuid) {

     var self = this
     var bounds = null
     this.bboxLayer[this.depth].eachLayer(function(layer) {
       if (layer.options.uuid === uuid || (layer.feature && layer.feature.id === uuid)) {
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
   },
   setSelected (layer) {
     this.selected.push(layer)
     layer.setStyle(this.selectedOptions)
   },
   handleReset (event) {
     this.unselectLayer()
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
  /* a effacer utilisé pour le dev */
  display:none;
 }
  div[id="fmtMap"] a.leaflet-control-layers-toggle::before{
   font-family:Formater;
   content: "\e806";
  }
  
  div[id="fmtMap"] section.leaflet-control-layers-list{
     /* a effacer utilisé pour le dev */
    display: block;
    padding: 3px 5px;
  }
    div[id="fmtMap"] .leaflet-control-layers-expanded {
          padding: 3px 5px;
   }
    input[type=radio] {
     display:none;
 }
  input[type=radio]:checked + span:before {
     font-family: FontAwesome;
     content: "\f111";
     opacity:1;
     
  }
   input[type=radio] + span:before {
     font-family: FontAwesome;
     content: "\f10c";
     opacity:0.8;
     cursor: pointer;
     
  }
 div[id="fmtMap"] .leaflet-control-layers-base label span{
   vertical-align: middle;
 }
</style>