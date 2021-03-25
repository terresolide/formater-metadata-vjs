/**
 * Global DataCenters
 */

export default {
  namespaced: true,
  state: {
    centers: {}
  },
  getters: {
    byId: (state) => (id) => {
      if (state.centers[id]) {
        return state.centers[id]
      } else {
        return false
      }
    },
    all: (state) => { return state.centers}
  },
  mutations: {
    init (state, centers) {
      state.centers = centers
    }
  }
}
