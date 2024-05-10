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
var L = require('leaflet')
// var L = require('../modules/leaflet.extend.js')
require("leaflet-kml")

L.Control.Fmtlayer = require('../modules/leaflet.control.fmtlayer.js')
L.Control.Reset = require('../modules/leaflet.control.reset.js')
L.Control.Fullscreen = require('formater-commons-components-vjs/src/leaflet/leaflet.control.fullscreen.js')
L.Control.Legend = require('formater-commons-components-vjs/src/leaflet//leaflet.control.legend.js')


L.Marker.prototype.options.icon = L.icon({
  iconUrl: require('../assets/img/marker-icon-orange.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
  iconRetinaUrl: require('../assets/img/marker-icon-2x-orange.png').default,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const getReader = () => import('../modules/capabilities-reader.js')
// const getProj4 = () => import('proj4')


// import {Map, Control, LatLng, tileLayer, TileLayer} from 'leaflet'
// import L from 'leaflet'
export default {
  name: 'FormaterMap',
  props: {
    depth: {
      type: Number,
      default: 0
    }
  },
  created: function() {
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
//     this.aerisResetListener = this.handleReset.bind(this)
//     document.addEventListener('aerisResetEvent', this.aerisResetListener)
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
//     document.removeEventListener('aerisResetEvent', this.aerisResetListener)
//     this.aerisResetListener = null
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
     $proj4: null,
     crs: {
       dest: null,
       espg3857: null
     },
     fullscreen: false,
     map: null,
     type: null,
     metadataListListener: null,
     metadataListener: null,
     closeMetadataListener: null,
     aerisResetListener: null,
     addLayerListener: null,
     removeLayerListener: null,
     bboxLayer: null,
     layers: new Map(),
     single: {bbox: null, layers: [], bounds: null}, // selected bbox
     // bounds of all records display for a depth
     bounds: null,
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
       fillOpacity: 0.3,
       strokeWidth:1,
       weight:1
     },
     currentOptions: {
         color: 'red',
         fillColor: 'red',
         fillOpacity: 0.05,
         strokeWidth:1,
         weight:1
     },
     colors: ['orange', 'purple', 'green'],
     markerColors: ['orange', 'blue', 'red'],
     icons:  [],
     controlLayer: null,
     resetControl: null,
     legendControl: null,

    }
  },
  computed: {
    // L.latlngBounds, the selected Area of research (different of searchArea which is the limitation from bbox of metadata)
    selectedBounds () {
      if (!this.$store.state.selectArea) {
        return null
      }
      return L.latLngBounds(
          [this.$store.state.selectArea.south, this.$store.state.selectArea.west],
          [this.$store.state.selectArea.north, this.$store.state.selectArea.east])
    },
    currentUuid () {
      return this.$route.params.uuid
    },
    selectedMetadata () {
      return this.$store.state.selectedMetadata
    }
  },
  methods: {
   init () {
     var container = this.$el.querySelector('#fmtMap');
     this.map = L.map( container, {scrollWheelZoom: false}).setView([51.505, -0.09], 1);
     this.bounds = this.map.getBounds()
     getReader().then( reader => {  
       this.reader = reader; 
       this.reader.init(this.$http, this.$store.state.proxy)})
 		
       for (var i in this.markerColors) {
        this.icons[this.markerColors[i]] = new L.Icon({
         // iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
          iconUrl: require('../assets/img/marker-icon-' + this.markerColors[i] + '.png').default,
          shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
          iconRetinaUrl: require('../assets/img/marker-icon-2x-' + this.markerColors[i]+ '.png').default,
         // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
      }
//    L.tileLayer('//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
// 			{
// 		     attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
// 	         maxZoom: 18,
// 	         minZoom:2
	         
// 	       }).addTo( this.map );
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
    this.resetControl = new L.Control.Reset(this.bounds, this.$i18n.locale)
    this.resetControl.addTo(this.map)
    this.controlLayer = new L.Control.Fmtlayer()
    this.controlLayer.tiles.arcgisTopo.layer.addTo(this.map)
    this.controlLayer.addTo(this.map)
    this.legendControl = new L.Control.Legend(this.$i18n.locale, this.$gn.uuidToDomId)

    var fullscreen = new L.Control.Fullscreen('fmtLargeMap', {lang: this.$i18n.locale, mouseWheel: true})
    fullscreen.addTo(this.map)
    this.legendControl.addTo(this.map)

//     getProj4().then(proj4 => {
//       console.log(proj4)
//       this.$proj4 = proj4.default
//       this.crs.dest = new this.$proj4.Proj('EPSG:4326')
//       this.crs.EPSG3857 = new this.$proj4.Proj('EPSG:3857')
//     })
   },
   addLayer (event) {
     // test get capabilities
//      this.$http.get('http://api.formater/interface-services/index.php?x=8').then(
//          response => { console.log(response.body)}
//      )
     var layer = event.detail.layer
     var metaId = event.detail.id
     var token = event.detail.token
     var zoom = event.detail.zoom
     var bounds = this.searchBboxBoundsById(metaId)
     var newLayer = null

     switch (layer.type) {
     case 'WMS':
     case 'OGC:WMS':
     case 'OGC Web Map Service':
       var regex = new RegExp(/GetCapabilities/i)
       if (regex.test(layer.href)) {
         this.beforeAddWMS(layer, metaId, zoom)
         return
       }
       if (!layer.options) {
         var extract = layer.href.match(/^(.*\?).*$/)
         var url = extract[1]
         layer.href = url
         layer.options = {
           id: layer.id,
           service: 'WMS',
           layers: layer.name,
           format: 'image/png',
           opacity: 0.5
         }
         if (token && token !== -1) {
           layer.options._bearer = token
         }
       }
       this.addWMSLayer(layer, metaId, zoom)
       break;
     case 'GetMap':
       if (!layer.options) {
	       layer.options = {
	         id: layer.id,
	         service: 'WMS',
	         layers: layer.name,
	         format: 'image/png',
	         opacity: 0.5
	       }
       }
       this.addWMSLayer(layer, metaId, zoom)
       break
     case 'WMTS':
     case 'WTS':
     if (!layer.options) {
         layer.options = {
           id: layer.id,
           service: 'WTS',
           layers: layer.name,
         }
       }
       this.addWTSLayer(layer, metaId)
       break;
     case 'XXX':
       var extract = layer.href.match(/^(.*\?).*$/)
       var url = extract[1]
       var options = {
         service: 'WMS',
         layers: layer.name,
         url: layer.href//,
       //  format: 'image/png',
        // opacity: 0.5
        }

       //GET CAPABILITIES
//        var param = 'service=WMS&layer=' + encodeURIComponent(layer.name) + '&url=' + encodeURIComponent(url)
//        this.$http.get('http://api.formater/interface-services/index.php?' + param).then(
//          response => { console.log(response.body)}
//         )
//        var newLayer = L.tileLayer.wms(url, options);
//        this.addLayerToMap(layer.id, metaId, newLayer)
       break;
     case 'OGC:WFS':
     case 'OGC:WFS-G':
       var extract = layer.href.match(/^(.*\?).*$/)
       url = layer.href + 'r?'
       url += 'version=1.0.0&request=GetFeature&typeName=' + layer.name
       url += '&service=WFS'
       url += '&outputFormat=' +encodeURIComponent('application/vnd.google-earth.kml+xml')


//        this.$http.get('http://api.formater/interface-services/kmlFeature.php?url=' + encodeURIComponent(url)).then(
//            response => {
//              const parser = new DOMParser();
//              const kml = parser.parseFromString(response.body, 'text/xml');
//              var newLayer = new L.KML(kml)
//              this.addLayerToMap(layer.id, metaId, newLayer, zoom)
//            }
//        )
       break;
     case 'OGC:KML':
     case 'OGC:OWS':
     case 'OGC:OWS-C':
     case 'GLG:KML-2.0-http-get-map':
       this.$http.get(layer.href).then(
           response => {
             const parser = new DOMParser();
             const kml = parser.parseFromString(response.body, 'text/xml');
             var newLayer = new L.KML(kml)
             this.addLayerToMap(layer.id, metaId, newLayer, zoom)
           }
       )
       break;

     
      // var kmlLayer = new L.KML(layer.href, {async: true});
      // kmlLayer.addTo(this.map)
     }
     
   },
   beforeAddWMS (layer, metaId, zoom) {
     this.reader.loadInfo(layer, {opacity:0.5, zoom: zoom} , metaId, this.addWMSLayer)
   },
   addWTSLayer (layer, metaId) {
     var tileLayer = L.tileLayer(layer.href, {opacity: 0.5})
     this.addLayerToMap(layer.options.id, metaId, tileLayer, true)
   },
   addWMSLayer(layerObj, metaId, zoom) {

     // add bearer if necessary
     // layerObj.options._bearer = 'mon bearer'
     var newLayer = L.tileLayer.wms(layerObj.href, layerObj.options)
     this.addLayerToMap(layerObj.options.id, metaId, newLayer, zoom)
     // Add legend if there is specific legend with the layer and only one metadata
     if (layerObj.options.legend && this.currentUuid && layerObj.id.indexOf(this.currentUuid) >= 0) {
       this.legendControl.addLegend(this.$store.state.currentUuid, layerObj.id, layerObj.options.legend.src)
     } else if (this.selectedMetadata && this.selectedMetadata.legend) {
       this.legendControl.addLegend(this.selectedMetadata.id,'0', this.selectedMetadata.legend)
     }
   },
   addLayerToMap(id, groupId, newLayer, zoom) {
     if (newLayer) {
       newLayer.addTo(this.map)
       newLayer.bringToFront()
       this.$store.commit('layers/addLayer', id)
//        if (!this.layers[this.depth]) {
//          this.layers[this.depth] = new Map()
//        }
       this.layers.set(id, newLayer)
       var bounds = this.searchBboxBoundsById(groupId)
       console.log(bounds)
       console.log(groupId)
       if (newLayer._kml) {
         bounds = newLayer.getBounds()
       }
       if( bounds && zoom)  { 
         this.map.fitBounds(bounds, {animate: true,  padding: [30,30]})
       }
     }
   },
   removeLayer (event) {
     var layer = this.layers.get(event.detail.id)
     if (layer) {
       layer.remove()
       this.$store.commit('layers/removeLayer', event.detail.id)
       if (layer.options.legend) {
         // remove legend attached to one layer (not legend attached to metadata)
         this.legendControl.removeLegend(event.detail.id)
       }
     }
     this.layers.delete(event.detail.id)
   },
   // @todo remove
   seeOnlyCurrent(currentId) {
     var bounds = this.selectBboxById(currentId)
     if (bounds) {
       this.controlLayer.setBboxLayer(L.rectangle(bounds, this.currentOptions))
     }
//      if (!this.layers[depth]) {
//        return
//      }
     var begin = currentId + '_'
     this.layers.forEach(function (layer, id) {
       if (id.indexOf(begin) !== 0) {
         layer.remove()
       }
     })
   },
   seeAllLayers() {
     var _this = this
//      if (!this.layers[this.depth]) {
//        return
//      }
     this.layers.forEach(function (layer) {
       layer.addTo(_this.map)
     })
   },
   hideLayers () {
     this.layers.forEach(function (layer) {
       layer.remove()
     })
   },
   hideBboxLayers () {
     //for (var i in this.bboxLayer){
       if (this.bboxLayer) {
         this.bboxLayer.remove()
       }
    // }
   },
   showBboxLayers () {
     for (var i in this.bboxLayer){
       this.bboxLayer.addTo(this.map)
     }
   },
   getOptionsLayer (depth) {
     if (!depth) {
       depth = 0
     }
     var options = Object.assign(this.defaultRectangleOptions, {fillColor: this.colors[depth], color: this.colors[depth]})
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
   receiveSingleMeta (event) {
     console.log('RECEIVE SINGLE METADATA')
     // LEGEND remove all
      this.legendControl.removeAll()
      var _this = this
     // LAYERS : show only this metadata layers, remove the others
     var countLayer = 0
      this.layers.forEach(function (layer, key, map) {
         var find = event.detail.meta.layers.find(ly => ly.id === key)
         if (!find) {
           layer.remove()
         } else {
           countLayer++
         }
      })
      if (countLayer > 0 && event.detail.meta.legend) {
        this.legendControl.addLegend(event.detail.meta.id, '0', event.detail.meta.legend)
      }
     // LEGEND ADD GLOBAL 
     // HIDE GLOBAL BBOX 
       this.hideBboxLayers()
       
     // SHOW SINGLE BBOX 
       if (event.detail.meta.geoBox) {
         this.single.bbox = L.polygon(
             this.$gn.bboxString2Array(event.detail.meta.geoBox),
             {style: this.getOptionsLayer(1)}
         )
         this.single.bounds = this.single.bbox.getBounds()
//          this.single.bbox.addTo(this.map)
//          console.log(this.single.bbox)
       } else if (event.detail.meta.feature) {
          this.single.bbox = L.geoJSON(event.detail.meta.feature, 
            {
              style: this.getOptionsLayer(1),
              pointToLayer: function(geoJsonPoint, latlng) {
                 return L.marker(latlng, {title: geoJsonPoint.title, icon: _this.icons['red']});
              }
//           onEachFeature (feature, layer) {
//             var bounds = layer.getBounds()
//             style.border = 'triangle'
//             layer.addFramed(style)
//             // layer.buildFramed()
//           }
          }).bindPopup(function(layer) {
				      var txt = '<h3>' + layer.options.title +'</h3>'
				      for( var prop in layer.feature.properties) {
				        txt += '<div><b>' + prop + '</b>: ' + layer.feature.properties[prop] + '</div>'
				      }
				      return txt
				  }) 
          var bounds = null
          var markers = []
          this.single.bbox.eachLayer(function (layer) {
            if (layer.getBounds) {
	            if (!bounds) {
	              bounds = layer.getBounds()
	            } else {
	              bounds.extend(layer.getBounds())
	            } 
            } else if (layer.getLatLng) {
	              markers.push(layer)
            }
          })
          
          if (bounds) {
	          this.single.bounds = bounds
	          this.map.fitBounds(this.single.bounds)
          } else if (markers.length === 1) {
            this.map.panTo(markers[0].getLatLng())
          }
          this.single.bbox.addTo(this.map)
          this.single.bbox.fire('click')
          
       } else if (event.detail.meta.id) {
         // this.single.bbox = L.geoJSON(event.detail.feature, {style:this.getOptionsLayer()}) 
         this.single.bbox = this.findBboxById(event.detail.meta.id)
         var bounds = null
         this.single.bbox.eachLayer(function (layer) {
           if (!bounds) {
             bounds = layer.getBounds()
           } else {
             bounds.extend(layer.getBounds())
           }
         })
         this.single.bounds = bounds
       }
       this.single.bbox.addTo(this.map)
       if (this.single.bounds) {
        this.map.fitBounds(this.single.bounds)
       }
       
   },
   receiveMetadata(event) {
     // case selectMeta in same page depth === 2
     // hide bboxLayer and layers
     if (event.detail.depth && event.detail.depth === -1) {
       this.receiveSingleMeta(event)
       return
     }
     // else that's simple metadata
     this.legendControl.removeAll()
     this.clearLayers();
     // if (this.depth === event.detail.depth   && this.bboxLayer[this.depth]) {
     if (this.bboxLayer) {
       
       this.bboxLayer.eachLayer(function (layer) {
         layer.remove()
       })
       this.bboxLayer.clearLayers();
       // this.updateLayers(event.detail.metadata)
      // this.layers[this.depth] = new Map()
       this.bounds = null
     }    
     if (event.detail && event.detail.meta  && event.detail.feature) {
//        if (event.detail.meta.geoBox) {
// 	       var box = event.detail.meta.geoBox.split('|')
// 	       var spatialExtent = [[parseFloat(box[1]), parseFloat(box[0])] , [parseFloat(box[3]), parseFloat(box[2])]]
// 	       // this.$store.commit('setDefaultSpatialExtent', spatialExtent)
//        }
     // } else {
       this.bboxLayer = L.geoJSON(event.detail.feature, {style:this.getOptionsLayer(1)}) 
       
       this.bboxLayer.addTo(this.map)
//        this.bboxLayer.eachLayer(function (layer) {
//          layer.buildFramed()
//        })
       
       var bounds = this.bboxLayer.getBounds()
       this.bounds = bounds
       // @todo passer cette variable comme local ? utilité
      //  this.$store.commit('setDefaultSpatialExtent', bounds)
       this.controlLayer.setBboxLayer(this.bboxLayer)
       this.map.fitBounds(bounds)
        // this.selectBbox(event)
     }
     this.$store.commit('searchAreaChange', this.bounds)
     if (event.detail && event.detail.meta && event.detail.meta.legend) {
       // case global legend in meta (the same for all layers attached to metadata) 
       // case flatsim
       this.legendControl.addLegend(event.detail.meta.id, '0', event.detail.meta.legend)
     } 
//      else {
//       var _this = this
//       console.log('SHOM')
//       console.log(this.layers)
//       this.layers.forEach( function (layer, index, map) {
//          // case one legend for each layer 
//          console.log(layer)
//          if (index.indexOf(event.detail.meta.id) >= 0 && layer.options.legend) {
//            _this.legendControl.addLegend(event.detail.meta.id, index, layer.options.legend.src)
//          }
//        })
//     }
     // this.seeOnlyCurrent(event.detail.meta.id)

   },
   receiveMetadatas (event) {
//      if (this.layers[this.depth]) {
//        this.layers[this.depth].forEach(function (layer) {
//          layer.remove()
//        })
//      }
    this.legendControl.removeAll()
    this.clearLayers();
    if (!event.detail.metadata) {
      // no child
      return
    } 
     if (this.$route.name === 'FormaterCatalogue') {
       this.$store.commit('searchAreaChange', null)
     }
     this.legendControl.removeAll()
     // if (this.depth === event.detail.depth   && this.bboxLayer[this.depth]) {
     if (this.bboxLayer && this.bboxLayer.clearLayers) {
       this.bboxLayer.clearLayers();
      
	     // this.updateLayers(event.detail.metadata)
	    // this.layers[this.depth] = new Map()
	     this.bounds = null
     }     
//      } else {
//        this.hideBboxLayers()
//        this.hideLayers()
//        // this.depth = event.detail.depth;
//      }
     this.type = event.detail.type
     // this.filterBboxWithSelectedBounds(event.detail.features)
     var style = this.getOptionsLayer(0)
     this.bboxLayer = L.geoJSON(event.detail.features, {
           style: style,
           pointToLayer: function(geoJsonPoint, latlng) {
             return L.marker(latlng, {title: geoJsonPoint.title});
           }
//            onEachFeature (feature, layer) {
//              var bounds = layer.getBounds()
//              style.border = 'triangle'
//              layer.addFramed(style)
//              // layer.buildFramed()
//            }
     }).bindPopup(function(layer) {
       var txt = '<h3>' + layer.options.title +'</h3>'
       for( var prop in layer.feature.properties) {
         txt += '<div><b>' + prop + '</b>: ' + layer.feature.properties[prop] + '</div>'
       }
       return txt
     })  
     
     //}
     this.bounds = this.bboxLayer.getBounds()
//      this.bboxLayer[this.depth].addTo(this.map);
//      if (this.bboxLayer[this.depth]) {
//        this.controlLayer.addOverlay(this.bboxLayer[this.depth], this.$i18n.t('all_box'))
//      }
      this.controlLayer.setBboxLayer(this.bboxLayer)

     if (this.bounds && this.bounds._southWest) {
      this.map.fitBounds(this.bounds)
      this.resetControl.setBounds(this.bounds)
     }
     // this.bboxLayer[this.depth].addTo(this.map)
   },
   updateLayers (metadatas) {
     // keep only layers according to metadata
     if (this.layers) {
       var self = this
       var toDelete = []
       this.layers.forEach(function (layer, key) {
         var metaId = self.$gn.layerId2MetaId(key)
         if (!metadatas[metaId]) {
           layer.remove()
           toDelete.push(key)
         }
       })
       toDelete.forEach(function (key) {
         self.layers.delete(key)
       })
     }
   },
   filterBboxWithSelectedBounds (features) {
     var _this = this
     features.forEach(function (feature) {
       feature = _this.inSelectedBounds(feature)
     })
   },
   inSelectedBounds (feature) {
     if (!this.selectedBounds) {
       return feature
     }
     var selectedBounds = this.selectedBounds
     switch(feature.geometry.type) {
    
     case 'MultiPolygon':
       //remove bbox which is out of selectedBounds
       for (var i=feature.geometry.coordinates.length - 1; i >= 0; i--) {
         var latlngs = L.GeoJSON.coordsToLatLngs(feature.geometry.coordinates[i], 1)
         var bounds = L.latLngBounds(latlngs)
         if (!bounds.intersects(selectedBounds)) {
           feature.geometry.coordinates.splice(i,1)
         }
       }
       return feature
     case 'Polygon':
     default:
         return feature
     }
   },
   selectBbox (event) {
     this.unselectBbox()
     var bounds = null
     var id = null
     if (event.detail.id) {
       id = event.detail.id
     } else if (event.detail.meta && event.detail.meta.id) {
       id = event.detail.meta.id
     } 
     if (id) {
       bounds = this.selectBboxById(id, event.detail.temporaly)
       this.metadataBoundsList.push(bounds)
     }
     return bounds

   },
 
   unselectBbox () {
     var self = this
     var options = this.getOptionsLayer(0)
     var icon = this.icons['orange']
     for(var i in this.selected) {
       this.selected[i].eachLayer(function (lr) {
        
         if (lr.setStyle) {
	         lr.setStyle({
	           color: options.color, 
	           fillColor: options.fillColor,
	           fillOpacity: options.fillOpacity
	         })
         } else if (lr.setIcon){
            lr.setIcon(icon)
            lr.setZIndexOffset(lr.options.oldZIndex)
         }
       })
//        this.selected[i].setStyle(
//            {
//              color: options.color, 
//              fillColor: options.fillColor,
//              fillOpacity: options.fillOpacity
//            })
      
      }
      this.selected = []
   },
   clearLayers () {
     if (!this.layers) {
       return
     }
     this.layers.forEach(function (layer) {
       layer.remove()
     })
     this.layers.clear()
   },
   back (event) {
     if (this.single.bbox) {
       this.single.bbox.remove()
       this.single.bbox = null
       this.single.bounds = null
     }
     this.legendControl.removeAll()
     this.seeAllLayers()
     this.showBboxLayers()
     if (this.bounds) {
       this.map.fitBounds(this.bounds)
     }
//      return
//      var bounds = null
//      if (this.metadataBoundsList.length > 0) {
//         this.metadataBoundsList.pop()
//         var bounds = this.metadataBoundsList.length > 0 ? this.metadataBoundsList[this.metadataBoundsList.length - 1] : null
        
//      }
//      this.$store.commit('searchAreaChange', bounds)
//      this.legendControl.back(this.$store.state.currentUuid)
//      this.unselectBbox()
//     // if (this.depth > event.detail.depth) {
// //         if (this.bboxLayer[this.depth]) {
// //           this.controlLayer.removeLayer(this.bboxLayer[this.depth])
// //           // this.bboxLayer[this.depth].remove()
// //         }

//         this.bboxLayer = null
//         this.bounds = null
//         this.clearLayers()
        
//         this.resetControl.setBounds(this.bounds)

//         var self = this
//         this.bboxLayer.eachLayer(function (layer) {
//           layer.setStyle({fillColor: self.colors[self.depth], color: self.colors[self.depth]})
//         })
//      // } 
//      this.controlLayer.setBboxLayer(this.bboxLayer)
//      this.seeAllLayers()
//      if (this.bounds) {
//        this.map.fitBounds(this.bounds[this.depth])
//      }
   },
   searchBboxBoundsById (id) {
     var self = this
     var bounds = null
     this.bboxLayer.eachLayer(function(layer) {
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
   findBboxById (id) {
     var bboxLayer = L.layerGroup()
     if (this.bboxLayer) {
        this.bboxLayer.eachLayer(function(layer) {
          if (layer.options.id === id || (layer.feature && layer.feature.id === id)) {
            bboxLayer.addLayer(layer)
            // self.setSelected(layer)
//             var bds = layer.getBounds()
//             if (!bounds) {
//               bounds = bds
//             } else  {
//               bounds.extend(bds)
//             }
           
          }
        })
     }
     return bboxLayer
   },
   selectBboxById (id, temporaly) {
     var self = this
     var bounds = null
     var bboxLayer = this.findBboxById(id)
     bboxLayer.fire('click')
//      if (this.bboxLayer[this.depth]) {
//         this.bboxLayer[this.depth].eachLayer(function(layer) {
//           if (layer.options.id === id || (layer.feature && layer.feature.id === id)) {
//             self.setSelected(layer)
//             var bds = layer.getBounds()
//             if (!bounds) {
//               bounds = bds
//             } else  {
//               bounds.extend(bds)
//             }
           
//           }
//         })
//      }
   
     this.setSelected(bboxLayer)
    
     var bounds = null
     var markers = []
     
     bboxLayer.eachLayer(function (layer) {
       if (layer.getBounds)  {
	       var bds = layer.getBounds()
	       if (!bounds) {
	         bounds = bds
	       } else {
	         bounds.extend(bds)
	       }
       } else if (layer.getLatLng){
        // bounds = [layer.getCenter()]
         markers.push(layer)
       }
     })
     if (bounds) {
       this.map.fitBounds(bounds, {animate: true, duration:100, padding: [50,50]})
     } else if (markers.length === 1) {
       this.map.panTo(markers[0].getLatLng())
       this.bboxLayer.fire('click', {latlng: markers[0].getLatLng()})
       var ft = markers[0].feature
       var txt = '<h3>' + ft.title +'</h3>'
       for( var prop in ft.properties) {
           txt += '<div><b>' + prop + '</b>: ' + ft.properties[prop] + '</div>'
       }
       this.bboxLayer.getPopup().setContent(txt)
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
     var selectedOptions = this.selectedOptions
     var icon = this.icons['red']
     var self = this
     layer.eachLayer(function (lr) {
       
       if (lr.setStyle) {
         lr.setStyle(selectedOptions)
         lr.bringToFront()
       } else if (lr.setIcon){
         lr.fire('click')
         lr.setIcon(icon)
         lr.options.oldZIndex = lr.options.zIndexOffset
         // lr.openPopup()
//          var popup = L.popup()
//          var txt = '<h3>' + lr.title +'</h3>'
//          for( var prop in lr.feature.properties) {
//            txt += '<div><b>' + prop + '</b>: ' + lr.feature.properties[prop] + '</div>'
//          }
//          popup.setLatLng(lr.getLatLng())
//          popup.setContent(txt)
//          popup.openOn(self.map)
         lr.setZIndexOffset(2000)
        
         // self.map.fireEvent('click', {latlng: lr.getLatLng()})
       }
     })
     // layer.setStyle(this.selectedOptions)
   },
   handleReset (event) {
     // this.depth = event.detail.depth
     // this.unselectBbox()
     for (var i in this.bboxLayer){
       if (this.bboxLayer[i] && this.bboxLayer[i].remove) {
         this.bboxLayer[i].remove()
       }
      // this.controlLayer.removeLayer(this.bboxLayer[i])
     }
     this.bboxLayer = []
     this.bounds = []
     this.$store.commit('searchAreaChange', null)
   }
  }
}
</script>
<style src="formater-commons-components-vjs/src/assets/css/fontello.css"></style>
<style>
div[id="fmtMap"]{
  width:100%;
  margin:0;
  padding:0;
  height:200px;
  z-index: 0;
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
  div[id="fmtMap"] .lfh-control-legend {
   cursor: pointer;
   background: white;
   display:none;
 }
  div[id="fmtMap"] .lfh-control-legend img{
    max-height:250px;
  }
   div[id="fmtMap"]  div.lfh-control-legend{
    display:block;
  }
    div[id="fmtMap"]  div.lfh-control-legend.hidden{
    display:none;
  }
 
 div[id="fmtMap"].mtdt-small .lfh-control-legend img{
   max-width:120px;
   max-height:100px;
 }
 div[id="fmtMap"] .lfh-control-legend img{
    display: none;
  }
/*  div[id="fmtMap"] .lfh-control-legend a{
   display:block;
 } */
  div[id="fmtMap"] .lfh-control-legend.expand img{;
   display:block;
   float:left;
   margin-left:5px;
 }
   div[id="fmtMap"] .lfh-control-legend.expand img:first-child{
    margin-left:0px;
   }
  div[id="fmtMap"] .lfh-control-legend.expand a{
   display:none;
 
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
 div[id="fmtMap"].mtdt-fullscreen a.leaflet-control-layers{
   border-radius: 2px;
 }
 div[id="fmtMap"] .leaflet-popup-content {
   font-size:12px;
 }
 div[id="fmtMap"] .leaflet-popup-content h3 {
   font-size:14px;
 }
 div[id="fmtMap"] .leaflet-popup-content div {
   line-height:1.1;
 }
</style>