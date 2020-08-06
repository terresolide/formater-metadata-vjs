/**
 * getCapabilities Reader
 */

const reader = {
    $http: null,
    parser: null,
    regex: null,
    proxy: null,
    init (http,  prox) {
      $http = http
      parser = new DOMParser()
      if (prox) {
        regex = new RegExp(prox.regex)
      }
      proxy = prox.url
    },
    loadInfo (layer, options, metaId, callback) {
      var url = layer.href
      if (regex.test(url) && proxy) {
        search = proxy + '?url=' + encodeURIComponent(url)
      }
      $http.get(search)
      .then(response => this.extract(response.body, layer, options, metaId, callback),
            response => console.log('CAN NOT GET ' + url))
    },
    extract (str, layer, options, metaId, callback) {
      var root = parser.parseFromString(str, 'text/xml')
      var ns = root.children[0].getAttribute('xmlns')
      var xlink = root.children[0].getAttribute('xmlns:xlink')
      var nsResolver = function (prefix) {
        switch(prefix) {
          case 'xlink':
            return xlink
          default:
            return ns
        }
      }

      var urlGetMap = this.getUrlGetMap(root, nsResolver)
      if (urlGetMap === '') {
        return null
      }
      options.url = urlGetMap
      var result = null
      result = root.evaluate('//ns:Layer[ns:Name="' + layer.name + '"]', root, nsResolver, XPathResult.ANY_TYPE, null)
      if (result.resultType !== XPathResult.UNORDERED_NODE_ITERATOR_TYPE && result.resultType !== XPathResult.ORDERED_NODE_ITERATOR_TYPE) {
        return null
      }
      var layerXml = result.iterateNext();
      if (layerXml === null) {
        return null
      }
      layer.href = urlGetMap
     // layer.legend = this.getLegend(root, layerXml, nsResolver)
      layer.title = this.getTitle(root, layerXml, nsResolver)
      layer.options = {
        id: layer.id,
        ESPG: this.getESPG(root, layerXml, nsResolver),
        format: this.getFormat(root, nsResolver),
        opacity: 0.5,
        layers: layer.name,
        legend: this.getLegend(root, layerXml, nsResolver)
      }
     // options.title = this.getTitle(root, layerXml, nsResolver)
    //  options.legend = this.getLegend(root, layerXml, nsResolver)
//      options.format = this.getFormat(root, nsResolver)
//      options.ESPG = this.getESPG(root, layerXml, nsResolver)
//      options.layers = layer.name
//      options.id = layer.id
      // search crs and legend and bbox
      if (typeof callback !== 'undefined') {
        callback(layer, metaId)
      }
    },
    getUrlGetMap( root, resolver) {
      var result = root.evaluate('//ns:Request/ns:GetMap/ns:DCPType/ns:HTTP/ns:Get/ns:OnlineResource/@xlink:href', root, resolver, XPathResult.STRING_TYPE, null)
      return result.stringValue
    },
    getESPG (root, layerXml, resolver) {
      // default leaflet CRS
      var result = root.evaluate('count(./ns:CRS[text()="EPSG:3857"])', layerXml, resolver, XPathResult.NUMBER_TYPE, null)
      if (result.numberValue > 0) {
       return '3857'
     }
      var result = root.evaluate('count(./ns:CRS[text()="EPSG:4326"])', layerXml, resolver, XPathResult.NUMBER_TYPE, null)
      if (result.numberValue > 0) {
        return '4326'
      }
      var result = root.evaluate('count(./ns:CRS[text()="EPSG:3395"])', layerXml, resolver, XPathResult.NUMBER_TYPE, null)
      if (result.numberValue > 0) {
        return '3395'
      } else {
        return null
      }
    },
    getFormat (root, resolver) {
      var result = root.evaluate('count(//ns:Request/ns:GetMap[ns:Format="image/png"])', root, resolver, XPathResult.NUMBER_TYPE, null)
      if (result.numberValue > 0) {
        return 'image/png'
      }
      var result = root.evaluate('count(//ns:Request/ns:GetMap[ns:Format="image/jpeg"])', root, resolver, XPathResult.NUMBER_TYPE, null)
      if (result.numberValue > 0) {
        return 'image/jpeg'
      }
      return null
    },
    getTitle (root, layerXml, resolver) {
      var result = root.evaluate('./ns:Title/text()', layerXml, resolver, XPathResult.STRING_TYPE, null)
      return result.stringValue
    },
    getAbstract (root, layerXml, resolver) {
      var result = root.evaluate('./ns:Abstract/text()', layerXml, resolver, XPathResult.STRING_TYPE, null)
      return result.stringValue
    },
    getGeographicBoundingBox (root, layerXml, resolver) {
      
    },
    getLegend (root, layerXml, resolver) {
      var result = root.evaluate('./ns:Style/ns:LegendURL/ns:OnlineResource/@xlink:href', layerXml, resolver, XPathResult.STRING_TYPE, null)
      var src = result.stringValue
      var result = root.evaluate('./ns:Style/ns:Title', layerXml, resolver, XPathResult.STRING_TYPE, null)
      var title = result.stringValue
      if (src !== '') {
        return {src: src, title: title}
      } else {
        return null
      }
      
    }
}
module.exports = reader