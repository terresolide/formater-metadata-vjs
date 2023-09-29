/**
 * Global Layers on Map
 */

export default {
  namespaced: true,
  state: {
    signed: [],
  },
  getters: {
    isSigned: (state) => (id) => {
      if (state.signed.indexOf(id) >= 0) {
        return true
      } else {
        return false
      }
    }
  },
  mutations: {
    addSigned (state, charterId) {     
      if (state.signed.indexOf(charterId) < 0) {
        state.signed.push(charterId)
      }
    },
    setSigned (state, charters) {
      state.signed = charters
    }
   
  }
}
