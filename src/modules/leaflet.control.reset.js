/**
 * 
 */

 L.Control.Reset = L.Control.extend({
    options: {
        position: 'topleft',
    },
    _bounds: null,
    _lang: 'en',
    _translate: {
      'en': {
        'reset': 'Reset Map'
      },
      'fr': {
        'reset': 'Initialiser'
      }
    },
    initialize: function(bounds, lang){
        this._bounds = bounds
        this._lang = (['en', 'fr'].indexOf(lang) >=0 ? lang : 'en')
    },
    setLang (lang) {
      this._lang = (['en', 'fr'].indexOf(lang) >=0 ? lang : 'en')
      this._container.querySelector('a').setAttribute('title', this._translate[this._lang]['reset'])
    },
    setBounds (bounds) {
      this._bounds = bounds
    },
    onAdd : function(map){
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control lfh-control-refresh');
        var a = L.DomUtil.create('a', 'fa fa-dot-circle-o')
        a.setAttribute('title', this._translate[this._lang]['reset'])
        container.appendChild(a)
        var self = this
        a.onclick = function(){
            map.fitBounds(self._bounds);
        }
        return container;
    },
    OnRemove: function () {
      
    }
})

module.exports = L.Control.Reset