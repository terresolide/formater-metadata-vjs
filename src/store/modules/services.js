/**
 * Services
 */

module.exports = {
  namespaced: true,
  state: {
    services: []
  },
  getters: {
   
  },
  mutations: {
    add (state, api) {
      state.services.push(api)
    }
  }
}
