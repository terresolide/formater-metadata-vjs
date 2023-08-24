/**
 * Global Roles used for access request
 * @prop clients list of clients record in catalog DB
 *   global is the global rôles in sso
 *   is like
 *     flatsim: {
 *       title: {fr: 'Données FLATSIM', en: 'FLATSIM data'},
 *       description: {fr: '', en: ''},
 *       roles: [role1, role2]
 *       groups: {
 *         AFAR: [role3, role4] 
 *       },
 *     oi2: {
 *       title: {fr: 'Données OI2', en: 'OI2 data'},
 *       description: {fr: '', en: ''},
 *       roles: [role5]
 *     } 
 *   }
 *   where 
 *     - single role like role1, role2 or role5 authorize all view and download
 *     - grouped role is order by view role and download role
 *       if download role authorize also view, its name contains the view role name
 *   where role is like 
 *   {
 *     name: 'FLATSIM_AFAR_V',
 *     title: {fr: 'AFAR', en: 'AFAR'},
 *     description: {fr: '', en: ''},
 *     parameters: {view: true, download: false, group: 'AFAR', display: true, ...}, 
 *     status: 'WAITING' ( the user requested for this role: 'WAITING', 'REJECTED', 'ACCEPTED' or null)
 *     access: true or false (the user has the role)
 *   }
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
      console.log(clientName)
      if (state.clients[clientName]) {
        return state.clients[clientName]
      } else {
        return null
      }
    },
    getClients (state, getters) {
      return state.clients
    },
    rolesForAccess: (state) => (clientName, access) => {
       if (!state.clients[clientName]) {
         return []
       }
       var client = state.clients[clientName]
       var neededRoles = []
       // où on liste les roles demandés pour la fiche
       for(var key in access) {
         if (access[key] !== 'free' && access[key] !== 'auth') {
           neededRoles.push(access[key])
         }
       }
       var roles = []
       // où on récupère les roles du client  si ils sont dans neededRoles
       console.log(client.roles)
       for(var coll in client.groups) {
         roles = roles.concat(client.groups[coll].filter(g => neededRoles.indexOf(g.name) >= 0))
       }
     
      roles = roles.concat(client.roles.filter(g => neededRoles.indexOf(g.name) >= 0))
      return roles
    },
     //,
//    hasAccess: (state) => (clientName, currentIdentifier) => {
//      if (!state.clients[clientName]) {
//        return {view: true, download:true}
//      }
//      var client = state.clients[clientName]
//      var response = {
//          view: false,
//          download: false
//      }
//      // var canAccess = false
//      client.roles.forEach(function (role) {
//        console.log(role)
//        if (role.access) {
//          if (role.parameters.hasOwnProperty('view')) {
//            if (role.parameters.view === true || role.parameters.view.includes(currentIdentifier)) {
//              response.view = true
//            }
//          } else {
//            response.view = true
//          }
//          if (role.parameters.hasOwnProperty('download')) {
//            if (role.parameters.download === true || role.parameters.download.includes(currentIdentifier)) {
//              response.download = true
//            }
//          } else {
//            response.download = true
//          }
//        }
//      })
//      if (!response.view && !response.download) {
//        return false
//      }
//      return response
//    }
  },
  mutations: {
    set (state, obj) {
      for(name in obj.clients) {
        var first = false      
        if (obj.clients[name].roles) {
          obj.clients[name].roles.forEach(function (role, index) {
            if (!first && role.parameters.display) {
              role.first = true
              first =false
            }
          })
        }
        // sort role by name in each group of roles
        // FLATSIM_AFAR_V < FLATSIM_AFAR_VD
        // then index = 0 for view role
        // index = 1 for view & download role
        if (obj.clients[name].groups) {
          for(var key in obj.clients[name].groups) {
            obj.clients[name].groups[key].sort(function (a, b) {
              return  a.name > b.name ? 1 : 0
            })
          }
        }
      }
      // update status of join role
      // if view is rejected => download is rejected
      // if wait for download => wait for view
      if (obj.clients[name].groups) {
        for(var key in obj.clients[name].groups) {
          if (obj.clients[name].groups[key][0].status === 'REJECTED') {
            obj.clients[name].groups[key][1].status = 'REJECTED'
          } else if (obj.clients[name].groups[key][1].status === 'WAITING' || 
                     obj.clients[name].groups[key][1].status === 'CONDITION' ) {
            obj.clients[name].groups[key][0].status = obj.clients[name].groups[key][1].status
          }
        }
      }
      state.clients = obj.clients
      this.commit('roles/setAccess',obj.roles)
    },
    /**
     * Roles is an array of roles by client 
     * Ex: {
     *    global: ['FORMATER_USER'], 
     *    flastim: ['FLATSIM_AFAR_V', 'FLATSIM_TARIM_VD']
     * }
     */
    setAccess (state, roles) {
      for(var name in state.clients) {
        if (!roles[name]) {
          // user has no role for this client. Check if some has been accepted and cancel
          state.clients[name].roles.forEach(function (role, index) {
              if (role.status === 'ACCEPTED') {
                role.status = 'REJECTED'
              }
          })
          for(var key in state.clients[name].groups) {
            state.clients[name].groups[key].forEach(function (role, i) {
              if (role.status === 'ACCEPTED') {
                role.status = 'REJECTED'
              }
            })
          }
          continue
        }
        
        var rolestr = roles[name].join(',')
        // user string strategy
        // if user has role view and download (CLIENT_ROLE_VD)
        // user has role view (CLIENT_ROLE_V) and can find substring in role string
        if (state.clients[name].roles) {
          state.clients[name].roles.forEach(function (role, index) {
              var index = rolestr.indexOf(role.name)
              role.access = index >= 0
              if (!role.access && role.status === 'ACCEPTED') {
                role.status = 'REJECTED'
              }
          })
        }
        if (state.clients[name].groups) {
          for(var key in state.clients[name].groups) {
            state.clients[name].groups[key].forEach(function (role, i) {
              var index = rolestr.indexOf(role.name)
              role.access = index >= 0
               if (!role.access && role.status === 'ACCEPTED') {
                role.status = 'REJECTED'
              }
            })
          }
        }
      }
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
            if (index === 1 && obj.status === 'WAITING') {
              state.clients[obj.client].groups[key][0].status = 'WAITING'
            }
          }
        }
      }
    }
  }
}
