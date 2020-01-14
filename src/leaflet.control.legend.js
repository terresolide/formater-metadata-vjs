/**
 * 
 */

 L.Control.Legend= L.Control.extend({
    options: {
        position: 'topright',
    },
    _legend: null,
    _legends: null,
    _imgNode: null,
    _lang: 'en',
    _toId: null,
    _translate: {
      'en': {
        'legend': 'Legend'
      },
      'fr': {
        'legend': 'Légende'
      }
    },
    initialize: function(lang, toId){
        this.setLang(lang)
        this._legends = new Map()
        this._toId = toId
    },
    setLang (lang) {
      this._lang = (['en', 'fr'].indexOf(lang) >=0 ? lang : 'en')
    },
    addLegend (uuid, layerId, url) {
      // this._legend = url
      if (!this._legends.has(uuid)) {
        this._legends.set(uuid, new Map())
      } 
      if (!this._legends.get(uuid).has(layerId)) {
        this._legends.get(uuid).set(layerId, url)
        this._addLegendToDom( layerId, url)
      }
      this.currentUuid = uuid
    },
    removeLegend(layerId) {
      // search legend in current uuid
      this._removeLegendFromDom(layerId)
      if (this._legends.has(this.currentUuid)) {
        this._legends.get(this.currentUuid).delete(layerId)
      }
    },
    back (uuid) {
      var keys = this._legends.keys()
      var last = null
      var previous = null
      //search last uuid with legend and previous uuid with legend
      for(var key of keys) {
        previous = last
        last = key
      }
      if (last) {
        // remove current legend in dom
        for(var layerId of this._legends.get(last).keys()) {
          this._removeLegendFromDom(layerId)
        }
        this._legends.delete(last)
      }
      this.currentUuid = uuid
      if (previous && previous === uuid) {
        for(var [layerId, url] of this._legends.get(previous)){
          this._addLegendToDom(layerId, url)
        }
      }
    },
   
    removeAll () {
      this._legends.forEach(function (legend) {
        legend.clear()
      })
      this._legends.clear() 
      this._container.querySelectorAll('img').forEach(function (img) {
        img.parentNode.removeChild(img)
      })
      
    },
    onAdd : function(map){
        
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control lfh-control-legend hidden');
        var a = L.DomUtil.create('a', 'icon-palette')
        a.setAttribute('title', this._translate[this._lang]['legend'])
        container.appendChild(a)
        container.onclick = function(){
          if (this.className.indexOf('expand') >= 0){
            this.classList.remove('expand')
          }else {
            this.classList.add('expand')
          }
        }
        return container;
    },
    _removeLegendFromDom(layerId) {
      var node = this._container.querySelector('#' + this._toId(layerId))
      if (node) {
        node.parentNode.removeChild(node)
      }
      if (this._container.childNodes.length < 2) {
        this._container.classList.add('hidden')
      }
    },
    _addLegendToDom (layerId, url) {
      var img = document.createElement('img')
      img.src = url
      img.id = this._toId(layerId)
      this._container.appendChild(img)
       if (this._container.childNodes.length >= 2) {
        this._container.classList.remove('hidden')
      }
    }
})

module.exports = L.Control.Legend