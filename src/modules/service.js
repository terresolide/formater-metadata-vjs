/**
 * 
 */
import Vue from 'vue'
import VueResource from 'vue-resource'
import PromiseQueue from 'easy-promise-queue'
import store from '@/store'

export default function  Service (api) {
  var iframe = null
  var url = new URL(api)
  this.domain = url.hostname
  this.root = url.origin
  this.clientId = null
  this.code = null
  this.token = null
  this.expire = 0
  console.log(this.root)
  this.type = 'unknown'
  this.baseUrl = 'https://localhost:8080/#'
  var found = window.location.href.match(/.*\/#/)
  if (found && found.length > 0) {
    this.baseUrl = found[0]
  }
  if (url.pathname.indexOf('atdistrib/resto2') > 0) {
    this.type = 'resto2'
  }
  if (!this.domain) {
    return null
  }
  var _this = this
  this.getCliendId = function () {
    return new Promise((resolve, reject) => {
      console.log('begin getClientId')
      if (_this.clientId) {
        resolve(_this.clientId)
      }
      var url = _this.root + '/atdistrib/resto2/api/auth/aeris/clientid'
      
      Vue.http.get(url).then(function (response) {
        if (response.body && response.body.clientId) {
        _this.clientId = response.body.clientId
        console.log(_this.clientId)
         resolve(_this.clientId)
        } else {
          reject({error: 'NO CLIENTID'})
        }
      }, response => reject({error: 'REQUEST ERROR'}))
      
    })
  }
  this.getToken = function () {
    // see timeout token (interval ?)
    return new Promise ((resolve, reject) => {
      console.log(_this.clientId)
      var token = 'blabla'
      resolve(token)
    })
  }
  this._extractCode = function (e) {
    console.log(e.target.baseURI)
    var url = new URL(e.target.baseURI);
    var code = url.searchParams.get("code");
    console.log('code = ', code)
    var app = url.searchParams.get('state')
    console.log('app = ', app)
     var next = function(iframe) {
      console.log('next')
        iframe.remove()
      }
    setTimeout(next, 1000, e.target)
    
    if (app === _this.domain) {
      _this.code = code
      setTimeout(next, 1000)
      resolve(code)
    } else {
      console.log('trouble app and domain')
      setTimeout(next, 1000)
      reject()
    }
  }
  this._getCode = function () {
    return new Promise ((resolve, reject) => {
      // not 
      console.log(_this.clientId)
      iframe = document.createElement('iframe');
      iframe.style.display = "none";
      // iframe.src = /* your URL here */;
      document.body.appendChild(iframe)
      // var loadListener = document.addEventListener()
      iframe.setAttribute('id', 'test')
      iframe.addEventListener('load', _this.extractCode)
      // iframe.onload = _this.extractCode
      console.log(iframe)
      var params = {
          response_type: 'code',
          client_id: _this.clientId,
          scope: 'openid',
          state: _this.domain,
          redirect_uri: _this.baseUrl
      }
      var url = process.env.SSO_URL + '/realms/' + process.env.SSO_REALM + '/protocol/openid-connect/auth?' 
      url += Object.keys(params).map(function (key) {
        return key + '=' + encodeURIComponent(params[key])
      }).join('&')
      console.log(url)
      iframe.src = url
    })
  }
  let pq = new PromiseQueue({concurrency: 1})
  pq.pause()
  pq.add([_this.getCliendId, _this._getCode])
  this._initializeResto = function () {
    // search code ...
    console.log('init resto' + this.domain)
    // add iframe and listen on load
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    console.log(process)
    // pq.resume()
    // this.getCliendId.then(resp => console.log(resp))
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