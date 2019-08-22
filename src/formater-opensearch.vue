/**
 * Tools to read the opensearch describe xml and extract the api and parameters 
 * and process the response to match a geonetwork response
 * 
 * @author epointal
 *
 **/
 
<template></template>
<script>

export default {
  name: 'FormaterOpensearch',
  props: {
    describe: {
      type: String,
      default: null
    },
    uuid: {
      type: String,
      default: null
    },
    depth: {
      type: Number,
      default: null
    }
  },
  created () {
    this.searchEventListener = this.handleSearch.bind(this) 
  	document.addEventListener('aerisSearchEvent', this.searchEventListener);
    this.load()
  },
  destroyed () {
    document.removeEventListener('aerisSearchEvent', this.searchEventListener);
    this.searchEventListener = null
  },
  data () {
    return {
      searchEventListener: null,
      api: null,
      geographic: ['geometry', 'box', 'lat', 'lon', 'radius'],
      paging: ['maxRecords', 'index', 'page'],
      osParameters: [],
      geoParameters: [],
      pagingParameters: [],
      parameters: []
    }
  },
  methods: {
     load() {
       this.$http.get(this.describe)
       .then(
           response => { this.extractDescribeParameters(response.body);}
        )
    },
    extractParameter (parameterNode) {
      var name = parameterNode.getAttribute('name')
      var obj= {
          name: name,
          title: parameterNode.getAttribute('title')
      }
      var pattern = parameterNode.getAttribute('pattern')
      if (pattern) {
        obj = Object.assign(obj, {pattern: pattern})
      }
      var min = parameterNode.getAttribute('minInclusive')
      if (min) {
        obj= Object.assign(obj, {min: min})
      }
      var max = parameterNode.getAttribute('maxInclusive')
      if (max) {
        obj = Object.assign(obj, {max: max})
      }
      var nodes = parameterNode.getElementsByTagName('parameters:Options')
      if (nodes) {
        var options= []
        for(var k=0; k < nodes.length; k++) {
          options.push(nodes[k].getAttribute('value'))
        }
        if (options.length > 0)
        obj = Object.assign(obj, {options: options})
      }
//      if (self.removedFields.indexOf(name) >=0) {
        
//       }else if (name.toLowerCase() === 'platform') {
//         this.platform = obj
//       } else if (name.toLowerCase() === 'q'){
//         this.hasQ = true
//      } else
        if (this.geographic.indexOf(name) >=0) {
        this.geoParameters.push(obj)
      } else if (this.paging.indexOf(name) >= 0) {
         this.pagingParameters.push(obj)
      }else if (name.indexOf('Date') === -1 && name.indexOf('Cover') === -1 && (!obj.options || obj.options.length > 1)) {
        this.osParameters.push(obj)
      }
    },
    extractDescribeParameters(parametersString) {
      console.log(parametersString)
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
      var regexList = this.$store.state.parameters.excluedRegex
      for(var i=0; i < parameters.length; i++){
        var value = parameters[i].getAttribute('value')
       
        var isExclued = regexList.some(function(str) {
          var rx = new RegExp(str)
          return rx.test(value)
        })
        if (isExclued) {
          console.log(value)
        }
        
        if (!isExclued) {
          var obj = self.extractParameter(parameters[i])
        }
//         var name = parameters[i].getAttribute('name')
//         var obj= {
//             name: name,
//             title: parameters[i].getAttribute('title')
//         }
//         var pattern = parameters[i].getAttribute('pattern')
//         if (pattern) {
//           obj = Object.assign(obj, {pattern: pattern})
//         }
//         var min = parameters[i].getAttribute('minInclusive')
//         if (min) {
//           obj= Object.assign(obj, {min: min})
//         }
//         var max = parameters[i].getAttribute('maxInclusive')
//         if (max) {
//           obj = Object.assign(obj, {max: max})
//         }
//         var nodes = parameters[i].getElementsByTagName('parameters:Options')
//         if (nodes) {
//           var options= []
//           for(var k=0; k < nodes.length; k++) {
//             options.push(nodes[k].getAttribute('value'))
//           }
//           if (options.length > 0)
//           obj = Object.assign(obj, {options: options})
//         }
//         if (self.removedFields.indexOf(name) >=0) {
          
// //         }else if (name.toLowerCase() === 'platform') {
// //           this.platform = obj
// //         } else if (name.toLowerCase() === 'q'){
// //           this.hasQ = true
//         } else if (self.geographic.indexOf(name) >=0) {
//           self.geoParameters.push(obj)
//         } else if (self.paging.indexOf(name) >= 0) {
//            self.pagingParameters.push(obj)
//         }else if (name.indexOf('Date') === -1 && name.indexOf('Cover') === -1 && (!obj.options || obj.options.length > 1)) {
//           self.osParameters.push(obj)
//         }
        
      }
      console.log('FIN DU DESCRIBE 2')
      this.$emit('hasChild', true)
      
      this.$store.commit('parametersChange', this.osParameters)
      // modification des paramètres
//       var evt = new CustomEvent('fmt:changeParametersEvent', {detail: {parameters: this.osParameters}})
//       document.dispatchEvent(evt)
//       var event = new CustomEvent('fmt:metadataWithChildEvent', {detail: {uuid: this.uuid, depth: this.depth}})
//       	  document.dispatchEvent(event)
     
      // this.requestApi(searchParameters)
    },
    handleSearch(e) {
      if (this.api && e.detail.parentUuid === this.uuid) {
        e.detail.api = this.api
      }
    }
  }
}

</script>

