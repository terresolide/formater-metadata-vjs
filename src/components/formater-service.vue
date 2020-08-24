<i18n>
{
  "fr": {
   "need_log": "Pour accéder à toutes les données du service <b>{domain}</b>, vous devez<br /> - vous connecter <br /> - puis autoriser ce service à accéder à vos données.",
   "need_authorize": "Pour accéder à toutes les données du service <b>{domain}</b>, vous devez l'autoriser à accéder à vos données.",
   "log_service": "Pour accéder à toutes les données du service <b>{domain}</b>, vous devez vous connecter."
   },
   "en": {
   "need_log": "To access all data of {domain} service,<br /> you must login in then authorize this service to access your personnal data.",
   "need_authorize": "To access all data of {domain} service,<br /> you must authorize this service to access your personnal data.",
    "log_service": "To access all data of {domain} service,<br /> you must login to this service."
  
   }
}
</i18n>
<template>
 <span class="mtdt-service">
 <div class="mtdt-msg" v-if="msg" >
 <div  style="text-align:right;" ><i class="fa fa-close" style="cursor: pointer;" @click="msg = false"></i></div>
 <h2 style="margin-top:0;">Important!</h2>
  <div v-if="$store.state.geonetwork && !email" 
  v-html="$t('need_log', {domain: service.domain})"></div>

  <div v-else-if="$store.state.geonetwork && email"
   v-html="$t('need_authorize', {domain: service.domain})"></div>
  
  <div v-else="$store.state.metadata" 
    v-html="$t('log_service', {domain: service.domain})"></div>
 </div>
 <div class="mtdt-service-button" v-show="clientId && service.token === null" @click="searchCode" style="display:inline-block;color:darkred;border:1px solid blackred;border-radius:3px;">
   <span v-if="$store.state.metadata">Log to {{service.domain}}</span>
   <span v-else-if="email">Authorize {{service.domain}}</span>
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
      msg: null
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
      var url = this.authUrl + '?'
      var paramsStr = Object.keys(params).map(function (key) {
        return key + '=' + params[key]
      }).join('&')
      url += paramsStr
      window.open(url, "_blank", "height=750, width=850, status=yes, toolbar=no, menubar=no, location=no,addressbar=no");
    },
    getMessage(e) {
      if (e.data.code && e.data.state === this.state) {
        this.getToken(e.data.code)
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
      .then(resp => this.setToken(resp.body))
    },
    setToken (data) {
      if (data.token) {
        this.$store.commit('services/setToken', {id: this.service.id, token: data.token})
      }
    }
  }
}
</script>
<style >
.mtdt-service-button{
  border: 1px solid black;
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
</style>
