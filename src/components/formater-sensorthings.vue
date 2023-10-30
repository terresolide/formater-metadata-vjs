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
      
    },
    service (newvalue) {
      
    }
  },
  created () {
  },
  mounted () {

  },
  destroyed () {
  },
  data () {
    return {
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
     load() {
   
       this.$http.get(this.api)
       .then(
           response => { console.log(resp.body)},
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
    }
   
  }
}

</script>

