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
    _translate: {
      'en': {
        'legend': 'Legend'
      },
      'fr': {
        'legend': 'Légende'
      }
    },
    initialize: function(lang){
        this.setLang(lang)
        this._legends = new Map()
    },
    setLang (lang) {
      this._lang = (['en', 'fr'].indexOf(lang) >=0 ? lang : 'en')
    },
    setLegend (uuid, layerId, url) {
      // this._legend = url
      if (!this._legends.has(uuid)) {
        this._legends.set(uuid, new Map())
      } 
      if (!this._legends.get(uuid).has(layerId)) {
        this._legends.get(uuid).set(layerId, url)
        console.log(layerId)
        this._addLegend( layerId, url)
      }

      this.currentUuid = uuid
      this._container.style.display = 'block'
    },
    deleteLegend(layerId) {
      // search legend in current uuid
      this._removeLegend(layerId)
      this._legends.get(this.currentUuid).delete(layerId)
    },
    back () {
      var keys = this._legends.keys()
      var last = null
      var previous = null
      for(var key of keys) {
        previous = last
        last = key
      }
      if (last) {
        this._legends.delete(last)
      }
      if (previous) {
        this._legends.get(previous).forEach( function (layerId, url) {
          this._addLegend(layerId, url)
        })
        this.currentUuid = last
      }
//      this._legends.delete(this._legends.keys())
//      this._legend = this._legends[this._legends.length -1]
//      if (this._legend != null) {
//        this._container.style.display = 'block'
//      } else {
//        this._container.style.display = 'none'
//      }
    },
   
    removeAll () {
      this._legends.forEach(function (legend) {
        legend.clear()
      })
      this._legends.clear() 
     // this._legends.pop()
      var _this = this
      this._container.querySelectorAll('img').forEach(function (img) {
        _this._container.parentNode.removeChild(img)
      })
      this._container.style.display = 'none'
      
    },
    onAdd : function(map){
        
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control lfh-control-legend');
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
    _removeLegend(layerId) {
      var node = this._container.querySelector('#' + layerId)
      if (node) {
        node.parentNode.removeChild(node)
      }
    },
    _addLegend (layerId, url) {
      var img = document.createElement('img')
      img.src = url
      img.id = layerId
      this._container.appendChild(img)
    }
})

module.exports = L.Control.Legend