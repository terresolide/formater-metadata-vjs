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
    url: {
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
    this.extractParameters()
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
      fixedFilters: [],
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
        $skip: 0,
        $top: this.$store.state.size.nbRecord,
        $expand: 'Thing($expand=Locations($top=1)),Sensor,ObservedProperty'
      }
    }, 
     extractParameters () {
          console.log(this.url)
          this.api = this.url
          var url = new URL(this.url)
          var filterParams = url.searchParams.get('$filter')
          var filters = null
          if (filterParams) {
             filters = filterParams.split('and')
             filters = filters.map(fl => {
               return fl.trim()
               var tab = fl.split(/\s+/)
               if (tab.length === 3) {
	               return {
	                 prop: tab[0],
	                 compare: tab[1],
	                 value: tab[2]
	               }
               } else {
                 return fl
               }
             })
          }
          this.fixedFilters = filters
          console.log(this.fixedFilters)
          
          this.api = url.protocol + '//' + url.host + url.pathname 
//        var tab = describe.split('?')
//        var fixedParameters = {}
//        if (tab.length > 1) {
//          var params = tab[1].split('&')
//          params.forEach(function (param) {
//            var x = param.split('=')
//            fixedParameters[x[0]] = x[1]
//          })
//        }
//        this.fixedParameters = fixedParameters
//        return tab[0]
     },
     getRecords(route) {
       this.$store.commit('searchingChange', true)
       this.prepareParameters(route)
       var url = this.api + '?'
       var parameters = Object.assign({}, this.parameters)
       url += Object.keys(parameters).map(function (prop) {
        return prop + '=' + encodeURIComponent(parameters[prop])
      }).join('&');
       this.$http.get(url )
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
    prepareFilters (query) {
      console.log(query)
      var filters = []
      filters = filters.concat(this.fixedFilters)
      if (query.any) {
        filters.push("substringof('" + query.any + "', name)")
      }
      if (query.box) {
        var polygon = this.$box2sql(query.box)
        if (polygon) {
          filters.push("geo.intersects(Thing/Locations/location,geography'" + polygon + "')")
        }
      }
      if (filters.length > 0) {
        this.parameters.$filter = filters.join(' and ')
      } 
      console.log(filters)
    },
    prepareParameters (newvalue) {
      var query = newvalue.query
      if (query.from) {
        this.parameters.$skip = parseInt(query.from) - 1
        if (query.to) {
          this.parameters.$top = parseInt(query.to) - parseInt(query.from) + 1
        }
      }
      
      this.prepareFilters(query)
      
    },
    treatmentJson (data) {
      var metadatas = {}
      var features = []
      var self = this
      var contents = { type: 'sensorthings'}
      data.value.forEach(function (value) {
        var feature = value.Thing.Locations[0].location
        feature.id = value['@iot.id'] + ''
        feature.title = value.Thing.Locations[0].name
        if (!feature.properties) {
          feature.properties = {}
        }
        feature.properties = Object.assign(feature.properties, value.Thing.properties)
       // feature.properties.title = value.Thing.name
       // feature.properties.id = value['@iot.id'] + ''
        features.push(feature)
        metadatas[value['@iot.id'] + ''] = self.mapToGeonetwork(value)
        metadatas[value['@iot.id'] + ''].feature = feature
      })
      contents.properties = {
        count: data.value.length,
        itemsPerPage: this.parameters.$top,
        startIndex: this.parameters.$skip + 1,
        next: data['@iot.nextLink'] ? data['@iot.nextLink'] : null
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
      properties.id = value['@iot.id'] + ''
      properties.metaId = value['@iot.selfLink']
      properties.title = value.name
      properties.description = value.description
      var temp = value.phenomenonTime.split('/')
      properties.tempExtentBegin = temp[0]
      properties.tempExtentEnd = temp[1]
      properties.type = 'dataset'
      properties.cds = this.cds
     // properties.networks = value.Thing.properties.networks
      properties.keyword = []
      var time = value.resultTime.split('/')
      properties.creationDate = time[0]
      properties.updated = time[1]
      if (value.properties.img) {
        properties.images = [['Browse', value.properties.img, '']]
        properties.thumbnail = value.properties.img
        delete properties.img
      }
      if (properties.file) {
        properties.download = [{
          mimeType: 'application/octet-stream',
          url: properties.file
        }]
      }
      properties.exportLinks= {json: value['@iot.selfLink']}
      properties.contacts = {metadata: {}, resource: {}}
      return properties
    }
   
  }
}

</script>

