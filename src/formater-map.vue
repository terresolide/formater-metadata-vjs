<i18n>{
   "en":{

   },
   "fr":{

   }
}
</i18n>
<template>
 <span class="fmt-map">
  <div id="fmtMap" class="fmt-small"></div>
 </span>
</template>
<script>
var L = require("leaflet");
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
    }
  },
  created: function() {
    this.$i18n.locale = this.lang
    this.metadataListListener = this.receiveMetadatas.bind(this)
    document.addEventListener('fmt:metadataListEvent', this.metadataListListener);
    this.metadataListener = this.selectLayer.bind(this)
    document.addEventListener('fmt:metadataEvent', this.metadataListener);
    this.closeMetadataListener = this.unselectLayer.bind(this)
    document.addEventListener('fmt:closeMetadataEvent', this.closeMetadataListener);
  },
  destroyed () {
    document.removeEventListener('fmt:metadataListEvent', this.metadataListListener);
    this.metadataListListener = null;
    document.removeEventListener('fmt:metadataEvent', this.metadataListener);
    this.metadataListener = null;
    document.removeEventListener('fmt:closeMetadataEvent', this.closeMetadataListener);
    this.closeMetadataListener = null
  },
  mounted: function () {
    this.init()
  },
  data() {
    return {
     map: null,
     metadataListListener: null,
     metadataListener: null,
     closeMetadataListener: null,
     bboxLayer: null,
     selected: [],
     bounds: null,
     defaultRectangleOptions: {
       interactive: false,
       fillColor:'orange', 
       fillOpacity:0.05, 
       stroke: true, 
       weight:1, 
       color: 'orange'
     },
     selectedOptions: {
       color: 'red',
       fillColor: 'red',
       fillOpacity: 0.4
     }
    }
  },
  
  methods: {
   init () {
     var container = this.$el.querySelector('#fmtMap');
     this.map = L.map( container).setView([51.505, -0.09], 1);
     this.bounds = this.map.getBounds()
 		
   L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
			{
			  attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
		      maxZoom: 18,
		      minZoom:2
		      
		    }).addTo( this.map );
   /*  L.tileLayer('//www.thegraceplotter.com/data/maps/CNES.RL03.monthly.NONE/trend/{z}/{x}/{y}.png',
   			{
   			  attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
   		      maxZoom: 18,
   		      minZoom:1,
   		      opacity: 0.3,
   		      tms: false
   		      
   		    }).addTo( this.map );*/
     this.bboxLayer = L.layerGroup();
     this.bboxLayer.addTo(this.map);
	
   },
   receiveMetadatas (event) {
     this.bounds = null;
     this.bboxLayer.clearLayers();
     var self = this
     if (!event.detail.metadata) {
       // no record
       return
     }
     if (!event.detail.metadata.forEach) {
       // only one record
       var uuid = event.detail.metadata['geonet:info'].uuid
       this.extractBbox(event.detail.metadata.geoBox, uuid)
       
     } else {
       // array of records
       event.detail.metadata.forEach( function (meta, index) {
         var uuid = meta['geonet:info'].uuid
         self.extractBbox(meta.geoBox, uuid)
       })
     }
     if (this.bounds) {
       this.map.fitBounds(this.bounds)
     }
     this.bboxLayer.addTo(this.map)
   },
   extractBbox(bbox, uuid) {
     if (!bbox) {
       return
     }
     
     var bboxList = this.$gnToArray(bbox)
     //trouble with rectangle ??? add polygon!
     var self = this;
     bboxList.forEach(function (tab){
       
	    // var tab = geoBox.split('|') 
	     tab = tab.map(x => parseFloat(x))
	     var latmin = Math.min(tab[3], tab[1])
	     var latmax = Math.max(tab[3], tab[1])
	     var lngmin = Math.min(tab[0], tab[2])
	     var lngmax = Math.max(tab[0], tab[2])
	     var path = [[latmin, lngmin], [latmax, lngmin], [latmax, lngmax], [latmin, lngmax], [latmin, lngmin]]
	     var bounds = L.latLngBounds(L.latLng(latmax, lngmin), L.latLng(latmin, lngmax));
	     var options = Object.assign({uuid:uuid}, self.defaultRectangleOptions)
	     var rectangle = L.polygon(path,options)
	//      rectangle.on('mouseover', function(layer) {
	//        console.log(layer.target.options.id)
	//      })
	    self.bboxLayer.addLayer(rectangle)
	     if (!self.bounds) {
	       self.bounds = bounds
	     } else {
	       self.bounds.extend(bounds)
	     }
     })
      
   },
   selectLayer (event) {
     this.unselectLayer()
     if (event.detail && event.detail['geonet:info'] && event.detail['geonet:info'].uuid) {
       this.selectLayerByUuid(event.detail['geonet:info'].uuid)

     } 
   },
   unselectLayer (event) {
     var self = this
     this.selected.forEach(function (layer) {
       layer.setStyle(
           {
             color: self.defaultRectangleOptions.color, 
             fillColor: self.defaultRectangleOptions.fillColor,
             fillOpacity: self.defaultRectangleOptions.fillOpacity
           })
      
     })
      this.selected = []
       if (this.bounds) {
         this.map.fitBounds(this.bounds)
       }
       
   },
   selectLayerByUuid (uuid) {
     var self = this
     var bounds = null
     this.bboxLayer.eachLayer(function(layer) {
       if (layer.options.uuid === uuid) {
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
      self.map.fitBounds(bounds)
     }
   },
   setSelected (layer) {
     this.selected.push(layer)
     layer.setStyle(this.selectedOptions)
   }  
  }
}
</script>
<style>
 @import "../node_modules/leaflet/dist/leaflet.css";
div[id="fmtMap"]{
  width:100%;
  margin:0;
  padding:0;
  height:200px;
}
div[id="fmtMap"].fmt-small .leaflet-top .leaflet-control{
   margin-top: 3px;
}
div[id="fmtMap"].fmt-small .leaflet-left .leaflet-control{
   margin-left: 3px;
}
div[id="fmtMap"].fmt-small .leaflet-control .leaflet-control-zoom-in, 
div[id="fmtMap"].fmt-small .leaflet-control .leaflet-control-zoom-out{
  font-size:16px;
}
div[id="fmtMap"].fmt-small .leaflet-bar a{

 width: 15px;
 height:15px;
 line-height:15px;
 }
</style>