require("exports-loader?!./l.min.js")

import Vue from 'vue'



//import vueCustomElement from 'vue-custom-element'
//Vue.use(vueCustomElement);
// import ajax from './services/ajax'


import Vuex from 'vuex'
Vue.use(Vuex)

//pour la traduction 
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);

import VueResource from 'vue-resource'
Vue.use(VueResource);


// import {VueTools} from 'formater-commons-components-vjs'
// Vue.use(VueTools)

import {VueColorPlugin} from 'aeris-mixins'
Vue.use(VueColorPlugin)

import {VueTools} from 'formater-commons-components-vjs'
Vue.use(VueTools)

import GeonetworkPlugin from './geonetwork.js'
Vue.use(GeonetworkPlugin)


// main component for app
import FormaterCatalogue from './formater-catalogue.vue'
import Keycloak from 'keycloak-js'

import makeStore from './store'

export let keycloak = Keycloak({
    url: 'https://sso.aeris-data.fr/auth',
    realm: 'test',
    clientId: 'formater-vjs',
    checkLoginIframe: true
})

var config = {}
if (typeof formaterConfig != 'undefined') {
  config = JSON.parse(formaterConfig.innerHTML)
} 
let locale = navigator.language.substr(0, 2)

if (config.lang) {
  locale = config.lang
} 
//let initOptions = {
//    url: configAuth.SSO_URL,
//    realm: configAuth.SSO_REALM,
//    clientId: configAuth.SSO_CLIENT_ID,
//    checkLoginIframe: true
//  }

keycloak.init({
  onLoad: 'check-sso',
  promiseType: 'native'
}).then(function (authenticated) {
  if (authenticated) {
    // Récupération des informations de l'utilisateur
    if (keycloak.tokenParsed) {
      var username = keycloak.tokenParsed.preferred_username
      console.log(username)
     // var name = keycloak.tokenParsed.given_name
     // var family_name = keycloak.tokenParsed.family_name
      var email = keycloak.tokenParsed.email

      // Le rôle est porté par le back-end (formater-php)
      if (keycloak.tokenParsed.resource_access['formater-php']) {
        var resourceRoles = keycloak.tokenParsed.resource_access['formater-php'].roles
      }

      var realmRoles = keycloak.tokenParsed.realm_access.roles

      var roles = []
      if (realmRoles) {
        roles = roles.concat(realmRoles)
      }
      if (resourceRoles) {
        roles = roles.concat(resourceRoles)
      }

      // POUR LES APPLICATIONS CATALOGUE AERIS
      let user = { type: 'aeris', token: keycloak.token, email: email, roles: roles, username: username }
      store.commit('user/set', user)
      console.log('USER AUTHENTICATED') 
      // login to background (create session)
      Vue.http.interceptors.push(function(request, next) {
        if (keycloak.token && request.aeris) {
          request.headers.set('Authorization', 'Bearer ' + keycloak.token);
          request.headers.set('Accept', 'application/json');
        }
      })
      Vue.http.get(store.state.url + 'apilogin', {credentials: true, aeris: true}).then(function (response) {
          // Si l'utilisateur est authentifié

      })
    }
  } else {
    console.log('USER NOT AUTHENTICATED')
  }
  ljs.addAliases({
    dep: [
       // font-awesome
       'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
       // leaflet
       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.4.0/leaflet.css',
       //regiter element
       //-------------
       // 'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
       'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js'
      ]
})
ljs.load('dep', function() {
  // Vue.customElement('formater-catalogue', FormaterCatalogue) 
  const i18n = new VueI18n({
    fallbackLocale: 'en',
    locale: locale
  })
  const store = makeStore(config)
  new Vue({
    el: '#formaterCatalogue',
    template: '<FormaterCatalogue/>',
    i18n,
    store,
    components: { FormaterCatalogue }
  })

})

})



