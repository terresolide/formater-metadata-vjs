/**
 * use geonetwork q-search service 
 * @see https://geonetwork-opensource.org/manuals/trunk/eng/users/api/q-search.html
 * 
 * use opensearch api with extension geo, time, and eo
 * @see http://www.opensearch.org/Home
 * 
 */
 
<template></template>
<script>

export default {
  name: 'FormaterApiRequester',
  props: {
    api: {
      type: String,
      default: null
    },
    cds: {
      type: String,
      default: null
    },
    depth: {
      type: Number,
      default: 1
    }
  },
  watch: {
    $route (newroute, old) {
      this.getRecords(newroute)
    }
  },
  computed: {
    isFlatsim () {
      return this.api.indexOf('flatsim') > 0
    }
  },
  data() {
    return {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': this.$store.state.lang === 'fr' ? 'fre,eng': 'eng,fre'
      },
      first: true,
      dimensions: [],
      parameters: {},
//       changePageListener:null,
//       temporalChangedListener: null,
//       spatialChangedListener: null,
//       dimensionChangedListener: null,
//       textChangedListener: null,
//       selectChangedListener: null,
      closeMetadataListener: null,
      // listen a global reset event
      resetListener: null,
      facet: [],
      type: 'opensearch',
      credentials: {}
     }
  },
  created () {
    this.getRecords(this.$route)
  },
  destroyed () {
 },
  mounted () {
//     this.facet.facetFormaterFre = []
//     this.facet.facetFormaterFre.push('https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fsolid_earth/https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fgeothermal/https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fgeothermal-geothermal_temperature')
//     this.facet.facetFormaterFre.push( 'https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fsolid_earth/https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fnon_solid/https%3A%2F%2Fw3id.org%2Fformater%2Fvariable%2Fnon_solid-hydrogen_gas')  
    // url="http://demo.formater/geonetwork/srv/fre/qi?_content_type=json&bucket=2365825987452666&fast=index&from=1&to=41"
  },
  methods: {
    initParameters () {
      this.parameters = {
        index: 1,
        maxRecords: this.$store.state.size.nbRecord
      }
      if (this.$store.state.group) {
         console.log('group')
      }
    }, 
    getRecords (newroute) {
      this.$store.commit('searchingChange', true)
      this.prepareRequest(newroute)
      this.requestApi(event)
    },
   prepareRequest(newroute) {
      this.initParameters()
      this.parameters = Object.assign(this.parameters, newroute.query)
      this.mapParameters()
    },
    mapParameters() {
      // transform the name of parameter from this application to the opensearch api for the predefined parameter
      // or test if it is an opensearch parameter
      // paramaters specific to api opensearch
      var specificParameters = this.$store.state.parameters.others
      // parameters mapping with our app parameters
      var mappingParameters = this.$store.state.parameters.mapping
      // change 
      this.parameters.renameProperty('bbox', mappingParameters['box'])
      if (this.parameters.from) {
        this.parameters['index'] = this.parameters.from
        if (this.parameters.to) {
          this.parameters['maxRecords'] = parseInt(this.parameters.to) - parseInt(this.parameters.from) + 1
        }
      }
      for(var name in this.parameters){
        if (typeof mappingParameters[name] !== 'undefined') {
          this.parameters.renameProperty(name, mappingParameters[name])
        } else  {
          var isSpecific = specificParameters.find(function (obj) {
            if (obj.name === name) {
              return true
            }
          })
          if (!isSpecific) {
            delete this.parameters[name]
          }
        } 
      }
    },
    requestApi (depth) {
		  if (!this.api) {
		    this.$store.commit('searchingChange', false)
		    return
		  }
      // var depth = (typeof this.parameters.depth != 'undefined') ? this.parameters.depth : this.depth
      var self = this
      var url = this.api + (this.api.indexOf('?') > 0 ? '&' :'?');
      var parameters = Object.assign({}, this.parameters)
      parameters = Object.assign(parameters, this.$store.state.parameters.fixed)
      // register parameters value
       url += Object.keys(parameters).map(function (prop) {
        return prop + '=' + parameters[prop]
      }).join('&');
      this.$emit('registerValues', {depth: depth, parameters: this.parameters})
     // this.$store.commit('addValueToParameters', this.parameters)
    
     this.$http.get(url).then(
          response => {   this.treatmentGeojson(response.body, depth);},
          response => { this.treatmentError(response, url, depth); })
    },
    treatmentError (response, url, depth) {
      
      if (response && this.$store.state.env === 'development' && this.$store.state.proxy.url) {
        var url = this.$store.state.proxy.url + '?url=' + encodeURIComponent(url)
        this.$http.get(url)
        .then(
            response => { this.treatmentGeojson(response.body, depth);},
            response => { this.treatmentError(null, url, depth);}
         )
         return
      }
      switch(response.status) {
      case 0:
        this.$store.commit('setError', 'Maybe CORS ERROR, try with proxy')
        break;
      case 403:
        this.$store.commit('setError', 'SERVER RESPONSE FOR ' + url + ' : ACCESS DENIED')
        break;
      case 404:
        this.$store.commit('setError', 'SERVER RESPONSE FOR ' + url + ' : PAGE NOT FOUND')
        break;
      default:
        this.$store.commit('setError', 'UNKNOWN ERROR FOR ' + url)
      }
      this.$store.commit('searchingChange', false)
    },
    treatmentGeojson (data, depth) {
      var metadatas = {}
      var self = this
      var features = []
      data.features.forEach( function (feature) {
        if (!feature.id) {
          feature.id = feature.properties.productIdentifier
        }
        feature.properties.id = feature.id
        metadatas[feature.id] =  self.mapToGeonetwork(feature.properties)
        features.push({type: feature.type, id: feature.id, geometry: feature.geometry})
       
      })
      if (data.features.length === 0) {
        metadatas = {}
      }
      if (data.properties) {
        var properties = data.properties
      } else {
        var properties = data.description
      }
      if (properties.startIndex) {
        properties.startIndex = parseInt(properties.startIndex)
      }
      if (properties.totalResults) {
        properties.totalResults = parseInt(properties.totalResults)
      }
      if (properties.itemsPerPage) {
        properties.itemsPerPage = parseInt(properties.itemsPerPage)
      }
      this.fill({ type: 'opensearch', properties: properties, features: features, metadata:metadatas}, depth)
      this.$store.commit('searchingChange', false)
    },
   
    // remove groupOwner if only one group choose in app parameters
//     treatmentDimension (dimensions) {
//       if (this.$store.state.group.length === 1) {
//         if (!dimensions) {
//           dimensions = []
//         } else if (!Array.isArray(dimensions)) {
//           dimensions = [dimensions]
//         }
//         var find = dimensions.findIndex(function (dimension) {
//           return dimension['@name'] === 'groupOwner'
//         })
//         if (find >= 0) {
//           dimensions.splice(find, 1)
//         }
//       }
//     },
//     searchGnStep2Parameters (dimension) {
//       if (this.first) {
//         // register dimension in store
//         if (this.depth === 0) {
//           this.$store.commit('gnParametersChange', {step:1, dimension: dimension})
//         }
//         // this.$store.commit('gnParametersChange', {step:2, dimension:[]})
//         // search summary for all record (including child dataset) for step 2
//         if (this.$store.state.summaryType.step1 !== this.$store.state.summaryType.step2) {
          
//           // var depth = (typeof this.parameters.depth != 'undefined') ? this.parameters.depth : this.depth
//           var headers =  {
//               'Accept': 'application/json, text/plain, */*',
//               'Accept-Language': this.$i18n.locale === 'fr' ? 'fre': 'eng'
//            }
//           var parameters = {
//               _content_type: 'json',
//               from:1,
//               to: 9,
//               type: 'dataset+or+series+or+publications',
//               resultType: this.$store.state.summaryType.step2
//           }
//           var url = this.srv + 'q?' + Object.keys(parameters).map(function (prop) {
//             return prop + '=' + parameters[prop]
//           }).join('&');
//           this.$http.get(url, {headers: headers}).then(
//             response => {  this.addGnParameters(response.body);}
//           )
//           this.first = false
//         }
//       }
//     },
//     addGnParameters(data) {
//       this.$store.commit('gnParametersChange', {step:2, dimension:data.summary.dimension})
//     },
//     updateGeonetworkContacts (data) {
//       data.responsibleParty.forEach( function (contact)  {
//           var fields = contact.split('|');
//           if (fields[1] === 'metadata' || fields[1] === 'metadonnées') {
//            if (_this.contacts.metadata[fields[0]]){
//              _this.contacts.metadata[fields[0]].push(fields)
//            } else {
//              _this.contacts.metadata[fields[0]] = [fields]
//            }
//           }else{
//             if (_this.contacts.resource[fields[0]]){
//                _this.contacts.resource[fields[0]].push(fields)
//             } else {
//                _this.contacts.resource[fields[0]] = [fields]
//             }
//           }
                
//       })
//     },
    mapToGeonetwork (properties) {
      var properties = Object.assign({}, properties)
      properties.fromOs = true
      properties.cds = this.cds
      // case Terradue
      if (properties.date) {
        var dates = properties.date.split('/')
        if (dates.length > 1) {
          properties.tempExtentBegin = dates[0]
          properties.tempExtentEnd = dates[1]
        }
      }
     
      // case Flatsim
      if (properties.productIdentifier) {
        properties.renameProperty('productIdentifier', 'identifier')
      }
      if (properties.startDate) {
        properties.renameProperty('startDate', 'tempExtentBegin')
      }
      if (properties.completionDate) {
        properties.renameProperty('completionDate', 'tempExtentEnd')
      }
      if (properties.updated) {
        properties.renameProperty('updated', 'revisionDate')
      }
      if (properties.published) {
        properties.renameProperty('published', 'publicationDate')
      }
      if (properties.produced) {
        properties.renameProperty('produced', 'creationDate')
      }
      if (!properties.type) {
        properties.type = 'dataset'
      }
      if (properties.quicklook) {
        properties.images = [['', properties.quicklook, '']]
        delete properties.quicklook
      }
      if (properties.license) {
        // @todo a effacer
        if (properties.license.licenseId === 'unlicensed' && this.isFlatsim) {
          properties.legalConstraints = ['license: https://creativecommons.org/licenses/by-nc/4.0/']
        } else {
          properties.legalConstraints = [properties.license.licenseId]
        }
        delete properties.license
      }
      properties.osParameters = []
      properties.mapping = []
      if (properties.services) {
        // @todo cas très très particulier de flatsim
        if(properties.services.browse && properties.services.browse.layers) {
          properties.layers = []
          properties.services.browse.layers.forEach(function (flatsimLayer, index) {
            var type =  flatsimLayer.type
            var layer = {
                id: properties.id + '_' + index,
                name: flatsimLayer.name,
                description:  flatsimLayer.name,
                href: flatsimLayer.url,
                type: flatsimLayer.type,
                checked: false
            }
            properties.layers.push(layer)
          })
        }
        if(properties.services.download && properties.services.download.url) {
          if (!properties.download) {
            properties.download = []
          }
          properties.download.push(properties.services.download)
          
        }
        delete properties.services
      }
      if( !properties.exportLinks) {
        properties.exportLinks = {}
      }
      // @todo Flatsim cas particulier des LIENS D'EXPORT qui se trouve dans link
      if (properties.links) {
        var i = properties.links.length
        while (i--) {
          // case terradue
          if (properties.links[i]['@title'] === 'Download') {          
            if (!properties.download) {
              properties.download = []
            }
            properties.download.push({
              url: properties.links[i]['@href'],
              mimeType: properties.links[i]['@type']
            })
            properties.links.splice(i, 1)
            continue
          }
          if (properties.links[i]['@title'] === 'Browse') {
            properties.images = [['Browse', properties.links[i]['@href'], '']]
            properties.thumbnail = properties.links[i]['@href']
            properties.links.splice(i, 1)
            continue
          }
          if (properties.links[i].rel === 'via') {
            properties.links.splice(i, 1)
            continue
          }
          if (properties.links[i]['@type'] === 'application/json' && !properties.exportLinks.json) {
            properties.exportLinks.json = properties.links[i]['@href']
            properties.links.splice(i,1)
            continue
          }
          if (properties.links[i]['@type'] === 'application/xml' && !properties.exportLinks.xml) {
            properties.exportLinks.xml = properties.links[i]['@href']
            properties.links.splice(i,1)
            continue
          }
          if (properties.links[i].type === 'application/json' && !properties.exportLinks.json) {
            properties.exportLinks.json = properties.links[i].href
            properties.links.splice(i,1)
            continue
          }
          if (properties.links[i].type === 'application/xml' && !properties.exportLinks.xml) {
            properties.exportLinks.xml = properties.links[i].href
            properties.links.splice(i,1)
            continue
          }
        }
        if (properties.links.length === 0) {
          delete properties.links
        }
        // 
      }

      if (!properties.contacts) {
        properties.contacts = {metadata: {}, resource: {}}
        if (properties.organisationName) {
          if (typeof properties.organisationName === 'string') {
            var responsible = new Array(10)
            responsible[0] = 'Point of contact'
            responsible[2] = properties.organisationName
            properties.contacts.metadata['Point of contact'] = [responsible]
            delete properties.organisationName
          }
        }
      }
     /* if (properties.keywords) {
        properties.keywordGroup = {}
        properties.keywords.forEach(function (keyword) {
          if (!properties.keywordGroup[keyword.type]) {
            properties.keywordGroup[keyword.type] = [{value: keyword.name}]
          } else {
            properties.keywordGroup[keyword.type].push({value: keyword.name})
          }
        })
        delete properties.keywords
      }*/
      if (properties.keywords) {
        properties.keyword = []
        properties.keywords.forEach(function (keyword) {
          properties.keyword.push(keyword.name)
        })
        delete properties.keywords
      }
      if (!properties.keyword) {
        properties.keyword = []
      }
      return properties
    },
    // @todo DEPLACER DANS FORM VOIR MÊME DANS formater-dimension-block/ formater-facet-block!!
//     prepareFacet (e) {
//       var facet = ''
     
//       for(var key in e.detail.facet) {
//         if (e.detail.facet[key].length > 0) {
//           if (facet === '') {
//             facet = key +'/' + e.detail.facet[key]
//           } else {
//             facet += '&' + key + '/' + e.detail.facet[key]
//           }
//         }
//       }
//       if (facet !== '') {
//        e.detail['facet.q'] = encodeURIComponent(facet)
//        delete e.detail.facet
//       }
//       return e;
//     },
    fill (data, depth) {
      data.depth = this.depth
      var event = new CustomEvent('fmt:metadataListEvent', {detail:  data})
      document.dispatchEvent(event)
    },
//     handleReset () {
//       var event = new CustomEvent('aerisResetEvent', {detail: {}})
//       document.dispatchEvent(event)
//       this.getRecords({detail: {depth:event.detail.depth}})
//     },
//     changePage (event) {
//       this.getRecords(event)
//     },
//     changeSearch (event) {
//       this.parameters.any = event.target.value
//       this.getRecords()
//     }
  }
}
</script>
