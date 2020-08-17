/**
 * Global User
 */
import jwt_decode from 'jwt-decode'
export default {
  namespaced: true,
  state: {
    user: {
      username: null,
      lastname: null,
      givenName: null,
      email: null
    },
    token: null,
    code: null,
    refreshToken: null,
    state: null,
    nonce: null
  },
  getters: {
    code (state, getters) {
      return state.code
    },
    email (state, getters) {
      if (state.user && state.user.email) {
        return state.user.email
      } else {
        return null
      }
    },
    nonce (state, getters) {
      return state.nonce
    },
    token (state, getters) {
      if (state.user && state.user.token) {
        return state.user.token
      } else {
        return null
      }
    },
    clientId (state, getters) {
      return state.clientId
    },
    username (state, getters) {
      if (state.user && state.user.username) {
        return state.user.username
      } else {
        return null
      }
    }
  },
  mutations: {
    initNonce (state) {
      state.nonce = Math.random().toString(36).substr(2)
    },
    set (state, jwtToken) {
      var obj = jwt_decode(jwtToken)
      if (obj.nonce === state.nonce) {
        state.user = {
            email: obj.email,
            username: obj.preferred_username,
            familyName: obj.family_name,
            name: obj.name,
            givenName: obj.given_name
        }
      }
      
    },
    setCode (state, code) {
      state.code = code
    },
    setTokens (state, tokens) {
      state.token = tokens.access_token
      state.refreshToken = tokens.refresh_token
    },
    reset (state) {
      state.user = null
      state.token = null
      state.code = null
      state.refreshToken = null
    }
  }
}
