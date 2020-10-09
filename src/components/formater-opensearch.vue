/**
 * Tools to read the opensearch describe xml and extract the api and parameters 
 * 
 * @author epointal
 *
 **/
 
<template>
<formater-api-requester v-if="api" :api="api" :depth="depth"></formater-api-requester>
</template>
<script>
import FormaterApiRequester from '@/components/formater-api-requester.vue'
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
export default {
  name: 'FormaterOpensearch',
  components: {
    FormaterApiRequester
  },
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
    // this.searchEventListener = this.handleSearch.bind(this) 
  	// document.addEventListener('aerisSearchEvent', this.searchEventListener);
    this.load()
  },
  mounted () {

  },
  destroyed () {
//     document.removeEventListener('aerisSearchEvent', this.searchEventListener);
//     this.searchEventListener = null
  },
  data () {
    return {
     // searchEventListener: null,
      api: null,
      // associative array of: parameter name in this application => name in the opensearch api
      // for the predefined parameters like box, temporalExtent, and paging (common for all api)
      mappingParameters: [],
      // list of others specific opensearch api parameters 
      // { name, title, pattern, min, max, options}
      osParameters: []
    }
  },
  methods: {
     load() {
       this.$http.get(this.describe)
       .then(
           response => { this.extractDescribeParameters(response.body);},
           response => { this.loadWithProxy()}
        )
    },
    loadWithProxy() {
      if (this.$store.state.proxy.url) {
	      var url = this.$store.state.proxy.url + '?url=' + encodeURIComponent(this.describe)
	      this.$http.get(url)
	      .then(
	          response => { this.extractDescribeParameters(response.body);},
	          response => { this.$emit('failed');}
	       )
      } else {
        console.log('CAN NOT GET ' + this.describe)
        this.$emit('failed')
      }
    },
    extractParameter (parameterNode, specName) {
      var listPredefined = this.$store.state.parameters.predefined
      // name in this application
      var appName = getKeyByValue(listPredefined, specName)
      // name in the opensearch api
      var name = parameterNode.getAttribute('name')
      if (typeof appName !== 'undefined') {
        this.mappingParameters[appName] = name
        return
      }
      
      var obj= {
          name: name,
          title: parameterNode.getAttribute('title')
      }
      // particular cas
      switch(name) {
        case 'relativeOrbitNumber':
          obj.title = obj.title || 'Ex: 123'
          break;
        
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
//         if (this.geographic.indexOf(name) >=0) {
//         this.geoParameters.push(obj)
//       } else if (this.paging.indexOf(name) >= 0) {
//          this.pagingParameters.push(obj)
//       }else 
      if (!obj.options || obj.options.length > 1) {
        this.osParameters.push(obj)
      }
    },
    extractDescribeParameters(parametersString) {
      var parser = new DOMParser()
      var xml = parser.parseFromString(parametersString, 'text/xml')
      var urls = xml.firstChild.childNodes
      var url = null
      // loop to find the good url
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
      // loop on the parameters node
      for(var i=0; i < parameters.length; i++){
        var specName = parameters[i].getAttribute('value')
        // search if the parameter is exclued (@see list in store/index.js)
        var isExclued = regexList.some(function(str) {
          var rx = new RegExp(str)
          return rx.test(specName)
        })
        if (!isExclued) {
          var obj = self.extractParameter(parameters[i] , specName)
        }
        
      }
     // this.recordService()
      this.$emit('parametersChange', {api: this.api, parameters:this.osParameters, mapping: this.mappingParameters})
      
    },
    // record this service
//     recordService() {
//       // only if authenticate user
//      // if (this.$store && this.$store.getters['user/email']) {
//         this.$store.commit('services/add', this.api)
//       // }
//     },
//     handleSearch(e) {
//       if (this.api && e.detail.parentUuid === this.uuid) {
//         e.detail.api = this.api
//       }
//     }
  }
}

</script>

