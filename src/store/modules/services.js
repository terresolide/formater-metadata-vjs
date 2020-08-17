/**
 * Services
 */
// import Service from '@/modules/service.js'

export default {
  namespaced: true,
  state: {
    services: [],
    current: -1
  },
  getters: {
   all (state, getters) {
     return state.services
   },
   byDomain (state, getters, domain) {
     return state.services.find(obj => obj.domain === domain)
   },
   byId (state, getters, id) {
     return state.services[id]
   },
   token: (state) => (domain) => {
     var service = state.services.find(obj => obj.domain === domain)
     if (service) {
       return service.token
     } else {
       return null
     }
   }
  },
  mutations: {
    add (state, service) {
      
       var index = state.services.findIndex(obj => obj.domain === service.domain)
       if (index > -1) {
         state.current = index
       } else {
         service.id = state.services.length
         state.services.push(service)
         state.current = service.id
       }
 
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
    }
  }
}
