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
    getClients (state, getters) {
      return state.clients
    }
  },
  mutations: {
    set (state, clients) {
      console.log(clients)
      state.clients = clients
      
    },
    setStatus (state, obj) {
      var index = state.roles[obj.client].findIndex(role => role.name === obj.name)
      state.clients[obj.client].roles[index].status = obj.status
    }
  }
}
