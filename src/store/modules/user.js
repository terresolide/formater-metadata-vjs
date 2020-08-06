/**
 * Global User
 */
module.exports = {
  namespaced: true,
  state: {
    user: null
  },
  getters: {
    email (state, getters) {
      if (state.user) {
        return state.user.email
      } else {
        return null
      }
    },
    type (state, getters) {
      if (state.user) {
        return state.user.type
      } else {
        return null
      }
    },
    id (state, getters) {
      if (state.user) {
        return state.user.id
      } else {
        return null
      }
    }
  },
  mutations: {
    set (state, user) {
      state.user = user
    },
    reset (state) {
      state.user = null
    }
  }
}
