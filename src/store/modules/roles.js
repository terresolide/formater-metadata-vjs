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
    hasAccess: (state) => (clientName, currentIdentifier) => {
      if (!state.clients[clientName]) {
        return {view: true, download:true}
      }
      var client = state.clients[clientName]
      var response = {
          view: false,
          download: false
      }
      // var canAccess = false
      client.roles.forEach(function (role) {
        console.log(role)
        if (role.access) {
          if (role.parameters.hasOwnProperty('view')) {
            if (role.parameters.view === true || role.parameters.view.includes(currentIdentifier)) {
              response.view = true
            }
          } else {
            response.view = true
          }
          if (role.parameters.hasOwnProperty('download')) {
            if (role.parameters.download === true || role.parameters.download.includes(currentIdentifier)) {
              response.download = true
            }
          } else {
            response.download = true
          }
        }
      })
      if (!response.view && !response.download) {
        return false
      }
      return response
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
