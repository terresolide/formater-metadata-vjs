/**
 * 
 */
import Vue from 'vue'
import Vuex from 'vuex'

export default function makeStore( config ) {
  var defaultConfig = {
      currentUuid: null,
      geonetwork: null,
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
      // default temporalExtent
      temporalExtent: 
      {
        min: "1920-12-01",
        max: "now"
      },
      disable: {
        temporal: false,
        spatial: false,
        searchTerm: false
      },
      // default map bounds
      spatialExtent: [[-60,-120],[75,130]],
      // search area 
      // when a record is selected searchArea is its bbox
      searchArea: null,
      // current opensearch api parameters
      parameters: {
        // regex of parameter (value attribute) which are exclued to use in request
        excluedRegex: ["\{geo:(uid|geometry|name|lon|lat|radius)\}",
          "\{language\}", "\{eo:parentIdentifier\}",
          "\{(fs|eo):(first|second|creation|modification|processing){0,1}Date(Min|Max){0,1}\}", 
          "\{resto:[a-zA-Z]+\}"],
        // list of predefined parameters (temporalExtent, spatialExtent and page information)
        // its name in application and the corresponding value of parameter in opensearch api
        predefined: {
          any: "{searchTerms}",
          start: "{time:start}",
          end: "{time:end}",
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
        // { name, title, pattern, min, max, options}
        others: []
      }
  }
  var finalConfig = Object.assign(defaultConfig, config)
  return new Vuex.Store( {
    state: finalConfig,
    mutations: {
      temporalChange(state, newTemporal) {
        state.temporalExtent = newTemporal
      },
      parametersChange(state, newParameters) {
        state.parameters = newParameters
      },
      searchAreaChange(state, newBounds) {
        state.searchArea = newBounds
      },
      parametersChange(state, newParameters) {
        state.parameters.others = newParameters.parameters
        state.parameters.mapping = newParameters.mapping
        switch(newParameters.type) {
        case 'noChild':
          state.disable = {temporal: true, spatial: true, searchTerm: true}
          break;
        case 'opensearch':
          // according to mapping element
          var disable = {temporal: true, spatial: true, searchTerm: true}
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
          state.disable = {temporal: false, spatial: false, searchTerm: false}
        }
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
      }
    },
    getters: {
    }
  } );
}