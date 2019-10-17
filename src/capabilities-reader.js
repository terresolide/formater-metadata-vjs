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
      regex = new RegExp(prox.regex)
      proxy = prox.url
    },
    loadInfo (url, layername) {
      var search = url
      console.log(proxy)
      if (regex.test(url)) {
        search = proxy + '?url=' + encodeURIComponent(url)
      }
      console.log(search)
      $http.get(search)
      .then(response => this.extract(response.body, layername))
    },
    extract (str, layername) {
      console.log(str)
      var root = parser.parseFromString(str, 'text/xml')
      var ns = root.children[0].getAttribute('xmlns')
      console.log(ns)
      var nsResolver = function (prefix) {
        if (prefix === 'ns') {
          return ns
        } else {
          return null
        }
      }
      var result = null
      console.log(layername)
      var result = root.evaluate('//ns:Layer[ns:Name="' + layername + '"]', root, nsResolver, XPathResult.ANY_TYPE, result)
      if (result.resultType !== XPathResult.UNORDERED_NODE_ITERATOR_TYPE && result.resultType !== XPathResult.ORDERED_NODE_ITERATOR_TYPE) {
        return null
      }
      var layerXml = result.iterateNext();
      if (layerXml === null) {
        return null
      }
      console.log(layerXml)
      
      return root
    }
}
module.exports = reader