/**
 * Router Configuration
 */

import Vue from 'vue'
import Router from 'vue-router'
const FormaterCatalogue = () => import('@/formater-catalogue.vue')
const FormaterSingle = () => import('@/formater-single.vue')
const FormaterLogin  = () => import('@/formater-login.vue')
const FormaterLogout  = () => import('@/formater-logout.vue')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FormaterCatalogue',
      component: FormaterCatalogue
    },
    {
      path: '/metadata/:uuid',
      name: 'Metadata',
      component: FormaterSingle
    },
    {
      path: '/login',
      name: 'FormaterLogin',
      component: FormaterLogin
    },
    {
      path: '/logout',
      name: 'FormaterLogout',
      component: FormaterLogout
    }
  ]
//,
//  beforeEach: (to, from, next) => {
//    if (to.name === 'FormaterCatalogue')
//  }
})
