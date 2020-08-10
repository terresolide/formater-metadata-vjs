/**
 * 
 */
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
// import basket from './modules/basket'
import services from './modules/services'

export default function makeStore( config ) {
  if (config.proxyUrl) {
    var proxy = {
        url: config.proxyUrl,
        regex: 'data\.shom'
    }
    delete config.proxyUrl
  } else if (config.geonetwork){
    var proxy = {
          url: config.geonetwork + 'proxy',
          regex: 'data\.shom'
    }
  } else {
    var proxy = {url: null, regex: ''}
  }
//  var isSameStep = true
//  if (config.summaryType) {
//  	if (config.summaryType.step1 !== config.summaryType.step2) {
//  		isSameStep = false
//  	}
//  }
  
  var defaultConfig = {
      lang: 'en',
      currentUuid: null,
      geonetwork: null,
      metadata: null,
      summaryType:{
        step1: 'details',
        step2: 'details'
      },
      group: [],
     // isSameStep: isSameStep,
      apiVersion: '0.1',
      style: 
      {
        primary:"#754a15",
        emphasis: "#dd9946",
        link: "#754a15",
        over: "#8c0209"
      },
      size: {
        capsuleWidth: 300,
        recordByLine: 4,
        nbLine: 4,
        nbRecord: 16
      },
      facets: [],
      // default temporalExtent
      temporalExtent: 
      {
        min: "1920-12-01",
        max: "now"
      },
      proxy: proxy,
      // default order
      orderBy: 'changeDate',
      disable: {
        temporal: false,
        spatial: false,
        searchTerm: false
      },
      osFields: {
        cartouche: {
          identifier: ['productType'],
          quality: ['resolution'],
          acquisition:  [ 'platform', 'instrument', 'sensorMode', 'polarisation',  'relativeOrbitNumber', 'orbitDirection', 'subswath'],
          process:  ['processingLevel', 'processingMode',  'correction', 'version']
        },
        metadata: {
          identifier: ['productIdentifier', 'parentIdentifier', 'productType'],
          quality: [ 'resolution', 'nbCols', 'nbRows', 'waterCover', 'snowCover', 'cloudCover'],
          acquisition: [ 'platform', 'instrument','sensorMode', 'polarisation', 
            'orbitNumber', 'relativeOrbitNumber', 'orbitDirection', 'subswath'],
          process: ['processingLevel', 'processingMode', 'processingContext', 'correction', 'version']
        }
      },
      // default date & constraint list
      dateList: ['createDate', 'publicationDate', 'revisionDate'],
      constraintList: ['legalConstraints', 'securityConstraints', 'resourceConstraints'],
      // default map bounds  [latS, lngW], [latN, lngE]
      spatialExtent: [[-60,-120],[75,130]],
      // search area 
      // when a record is selected searchArea is its bbox
      searchArea: null,
      // the bounding box of research
      selectArea: null,
      gnParameters: {
        step1step2: [],
        step1: [],
        step2: [],
        // @toDelete ? pas utilisé pour le moment
        defaut: ['any', 'geometry', 'extTo', 'extFrom', 'from', 'to', 'resultType', '_content_type', 'bucket', 'fast']
      },
      // current opensearch api parameters
      parameters: {
        // regex of parameter (value attribute) which are exclued to use in request
        excluedRegex: ["\{geo:(uid|geometry|name|lon|lat|radius)\}", "\{eo:parentIdentifier\}",
          "\{(fs|eo):(first|second|creation|modification|processing){0,1}Date(Min|Max){0,1}\}", 
          "\{resto:[a-zA-Z]+\}"],
        // list of predefined parameters (temporalExtent, spatialExtent and page information)
        // its name in application and the corresponding value of parameter in opensearch api
        predefined: {
          any: "{searchTerms}",
          start: "{time:start}",
          end: "{time:end}",
          lang: "{language}",
          box: "{geo:box}",
          maxRecords: "{count}",
          index: "{startIndex}",
          page: "{startPage}"
        },
        // FOR THE CURRENT API opensearch: 2 arrays (empty by default)
        // associative array of: parameter name in this application => name in the opensearch api
        // for the predefined parameters like box, temporalExtent, and paging (common for all api)
        mapping:[],
        // list of others specific opensearch api parameters 
        // add in formater-parameters-form
        others: []
      },
      searching: false,
      error: null,
      selectedMetadata: null
  }
  var finalConfig = Object.assign(defaultConfig, config)
  return new Vuex.Store( {
    state: finalConfig,
    mutations: {
      setDefaultSpatialExtent(state, spatialExtent) {
        state.spatialExtent = spatialExtent
      },
      temporalChange(state, newTemporal) {
        state.temporalExtent = newTemporal
      },
     /* parametersChange(state, newParameters) {
        state.parameters = newParameters
      },*/
      searchAreaChange(state, newBounds) {
        state.searchArea = newBounds
      },
      selectAreaChange(state, bbox) {
        console.log('selectAreaChange')
        state.selectArea = bbox
      },
      gnParametersChange(state, obj) {
        if (!obj.dimension) {
          obj.dimension = []
        }
        if (!Array.isArray(obj.dimension)) {
          obj.dimension = [obj.dimension]
        }

        if (obj.step === 1) {
          var key = 'step1'
          if (state.summaryType.step1 === state.summaryType.step2) {
            var key = 'step1step2'
          } 
          if (obj.dimension) {
            obj.dimension.forEach(function (dim) {
              state.gnParameters[key].push(dim['@name'])
            })
          }
        }
        if (obj.step === 2) {
          if (state.summaryType.step1 !== state.summaryType.step2) {
            if (obj.dimension)
            obj.dimension.forEach(function (dim) {
              // search in step1
              var found = state.gnParameters.step1.indexOf( dim['@name'])
              if (found >= 0) {
                // in step1step2
                state.gnParameters.step1step2.push(dim['@name'])
                state.gnParameters.step1.splice(found, 1)
              } else {
                state.gnParameters.step2.push(dim['@name'])
              }
            })
          } else {
            // all step1step2
            state.gnParameters.step1step2 = state.gnParameters.step1
            state.gnParameters.step1 = []
          }
        }
        state.gnParameters.defaut = state.gnParameters.defaut.concat(state.gnParameters.step1step2)
      },
      parametersChange(state, newParameters) {
        state.parameters.others = newParameters.parameters
        state.parameters.mapping = newParameters.mapping
        switch(newParameters.type) {
        case 'noChild':
          state.disable = {temporal: true, spatial: true, searchTerm: true, other: true}
          break;
        case 'opensearch':
          // according to mapping element
          var disable = {temporal: true, spatial: true, searchTerm: true, other: false}
          if (state.parameters.mapping['any']) {
            disable.searchTerm = false
          }
          if (state.parameters.mapping['start'] && state.parameters.mapping['end']) {
            disable.temporal = false
          }
          if (state.parameters.mapping['box']) {
            disable.spatial = false
          }
          state.disable = disable
          break;
        case 'geonetwork':
        default:
          state.disable = {temporal: false, spatial: false, searchTerm: false, other: false}
        }
      },
      addValueToParameters (state, obj) {
        // @todo useless ? 
        state.parameters.others.forEach(function (parameter) {
          if (obj[parameter.name]) {
            parameter.value = obj[parameter.name]
          }
        })
      },
      sizeChange(state) {
        var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        width -= 350
        var count = parseInt(width/334)
        state.size.capsuleWidth = parseInt(width / count - 16)
        state.size.recordByLine = count
        state.size.nbRecord = count * state.size.nbLine
      },
      currentUuidChange(state, id) {
        state.currentUuid = id
      },
      searchingChange (state, value) {
        state.searching = value
      },
      setError (state, msg) {
        state.error = msg
      },
      removeError (state) {
        state.error = null
      },
      selectMetadata (state, metadata) {
    	state.selectedMetadata = metadata
      },
      resetSelectedMetadata (state) {
    	state.selectedMetadata = null
      }
    },
    getters: {
    },
    modules: {
      user: user,
      services: services
    }
  });
}