/**
 * Router Configuration
 */

import Vue from 'vue'
import Router from 'vue-router'
import  FormaterCatalogue  from  '@/formater-catalogue.vue'
const FormaterLogin  = () => import( '@/formater-login.vue')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FormaterCatalogue',
      component: FormaterCatalogue
    },
    {
      path: '/login',
      name: 'FormaterLogin',
      component: FormaterLogin
    }
  ]
})
