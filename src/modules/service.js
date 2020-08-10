/**
 * 
 */
import Vue from 'vue'
import VueResource from 'vue-resource'

export default function  Service (api) {
  var url = new URL(api)
  this.domain = url.hostname
  this.root = url.origin
  this.clientId = null
  console.log(this.root)
  this.type = 'unknown'
  if (url.pathname.indexOf('atdistrib/resto2') > 0) {
    this.type = 'resto2'
  }
  if (!this.domain) {
    return null
  }
  this.getCliendId = function (inDepth) {
    var url = this.root + '/atdistrib/resto2/api/auth/aeris/clientid'
    var _this = this
    Vue.http.get(url).then(function (response) {
      _this.clientId = response.body.clientId
      console.log(_this.clientId)
      if (inDepth) {
      _this._searchCode()
      }
    })
    
  }
  this._searchCode = function () {
    var _this = this
    console.log('clientId', _this.clientId)
  }
  this._initializeResto = function () {
    // search code ...
    console.log('init resto' + this.domain)
    // add iframe and listen on load
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    this.getCliendId(true)
//    iframe.on('load', function (e) {
//      
//    })
//    document.appendChild(iframe)
//    iframe.src = this.domain + 'atdis'
  }
  this.initialize = function () {
    console.log('initialize service')
    switch (this.type) {
      case 'resto2':
        this._initializeResto()
        break
    }
  }
  return this
}