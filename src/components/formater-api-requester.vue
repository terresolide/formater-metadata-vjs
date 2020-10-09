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
    depth: {
      type: Number,
      default: 1
    }
  },
  watch: {
    $route (newroute, old) {
      console.log(newroute)
      this.getRecords(newroute)
      
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
    
    console.log('CREATE API REQUESTER')
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
    }, 
    getRecords (newroute) {
      
         console.log('GET RECORDS')
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
        this.parameters[mappingParameters['index']] = this.parameters.from
        if (this.parameters.to) {
          this.parameters[mappingParameters['maxRecords']] = this.parameters.to - this.parameters.from + 1
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
      // register parameters value
       url += Object.keys(this.parameters).map(function (prop) {
        return prop + '=' + self.parameters[prop]
      }).join('&');
      this.$emit('registerValues', {depth: depth, parameters: this.parameters})
     // this.$store.commit('addValueToParameters', this.parameters)
      this.$http.get(url).then(
          response => {   this.treatmentGeojson(response.body, depth);},
          response => { this.treatmentError(response, url); })
    },
    treatmentError (response, url) {
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

      this.fill({ type: 'opensearch', properties: data.properties, features: features, metadata:metadatas}, depth)
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
        properties.legalConstraints = [properties.license.licenseId]
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
          if (properties.links[i].type === 'application/json' && !properties.exportLinks.json) {
            properties.exportLinks.json = properties.links[i].href
            properties.links.splice(i,1)
          }
          if (properties.links[i].type === 'application/xml' && !properties.exportLinks.xml) {
            properties.exportLinks.xml = properties.links[i].href
            properties.links.splice(i,1)
          }
        }
        delete properties.links
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
      console.log('DISPATHC mt:metadataListEvent')
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
