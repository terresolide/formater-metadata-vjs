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
    set (state, obj) {
      for(name in obj.clients) {
        var first = false
        var groups = {}
        // group of rights like OZARK, TARIM
        if (obj.clients[name].roles) {
          obj.clients[name].roles.forEach(function (role, index) {
            if (!first && role.parameters.display) {
              role.first = true
//              var index = obj.roles[name].indexOf(role.name)
//              role.access = index >= 0
              first =false
            }
          })
        }
        // sort
        if (obj.clients[name].groups) {
          for(var key in obj.clients[name].groups) {
            obj.clients[name].groups[key].sort(function (a, b) {
              return  parseInt(a.parameters.download) >= parseInt(b.parameters.download) ? 1 : 0
            })
//            obj.clients[name].groups[key].forEach(function (role) {
//              var index = obj.roles[name].indexOf(role.name)
//              role.access = index >= 0
//            })
          }
        }
      }
      state.clients = obj.clients
      this.commit('roles/setAccess',obj.roles)
    },
    setAccess (state, roles) {
      for(name in state.clients) {
        var rolestr = roles[name].join(',')
        if (state.clients[name].roles) {
          state.clients[name].roles.forEach(function (role, index) {
              var index = rolestr.indexOf(role.name)
              role.access = index >= 0
          })
        }
        if (state.clients[name].groups) {
          for(var key in state.clients[name].groups) {
            state.clients[name].groups[key].forEach(function (role, i) {
              var index = rolestr.indexOf(role.name)
              role.access = index >= 0
            })
          }
        }
      }
      console.log(state.clients)
    },
    setToken (state, obj) {
      if (state.clients[obj.client]) {
        state.clients[obj.client].token = obj.token
      }
    },
    setStatus (state, obj) {
      if (state.clients[obj.client].roles) {
        var index = state.clients[obj.client].roles.findIndex(role => role.name === obj.name)
        if (index >= 0) {
           state.clients[obj.client].roles[index].status = obj.status
        }
      } 
      if (state.clients[obj.client].groups) {
        for (var key in state.clients[obj.client].groups) {
          var index = state.clients[obj.client].groups[key].findIndex(role => role.name === obj.name)
          if (index >= 0) {
            state.clients[obj.client].groups[key][index].status = obj.status
          }
        }
      }
    }
  }
}
