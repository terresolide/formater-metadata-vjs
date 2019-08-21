/**
 * 
 */
import Vue from 'vue'
import Vuex from 'vuex'

export default function makeStore( config ) {
  delete config.lang
  var defaultConfig = {
      srv: "http://localhost/geonetwork/",
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
      bounds: [[-90,-180],[90,180]]
  }
  defaultConfig = Object.assign(defaultConfig, config)
  
  return new Vuex.Store( {
    state: config,
    mutations: {
      temporalChange(state, newTemporal) {
        state.temporalExtent = newTemporal
      }
    }
  } );
}