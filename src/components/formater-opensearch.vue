/**
 * Tools to read the opensearch describe xml and extract the api and parameters 
 * 
 * @author epointal
 *
 **/
 
<template>
<formater-api-requester v-if="api" :api="api" :cds="cds" :depth="depth"></formater-api-requester>
</template>
<script>
import FormaterApiRequester from '@/components/formater-api-requester.vue'
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => {
    value = value.replace('?', '')
    return object[key] === value
  });
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
    cds: {
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
    },
    service: {
      type: Object,
      default: null
    }
  },
  watch: {
    service (newvalue) {
      if (newvalue.domain.indexOf('flatsim') >= 0) {
        this.osParameters = this.osParameters.filter(param => param.name !== 'processingLevel')
        this.$emit('parametersChange', {api: this.api, parameters:this.osParameters, mapping: this.mappingParameters, fixed:this.fixedParameters})
      }
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
      fixedParameters: {},
      paramNS: 'parameters',

      // associative array of: parameter name in this application => name in the opensearch api
      // for the predefined parameters like box, temporalExtent, and paging (common for all api)
      mappingParameters: [],
      // list of others specific opensearch api parameters 
      // { name, title, pattern, min, max, options}
      osParameters: []
    }
  },
  methods: {
     extractFixedParams (describe) {
       var tab = describe.split('?')
       var fixedParameters = {}
       if (tab.length > 1) {
         var params = tab[1].split('&')
         params.forEach(function (param) {
           var x = param.split('=')
           fixedParameters[x[0]] = x[1]
         })
       }
       this.fixedParameters = fixedParameters
       return tab[0]
     },
     load() {
       var describe = this.extractFixedParams(this.describe)
       this.$http.get(describe)
       .then(
           response => { this.extractDescribeParameters(response.body);},
           response => { 
             if (response.status === 403 || response.status === 401 || response.status === 400) {
               console.log('CAN NOT GET ' + this.describe)
               this.$emit('failed')
               return
             }
             this.loadWithProxy()
           }
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
      var listPredefined = this.$store.getters['predefinedParams']
      // name in this application
      var appName = getKeyByValue(listPredefined, specName)
      // name in the opensearch api
      var name = parameterNode.getAttribute('name')
      if (this.fixedParameters[name]) {
        return
      }
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
//         case 'relativeOrbitNumber':
//           obj.title = obj.title || 'Ex: 123'
//           break;
        case 'processingLevel':
          if (this.service && this.service.domain.indexOf('flatsim')>= 0) {
             return;
          }
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
      var nodes = parameterNode.getElementsByTagName(this.paramNS + ':Options')
      if (nodes.length === 0) {
        nodes = parameterNode.getElementsByTagName(this.paramNS + ':Option')
      }
      if (nodes.length === 1) {
        return
      }
      if (nodes.length > 0) {
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
    extractNamespaces (attrs) {
      var namespaces = {}
      for (var i=0; i < attrs.length; i++) {
        if (attrs[i].value.indexOf('parameters') > 0 ) {
          var part = attrs[i].name.split(':')
          this.paramNS =  part[1]
        } else if (attrs[i].value.indexOf('time') > 0) {
          var part = attrs[i].name.split(':')
          namespaces.time = part[1]
        } else if (attrs[i].value.indexOf('geo') > 0) {
          var part = attrs[i].name.split(':')
          namespaces.geo = part[1]
        }
      }
      this.$store.commit('setNamespaces', namespaces)
    },
    extractDescribeParameters(parametersString) {
      var parser = new DOMParser()
      var xml = parser.parseFromString(parametersString, 'text/xml')
      this.extractNamespaces(xml.firstElementChild.attributes)
      var urls = xml.firstElementChild.childNodes
      var url = null
      // loop to find the good url
      urls.forEach(function (node) {
         if (node.tagName && node.tagName.toLowerCase() === 'url' && node.getAttribute('type').indexOf('json') >= 0
             && node.getAttribute('type').indexOf('tdensity') < 0 && node.getAttribute('type').indexOf('elasticsearch') < 0) {
           var template = node.getAttribute('template')
           var extract = template.match(/^([^?]*(?:\?)).*$/i)
           if( extract && extract[1] && extract[1] != ''){
               url = node;
           }
         }
      })
      if (!url)  {
        return
      }
      var template = url.getAttribute('template')
      var extract = template.match(/^([^?]*(?:\?)).*$/i)
      if (!extract[1]) {
        return
      } else {
        this.api = extract[1]
      }
      var parameters = url.getElementsByTagName(this.paramNS + ':Parameter')
      var self = this
      var regexList = this.$store.state.parameters.excluedRegex
      // loop on the parameters node
      for(var i=0; i < parameters.length; i++){
        var specName = parameters[i].getAttribute('value')
        specName = specName.replace('?', '')
        // search if the parameter is exclued (@see list in store/index.js)
        var isExclued = regexList.some(function(str) {
          var rx = new RegExp(str)
          return rx.test(specName)
        })
        if (!isExclued) {
          var obj = self.extractParameter(parameters[i] , specName)
        }
        
      }
//       console.log(this.osParameters)
//       console.log(this.mappingParameters)
//       console.log(this.fixedParameters)
     // this.recordService()
      this.$emit('parametersChange', {api: this.api, parameters:this.osParameters, mapping: this.mappingParameters, fixed: this.fixedParameters})
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

