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

import ToolsPlugin from '@/modules/tools.js'
Vue.use(ToolsPlugin)


import makeStore from './store'

let config = {}
if (typeof formaterConfig != 'undefined') {
  config = JSON.parse(formaterConfig.innerHTML)
} 
 
// export let keycloak = makeAuth(config.auth)

const store = makeStore(config)
let locale = navigator.language.substr(0, 2)

if (config.lang) {
  locale = config.lang
} 
// let launch = function () {
  ljs.addAliases({
    dep: [
       // font-awesome
       'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
       // leaflet
       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.4.0/leaflet.css',
       //regiter element
       //-------------
       // 'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
       // 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js'
      // 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.min.js'
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
      components: { App },
      beforeCreate(e) {
        
        if (!process.env.SSO_URL || !store.state.auth || document.location.href.indexOf('/login') > 0 ||
            document.location.href.indexOf('/logout') > 0 || document.location.href.indexOf('state=php') > 0) {
          if (document.location.href.indexOf('state=php') > 0) {
            var regex = new RegExp(/^(.*\/)\?(.*)#\/$/)
            var found = document.location.href.match(regex)
            // var found = document.location.href.match(/^(.*\/)\?(.*)#\/$/g)
            if (found && found.length > 2) {
              location = found[1] + '#/login?' + found[2]
              window.location.replace(location)
            }
          }
          return
        }
        
        var location = this.$custURL(window.location.href)
        this.$store.commit('user/initAuth', {
          clientId: process.env.SSO_CLIENT_ID, 
          ssoUrl: process.env.SSO_URL,
          realm: process.env.SSO_REALM,
          formaterRole: process.env.FORMATER_ROLE
        })
        this.$store.commit('services/init', process.env.SSO_NAME)
        
        // only to auth when begin ...
//        var paramsStr = Object.keys(location.params).map(function (key) {
//          return key + '=' + location.params[key]
//        }).join('&')
//        var redirectUri = location.base + (paramsStr.length > 0 ? ('?' + paramsStr) : '')
//        if (!this.$store.state.metadata && !location.authParams['error'] && !location.authParams['code']) { 
//          var url = this.$store.getters['user/loginUrl']
//          var loginParams = this.$store.getters['user/loginParams'](redirectUri, false)
//          url += '?' + loginParams
//          window.location.href = url
//          return
//        }
//        if (location.authParams['code']) {
//          store.commit('user/setRedirectUri', redirectUri)
//          store.commit('user/setCode', location.authParams['code'])
//        }
//        
//        window.location.replace(redirectUri)
        
      }
    })
  
  })

