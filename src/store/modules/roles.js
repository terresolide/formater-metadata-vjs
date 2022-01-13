/**
 * Global Roles
 */
export default {
  namespaced: true,
  state: {
    clients: []
  },
  getters: {
    get: (state) => (client, name) => {
      return state.clients[client].find(role => role.name === name)
    },
    getClient: (state) => (clientName) => {
      if (state.clients[clientName]) {
        return state.clients[clientName]
      } else {
        return null
      }
    },
    getClients (state, getters) {
      return state.clients
    },
    hasAccess: (state) => (clientName) => {
      if (!state.clients[clientName]) {
        return false
      }
      var client = state.clients[clientName]
      var canAccess = false
      client.roles.forEach(function (role) {
        if (role.access) {
          canAccess = true
        }
      })
      return canAccess
    }
  },
  mutations: {
    set (state, clients) {
      for(name in clients) {
        var first = false
        clients[name].roles.forEach(function (role, index) {
          if (!first && role.parameters.display) {
            role.first = true
            first =false
          }
        })
      }
      state.clients = clients
    },
    setToken (state, obj) {
      console.log(obj)
      if (state.clients[obj.client]) {
        state.clients[obj.client].token = obj.token
      }
    },
    setStatus (state, obj) {
      var index = state.clients[obj.client].roles.findIndex(role => role.name === obj.name)
      state.clients[obj.client].roles[index].status = obj.status
    }
  }
}
