<i18n>{
   "en":{
       "draw_bbox": "Draw a bounding box"
   },
   "fr":{
       "draw_bbox": "Dessiner / Modifier les limites sur la carte"
   }
}
</i18n>
<template>
 <div class="fmt-draw-bbox"  v-show="drawing">
 <div class="fmt-header" >
  	<span class="close fa fa-close" @click="drawEnd" ></span>
	<h3  @mousedown="movestart" style="padding:10px;margin:0;">{{$t('draw_bbox')}}</h3>
</div>
  <div id="fmtDraw" class="fmt-small"></div>
 </div>
</template>
<script>
import L from 'leaflet';
require('leaflet-draw')
// import {Map, Control, LatLng, tileLayer, TileLayer} from 'leaflet'
// import L from 'leaflet'
export default {
  name: 'FormaterDrawBbox',
  components: {
  },
  props: {
    lang: {
      type: String,
      default: 'en'
    },
    color: {
      type: String,
      default: 'black'
    },
    background: {
      type: String,
      default: 'none'
    }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue  
    	if (newvalue === 'fr') {
          L.drawLocal = require('formater-geotiff-visualizer-vjs/src/module/leaflet.draw.fr.js')
        } else {
          L.drawLocal = require('formater-geotiff-visualizer-vjs/src/module/leaflet.draw.en.js')
        }
        // rerender leaflet draw
        if (this.drawControl) {
          this.drawControl.remove()
          this.drawControl.addTo(this.mapObject)
        }
    },
    color (newvalue) {
      this.$el.querySelector(".fmt-header").style.color = newvalue
    },
    background (newvalue) {
      this.$el.querySelector(".fmt-header").style.background = newvalue
    }
  },
  created: function() {
    this.$i18n.locale = this.lang
  	if (this.lang === 'fr') {
      L.drawLocal = require('formater-geotiff-visualizer-vjs/src/module/leaflet.draw.fr.js')
    } 
    // open and close
    this.drawStartListener = this.open.bind(this)
    document.addEventListener('fmt:selectAreaDrawStart', this.drawStartListener)
    this.drawEndListener = this.close.bind(this)
    document.addEventListener('fmt:selectAreaDrawEnd', this.drawEndListener)
    this.bboxChangeListener = this.selectAreaChange.bind(this)
    document.addEventListener('fmt:bboxChange', this.bboxChangeListener)
    // drag and drop
  	this.mousemoveListener = this.move.bind(this)
    document.addEventListener('mousemove', this.mousemoveListener)
    this.mouseupListener = this.moveEnd.bind(this)
    document.addEventListener('mouseup', this.mouseupListener)
    this.resizeListener = this.resize.bind(this)
    window.addEventListener('resize', this.resizeListener)

  },
  destroyed () {
    document.removeEventListener('fmt:selectAreaDrawStart', this.drawStartListener)
    this.drawStartListener = null
    document.removeEventListener('fmt:selectAreaDrawEnd', this.drawEndListener)
    this.drawEndListener = null
    document.removeEventListener('fmt:bboxChange', this.bboxChangeListener)
    this.bboxChangeListener = null
    document.removeEventListener('mousemove', this.mousemoveListener)
    this.mousemoveListener = null
    document.removeEventListener('mouseup', this.mouseupListener)
    this.mouseupListener = null
    window.removeEventListener('resize', this.resizeListener)
    this.resizeListener = null
  },
  mounted: function () {
    console.log('mounted')
    this.$el.querySelector(".fmt-header").style.color = this.color
    this.$el.querySelector(".fmt-header").style.background = this.background
//     this.initHeight()
//     	// console.log(this.$el)
//   	// this.resizeListener = new ResizeObserver(this.resize).observe(this.$el)
//     this.initPosition()
//     this.initMap()
  },
  data() {
    return {
     mousemoveListener: null,
     mouseupListener: null,
     resizeListener: null,
     drawing: false,
     map: null,
     bounds: null,
     drawControl: null,
     selected: false,
     delta: {x: 0, y:0},
     pos: {x:0, y:0},
    }
  },
  methods: {
   initPosition () {
     
     var left = (this.$el.parentNode.offsetWidth - this.$el.offsetWidth) / 2;
     var top = (this.$el.parentNode.offsetHeight - this.$el.offsetHeight) / 2;
     this.$el.style.left = left + 'px';
     this.$el.style.top = -top + 'px';
     this.pos.x = left
     this.pos.y = this.$el.offsetTop
   },
   initHeight () {
     var height = this.$el.offsetHeight - this.$el.querySelector('.fmt-header').offsetHeight -4
     console.log(height)
     this.$el.querySelector('#fmtDraw').style.height = height +'px'
   },
   initDrawControl() {
     var drawnItems = new L.FeatureGroup()
     this.map.addLayer(drawnItems)
     this.drawControl = new L.Control.Draw({
       draw: {
         rectangle: {
           shapeOptions: {
             color: '#ff0000'
           }
         },
         circlemarker: false,
         circle: false,
         marker: false,
         polygon: false,
         polyline: false
       },
       edit: {
         featureGroup: drawnItems
       }
     })
     this.drawControl.addTo(this.map)
     this.map.on(L.Draw.Event.CREATED, function (e) {
       let layer = e.layer
       let bounds = e.layer.getBounds()
       let bbox = { north: bounds.getNorthEast().lat,
                    south: bounds.getSouthWest().lat,
                    east: bounds.getNorthEast().lng,
                    west: bounds.getSouthWest().lng
       }
       // trigger event fmt:selectAreaChange
       let event = new CustomEvent('fmt:selectAreaChange', {detail: bbox})
       document.dispatchEvent(event)
       drawnItems.clearLayers()
       drawnItems.addLayer(layer)

     })

     this.map.on(L.Draw.Event.EDITED, function (e) {
       let bounds
       e.layers.eachLayer(function (layer) {
         bounds = layer.getBounds()
       })
       let bbox = { north: bounds.getNorthEast().lat,
                    south: bounds.getSouthWest().lat,
                    east: bounds.getNorthEast().lng,
                    west: bounds.getSouthWest().lng
       }
       // trigger event fmt:selectAreaChange
       let event = new CustomEvent('fmt:selectAreaChange', {detail: bbox})
       document.dispatchEvent(event)
     })

    /* this.mapObject.on(L.Draw.Event.DELETESTART, function (e) {
       drawnItems.eachLayer(function (layer) {
         layer.bringToFront()
       })
     })
     this.mapObject.on(L.Draw.Event.EDITSTART, function (e) {
       drawnItems.eachLayer(function (layer) {
         layer.bringToFront()
       })
     })*/
   },
   initMap () {
     if (this.map) {
       return;
     }
     var container = this.$el.querySelector('#fmtDraw');
     this.map = L.map( container).setView([51.505, -0.09], 2);
     this.bounds = this.map.getBounds()
 		
     L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
			{
			  attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
		      maxZoom: 18,
		      minZoom:1
		      
		    }).addTo( this.map );
     this.initDrawControl()
	
   },
   open (event) {
     console.log('open')
     this.drawing = true
     var self = this
     var next = function () {
       self.initHeight();
       self.initPosition();
       self.initMap();
       self.map.invalidateSize();
     }
     setTimeout(next, 5)
   },
   drawEnd () {
     var event = new CustomEvent('fmt:drawClose')
     document.dispatchEvent(event)
   },
   selectAreaChange (event) {
     console.log(event.detail)
   },
   close (event) {
     console.log(event.detail)
     this.drawing = false
   },
   movestart (evt) {
     console.log('start')
     this.selected = true
     this.delta = {
         x: this.pos.x - this.$el.offsetLeft,
         y: this.pos.y - this.$el.offsetTop
     }
   },
   move (evt) {
     // console.log(evt)
     this.pos.x = evt.clientX
     this.pos.y = evt.clientY
     if (this.selected) {
     	this.$el.style.left = (this.pos.x - this.delta.x) + 'px'
     	this.$el.style.top = (this.pos.y - this.delta.y) + 'px'
     }
   },
   moveEnd () {
     this.selected = false
   },
   resize (evt) {
     this.initHeight()
     this.map.invalidateSize()
   }
  }
}
</script>
<style  >
  @import "../node_modules/leaflet-draw/dist/leaflet.draw.css";
  

 .fmt-draw-bbox{
  position: absolute;
   width: 600px;
   height: 400px;
   z-index:2000;
   top: 50px;
   left: 50px;
 /*  resize: both;
   overflow:auto;
  /* margin: -200px 0 0 -300px;*/
   padding: 0px;
   border-radius: 6px;
   background: white;
   border: 2px solid #ccc;
   box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
 }
 .fmt-draw-bbox div.fmt-header{
   margin:0;
   border-radius: 6px 6px 0px 0px;
 }
