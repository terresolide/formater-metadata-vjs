/**
 * use geonetwork elasticsearch service 

 * 
 */
<i18n>{
  "fr": {
    "SERVICE_UNAVAILABLE": "Le service est indisponible. Veuillez revenir plus tard!"
  },
  "en": {
     "SERVICE_UNAVAILABLE": "The service is unavailable. Please come back later!"
  }
}
</i18n>
<template></template>
<script>


export default {
  name: 'FormaterElasticsearchRequester',
  props: {
    depth: {
      type: Number,
      default:0
    }
  },
  watch: {
    $route (newroute, old) {
      this.getRecords(newroute)
      
    }
  },
  data() {
    return {
      srv: null,
      api: null,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': this.$store.state.lang === 'fr' ? 'fre,eng': 'eng,fre'
      },
      first: true,
      dimensions: [],
      parameters: {},
      changePageListener:null,
      temporalChangedListener: null,
      spatialChangedListener: null,
      dimensionChangedListener: null,
      textChangedListener: null,
      selectChangedListener: null,
      closeMetadataListener: null,
      // listen a global reset event
      resetListener: null,
      facet: [],
      type: 'geonetwork',
      credentials: {}
     }
  },
  created () {
    if (this.$store.state.geonetwork) {
       this.srv = this.$store.state.geonetwork +  'srv/api/search/records/_search?bucket=metadata'
       // this.srv = this.$store.state.geonetwork +  'srv/fre/'
    }
    this.getRecords(this.$route)

  },
  destroyed () {
//     document.removeEventListener('fmt:pageChangedEvent', this.pageChangedListener);

  },
  mounted () {

  },
  methods: {
    initParameters () {
        this.parameters = {
          from: 0,
          size: this.$store.state.size.nbRecord,
          _source: {
            includes: ["uuid", "id", "groupOwner", "cl_status", "cl_hierarchyLevel", "geom", "resourceTitle*", "resourceTemporalExtentDetails", "resourceAbstract*", "th_formater-platform-gn", "overview","link"]
          },
          sort: [{changeDate: "desc"}, {popularity: "desc"}],
          query: {
            bool: {
                filter: [{
                    term: {isTemplate: 'n'}
                },  {
                    terms: {resourceType: ['dataset', 'series']}
                }],
                must_not: {
                    exists: {field: 'parentUuid'}
                }
            }
          }
         }
       
    }, 
    getRecords (event) {
      
//       if (this.$store.state.metadata && this.first) {
//         this.first = false
//         this.searchSimpleMetadata()
//         return
//       }
      this.$store.commit('searchingChange', true)
      // trigger search event like breadcrumb
//       if (event.detail && typeof event.detail.depth == 'number') {
//         var depth = event.detail.depth
//       } else {
//         var depth = this.depth
//       }
//       var e = new CustomEvent("aerisSearchEvent", { detail: {depth: depth}});
//       document.dispatchEvent(e);
     
//       if (e.detail.api) {
//         this.api = e.detail.api
//         delete e.detail.api
//         this.type = 'opensearch'
        
 //     } else {
        this.type = 'geonetwork'
//      }

      this.prepareRequest(event)
      this.requestApi(event)
    },
//     prepareRequest (e) {
//       switch (this.type) {
//       case 'geonetwork':
//         this.prepareRequestGeonetwork(e)
//         break;
//       case 'opensearch':
//         this.prepareRequestOpensearch(e)
//         break
//       }
//     },
    createGeometry (bbox) {
      var split = bbox.split(',')
      var north = split[3]
      var south = split[1]
      var east = split[2]
      var west = split[0]
      var box = 'POLYGON((' + west + '+' + north + ','
        box += east + '+' + north + ',';
        box += east + '+' + south + ',';
        box += west + '+' + south + ',';
        box += west + '+' + north + '))';
      return box;
    },
    prepareRequest(route) {
      
      this.initParameters()
      
      // delete e.detail.lang
//       if (!e.detail.startDefault) {
//         e.detail.renameProperty('start', 'extFrom')
//       } else {
//         delete e.detail.start
//       }
//       if (e.detail.endDefault) {
//         delete e.detail.endDefault
//         delete e.detail.end
        
//       } else {
//         e.detail.renameProperty('end', 'extTo')
//       }
//       delete e.detail.startDefault
//       delete e.detail.endDefault
//       delete e.detail.box

//      // delete e.detail.depth
//       delete e.detail.recordPerPage
     
      if (route.name === 'Metadata') {
       this.parameters.aggregations = this.$store.state.aggregations.step1
       this.parameters.query.bool.filter.push({ term: {parentUuid: route.params.uuid}})
       delete this.parameters.bool.must_not
      } else {
       // this.parameters.isChild = false
       this.parameters.aggregations = this.$store.state.aggregations.step1
      }
//       if (e.detail.depth > 0) {
//         // voir plutôt les key à éliminer centre de données, variable, instruments, gemet, types?
//         for(var key in e.detail) {
//           if (['any', 'geometry', 'extTo', 'extFrom', 'from', 'to', 'parentUuid', 'type'].indexOf(key) >=0){
//             this.parameters[key] = e.detail[key]
//           }
//         }
//       } else {
        // this.prepareFacet(route)
     
        var _this = this

    },
//     prepareRequestOpensearch(e) {
//       this.initParameters()
//        if (e.detail.startDefault) {
//         delete e.detail.start
//       }
//       if (e.detail.endDefault) {
//         delete e.detail.end
//       } 
//       this.mapParameters(e)
//       this.parameters = Object.assign(this.parameters, e.detail)   

//     },
    searchSimpleMetadata() {
      this.$http.get(this.$store.state.metadata).then(
          response => {  
            var data = response.body
            var uuid = data['geonet:info'].uuid
            console.log(data)
            var meta = this.$gn.treatmentMetadata(data, uuid);
            // var feature = self.$gn.extractBbox(data.geoBox, uuid)
            meta.appRoot = true
            var event = new CustomEvent('fmt:metadataEvent', {detail: {meta:meta, depth: 0 } })
            document.dispatchEvent(event)
         }
        )
    },
//     mapParameters(e) {
//       // transform the name of parameter from this application to the opensearch api for the predefined parameter
//       // or test if it is an opensearch parameter
//       // paramaters specific to api opensearch
//       var specificParameters = this.$store.state.parameters.others
//       // parameters mapping with our app parameters
//       var mappingParameters = this.$store.state.parameters.mapping
//       for(var name in e.detail){
        
//         if (typeof mappingParameters[name] !== 'undefined') {
//           e.detail.renameProperty(name, mappingParameters[name])
//         } else  {
//           var isSpecific = specificParameters.find(function (obj) {
//             if (obj.name === name) {
//               return true
//             }
//           })
//           if (!isSpecific) {
//             delete e.detail[name]
//           }
//         } 
//       }
//     },
//     requestApi (depth)  {
//         switch (this.type) {
//         case 'geonetwork':
//           this.requestApiGeonetwork(depth)
//           break;
//         case 'opensearch':
//           this.requestApiOpensearch(depth)
//           break;
//         }
//     },
    requestApi (route) {
      if (!this.srv) {
        return
      }
      // var depth = (typeof this.parameters.depth != 'undefined') ? this.parameters.depth : this.depth
     
     // delete this.parameters.depth
      var headers =  {
          'Accept': 'application/json',
          // 'Accept-Language': this.$store.state.lang === 'fr' ? 'fre': 'eng'
       }
    //   this.parameters = Object.assign(this.parameters, route.query)
    //   this.parameters.renameProperty('start', 'extFrom')
    //   this.parameters.renameProperty('end', 'extTo')

    //   if (this.parameters.box) {
    //       this.parameters.geometry = this.createGeometry(this.parameters.box)
    //       delete this.parameters.box
    //   }

      var self = this
      // parameters according to depth
    //   if (route.name === 'FormaterCatalogue') {
    //  // if (depth === 0) {
    //     // remove all parameters coming from step2 (normally there is not)
    //     this.$store.state.gnParameters.step2.forEach(function (key) {
    //       delete self.parameters[key]
    //     })
    //   }
    //   if (route.name === 'Metadata') {
    //  // if (depth > 0) {
    //     // remove all parameters exlusivy reserve to step1
    //     this.$store.state.gnParameters.step1.forEach(function (key) {
    //       delete self.parameters[key]
    //     })
    //   }
      
    //   ['index', 'maxRecords', 'page'].forEach(function (key) {
    //     delete self.parameters[key]
    //   })
    
    //   if (this.parameters.sortBy === 'title') {
    //     this.parameters.sortOrder = 'ordering'
    //   } else {
    //     delete this.parameters.sortOrder
    //     // this.parameters.sortOrder = 'reverse'
    //   }
    //   if (route.name === 'FormaterCatalogue' && this.$store.state.group && !this.parameters._groupOwner) {
    //     this.parameters._groupOwner = this.$store.state.group.join('+or+')
    //   }
      // this.$router.push({name: 'FormaterCatalogue', query:this.parameters})
      // this.parameters.sortOrder =  this.parameters.sortBy === 'title' ? 'ordering': 'reverse';
      console.log(this.srv)
      var url = this.srv + 'q?' + Object.keys(this.parameters).map(function (prop) {
        return prop + '=' + self.parameters[prop]
      }).join('&');
      this.$http.post(this.srv, this.parameters, {headers: headers}).then(
        response => { 
          console.log(response.body)
          this.treatmentElasticsearch(response.body, 0)
          return
          this.treatmentGeonetwork(response.body, 0);},
        response => { this.treatmentError(response, url); })
    },
//     requestApiOpensearch (depth) {
// 		  if (!this.api) {
// 		    this.$store.commit('searchingChange', false)
// 		    return
// 		  }
//       // var depth = (typeof this.parameters.depth != 'undefined') ? this.parameters.depth : this.depth
//       var self = this
//       var url = this.api + (this.api.indexOf('?') > 0 ? '&' :'?');
//       // register parameters value
//       url += Object.keys(this.parameters).map(function (prop) {
//         return prop + '=' + self.parameters[prop]
//       }).join('&');
//       this.$emit('registerValues', {depth: depth, parameters: this.parameters})
//      // this.$store.commit('addValueToParameters', this.parameters)
//       this.$http.get(url).then(
//           response => {   this.treatmentGeojson(response.body, depth);},
//           response => { this.treatmentError(response, url); })
//     },
    treatmentError (response, url) {
      switch(response.status) {
      case 0:
        this.$store.commit('setError', this.$i18n.t('SERVICE_UNAVAILABLE'))
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
//     treatmentGeojson (data, depth) {
//       var metadatas = {}
//       var self = this
//       var features = []
//       data.features.forEach( function (feature) {
//         feature.properties.id = feature.id
//         metadatas[feature.id] =  self.mapToGeonetwork(feature.properties)
//         features.push({type: feature.type, id: feature.id, geometry: feature.geometry})
       
//       })
//       if (data.features.length === 0) {
//         metadatas = {}
//       }
//       if (data.properties) {
//         var properties = data.properties
//       } else {
//         var properties = data.description
//       }

//       this.fill({ type: 'opensearch', properties: data.properties, features: features, metadata:metadatas}, depth)
//       this.$store.commit('searchingChange', false)
//     },
    treatmentElasticsearch (data, depth) {
       this.treatmentAggregations(data.aggregations)
       var metadatas = {}
       var features = []
       var self = this
       if (data.hits && data.hits.hits) {
         data.hits.hits.forEach( function (meta, index) {
             var uuid = meta._id
             var feature = {
                type: 'Feature',
                id: uuid,
                geometry: meta._source.geom
              }
              if (feature) {
                    features.push(feature)
              }
             metadatas[uuid] = self.$gn.treatmentMetaElasticsearch(meta ,uuid)
             
             
           })
       }
       data.summary = {
        from: this.parameters.from + 1,
        to: this.parameters.from + features.length,
        total: data.hits.total.value,
        dimension: []
       }
       
      data.metadata = metadatas
      data.type = 'geonetwork'
      data.features = {
        type: 'FeatureCollection',
        features: features
      }
      console.log(data.summary.dimension)
      delete data.hits
      delete data.aggregations
      this.fill(data, depth)
      this.$store.commit('searchingChange', false)
    },
   
    // treatmentGeonetwork (data, depth) {
    //   var metadatas = {}
    //   this.treatmentDimension(data.summary.dimension)
    //   var features = []
    //   var self = this
    //   if (!data.metadata){
    //     var metadatas = null
    //   } else if (data.metadata && !data.metadata.forEach) {
    //     var uuid = data.metadata['geonet:info'].uuid
    //     metadatas[uuid] = self.$gn.treatmentMetadata(data.metadata ,uuid)
    //     var feature = self.$gn.extractBbox(data.metadata.geoBox, uuid)
    //     if (feature) {
    //         features.push(feature)
    //     }
    //   } else {
    //        data.metadata.forEach( function (meta, index) {
    //          var uuid = meta['geonet:info'].uuid
    //          metadatas[uuid] = self.$gn.treatmentMetadata(meta ,uuid)
    //           var feature = self.$gn.extractBbox(meta.geoBox, uuid)
    //           if (feature) {
    //                 features.push(feature)
    //           }
    //        })
    //   }
    //   data.metadata = metadatas
    //   data.type = 'geonetwork'
    //   data.features = features
    //   this.fill(data, depth)
    //   this.$store.commit('searchingChange', false)
    //   this.searchGnStep2Parameters(data.summary.dimension)
    //   // this.searchRelated()
    // },
    treatmentAggregations (aggs) {
      var aggregations = []
      var promises = []
      var aggregations = []
      for(var key in aggs) {
        aggs[key].key = key
        aggregations.push(aggs[key]) 
       
      }
  
      aggregations.sort((a,b) => a.meta.sort - b.meta.sort)
      console.log(aggregations)
      for(var i in aggregations) {
        promises.push(this.prepareAggregations(aggregations[i]))
      }
      Promise.all(promises)
      .then((values) => {
        console.log(values)
        var data = { dimension: values}
        data.depth = this.depth
        console.log(data)
        var event = new CustomEvent('fmt:dimensionEvent', {detail:  data})
        document.dispatchEvent(event)
      })

    
    },
    translate(thesaurus, uris) {
      var self = this
      return new Promise(function (resolve, reject) {
        var id = uris.join(',')
        var lang = self.$store.state.lang === 'fr' ? 'fre' : 'eng'
        var url = self.$store.state.geonetwork + 'srv/api/registries/vocabularies/keyword?id=' + encodeURIComponent(id) + '&thesaurus=' + thesaurus + '&lang=' + lang
        self.$http.get(url, {headers: {'accept': 'application/json'}})
        .then(resp => {
          resolve(resp.body)
        })
      })
      
    },
    prepareAggregations(agg) {
      var self = this
      return new Promise(function (resolve, reject) {
        var label = agg.key
        var lang = self.$store.state.lang
        if (agg.meta && agg.meta.label) {
          label = agg.meta.label[lang] ? agg.meta.label[lang] : agg.meta.label
        }
       
        var aggregation = {
          '@name': agg.key,
          label: label,
          meta: agg.meta,
          category: []
        }
        console.log(aggregation)
        var dimension = agg.meta && agg.meta.type && agg.meta.type === 'dimension'
      
        var buckets = agg.buckets
        var gnGroups = self.$gn.groups
        var lang = self.$store.state.lang
        var toTranslate = []
        var thesaurus = agg.meta.thesaurus || null
      
        buckets.forEach(function (item, index) {


          // buckets[index].keys = keys
          buckets[index]['@value'] = item.key
          if (dimension) {
            if (agg.key === 'groupOwner') {
              var label = gnGroups[item.key].label[lang]
              console.log(label)
            } else {
              var label = item.key
            }
            aggregation.category.push({
              '@name': label,
              '@label': label,
              '@value': item.key,
              '@count': item.doc_count
            })
          } else {
            var keys = item.key.split('^')
            var uri = keys.pop()
            toTranslate.push(uri)
            buckets[index].parent = keys.join('^')
            buckets[index].length = keys.length
            buckets[index]['@name'] = item.key
            buckets[index]['@label'] = item.key
            buckets[index]['@value'] = uri
            buckets[index]['@count'] = item.doc_count
            delete item.doc_count
          }
          
        })
        // translate

        if (dimension) {
          resolve(aggregation)
          return
        }
        self.translate(thesaurus, toTranslate)
        .then(translated => {
          console.log(translated)
          buckets.forEach(function (item, index) {
            if (translated[item['@value']]) {
              buckets[index]['@label'] = translated[item['@value']]
            }
          })
          console.log(buckets)
          const arrayToTree = (arr, parent = '') =>
          arr.filter(item => item.parent === parent)
          .map(child => { 
            var category = arrayToTree(arr, child.key)
            if (category.length > 0) {
              child.category = category
            }
            return child
          });
          var category = arrayToTree(buckets)

          aggregation.category = category
          console.log(category)
          resolve(aggregation)
        })
        
      })
    },
    // remove groupOwner if only one group choose in app parameters
    // treatmentDimension (dimensions) {
    //   if (this.$store.state.group.length === 1) {
    //     if (!dimensions) {
    //       dimensions = []
    //     } else if (!Array.isArray(dimensions)) {
    //       dimensions = [dimensions]
    //     }
    //     var find = dimensions.findIndex(function (dimension) {
    //       return dimension['@name'] === 'groupOwner'
    //     })
    //     if (find >= 0) {
    //       dimensions.splice(find, 1)
    //     }
    //   }
    // },
    // searchGnStep2Parameters (dimension) {
    //   if (this.first) {
    //     // register dimension in store
    //     if (this.depth === 0) {
    //       this.$store.commit('gnParametersChange', {step:1, dimension: dimension})
    //     }
    //     // this.$store.commit('gnParametersChange', {step:2, dimension:[]})
    //     // search summary for all record (including child dataset) for step 2
    //     if (this.$store.state.summaryType.step1 !== this.$store.state.summaryType.step2) {
          
    //       // var depth = (typeof this.parameters.depth != 'undefined') ? this.parameters.depth : this.depth
    //       var headers =  {
    //           'Accept': 'application/json, text/plain, */*',
    //           'Accept-Language': this.$store.state.lang === 'fr' ? 'fre': 'eng'
    //        }
    //       var parameters = {
    //           _content_type: 'json',
    //           from:1,
    //           to: 9,
    //           type: 'dataset+or+series+or+publications',
    //           resultType: this.$store.state.summaryType.step2
    //       }
    //       var url = this.srv + 'q?' + Object.keys(parameters).map(function (prop) {
    //         return prop + '=' + parameters[prop]
    //       }).join('&');
    //       this.$http.get(url, {headers: headers}).then(
    //         response => {  this.addGnParameters(response.body);}
    //       )
    //       this.first = false
    //     }
    //   }
    // },
    // addGnParameters(data) {
    //   this.$store.commit('gnParametersChange', {step:2, dimension:data.summary.dimension})
    // },
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
      console.log(properties)
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
       // properties.legalConstraints = [properties.license.licenseId]
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
      console.log(data)
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
