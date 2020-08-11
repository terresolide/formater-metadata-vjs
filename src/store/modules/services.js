/**
 * Services
 */
import Service from '@/modules/service.js'

export default {
  namespaced: true,
  state: {
    services: []
  },
  getters: {
   byDomain (state, getters, domain) {
     return state.services.find(obj => obj.domain === domain)
   }
  },
  mutations: {
    add (state, api) {
      let service = new Service(api)
      console.log(service.domain)
      console.log(service.type)
      if (!service) {
        return 
      }
      var found = state.services.find(obj => obj.domain === service.domain)
      if (!found) {
       service.initialize()
       state.services.push(service)
      }
    }
  }
}
