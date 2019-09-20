/**
 * 
 */

 L.Control.Legend= L.Control.extend({
    options: {
        position: 'topright',
    },
    _legend: null,
    _legends: [],
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
    },
    setLang (lang) {
      this._lang = (['en', 'fr'].indexOf(lang) >=0 ? lang : 'en')
    },
    setLegend (uuid, url) {
     
      this._legend = url
      this._legends.push(url)
      this._container.style.display = 'block'
      this._load()
    },
    back () {
      this._legends.pop()
      this._legend = this._legends[this._legends.length -1]
      console.log(this._legend)
      if (this._legend != null) {
        this._container.style.display = 'block'
      } else {
        this._container.style.display = 'none'
      }
    },
   
    removeLegend () {
      this._legend = null
      this._legends.pop()
      this._container.style.display = 'none'
    },
    onAdd : function(map){
        
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control lfh-control-legend');
        var a = L.DomUtil.create('a', 'fa fa-sticky-note')
        a.setAttribute('title', this._translate[this._lang]['legend'])
        container.appendChild(a)
        this._imgNode = document.createElement('img')
        container.appendChild(this._imgNode)
        container.onclick = function(){
          if (this.className.indexOf('expand') >= 0){
            this.classList.remove('expand')
          }else {
            this.classList.add('expand')
          }
        }
        return container;
    },
    _load () {
       if (this._legend) {
         this._imgNode.src = this._legend

       }
      
    }
})

module.exports = L.Control.Legend