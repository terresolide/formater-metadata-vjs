/**
 * 
 */
import Vue from 'vue'
import Vuex from 'vuex'

export default function makeStore( config ) {
  delete config.lang
  var defaultConfig = {
      geonetwork: "http://localhost/geonetwork/",
      style: 
      {
        primary:"#754a15",
        emphasis: "#dd9946"
      },
      temporalExtent: 
      {
        min: "1920-12-01",
        max: "now"
      },
      spatialExtent: [[-60,-120],[75,130]],
      bounds: null,
      parameters: {}
  }
  var finalConfig = Object.assign(defaultConfig, config)
  console.log(defaultConfig)
  console.log(finalConfig.spatialExtent)
  return new Vuex.Store( {
    state: finalConfig,
    mutations: {
      temporalChange(state, newTemporal) {
        state.temporalExtent = newTemporal
      },
      parametersChange(state, newParameters) {
        state.parameters = newParameters
      },
      boundsChange(state, newBounds) {
        state.bounds = newBounds
      }
    },
    getters: {
    }
  } );
}