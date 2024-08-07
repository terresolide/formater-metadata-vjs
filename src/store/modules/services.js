/**
 * Services
 * Manage list of opensearch service
 * @prop services array of service 
 *    {
 *      id: index in table services
 *      type: 'resto2'
 *      token: access token to the service
 *      host: base url to the service
 *      authUrl: the authenticate url of the service, where pass code
 *      clientId: the clientId in sso
 *      clientIdUrl: the url where find the clientId
 *      validationUrl: url de validation du token
 *      disconnectUrl: url de déconnexion du service
 *      refreshUrl: url de rafraichissement du token
 *      access: the current role for access to search,view or download for the current metadata
 *    }
 * @prop sso name of sso used to connect?
 * @prop current the index of the selected service or -1 if no service
 */
// import Service from '@/modules/service.js'

export default {
  namespaced: true,
  state: {
    services: [],
    sso: null,
    pre: null,
    current: -1
  },
  getters: {
   all (state, getters) {
     return state.services
   },
   current (state, getters) {
     return state.current
   },
   clientId(state, getters) {
     if (state.current >= 0) {
       return state.services[state.current].clientId
     } else {
       return false
     }
   },
   byDomain: (state) => (domain) => {
     return state.services.find(obj => obj.domain === domain)
   },
   byId: (state) => (id) => {
     return state.services[id]
   },
   getToken: (state) => (domain) => {
     var service = state.services.find(obj => obj.domain === domain)
     if (service) {
       return service.token
     } else {
       return null
     }
   },
   token (state, getters) {
     if (state.current >= 0) {
       return state.services[state.current].token
     } else {
       return null
     }
   },
   type (state, getters) {
     if (state.current >=0) {
       return state.services[state.current].type
     } else {
       return null
     }
   }
  },
  mutations: {
    init (state, ssoname) {
      state.sso = ssoname
    },
    initialize (state, clients) {
      var index = 0
      state.services = []
      clients.forEach(function (client) {
        client.id = index
        client.token = null
        client.access = false
        state.services.push(client)
        index++
      })
      if (state.pre) {
        this.commit('services/add', state.pre)
      }
    },
    reset (state) {
      if (state.current >= 0) {
        state.services[state.current].token = null
      }
      state.services.forEach(function(service, index) {
        state.services[index].token = null
      })
    },
    resetCurrent (state) {
      state.current = -1
      state.pre = null
    },
    add (state, service) {
       if (state.services.length === 0) {
         state.pre = service
       }
       var index = state.services.findIndex(obj => obj.domain === service.domain)
//       if (index < 0) {
//         var url = new URL(service.api)
//         if (url.pathname.indexOf('atdistrib/resto2') > 0) {
//           index = state.services.length
//           service.id = index
//           service.token = null
//           service.type = 'resto2'
//           service.host = url.protocol + '//' + url.hostname
//           service.authUrl = null
//           service.clientIdUrl = null
//           service.authUrl = service.host + '/atdistrib/resto2/api/auth/' + state.sso
//           service.clientIdUrl = service.host + '/atdistrib/resto2/api/auth/' + state.sso + '/clientid'
//           service.validationUrl = service.host + '/atdistrib/resto2/api/user/checkToken'
//           service.disconnectUrl = service.host + '/atdistrib/resto2/api/user/disconnect'
//           service.refreshUrl = service.host + '/atdistrib/resto2/api/user/connect'
//           state.services.push(service)
//         }
       if (index >= 0) {
           state.services[index].access = service.access
       }
       state.current = index

       // return index
//      let service = new Service(api)
//      console.log(service.domain)
//      console.log(service.type)
//      if (!service) {
//        return 
//      }
//      var found = state.services.find(obj => obj.domain === service.domain)
//      if (!found) {
//       service.initialize()
//       state.services.push(service)
//      }
    },
    setReject (state, infos) {
      state.services[infos.id].reject = infos.reject
    },
    setToken (state, infos) {
      state.services[infos.id].token = infos.token
    },
    setClientId (state, infos) {
      state.services[infos.id].clientId = infos.clientId
    }
  }
}
