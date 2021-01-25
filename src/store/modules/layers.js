/**
 * Global Layers on Map
 */

export default {
  namespaced: true,
  state: {
    layers: {}
  },
  getters: {
    isAdded: (state) => (id) => {
      if (state.layers[id]) {
        return true
      } else {
        return false
      }
    },
    all: (state) => { return state.layers}
  },
  mutations: {
    addLayer (state, layerId) {
      state.layers[layerId] = true
    },
    removeLayer (state, layerId) {
      delete state.layers[layerId]
//      var findMeta = state.layers.findIndex
//      delete state.layers[obj.metaId][obj.layerId]
//      if (Object.keys(state.layers[obj.metaId]).length === 0) {
//        delete state.layers[obj.metaId]
//      }
    },
    init (state) {
      state.layers = {}
    }
  }
}
