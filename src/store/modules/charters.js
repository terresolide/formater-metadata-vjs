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
    setSigned (state, charters) {
      state.signed = charters
    }
  }
}
