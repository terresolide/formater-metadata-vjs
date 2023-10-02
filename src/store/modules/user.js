/**
 * Global User and authentication
 */
import jwt_decode from 'jwt-decode'
export default {
  namespaced: true,
  state: {
    user: {
      username: null,
      familyName: null,
      givenName: null,
      email: null,
      roles: []
    },
    show: null,
    strRoles: null,
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
//    canDownload: (state, getter) => (download, clientId) => {
//      if (download === 'free' ) {
//        return true
//      }
//      if (download === 'auth') {
//        if (state.user && state.user.email) {
//          return true
//        } else {
//          return false
//        }
//      }
//      return false
//    },
//    canView: (state, getter) => (view, clientId) => {
//      if (view === 'free') {
//        return true
//      }
//      if (view === 'auth') {
//        if (state.user && state.user.email) {
//          return true
//        } else {
//          return false
//        }
//      }
//      console.log(clientId)
//      if (clientId) {
//        var views = view.split(',')
//        console.log(views)
//        console.log(state.user.roles[clientId])
//        
//      }
//      return false
//    },
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
    type (state, getters) {
      if (state.user && state.user.organizationType) {
        return state.user.organizationType
      }
      return null
    },
    get (state, getters) {
      if (state.user && state.user.email) {
        return state.user
      } else {
        return null
      }
    },
  //  getAccess: (state) => (client, access) => {
    getAccess: (state) => (access) => {
      var resp = {search: false, view: false, download: false}
//      if (!client) {
//        return resp
//      }
//      var userRoles = false
//      if (state.user && state.user.roles && state.user.roles[client]) {
//        userRoles = state.user.roles[client].join(',')
//      } 
      var props =  ['search', 'view', 'download']
      props.forEach(function (prop) {
        if (!access[prop] || access[prop] === 'free') {
          resp[prop] = true
        } else if (access[prop] === 'auth') {
          resp[prop] = state.user && state.user.email ? true : false
        } else {
         // if (!state.user || !state.user.roles || !state.user.roles[client])
          if (!state.user || !state.strRoles)
          {
            resp[prop] = false
          } else {
            var roles = access[prop].split(',')
            for (var key in roles) {
              if (state.strRoles && state.strRoles.indexOf(roles[key]) >= 0) {
                resp[prop] = true
                break
              }
            }
          }
        }
      })
      return resp
    },
    getState (state, getters) {
      return state.state
    },
    hasRole: (state) => (client, role) => {
      return state.strRoles && state.strRoles.indexOf(role) >= 0
//      if (!state.user.roles[client])
//      {
//        return false
//      }
//      return state.user.roles[client].indexOf(role) >= 0
    },
//    isFormater (state, getters) {
//      if (!state.user || !state.user.roles) {
//        return false
//      }
//      return state.user.roles.indexOf(state.formaterRole) >= 0
//    },
//    formaterRole (state, getters) {
//      return state.formaterRole
//    },
    nonce (state, getters) {
      return state.nonce
    },
    token (state, getters) {
     return state.token
    },
    realm (state, getter) {
      return state.realm
    },
    refreshToken (state, getter) {
      return state.refreshToken
    },
    roles (state, getter) {
      return state.user.roles
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
    iframeUrl (state, getters) {
      if (state.ssoUrl) {
        return  state.ssoUrl + '/realms/' + state.realm + '/protocol/openid-connect/login-status-iframe.html'
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
    },
    show (state, getters) {
      return state.show
    }
  },
  mutations: {
    initAuth (state, obj) {
     // state.formaterRole = obj.formaterRole
      state.ssoUrl = obj.ssoUrl
     // state.clientId = obj.clientId
      state.realm = obj.realm
    },
    setClient (state, obj) {
      state.clientId = obj.clientId
      // @todo autre info pour client "externe"
      var date = new Date()
      var y = date.getYear() + ''
      var str = obj.clientId + date.getMonth() + '_' + date.getDate()
      state.nonce = btoa(str).replace(/=|\+|\//gm, '0')
      state.state = btoa(state.clientId).replace(/=|\+|\//gm, '0')
    },
//    hasAccess (state) {
//      return state.user.roles
//    },
//    set (state, jwtToken) {
//      var obj = jwt_decode(jwtToken)
//      if (obj.nonce === state.nonce) {
//        console.log(obj)
//        state.user = {
//            id: obj.sub,
//            email: obj.email,
//            username: obj.preferred_username,
//            familyName: obj.family_name,
//            name: obj.name,
//            givenName: obj.given_name,
//            roles: obj.realm_roles
//        }
//      }
//      
//    },
    setCode (state, code) {
      state.code = code
    },
    setOrganization (state, org) {
      state.user.organization = org.organization
      state.user.organizationType = org.organizationType
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
      console.log(obj)
      if (obj.nonce === state.nonce) {
        var roles = [ ]
        for (var client in obj.client_roles)
        {
          roles[client] = obj.client_roles[client].roles
        }
        roles.global = obj.realm_roles
        
        var strRoles = []
        for (var key in roles) {
          if (key !== 'account' && key !== 'realm-management') {
            strRoles.push(roles[key].join(','))
          }
        }
        state.strRoles = strRoles.join(',')
        state.user = {
            id: obj.sub,
            email: obj.email,
            username: obj.preferred_username,
            familyName: obj.family_name,
            name: obj.name,
            givenName: obj.given_name,
            roles: roles,
            organization: obj.fmt_organization,
            organizationId: obj.fmt_organization_id,
            organizationType: obj.fmt_organization_type
        }
      }
    },
    reset (state) {
      state.user = null
      state.token = null
      state.code = null
      state.refreshToken = null
      state.strRoles = null
      state.show = null
    },
    toggleShow (state, obj) {
      if (!obj) {
        state.show = obj
        return
      }
      // Compare if it's the same client and the same role
      var roles = null
      if (obj.access) {
        roles = []
        for (var key in obj.access) {
          if (obj.access[key] !== 'free' && obj.access[key] !== 'auth') {
            if (roles.indexOf(obj.access[key]) < 0) {
              roles.push(obj.access[key])
            }
          }
        }
      }
      if (!state.show || state.show.client !== obj.client ||
          (state.show.roles && !roles) || (!state.show.roles && roles)) {
        state.show = {client: obj.client, roles: roles}
      } else if (!state.show.roles && !roles) {
        state.show = null
      } else {
        // compare roles
        var intersection = state.show.roles.filter(role => roles.includes(role))
        if (intersection.length === roles.length) {
          state.show = null
        } else {
          state.show = {client: obj.client, roles: roles}
        }
      }
    }
  }
}
