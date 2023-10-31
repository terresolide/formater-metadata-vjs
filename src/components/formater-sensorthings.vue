/**
 * Tools to search with a SensorThings Api
 * 
 * @author epointal
 *
 **/
 
<template>
</template>
<script>

export default {
  name: 'FormaterSensorthings',
  components: {
  },
  props: {
    api: {
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
    $route (newvalue) {
      this.getRecords(newvalue)
    },
    service (newvalue) {
      
    }
  },
  created () {
    this.initParameters()
    this.getRecords(this.$route)
  },
  mounted () {

  },
  destroyed () {
  },
  data () {
    return {
      parameters: {},
      fixedParameters: {},

      // associative array of: parameter name in this application => name in the SensorThings api
      // for the predefined parameters like box, temporalExtent, and paging (common for all api)
      mappingParameters: [],
      // list of others specific opensearch api parameters 
      // { name, title, pattern, min, max, options}
      osParameters: []
    }
  },
  methods: {
    initParameters () {
      this.parameters = {
        skip: 0,
        top: this.$store.state.size.nbRecord
      }
    }, 
     extractParameters (api) {
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
     getRecords(route) {
       this.$store.commit('searchingChange', true)
       this.$http.get(this.api + '&$skip=0&$top=' + this.$store.state.size.nbRecord )
       .then(
           response => { this.treatmentJson(response.body)},
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
	      var url = this.$store.state.proxy.url + '?url=' + encodeURIComponent(this.api)
	      this.$http.get(url)
	      .then(
	          response => { console.log(response.body);},
	          response => { this.$emit('failed');}
	       )
      } else {
        console.log('CAN NOT GET ' + this.describe)
        this.$emit('failed')
      }
    },
    treatmentJson (data) {
      console.log(data)
      var metadatas = {}
      var features = []
      var self = this
      var contents = { type: 'sensorthings'}
      data.value.forEach(function (value) {
        var feature = value.Thing.Locations[0].location
        feature.id = value['@iot.id']
        feature.title = value.Thing.Locations[0].name
        if (!feature.properties) {
          feature.properties = {}
        }
        feature.properties.title = value.Thing.name
        feature.properties.id = value['@iot.id']
        features.push(feature)
        metadatas[value['@iot.id']] = self.mapToGeonetwork(value)
      })
      console.log(features)
      contents.properties = {
        totalResults: data.value.length,
        itemsPerPage: this.parameters.top,
        startIndex: this.skip,
        next: data['@iot.nextLink']
      }
      
      contents.depth = this.depth
      contents.features = features
      contents.metadata = metadatas
      var event = new CustomEvent('fmt:metadataListEvent', {detail: contents })
      document.dispatchEvent(event)
      this.$store.commit('searchingChange', false)
    },
    mapToGeonetwork (value) {
      var properties = value.properties
      properties.title = value.name
      properties.description = value.description
      var temp = value.phenomenonTime.split('/')
      properties.tempExtentBegin = temp[0]
      properties.tempExtentEnd = temp[1]
      properties.type = 'dataset'
      properties.cds = this.cds
      if (value.properties.img) {
        properties.images = [['', value.properties.img, '']]
        delete properties.img
      }
      if (properties.file) {
        properties.download = [{
          mimeType: 'csv/txt',
          url: properties.file
        }]
      }
      console.log(properties.file)
      properties.contacts = {metadata: {}, resource: {}}
      return properties
    }
   
  }
}

</script>

