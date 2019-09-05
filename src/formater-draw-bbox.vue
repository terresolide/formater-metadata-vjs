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
 <div class="mtdt-draw-bbox"  v-show="drawing && !$store.state.disable.spatial">
 <div class="mtdt-header" >
       <span class="close fa fa-close" @click="drawEnd" ></span>
     <h3  @mousedown="movestart" style="padding:10px;margin:0;">{{$t('draw_bbox')}}</h3>
</div>
  <div id="fmtDraw" class="mtdt-small"></div>
 </div>
</template>
<script>
import L from 'leaflet';
require('leaflet-draw')
L.modLat = function( lat ){
     lat = lat%180;
     if( lat > 90 ){
          lat -= 180;
     }else if( lat < -90 ){
          lat += 180;
     }
     return lat;
}
L.modLng = function( lng ){
     lng = lng%360;
     if( lng > 180 ){
          lng -= 360;
     }else if( lng < -180 ){
          lng += 360;
     }
     return lng;
}

// import {Map, Control, LatLng, tileLayer, TileLayer} from 'leaflet'
// import L from 'leaflet'
export default {
  name: 'FormaterDrawBbox',
  components: {
  },
  props: {
  },
  computed: {
    searchArea() {
      return this.$store.state.searchArea
    }
  },
  watch: {
    searchArea (newvalue) {
      console.log('searchArea change')
      console.log(newvalue)
      this.initBoundsLayer()
      var bounds = this.getBounds()
      var bbox = null
      if (bounds.isValid()) {
         bbox = {
           north: bounds.getNorth(),
           east: bounds.getEast(),
           west: bounds.getWest(),
           south: bounds.getSouth()
         }
      }
      this.selectAreaChange({detail: bbox})
    }
  },
  
  created: function() {
    if (this.$i18n.locale  === 'fr') {
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
    this.$el.querySelector(".mtdt-header").style.color = 'white'
    this.$el.querySelector(".mtdt-header").style.background = this.$store.state.style.primary
    this.initHeight()
    this.initPosition()
    this.initMap()
  },
  data() {
    return {
     mousemoveListener: null,
     mouseupListener: null,
     resizeListener: null,
     drawStartListener: null,
     drawEndListener: null,
     bboxChangeListener: null,
     resetListener: null,
     drawing: false,
     map: null,
     // the search limit on map
     boundsLayer: null,
     bbox: null,
     drawControl: null,
     drawLayers: null,
     selected: false,
     intersection: null,
     delta: {x: 0, y:0},
     pos: {x:0, y:0},
    }
  },
  methods: {
    initPosition () {
      var left = (this.$el.parentNode.offsetWidth - this.$el.offsetWidth) / 2;
      this.$el.parentNode.style.position = 'absolute'
      var top = 25;
      this.$el.style.left = left + 'px';
      this.$el.style.top = top + 'px';
      this.pos.x = left
      this.pos.y = this.$el.offsetTop
    },
    initHeight () {
      var height = this.$el.offsetHeight - this.$el.querySelector('.mtdt-header').offsetHeight -4
      this.$el.querySelector('#fmtDraw').style.height = height +'px'
    },
    removeBoundsLayer () {
      if (this.boundsLayer) {
        this.boundsLayer.remove()
        this.boundsLayer = null
        if (this.intersection) {
          this.intersection.remove()
          this.intersection = null
        }
      }
    },
    initBoundsLayer () {
      this.removeBoundsLayer()
      if (this.searchArea) {
        this.boundsLayer = L.rectangle(this.searchArea, {color:'#cccccc', fillOpacity: 0.2, weight: 1})
        this.boundsLayer.addTo(this.map)
        this.map.fitBounds(this.boundsLayer.getBounds())
        this.drawIntersection()
    
      }
    },
    initDrawControl() {
      if (this.drawControl) {
        return
      }
      this.drawLayers = new L.FeatureGroup()
      this.map.addLayer(this.drawLayers)
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
          featureGroup: this.drawLayers
        }
      })
      this.drawControl.addTo(this.map)
      var self = this
      this.map.on(L.Draw.Event.CREATED, function (e) {
        let layer = e.layer
        let bounds = e.layer.getBounds()
        self.bbox = self.drawValidBbox(bounds)
        self.drawIntersection()
        // trigger event fmt:selectAreaChange
        let event = new CustomEvent('fmt:selectAreaChange', {detail: self.bbox})
        document.dispatchEvent(event)
      })
    
      this.map.on(L.Draw.Event.EDITED, function (e) {
        let bounds
        e.layers.eachLayer(function (layer) {
          bounds = layer.getBounds()
        })
         self.bbox = self.drawValidBbox(bounds)
         self.drawIntersection()
        // trigger event fmt:selectAreaChange
        let event = new CustomEvent('fmt:selectAreaChange', {detail: self.bbox})
        document.dispatchEvent(event)
      })
    
      this.map.on(L.Draw.Event.DELETED , function (e) {
        var returnedBbox = { 
          north: '',
          south: '',
          east: '',
          west: ''
        }
        // self.bbox is null
        self.bbox = self.drawValidBbox(null)
        self.drawIntersection()
        // trigger event fmt:selectAreaChange
        let event = new CustomEvent('fmt:selectAreaChange', {detail: returnedBbox})
        document.dispatchEvent(event)
      })
    },
    initMap () {
      if (this.map) {
        return;
      }
      var container = this.$el.querySelector('#fmtDraw');
      this.map = L.map( container).setView([51.505, -0.09], 2);
            
      L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
          maxZoom: 18,
          minZoom:1
        }).addTo( this.map );
      // this.initBoundsLayer(this.searchArea)
      this.initDrawControl()
    },
    open (event) {
      this.drawing = true
      var self = this
      var next = function () {
        self.initHeight();
        self.initPosition();
        self.map.invalidateSize();
        self.selectAreaChange(event)
      }
     
      setTimeout(next, 5)
    },
    getBounds () {
      return this.drawLayers.getBounds()
    },
    drawEnd () {
      var event = new CustomEvent('fmt:drawClose')
      document.dispatchEvent(event)
    },
    selectAreaChange (event) {
      var bbox = event.detail
      if (bbox && bbox.north !== "" && bbox.south !== "" && bbox.east !== "" && bbox.west !== "") {
        for(var key in bbox){
          bbox[key] = parseFloat(bbox[key]);
        }
        var bbox2 = {}
        bbox2.south = Math.min(bbox.north, bbox.south)
        bbox2.north = Math.max(bbox.north, bbox.south)
        bbox2.west = Math.min(bbox.east, bbox.west)
        bbox2.east = Math.max(bbox.east, bbox.west)
        var bounds = [[bbox2.south, bbox2.west], [bbox2.north, bbox2.east]]
        // trigger event fmt:selectAreaChange
        this.bbox = this.drawValidBbox(L.latLngBounds(bounds))
        this.drawIntersection()
    
        let e = new CustomEvent('fmt:selectAreaChange', {detail: bbox})
        document.dispatchEvent(e)
      } else {
        this.drawLayers.clearLayers()
        this.bbox = null
      }
      if (this.intersection) {
        this.map.fitBounds(this.intersection.getBounds(), {padding: [30,30]})
      } else if( this.drawLayers.getLayers().length > 0 && !this.searchArea) {
        this.map.fitBounds(this.drawLayers.getBounds(), {padding: [20,20]})
      } else if (this.searchArea) {
        this.map.fitBounds(this.boundsLayer.getBounds(), {padding: [10, 10]})
      } else {
        this.map.fitBounds(this.$store.state.spatialExtent)
      }
      
    },
    close (event) {
      this.drawing = false
    },
    movestart (evt) {
      this.selected = true
      this.delta = {
          x: this.pos.x - this.$el.offsetLeft,
          y: this.pos.y - this.$el.offsetTop
      }
    },
    move (evt) {
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
    },
    drawValidBbox (bounds) {
      this.drawLayers.clearLayers()
      if (!bounds) {
        return null
      }
      let bbox = { north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getSouthWest().lng
      }
      // valid bbox
      if (bbox.east > 180 || bbox.west < -180) {
         var delta = bbox.east - bbox.west
         if ( delta > 360) {
           bbox.east = 180
           bbox.west = -180
         }else {
           bbox.west = L.modLng(bbox.west);
           bbox.west = bbox.west === 180 ? -180 : bbox.west
           bbox.east = Math.min(bbox.west + delta, 180)
         }
      }
      // draw or redraw if bbox change
      var bounds = [[bbox.south, bbox.west], [bbox.north, bbox.east]]
      var rectangle = L.rectangle(bounds, {color: '#ff0000'})
      this.drawLayers.addLayer(rectangle)
      
      return bbox;
    },
    drawIntersection () {
      if (this.intersection) {
        this.intersection.remove()
        this.intersection = null
      }
      if (!this.bbox) {
        return;
      }
      var bbox = Object.create(this.bbox)
      if (this.searchArea) {
        if (bbox.west < this.searchArea.getWest()) {
          bbox.west = this.searchArea.getWest()
        } else if (bbox.west > this.searchArea.getEast()) {
          bbox.west = this.searchArea.getEast()
        }
        if (bbox.east > this.searchArea.getEast()) {
          bbox.east = this.searchArea.getEast()
        } else if (bbox.east < this.searchArea.getWest()) {
          bbox.east = this.searchArea.getWest()
        }
        if (bbox.north > this.searchArea.getNorth()) {
          bbox.north = this.searchArea.getNorth()
        } else if (bbox.north < this.searchArea.getSouth()) {
          bbox.north = this.searchArea.getSouth()
        }
        if (bbox.south < this.searchArea.getSouth()) {
          bbox.south = this.searchArea.getSouth()
        } else if (bbox.south > this.searchArea.getNorth()) {
          bbox.south = this.searchArea.getNorth()
        }
        var bounds = [[bbox.south, bbox.west], [bbox.north, bbox.east]]
        this.intersection = L.rectangle(bounds, {color: '#ff0000'})
        this.intersection.addTo(this.map)
     }
     
    }
  }
}
</script>
<style src="leaflet-draw/dist/leaflet.draw.css"></style>
<style  >
 /* @import "leaflet-draw/dist/leaflet.draw.css";*/

