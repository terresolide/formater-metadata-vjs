/**
 * Tools to read the opensearch describe xml and extract the api and parameters 
 * and process the response to match a geonetwork response
 * 
 * @author epointal
 */
import Vue from 'vue'
import VueResource from 'vue-resource'

var opensearch = {
    _options: {
      
    },
    reader: function(options) {
      this._options = Object.assign(this._options, options)
    }
    
}
opensearch.reader = {
    load: function(describeUrl) {
      this.$http.get(describeUrl)
      .then(
          response => { this.extractDescribeParameters(response.body);}
      )
    },
    extract: function (parametersString) {
      var parser = new DOMParser()
      var xml = parser.parseFromString(parametersString, 'text/xml')
      var urls = xml.firstChild.childNodes
     var url = null
      urls.forEach(function (node) {
         if (node.tagName && node.tagName.toLowerCase() === 'url' && node.getAttribute('type').indexOf('json') >= 0) {
           var template = node.getAttribute('template')
           var extract = template.match(/^(.*(?:(?:search.json\?)|(?:\?format=FLATSIM))).*$/)
           if( extract && extract[1] && extract[1] != ''){
               url = node;
           }
         }
      })
      if (!url)  {
        return
      }
      var template = url.getAttribute('template')
      var extract = template.match(/^(.*(?:(?:search.json\?)|(?:\?format=FLATSIM))).*$/)
      if (!extract[1]) {
        return
      } else {
        this.api = extract[1]
      }
      var parameters = url.getElementsByTagName('parameters:Parameter')
      var self = this
      for(var i=0; i < parameters.length; i++){
        var name = parameters[i].getAttribute('name')
        var obj= {
            name: name,
            title: parameters[i].getAttribute('title')
        }
        var pattern = parameters[i].getAttribute('pattern')
        if (pattern) {
          obj = Object.assign(obj, {pattern: pattern})
        }
        var min = parameters[i].getAttribute('minInclusive')
        if (min) {
          obj= Object.assign(obj, {min: min})
        }
        var max = parameters[i].getAttribute('maxInclusive')
        if (max) {
          obj = Object.assign(obj, {max: max})
        }
        var nodes = parameters[i].getElementsByTagName('parameters:Options')
        if (nodes) {
          var options= []
          for(var k=0; k < nodes.length; k++) {
            options.push(nodes[k].getAttribute('value'))
          }
          if (options.length > 0)
          obj = Object.assign(obj, {options: options})
        }
        if (self.removedFields.indexOf(name) >=0) {
          
//         }else if (name.toLowerCase() === 'platform') {
//           this.platform = obj
//         } else if (name.toLowerCase() === 'q'){
//           this.hasQ = true
        } else if (self.geographic.indexOf(name) >=0) {
          self.geoParameters.push(obj)
        } else if (self.paging.indexOf(name) >= 0) {
           self.pagingParameters.push(obj)
        }else if (name.indexOf('Date') === -1 && name.indexOf('Cover') === -1 && (!obj.options || obj.options.length > 1)) {
          self.osParameters.push(obj)
        }
        
      }
      var evt = new CustomEvent('fmt:changeParametersEvent', {detail: {parameters: this.osParameters}})
      document.dispatchEvent(evt)
      this.hasChild = true
      this.$set(this.tabs, 'search', true)
      this.currentTab = 'search'
      this.getRecords()
      // this.requestApi(searchParameters)
    }
}
module.export = opensearch
