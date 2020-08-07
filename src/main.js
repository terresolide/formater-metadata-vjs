require("exports-loader?!./l.min.js")

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);
import VueResource from 'vue-resource'
Vue.use(VueResource);

import App from './app.vue'
import router from './router'

//import {VueColorPlugin} from 'aeris-mixins'
//Vue.use(VueColorPlugin)

import {VueTools} from 'formater-commons-components-vjs'
Vue.use(VueTools)

import GeonetworkPlugin from './geonetwork'
Vue.use(GeonetworkPlugin)

import makeAuth from './auth.js'
import makeStore from './store'

let config = {}
if (typeof formaterConfig != 'undefined') {
  config = JSON.parse(formaterConfig.innerHTML)
} 
 
export let keycloak = makeAuth(config.auth)

const store = makeStore(config)
let locale = navigator.language.substr(0, 2)

if (config.lang) {
  locale = config.lang
} 
let launch = function () {
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
    const i18n = new VueI18n({
      fallbackLocale: 'en',
      locale: locale
    })
  
    new Vue({
      el: '#formaterCatalogue',
      template: '<app/>',
      i18n,
      store,
      router,
      components: { App }
    })
  
  })
}

if (!keycloak) {
  // launch the Vue app
  launch()
} else {
  keycloak.init({
    onLoad: 'check-sso'
  }).then(function (authenticated) {
    if (authenticated) {
       if (keycloak.tokenParsed) {
        var username = keycloak.tokenParsed.preferred_username
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
        let user = { type: 'aeris', email: email, roles: roles, username: username }
        store.commit('user/set', user)
        console.log('USER AUTHENTICATED') 
      }
    } else {
      console.log('USER NOT AUTHENTICATED')
    }
    launch()
  })
}



