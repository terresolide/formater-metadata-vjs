<i18n>
{
  "fr": {
    "access_to": "Connecté à",
    "access_token": "token d'accès",
    "authorize": "Autoriser",
    "authorization_failed": "La connexion au service {domain} a échoué.",
    "copied_to_clipboard": "Le token a été copié dans le presse-papier.<br>Il expire dans <b>{time}</b>",
    "copy_in_clipboard": "Copier le token d'accès dans le presse-papier",
    "insufficient_right": "Vos droits sont insuffisants\npour accéder aux services\nde visualisation et téléchargement de cette collection",
    "limited_access_to": "Accès limité à {domain}",
    "log_service": "Pour visualiser ou télécharger les données de <b>{domain}</b>, vous devez vous y connecter.",
    "log_to": "Se connecter au service {domain}",
    "login": "Se connecter",
    "logout": "Se déconnecter",
    "need_authorize": "Pour visualiser ou télécharger les données de <b>{domain}</b>, vous devez autoriser ce service à accéder à vos données personnelles (email, nom, rôles).",
    "need_log": "Pour accéder à toutes les données du service <b>{domain}</b>, vous devez vous connecter puis, si vous avez <b>les droits suffisants</b> et suivant votre navigateur, autoriser ce service à accéder à vos données (nom, email).",
    "service_response": "La réponse du service est",
    "session_expire": "Votre session auprès de <b>{domain}</b> a expiré.<br />Vous devez vous reconnecter."
  },
  "en": {
    "access_to": "Login to",
    "access_token": "Access token",
    "authorize": "Authorize",
    "authorization_failed": "Connection to the service {domain} failed.",
    "copied_to_clipboard": "The token has been copied in clipboard.<br>It will expire in <b>{time}</b>",
    "copy_in_clipboard": "Copy the access token in clipboard",
    "insufficient_right": "Your rights are insufficient\nto access the viewing\nand downloading services of this collection",
    "limited_access_to": "Limited access to {domain}",
    "log_service": "To access data of <b>{domain}</b>  service,<br /> you must login to this service.",
    "log_to": "Sign in the {domain} service",
    "login": "Sign in",
    "logout": "Se déconnecter",
    "need_authorize": "To visualize and download data of <b>{domain}</b> and your browser, you must authorize this service to access your personnal data (email, name, roles).",
    "need_log": "To access data of <b>{domain}</b>  service,<br /> you must login in then, if you have sufficient rights, you must authorize this service to access your personnal data (name, email).",
    "service_response": "The service has responded",
    "session_expire": "Your session width <b>{domain}</b> has expired.<br /> You need to log back in."
  }
}
</i18n>
<template>
 <span class="mtdt-service">
 <div class="mtdt-msg" v-if="msg" >
 <div  style="text-align:right;" ><i class="fa fa-close" style="cursor: pointer;" @click="close"></i></div>
 <div class="mtdt-msg-title" >
      <span v-if="!errorMessage">Important!</span>
      <span v-else >{{$t('error')}}</span>
 </div>
 
 <!--   <div v-if="$store.state.geonetwork && !email" 
  v-html="$t('need_log', {domain: service.domain})"></div>
   <div v-else-if="hasExpired" v-html="$t('session_expire', {domain: service.domain})">
  </div>
  <div v-else-if="$store.state.geonetwork && email"
   v-html="$t('need_authorize', {domain: service.domain})"></div>
  
  <div v-else="$store.state.metadata" 
    v-html="$t('log_service', {domain: service.domain})"></div>
  -->
  <div v-if="!email"  v-html="$t('need_log', {domain: service.domain})"></div>
   <div v-else-if="hasExpired" v-html="$t('session_expire', {domain: service.domain})">
  </div>
  <div v-else-if="email && hasAccess && !service.token && !errorMessage"
   v-html="$t('need_authorize', {domain: service.domain})">
   </div>
   <div v-else-if="errorMessage">
     <div>{{$t('authorization_failed', {domain: service.domain})}}</div>
     <div>{{$t('service_response')}}: &laquo;{{errorMessage}}&raquo;</div>
   </div>
   <div class="mtdt-service-button" :class="{searching: searching}" v-show="clientId && service.token === null"
     @click="searchCode" >
	   <!--  <span v-if="$store.state.metadata">{{$t('login')}}</span> -->
	   <span v-if="email && hasAccess && !errorMessage">{{$t('authorize')}}</span>
   </div>
 </div>
 <!--  <div v-if="!$store.state.metadata && email" class="mtdt-service-button" :class="{searching: searching}" v-show="clientId">
  -->
  <!--   <iframe v-if="iframeUrl" style="display:none;" :src="iframeUrl" ></iframe>  -->
 <div v-if="email" class="mtdt-service-button" :class="{searching: searching}" v-show="clientId">
   <a v-if="service.token" 
   @click="logout" :style="{'--color': $store.state.style.primary}">
      {{$t('access_to')}} {{service.domain}}
      <i  class="fa fa-check-square-o"></i>
   </a>
   <a v-if="!service.token && hasAccess" class="mtdt-menu-item" :class="{searching: searching}"
   @click="searchCode" :style="{'--color': $store.state.style.primary}">
      {{$t('access_to')}} {{service.domain}}
      <i  class="fa fa-square-o"></i>
   </a>
   <a v-if="!service.token && !hasAccess" class="mtdt-menu-item" :class="{searching: searching}"
    :style="{'--color': $store.state.style.primary}" :title="$t('insufficient_right')">
      {{$t('limited_access_to', {domain: service.domain})}} 
      <i  class="fa fa-ban"></i>
    <!--    <div>Demande accès</div>
      <div>{{access}}</div>
      <div>{{service.access}}</div>-->
   </a>
    <a v-if="service.token && !hasAccess" class="mtdt-menu-item" :class="{searching: searching}"
    :style="{'--color': $store.state.style.primary}" :title="$t('insufficient_right')">
      Droit insuffisant demande accès
      <i  class="fa fa-ban"></i>
   </a>
   <span  v-if="service.token"  class="copy-clipboard mtdt-menu-item" :title="$t('copy_in_clipboard')">
             (<a @click="copyClipboard($event)" :style="{'--color': $store.state.style.primary}"><i class="fa fa-clipboard"></i> {{$t('access_token')}}</a>)
            <div class="clipboard-tooltip"   @click="removeTooltip($event)" v-html="$t('copied_to_clipboard', {time: getTime})"></div>
   </span> 
