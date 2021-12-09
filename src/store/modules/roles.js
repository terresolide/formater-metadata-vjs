/**
 * Global Roles
 */
export default {
  namespaced: true,
  state: {
    roles: []
  },
  getters: {
    get: (state) => (name) => {
      return state.roles.find(role => role.name === name)
    },
    getAll (state, getters) {
      return state.roles
    }
  },
  mutations: {
    set (state, roles) {
      state.roles = roles
      
    },
    setStatus (state, obj) {
      var index = state.roles.findIndex(role => role.name === obj.name)
      state.roles[index].status = obj.status
    }
  }
}
