/**
 * 
 */
import Vue from 'vue'
import Vuex from 'vuex'

export default function makeStore( config ) {
  var defaultConfig = {
      geonetwork: "http://localhost/geonetwork/",
      style: 
      {
        primary:"#754a15",
        emphasis: "#dd9946"
      },
      // default temporalExtent
      temporalExtent: 
      {
        min: "1920-12-01",
        max: "now"
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
          "\{searchTerms\}", "\{language\}", "\{eo:parentIdentifier\}",
          "\{(fs|eo):(first|second|creation|modification|processing){0,1}Date(Min|Max){0,1}\}", 
          "\{resto:[a-zA-Z]+\}"],
        // list of predefined parameters (temporalExtent, spatialExtent and page information)
        // its name in application and the corresponding value of parameter in opensearch api
        predefined: {
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
        console.log('commit bounds change')
        state.searchArea = newBounds
      },
      parametersChange(state, newParameters) {
        console.log('PARAMETERS CHANGE', newParameters)
        state.parameters.others = newParameters.parameters
        state.parameters.mapping = newParameters.mapping
      }
    },
    getters: {
    }
  } );
}