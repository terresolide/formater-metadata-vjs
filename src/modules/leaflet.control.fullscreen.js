/**
 * 
 */

 L.Control.Fullscreen = L.Control.extend({
    options: {
        position: 'topright',
    },
    _large: null,
    _nodeSmall: null,
    _nodeLarge: null,
    _mapContainer: null,
    _lang: 'en',
    _fullscreen: false,
    _translate: {
      'en': {
        'fullscreen': 'Enlarge',
        'reduce': 'Reduce'
      },
      'fr': {
        'fullscreen': 'Agrandir',
        'reduce': 'Reduire'
      }
    },
    initialize: function(idLarge, lang){
        this._large = idLarge
        this.setLang(lang)
    },
    setLang (lang) {
      this._lang = (['en', 'fr'].indexOf(lang) >=0 ? lang : 'en')
    },
    onAdd : function(map){
        this._nodeSmall = map._container.parentNode
        this._nodeLarge = document.querySelector('#' + this._large)
        if (!this._nodeLarge) {
          return
        }
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control lfh-control-fullscreen');
        var a = L.DomUtil.create('a', 'fa fa-expand')
        a.setAttribute('title', this._translate[this._lang]['fullscreen'])
        container.appendChild(a)
        var self = this
        a.onclick = function(){
           self._fullscreen = !self._fullscreen
           this.setAttribute('class', self._fullscreen ? 'fa fa-compress' : 'fa fa-expand')
           if (self._fullscreen) {
             self._enlarge()
           } else {
             self._reduce()
           }
        }
        return container;
    },
    _enlarge : function () {
      this._nodeLarge.appendChild(this._map._container)
      var height = window.innerHeight - 400 
      this._container.querySelector('a').setAttribute('title', this._translate[this._lang]['reduce'])
      this._map._container.style.height = height + 'px'
      this._map._container.className = this._map._container.className.replace('mtdt-small', 'mtdt-fullscreen')
      this._map.setMinZoom(2)
      this._map.invalidateSize()
      this._emitChange()
    },
    _reduce : function () {
      this._nodeSmall.appendChild(this._map._container)
      this._map.setMinZoom(1)
      this._map._container.className = this._map._container.className.replace('mtdt-fullscreen', 'mtdt-small')
      this._map.invalidateSize()
      this._emitChange()
    },
    _emitChange : function () {
      var event = new CustomEvent('mapNodeChange')
      document.dispatchEvent(event)
    }
})

module.exports = L.Control.Fullscreen