</div>
<!--  <div class="mtdt-service-button" v-if="$store.state.metadata"
:class="{searching: searching}" >
  <span v-if="identity">{{identity.email}}</span>
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
 </div>-->
</span>
</template>
<script>
import jwt_decode from 'jwt-decode'
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
    getTime () {
      return new Date(this.time).toISOString().substr(11, 8);
    },
    hasAccess () {
      if (!this.access) {
       // this.msg = true
        return false
      }
      var access = this.access.view || this.access.download
    //  this.msg = access && !this.service.token
      return access
    },
    client () {
      return this.$store.getters['roles/getClient'](this.service.clientId)
    },
    access () {
      if (!this.clientId || this.reject) {
        return false
      }
      // var result = this.$store.getters['user/getAccess'](this.clientId, this.service.access)
      return this.$store.getters['user/getAccess'](this.service.access)
    },
//     isFormater (newvalue) {
//       var isFormater = this.$store.getters['user/isFormater']
//       this.testLoginSso(this.email, isFormater)
//       return isFormater
//     },
    redirectUri () {
      if (this.$store.state.ssoLogin) {
        return this.$store.state.ssoLogin
      }
      var found = window.location.href.match(/^(.*\/)#/)
      if (found && found.length > 1) {
       return found[1] + '#/'
      } else {
        return null
      }
    }, 
    authUrl () {
      return this.$store.getters['user/loginUrl']
    }
  },
  watch: {
    email (newvalue) {
      if (!newvalue) {
        this.$store.commit('services/setToken', {id: this.service.id, token: null})
        this.searching = false
      }
    }
  },
  data() {
    return {
      src: null,
      root: null,
      clientId: null,
      reject: false,
      errorMessage: null,
      domain: null,
      codeListener: null,
      state: null,
      msg: null,
      searching: false,
      popup: null,
      identity: null,
      expire: null,
      time: 0,
      hasExpired: false,
      timer: null,
      needAuthorize: null,
      iframeUrl: null,
      showTooltip: false
    }
  },
  created () {
    this.getClientId()
    this.codeListener = this.getMessage.bind(this)
    window.addEventListener('message', this.codeListener) 
    this.needAuthorize = this.openPopupAuthorize.bind(this)
    document.addEventListener('fmt:needAuthorize', this.needAuthorize)
   
  },
  destroyed () {
    window.removeEventListener('message', this.codeListener)
    this.codeListener = null
    document.addEventListener('fmt:needAuthorize', this.needAuthorize)
    this.needAuthorize = null
  },
  methods: {
    close () {
      this.msg = false
      this.hasExpired = false
      this.errorMessage = null
    },
    copyClipboard (event) {
      var _this = this
      var target = event.target
      navigator.clipboard.writeText(this.service.token).then(function() {
        /* clipboard successfully set */
        target.classList.add('tooltip-show')
        setTimeout(function () {
          target.classList.remove('tooltip-show')
        }, 6000)
      }, function() {
        alert(_this.$i18n.t('unauthorized_clipboard'))
      }); var _this = this
    },
    removeTooltip (event) {
      var node = event.target
      node.previousElementSibling.classList.remove('tooltip-show')
    },
    getClientId () {
      this.clientId = this.service.clientId
      if (this.email && this.hasAccess) {
		    this.msg = true
		  }
      this.state = 'php' + btoa(this.clientId + this.service.domain).replace(/=|\+|\//gm, '0')
      this.testLoginSso()
//       var url = this.service.clientIdUrl
//       this.$http.get(url).then(function (response) {
//         if (response.body && response.body.clientId) {
//           this.clientId = response.body.clientId
//           if (this.email && this.hasAccess) {
//             this.msg = true
//           } else {
//             console.log('no client Id')
//           }
//           this.$store.commit('services/setClientId', {id: this.service.id, clientId: this.clientId})
//           this.state = 'php' + btoa(this.clientId + this.service.domain).replace(/=|\+|\//gm, '0')
//           this.testLoginSso()
//         }
// 	    }, resp => console.log('NO_CLIENT_ID'))
    },
   
    searchCode () {
      console.log(this.clientId)
      if (!this.clientId) {
        return null
      }
      console.log(this.clientId)
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
      this.openPopup(url)
      // window.open(url, "_blank", "height=750, width=850, status=yes, toolbar=no, menubar=no, location=no,addressbar=no");
    },
    openPopup (url) {
      this.popup = window.open(url, "_blank", "height=750, width=850, status=yes, toolbar=no, menubar=no, location=no,addressbar=no");
      var _this = this
      var loop = setInterval(function() {
        if (_this.popup.closed) {
          clearInterval(loop)
          _this.searching = false
          _this.popup = null
        }
      })
    },
    getMessage(e) {
      if (e.data.code && e.data.state === this.state) {
        this.msg = false
        this.getToken(e.data.code)
        this.iframeUrl = null
      }
      this.searching = false

    },
    testLoginSso (email, hasAccess) {
      if (!email || !hasAccess || !this.clientId || !this.redirectUri) {
        return
      }
      var params = {
          redirect_uri: encodeURIComponent(this.redirectUri),
          response_type: 'code',
          client_id: this.clientId,
          scope: 'openid',
          state: this.state,
          prompt: 'none'
      }
      // this.searching = true
      var url = this.authUrl + '?'
      var paramsStr = Object.keys(params).map(function (key) {
        return key + '=' + params[key]
      }).join('&')
      url += paramsStr
      this.iframeUrl = url
      // window.postMessage(this.$store.getters['user/clientId'] + ' ' + 'blabla', 'https://sso.aeris-data.fr')
//       this.$http.get(url, {credentials: true})
//       .then(resp => console.log(resp), resp => console.log(browser.cookies.get({name: 'KEYCLOAK_IDENTITY' })))
    },
    getToken (code) {
      if (this.reject) {
        return
      }
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
      .then(
         resp => this.setToken(resp.body), 
         resp => {
           console.log('REJETE')
           this.reject = true
           this.msg = true
           this.errorMessage = resp.status + ' - ' + resp.statusText
           // alert('SERVER RESPONSE ' + resp.status + ' - ' + resp.statusText)
           this.searching = false
         }
      )
    },
    openPopupAuthorize (event) {
      var currentId = this.$store.getters['services/current']
      if (this.service.id === currentId) {
        this.msg = true
      }
    },
    setToken (data) {
      this.searching = false
      if (this.timer) {
        clearInterval(this.timer)
      } 
      if (data.token) {
        this.$store.commit('services/setToken', {id: this.service.id, token: data.token})
        this.$store.commit('roles/setToken', {client: this.service.clientId, token: data.token})
        // if (this.$store.state.metadata) {
          var obj = jwt_decode(data.token)
          this.identity = obj.data || null
          var now = new Date()
          this.expire = obj.exp * 1000 // - now.getTime() 
          var now = new Date()
          this.time = this.expire - now.getTime()
          // if (this.expire > 2000) {
          this.timer = setInterval(this.refreshToken, 6000)
          // }
        // }
      }  else {
        this.logout()
      }   
    },
    refreshToken () {
      var now = new Date()
      this.time = this.expire - now.getTime()
      if (this.time < 180000) {
	      this.$http.get(this.service.refreshUrl,    
	      // this.$http.get(this.service.refreshUrl + '?_tk=' + this.service.token,
	          {
	             headers: {
	               "Authorization": "Bearer " + this.service.token
	//               'Content-Type': 'application/json',
	//               'Accept': 'application.json',
	              }
	          }
	      )
	      .then(function (resp) {
	        if (resp.body.token) {
	          this.$store.commit('services/setToken', {id: this.service.id, token: resp.body.token})
	          var obj = jwt_decode(resp.body.token)
	          var now = new Date()
	          this.expire = obj.exp * 1000
	          this.time = this.expire - now.getTime()
	        } else {
	          this.hasExpired = true
	          this.time = 0
	          this.msg = true
	          this.logout()
	        }
	        if (resp.body.status === 'error') {
	          
	        }
	      }, resp => this.logout())
      }
    },
    validToken () {
     var now = new Date()
     this.time = this.expire - now.getTime()
     if (this.time < 180000) {
	      this.$http.get(this.service.validationUrl + '?_tk=' + this.service.token,
	          {
	            headers: {
	              'Content-Type': 'application/json',
	              'Accept': 'application.json',
	             }
	          })
	          .then(function (resp) {
	            if (resp.body.status === 'error') {
	              this.hasExpired = true
	              this.time = 0
	              this.msg = true
	              this.logout()
	            }
	          }, resp => this.logout())
      } 
    },
    logout () {
      this.identity = null
      this.expire = null
      this.time = 0
      clearInterval(this.timer)
      this.timer = null
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
  margin-top:20px;
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
z-index:1000;
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
/**
use css of formater-user
.copy-clipboard {
  position: relative;
}
.clipboard-tooltip {
  position: absolute;
  background-color: #fafafa;
  border: 1px solid #a3a3a3;
  font-size: smaller;
  line-height: 1;
  padding: 4px;
  width: 160px;
  text-align: left;
  left:150px;
  color:black;
  z-index:100;
  -webkit-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
}
span div.clipboard-tooltip  {
  cursor: pointer;
  font-size:0.8rem;
  left:0;
}
**/ 
/* .mtdt-menu-item:after{
  content: "|";
  padding-left:10px;
}*/
</style>
