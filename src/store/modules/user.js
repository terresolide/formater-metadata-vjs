/**
 * Global User and authentication
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
    nonce: null,
    ssoUrl: null,
    clientId: null,
    realm: null,
    redirectUri: null
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
    getState (state, getters) {
      return state.state
    },
    token (state, getters) {
     return state.token
    },
    refreshToken (state, getter) {
      return state.refreshToken
    },
    tokenUrl (state, getters) {
      if (state.ssoUrl) {
        return  state.ssoUrl + '/realms/' + state.realm + '/protocol/openid-connect/token'
      } else {
        return null
      }
    },
    loginUrl (state, getters) {
      if (state.ssoUrl) {
        return  state.ssoUrl + '/realms/' + state.realm + '/protocol/openid-connect/auth'
      } else {
        return null
      }
    },
    loginParams: (state, getters) => (redirectUrl, prompt) => {
      var params = {
        nonce: state.nonce,
        state: state.state,
        client_id: state.clientId,
        response_type: 'code',
        response_mode: 'fragment',
        scope: 'openid',
        redirect_uri: encodeURIComponent(redirectUrl)
      }
      if (!prompt) {
        params.prompt = 'none'
      }
      var paramsStr = Object.keys(params).map(function (key) {
        return key + '=' + params[key]
      }).join('&')
      return paramsStr
    },
    logoutUrl (state, getters) {
      if (state.ssoUrl) {
        return  state.ssoUrl + '/realms/' + state.realm + '/protocol/openid-connect/logout'
      } else {
        return null
      }
    },
    infoUrl (state, getters) {
      if (state.ssoUrl) {
        return  state.ssoUrl + '/realms/' + state.realm + '/protocol/openid-connect/userinfo'
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
    },
    redirectUri (state, getters) {
      return state.redirectUri
    }
  },
  mutations: {
    initAuth (state, obj) {
      var date = new Date()
      var y = date.getYear() + ''
      var str = obj.clientId + date.getMonth() + '_' + date.getDate()
      console.log(str)
      state.ssoUrl = obj.ssoUrl
      state.clientId = obj.clientId
      state.realm = obj.realm
      state.nonce = btoa(str).replace(/=|\+|\//gm, '0')
      state.state = btoa(state.clientId).replace(/=|\+|\//gm, '0')
    },
    set (state, jwtToken) {
      var obj = jwt_decode(jwtToken)
      console.log(obj)
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
    setRedirectUri (state, uri) {
      state.redirectUri = uri
    },
    setTokens (state, tokens) {
      state.token = tokens.access_token
      state.refreshToken = tokens.refresh_token
//      var obj1 = jwt_decode(state.toke)
//      console.log(obj1)
      var obj = jwt_decode(tokens.id_token)
      if (obj.nonce === state.nonce) {
        console.log(obj)
        state.user = {
            email: obj.email,
            username: obj.preferred_username,
            familyName: obj.family_name,
            name: obj.name,
            givenName: obj.given_name
        }
      }
    },
    reset (state) {
      state.user = null
      state.token = null
      state.code = null
      state.refreshToken = null
    }
  }
}
