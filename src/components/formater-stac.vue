/**
 * Tools to search in stac collection
 * 
 * @author epointal
 *
 **/
 
<template>

</template>
<script>
export default {
  name: 'FormaterStac',
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
//   watch: {
//     service (newvalue) {
//       if (newvalue.domain.indexOf('flatsim') >= 0) {
//         this.osParameters = this.osParameters.filter(param => param.name !== 'processingLevel')
//         this.$emit('parametersChange', {api: this.api, parameters:this.osParameters, mapping: this.mappingParameters, fixed:this.fixedParameters})
//       }
//     }
//   },
  created () {
    console.log('STAC')
    this.load(this.describe)
  },
  mounted () {

  },
  destroyed () {
//     document.removeEventListener('aerisSearchEvent', this.searchEventListener);
//     this.searchEventListener = null
  },
  data () {
    return {
     stacParameters: [],
     parameters: {page: 1, limit: 8},
     predefined: {
         start: "start",
         end: "end",
         box: "box",
         maxRecords: "limit",
         index: "offset",
         page: "page"
       },
     defaultQuery: {},
     searchUrl: null,
     count: 0
    }
  },
  methods: {
     load(url, index = 0) {
   
       var describe = this.describe
       var describe = 'https://geodes-portal.cnes.fr/api/stac/collections/PEPS_S1_L1'
       describe = 'https://gdm.formater/api/geodes/collections/PEPS_S1_L1'
       this.$http.get(describe)
       .then(
           response => { this.extractDescribeParameters(response.body);},
           response => { 
             if (response.status === 403 || response.status === 401 || response.status === 400) {
               console.log('CAN NOT GET ' + this.describe)
               this.$emit('failed')
               return
             }
             if (index === 0) {
                var tab = describe.split('/')
                var col = tab.pop()
                this.load(this.$store.state.proxyGeodes + '/collections/' + col, 1)
             }
           }
        )
    },
    initParameters () {
      this.parameters = {
        page: 1,
        limit: this.$store.state.size.nbRecord,
        query: this.defaultQuery
      }
    }, 
    getRecords (newroute) {
      this.$store.commit('searchingChange', true)
      this.prepareRequest(newroute)
      this.requestApi()
    },
   prepareRequest(newroute) {
      this.initParameters()
      for (var key in newroute) {

      }
      // this.mapParameters()
    },
    requestApi () {
      if (this.count > 2) {
        return
      }
      console.log(this.searchUrl)
      this.$http.post(
        this.searchUrl,
        this.parameters,
       {headers: {'Content-Type': 'application/json'}}
      ).then(
        resp => {console.log(resp.body)},
        resp => {
          switch (resp.status) {

          }
          if (this.searchUrl !== this.$store.state.proxyGeodes + '/items') {
            this.searchUrl = this.$store.state.proxyGeodes + '/items'
            console.log(this.searchUrl)
            this.requestApi()
          }
        }
      )

    },
    extractDescribeParameters(json) {
      for(var i in json.links) {
        if (json.links[i].rel === 'root') {
          this.searchUrl = json.links[i].href + '/search'
        }
      }
      this.defaultQuery = {
        dataType: {in: [json.id]}
      }
      if (json.summaries) {
        // extraction des éléments de recherche
        for (var key in json.summaries) {
          var tab = key.split(':')
          var obj = {name: key, title: tab.pop()}
          // range 
          if (json.summaries[key].minimum ) {
            obj.min = json.summaries[key].minimum
          }
          if (json.summaries[key].maximum) {
            obj.maximum = json.summaries[key].maximum
          }
          if (Array.isArray(json.summaries[key])) {
            if (json.summaries[key].length <2) {
              continue
            }
          }
          this.stacParameters.push(obj)

        }
      }
      this.$emit('parametersChange', {api: this.api, parameters:this.stacParameters, mapping: this.predefined, fixed: []})
      this.getRecords()
    }
  }
}

</script>

