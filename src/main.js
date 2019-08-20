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

import Tools from './formater-metadata-tools.js'
Vue.use(Tools)

// main component for app
import FormaterCatalogue from './formater-catalogue.vue'

import makeStore from './store'

var config = {}
if (typeof formaterConfig != 'undefined') {
  config = JSON.parse(formaterConfig.innerHTML)
  console.log(config)
} 
let locale = navigator.language.substr(0, 2)
console.log(locale)
 console.log(formaterConfig)
console.log(config)
if (config.lang) {
  locale = config.lang
} 
delete config.lang
console.log(config.style)


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
  console.log(config.style.primary)
  const i18n = new VueI18n({
    fallbackLocale: 'en',
    locale: locale
  })
  const store = makeStore(config)
//  const store = new Vuex.Store({
//    state: config,
//    
//    mutations: {
//      temporalChange(state, newTemporal) {
//        state.temporalExtent = newTemporal
//      }
//    }
//  })
  new Vue({
    el: '#formaterCatalogue',
    template: '<FormaterCatalogue/>',
    i18n,
    store,
    components: { FormaterCatalogue }
  })

})

