require("exports-loader?!./l.min.js")

import Vue from 'vue'

import vueCustomElement from 'vue-custom-element'
Vue.use(vueCustomElement);

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

import FormaterCatalogue from './formater-catalogue.vue'



ljs.addAliases({
    dep: [
       // font-awesome
       'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
       // leaflet
       // 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.4.0/leaflet.css',
       //regiter element
       //-------------
       'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
       'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js'
      ]
})
ljs.load('dep', function() {
  Vue.customElement('formater-catalogue', FormaterCatalogue) 
})

