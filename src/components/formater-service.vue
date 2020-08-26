<i18n>
{
  "fr": {
   "need_log": "Pour accéder à toutes les données du service <b>{domain}</b>, vous devez<br /> - vous connecter <br /> - puis autoriser ce service à accéder à vos données.",
   "need_authorize": "Pour accéder à toutes les données du service <b>{domain}</b>, vous devez l'autoriser à accéder à vos données.",
   "log_service": "Pour accéder à toutes les données du service <b>{domain}</b>, vous devez vous y connecter.",
   "authorize": "Autoriser",
   "login": "Se connecter",
   "logout": "Se déconnecter",
   "log_to": "Se connecter au service {domain}"
   },
   "en": {
   "need_log": "To access data of <b>{domain}</b>  service,<br /> you must login in then authorize this service to access your personnal data.",
   "need_authorize": "To access data of <b>{domain}</b> service,<br /> you must authorize this service to access your personnal data.",
    "log_service": "To access data of <b>{domain}</b>  service,<br /> you must login to this service.",
    "authorize": "Authorize",
    "login": "Sign in",
    "logout": "Se déconnecter",
    "log_to": "Sign in the {domain} service"
  
   }
}
</i18n>
<template>
 <span class="mtdt-service">
 <div class="mtdt-msg" v-if="msg" >
 <div  style="text-align:right;" ><i class="fa fa-close" style="cursor: pointer;" @click="msg = false"></i></div>
 <div class="mtdt-msg-title" >Important!</div>
  <div v-if="$store.state.geonetwork && !email" 
  v-html="$t('need_log', {domain: service.domain})"></div>

  <div v-else-if="$store.state.geonetwork && email"
   v-html="$t('need_authorize', {domain: service.domain})"></div>
  
  <div v-else="$store.state.metadata" 
    v-html="$t('log_service', {domain: service.domain})"></div>
  
   <div class="mtdt-service-button" v-show="clientId && service.token === null"
     @click="searchCode">
   <span v-if="$store.state.metadata">{{$t('login')}}</span>
   <span v-else-if="email">{{$t('authorize')}}</span>
</div>
 </div>
 <div v-if="!$store.state.metadata && email" class="mtdt-service-button" :class="{searching: searching}" v-show="clientId">

   <a v-if="service.token" class="mtdt-menu-item" 
   @click="logout" :style="{'--color': $store.state.style.primary}">
      {{$t('authorize')}} {{service.domain}}
      <i  class="fa fa-check-square-o"></i>
   </a>
   <a v-if="!service.token" class="mtdt-menu-item" 
   @click="searchCode" :style="{'--color': $store.state.style.primary}">
      {{$t('authorize')}} {{service.domain}}
      <i  class="fa fa-square-o"></i>
   </a>
</div>
<div class="mtdt-service-button" v-else="$store.state.metadata">
      <a  v-if="!service.token" @click="searchCode" 
   :style="{'--color': $store.state.style.primary}"
    :title="$t('log_to', {domain: service.domain})">
   <i class="fa fa-sign-in" style="font-size:1.5rem;"></i>
    {{$t('login')}} 
   </a>
	 <a v-else @click="logout"  :style="{'--color': $store.state.style.primary}">
	 <i class="fa fa-sign-out" style="font-size:1.5rem;"></i>
	  {{$t('logout')}} 
	 </a>
 </div>
</span>
</template>
<script>

export default {
  name: 'FormaterService',
  components: {
  },
  props: {
    service: {
      type: Object,
      default: null
    }
  },
  computed: {
    email () {
      return this.$store.getters['user/email']
    },
    redirectUri () {
      if (this.$store.state.ssoLogin) {
        return this.$store.state.ssoLogin
      }
      var found = window.location.href.match(/^(.*\/)#/)
      if (found && found.length > 1) {
        console.log(found[1])
       return found[1]
      } else {
        return null
      }
    }, 
    authUrl () {
      return this.$store.getters['user/loginUrl']
    }
  },
  data() {
    return {
      src: null,
      root: null,
      clientId: null,
      domain: null,
      codeListener: null,
      state: null,
      msg: null,
      searching: false
    }
  },
  created () {
    this.getClientId()
    this.codeListener = this.getMessage.bind(this)
    window.addEventListener('message', this.codeListener)    
  },
  destroyed () {
    window.removeEventListener('message', this.codeListener)
    this.codeListener = null
  },
  methods: {
    getClientId () {
      var url = this.service.clientIdUrl
      this.$http.get(url).then(function (response) {
        if (response.body && response.body.clientId) {
          this.clientId = response.body.clientId
          this.msg = true
          this.$store.commit('services/setClientId', {id: this.service.id, clientId: this.clientId})
          this.state = 'php' + btoa(this.clientId).replace(/=|\+|\//gm, '0')
        }
	    }, resp => console.log('NO_CLIENT_ID'))
    },
    searchCode () {
      if (!this.clientId) {
        return null
      }
      var params = {
          redirect_uri: encodeURIComponent(this.redirectUri),
          response_type: 'code',
          client_id: this.clientId,
          scope: 'openid',
          state: this.state
      }
      this.searching = true
      var url = this.authUrl + '?'
      var paramsStr = Object.keys(params).map(function (key) {
        return key + '=' + params[key]
      }).join('&')
      url += paramsStr
      window.open(url, "_blank", "height=750, width=850, status=yes, toolbar=no, menubar=no, location=no,addressbar=no");
    },
    getMessage(e) {
      if (e.data.code && e.data.state === this.state) {
        this.msg = false
        this.getToken(e.data.code)
      } else {
        this.searching = false
      }
    },
    getToken (code) {
      console.log('GET TOKEN')
      console.log(code)
      var url = this.service.authUrl
      var params = {
        code: code,
        state: this.state,
        clientId: this.clientId,
        redirectUri: this.redirectUri
      }
      this.$http.post(url, params, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application.json'
         }
      })
      .then(resp => this.setToken(resp.body), resp => {this.searching = false})
    },
    setToken (data) {
      this.searching = false
      if (data.token) {
        this.$store.commit('services/setToken', {id: this.service.id, token: data.token})
      }
    },
    logout () {
      this.$store.commit('services/setToken', {id: this.service.id, token: null})
    }
  }
}
</script>
<style >
.mtdt-service-button{
  display:inline-block;
  border-radius:3px;
  cursor: pointer;
   pointer-events: auto;
}
.mtdt-service-button.searching{
  pointer-events: none;
  }
  
.mtdt-msg .mtdt-service-button {
 display: block;
  text-align: right;
  margin-right: 20px;
   cursor: auto;
}
.mtdt-msg .mtdt-service-button span {
  background: darkred;
  color: white;
  padding: 5px 8px;
  border-radius:5px;
   cursor: pointer;
  box-shadow: 0 1px 5px rgba(0,0,0,.65);
}
.mtdt-msg {
background: #fefefe;
color:darkred;
max-width: 450px;
padding: 0 10px 20px 10px;
border-radius: 5px;
position: fixed; 
top:30%; 
left:30%;
z-index:10;
text-align: left;
box-shadow: 2px 3px 3px 3px rgba(0, 0, 0, 0.5);
}
div.mtdt-msg-title {
  font-size: 1.5rem;
  font-weight:800;
  margin-bottom:10px;
}
.mtdt-menu-item {
  padding: 0 10px;
  border-right: 1px solid black;
}
.mtdt-service-button a {
  color: var(--color);
}
.mtdt-service-button a:hover {
  color: darkred;
}
/* .mtdt-menu-item:after{
  content: "|";
  padding-left:10px;
}*/
</style>