div[id="fmtDraw"]{
  border-radius: 0px 0px 6px 6px;
  height:350px;
}
div[id="fmtDraw"].fmt-small .leaflet-top .leaflet-control{
   margin-top: 3px;
}
div[id="fmtDraw"].fmt-small .leaflet-left .leaflet-control{
   margin-left: 3px;
}
div[id="fmtDraw"].fmt-small .leaflet-control .leaflet-control-zoom-in, 
div[id="fmtDraw"].fmt-small .leaflet-control .leaflet-control-zoom-out{
  font-size:16px;
}
div[id="fmtDraw"].fmt-small .leaflet-bar a{
 background-image:none;
 width: 20px;
 height:20px;
 line-height:20px;
 }
 div[id="fmtDraw"] a.leaflet-draw-draw-rectangle:before{
  content:"\f04d";
  font-family: "FontAwesome"
}
div[id="fmtDraw"] a.leaflet-draw-edit-edit:before{
  content:"\f040";
  font-family: "FontAwesome"
}
div[id="fmtDraw"] a.leaflet-draw-edit-remove:before{
  content:"\f1f8";
  font-family: "FontAwesome"
}
 .fmt-draw-bbox div.fmt-header{
   margin: 0 0 0px 0;
   cursor: move;
}
.fmt-draw-bbox span.close{
	position:absolute;
	top:2px;
	right:4px;
	cursor: pointer;
}
 @media screen and (min-width: 1024px) {
    .fmt-draw-bbox {
       width: 700px;
       height: 400px;
    }
  }
   @media screen and (min-width: 1680px) {
    .fmt-draw-bbox {
       width: 900px;
       height: 600px;
    }
  }
</style>