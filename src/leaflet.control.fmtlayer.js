/**
 * L control tiles with given default tiles
 */
/* eslint no-undef: 0 */
 L.Control.Fmtlayer = L.Control.Layers.extend({
   options: {
     position: 'topleft',
   },
   tiles: {
     osm: {
       name: 'OSM',
       url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
       attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
     },
//     osmFr: {
//       name: 'OpenStreetMap France',
//       url: '//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
//       attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>'
//     },
//     opentopomap: {
//       name: 'OpenStreetMap Topo',
//       url: '//{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
//       attribution: 'Kartendaten: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, <a href="http://viewfinderpanoramas.org">SRTM</a> | Kartendarstellung: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//     },
     arcgisTopo: {
       name: 'ArcGIS',
       url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
       attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
     }
   },
   initialize: function (baseLayers, overlays, options) {
     L.Control.Layers.prototype.initialize.call(this, baseLayers, overlays, options)
     // Default tiles allready in control
     for (var key in this.tiles) {
       var layer = L.tileLayer(this.tiles[key].url, {attribution: this.tiles[key].attribution})
       this.tiles[key].layer = layer
       this.addBaseLayer(layer, this.tiles[key].name)
     }
   }
 })
 module.exports = L.Control.Fmtlayer