.mtdt-draw-bbox{
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
.mtdt-draw-bbox div.mtdt-header{
  margin:0;
  border-radius: 6px 6px 0px 0px;
}
div[id="fmtDraw"]{
  border-radius: 0px 0px 6px 6px;
  height:350px;
}
div[id="fmtDraw"].mtdt-small .leaflet-top .leaflet-control{
   margin-top: 3px;
}
div[id="fmtDraw"].mtdt-small .leaflet-left .leaflet-control{
   margin-left: 3px;
}
div[id="fmtDraw"].mtdt-small .leaflet-control .leaflet-control-zoom-in, 
div[id="fmtDraw"].mtdt-small .leaflet-control .leaflet-control-zoom-out{
  font-size:16px;
}
div[id="fmtDraw"].mtdt-small .leaflet-bar a{
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
 /** menu leaflet draw */
  div[id="fmtDraw"] .leaflet-container .leaflet-draw-section a {
    color: #fff;
    font-weight: 700;
  }
    div[id="fmtDraw"] .leaflet-draw-actions li a {
    color: #fff;
  }
  div[id="fmtDraw"] .leaflet-draw-actions li {
    display: block;
    margin: 0 0 1px 0;
    border-radius: 0;
  }
  div[id="fmtDraw"] .leaflet-draw-actions {
    background: #555;
    margin-left:5px;
    padding: 2px;
    -webkit-border-radius: 0 4px 4px 4px;
    border-radius: 0 4px 4px 4px;
  }
  div[id="fmtDraw"] .leaflet-draw-actions li:first-child a{
    -webkit-border-radius: 0 4px 0 0;
    border-radius: 0 4px 0 0;
  }
  div[id="fmtDraw"] .leaflet-draw-actions li:last-child a{
    -webkit-border-radius: 0 0px 4px 4px;
    border-radius: 0 0px 4px 4px;
  }
 .mtdt-draw-bbox div.mtdt-header{
   margin: 0 0 0px 0;
   cursor: move;
}
.mtdt-draw-bbox span.close{
     position:absolute;
     top:2px;
     right:4px;
     cursor: pointer;
}
 @media screen and (min-width: 1024px) {
    .mtdt-draw-bbox {
       width: 700px;
       height: 400px;
    }
  }
   @media screen and (min-width: 1680px) {
    .mtdt-draw-bbox {
       width: 900px;
       height: 600px;
    }
  }
</style>