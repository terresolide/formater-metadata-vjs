<i18n>
{
  "en": {
    "cancel": "Cancel",
    "login": "Sign in",
    "logout": "Sign out",
    "limited_access":"Limited access",
    "not_logout_sso": "You are logged out of the application.<br />But you are not logged out of &laquo;ForM@Ter SSO&raquo;."
  },
  "fr": {
    "cancel": "Annuler",
    "login": "Se connecter",
    "logout": "Se déconnecter",
    "limited_access":"Accès limité",
    "not_logout_sso": "Vous êtes déconnecté de l'application.<br />Mais vous n'êtes pas déconnecté du &laquo;SSO ForM@Ter&raquo;."
  }
}
</i18n>
<template>
 <span class="mtdt-authentication">
   <!--    <div v-if="ssoLogoutInfo" class="formater-logout-sso" >
      <div>
        <div class="fa fa-close" @click.self="closeLogout($event)"></div>
        <div v-html="$t('not_logout_sso')"></div>
        <div style="text-align:right;margin-top:20px;">
            <input style="max-width:150px;" class="button" type="button" @click.self="closeLogout($event)" :value="$t('cancel')" />
           <input style="max-width:150px;" type="button" @click="logoutSso()" :value="$t('logout')" />
        </div>
      </div>
    </div> -->
    <formater-service v-show="currentService === index"
     v-for="(service, index) in services" :key="index" :service="service">
     </formater-service>
   <!--    <div v-if="!$store.state.metadata" class="mtdt-user" :class="{searching: searching}"> -->
     <div  class="mtdt-user" :class="{searching: searching}"> 
      <formater-user v-if="email"></formater-user>
		  <span   v-if="email">
		   <!--   <a v-if="!isFormater && !alreadyAsk"   :style="{'--color': $store.state.style.primary}" style="margin-right:10px;" @click="msg = true"><i class="fa fa-key"></i> {{$t('limited_access')}}</a>
      -->
		    <a   @click="logout"   :title="$t('logout')" :style="{'--color': $store.state.style.primary}">
		    <i class="fa fa-sign-out" ></i> 
		    {{$t('logout')}}</a>
		  </span>
		 <span  v-else>
		    <a @click="login"   title="login" :style="{'--color': $store.state.style.primary}">
		    <i class="fa fa-sign-in" style="font-size:1.2rem;vertical-align:middle;"></i> 
		    {{$t('login')}}
		    </a>
	    </span>
	  </div>
	  <!--  
	  <iframe v-if="iframeUrl" style="display:none;" :src="iframeUrl" ></iframe>
	 <!--  <i class="fa fa-user" :style="{color:$store.state.style.primary}"></i>  -->
 </span>

</template>
<script>
import FormaterService from '@/components/formater-service.vue'
import FormaterUser from '@/components/formater-user.vue'
import jwt_decode from 'jwt-decode'
export default {
  name: 'FormaterAuthentication',
  components: {
    FormaterService,
    FormaterUser
  },
  props: {
  },
  computed: {
    email () {
//       if (!this.find) {
//         this.searchCode()
//       }
      return this.$store.getters['user/email']
    },
    user () {
      return this.$store.getters['user/get']
    },
    nonce () {
      return this.$store.getters['user/nonce']
    },
    clientId () {
      return this.$store.getters['user/clientId']
    },
    loginUrl () {
      return this.$store.getters['user/loginUrl']
    },
    userInfoUrl () {
      return this.$store.getters['user/infoUrl']
    },
    logoutUrl () {
      return this.$store.getters['user/logoutUrl']
    },
    tokenUrl () {
      return this.$store.getters['user/tokenUrl']
    },
    baseUrl () {
      var found = window.location.href.match(/.*\/#/)
      if (found && found.length > 0) {
        return found[0]
      } else {
        return null
      }
    },
    currentService () {
      return this.$store.getters['services/current']
    },
//     isFormater () {
//       return this.$store.getters['user/isFormater']
//     },
    services () {
      return this.$store.getters['services/all']
    }
  },
  data() {
    return {
      codeListener: null,
      searching: false,
      popup: null,
      alreadyAsk: false,
      msg: false,
      iframeUrl: null,
      ssoLogoutInfo: false
     // iframe: null
    }
  },
  created () {
    this.codeListener = this.getMessage.bind(this)
    window.addEventListener('message', this.codeListener)
    // case already connected
    this.requestClientForApp()
    
    // this.updateTokens()
    // this.getTokens()
    // this.testLoginSso()
  },
  destroyed () {
    window.removeEventListener('message', this.codeListener)
    this.codeListener = null
  },
  methods: {
   closeLogout (event) {
     this.ssoLogoutInfo = false
     event.stopPropagation()
     event.preventDefault()
     return false
   },
   loginParams (redirectUrl) {
     return this.$store.getters['user/loginParams'](redirectUrl, true)
   },
   getCookie () {
       var name = this.clientId + "=";
       var ca = document.cookie.split(';');
       for(var i=0;i < ca.length;i++) {
         var c = ca[i];
         while (c.charAt(0)==' ') c = c.substring(1,c.length);
         if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
       }
       return null;
   },
   getMessage (e) {
     if (e.data.code && e.data.state == this.$store.getters['user/getState']) {
       this.$store.commit('user/setCode', e.data.code)
       this.getTokens()
       this.iframeUrl = null
     } else if (e.data === 'logout') {
       this.resetUser()
     }
   },
   getUserRoles () {
       this.$http.get(this.userInfoUrl,
           {
             credentials: true,
             headers: {
               'Accept': 'application/json',
               'Authorization': 'Bearer ' + this.$store.getters['user/token']
             }
           }
       ).then(function (resp) {
         console.log(resp)
       })
   },
   getTokens () {
     
     if (this.$store.getters['user/code']) {
       var postdata = {
         code: this.$store.getters['user/code'],
         grant_type: 'authorization_code',
         client_id: this.clientId,
         redirect_uri: this.$store.getters['user/redirectUri']
           
       }
       this.$http.post(this.tokenUrl, 
           postdata, 
           {
             credentials: true,
             emulateJSON: true,
             headers: {'Accept': 'application/json'}
           }
         )
       .then(function (resp) {
         this.setTokens(resp.body)
         if (!this.user.organization) {
           this.$store.commit('user/toggleShow', {client: null, access: null})
         }
         var expires = resp.body.expires_in - 50
         var _this = this
         var next = function () {
           _this.updateTokens()
         }
         setTimeout(next, expires * 1000)
       }, this.resetUser)
     }
   },
   setCookie (refreshToken) {
     if (!refreshToken) {
       document.cookie = this.clientId + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;secure=True'
     } else {
       document.cookie = this.clientId + '=' + refreshToken + ';;path=/;SameSite=strict;secure=True'
     }
   },
   setTokens (data) {
     this.searching = false
     this.setCookie(data.refresh_token)
     this.$store.commit('user/setTokens', data)
   },
   updateTokens () {
     var refresh = this.getCookie()
     if (!refresh) {
       return
     }
     var postdata = {
       refresh_token: refresh,
       grant_type: 'refresh_token',
       client_id: this.clientId,
       redirect_uri: this.$store.getters['user/redirectUri']
           
     }
     this.$http.post(this.tokenUrl, 
         postdata, 
         {
           credentials: true,
           emulateJSON: true
         }
       )
     .then(function (resp) {
       this.setTokens(resp.body)
       var expires = resp.body.expires_in
       var _this = this
       var next = function () {
         _this.updateTokens()
       }
       setTimeout(next, expires * 1000)
     }, this.resetUser)
   },
   logout () {
     this.resetUser()
     this.iframeUrl = null
     //this.ssoLogoutInfo = true
     this.searching = false
     this.logoutSso() 
//      var url = this.logoutUrl + '?redirect_uri=' + redirectUri 
//      this.openPopup(url)
   },
   logoutSso () {
     
     var redirectUri = this.$store.state.ssoLogout ? this.$store.state.ssoLogout : this.baseUrl + '/logout?'
     var url = this.logoutUrl + '?redirect_uri=' + redirectUri 
     this.openPopup(url)
     this.ssoLogoutInfo = false
   },
   openPopup (url) {
     window.open(url, "_blank", "height=750, width=850, status=yes, toolbar=no, menubar=no, location=no,addressbar=no");
     var _this = this
     setTimeout(function () {
       _this.searching = false
     }, 5000)
   },
   login () {
     this.searching = true
     // var redirectUri = this.baseUrl + '/login?'
     var redirectUri = this.$store.state.ssoLogin ? this.$store.state.ssoLogin : this.baseUrl + '/login?'
       
    // var redirectUri = 'https://www.poleterresolide.fr/sso-login/'
     var url = this.loginUrl + '?' + this.loginParams(redirectUri)  
     this.$store.commit('user/setRedirectUri', redirectUri)
     this.openPopup(url)
     // this.iframe = 'https://sso.aeris-data.fr/auth/realms/test/protocol/openid-connect/login-status-iframe.html'
     // wn.postMessage(this.clientId + ' ' + this.$store.getters['user/getState'], 'http://localhost:8080')
     // window.open(url, "_blank", "height=750, width=850, status=yes, toolbar=no, menubar=no, location=no,addressbar=no");
   },
   requestClientForApp () {
     this.$http.get(this.$store.state.checkSSO + '/api/client/' + this.$store.state.app)
     .then(resp => {
       if (resp.body.success) {
         this.$store.commit('user/setClient', resp.body.client)
         this.updateTokens()
       }
     })
   },
   resetUser () {
     this.searching = false
     this.setCookie(null)
     this.$store.commit('user/reset')
     this.$store.commit('services/reset')
   }
  }
}
</script>
<style>
/*.mtdt-authentication ,
.mtdt-authentication  a,
.mtdt-authentication span,
.mtdt-authentication  i {
  vertical-align:middle;
}*/
.mtdt-authentication input[type="button"] {
    margin: 0 0 3px 7px;
    padding: 3px 12px;
    text-align: center;
    border-width: 1px;
    border-style: solid;
    border-radius: 1px;
    font-size: 16px;
    line-height: 1.7;
    border-color: #e5b171 #cb8025 #cb8025;
    background:#754a15;
    color: #fff;
    text-decoration: none;
    vertical-align: top;
    cursor: pointer;
    pointer-events: auto;
    box-sizing: border-box;
    box-shadow: 0 1px 5px rgba(0,0,0,.65);
}
/* .mtdt-authentication .fa-close { */
/*    position: absolute; */
/*    top: 0; */
/*    right: 0; */
/*    padding: 2px 5px; */
/*    border: 1px dotted white; */
/*    opacity:0.9; */
/*    cursor: pointer; */
/* } */
/* .mtdt-authentication .fa-close:hover { */
/*   opacity: 1; */
/*   border-color:grey; */
/* } */
.formater-logout-sso{
  position:fixed;
  top:5px;
  width:100%;
  left:0;
  z-index:100;
}
.formater-logout-sso  > div {
  position: relative;
  max-width: 600px;
  width:600px;
  min-width: 500px;
  margin:auto;
 margin-top: 50vh; /* poussé de la moitié de hauteur de viewport */
  transform: translateY(-50%); /* tiré de la moitié de sa propre hauteur */
  padding:20px;
  text-align:left;
  background: white;
  box-shadow: 2px 3px 3px 3px rgba(0, 0, 0, 0.5);
  max-height:95vh;
}
.mtdt-authentication .mtdt-user {
  display: inline-block;
  pointer-events:auto;
}
.mtdt-authentication .mtdt-user i {
font-size:1.2rem;
vertical-align:middle;
}
.mtdt-authentication .mtdt-user > span {
  padding: 0 10px;
}
.mtdt-authentication .mtdt-user.searching {
  pointer-events: none;
}

.mtdt-authentication a {
  cursor: pointer;
}
.mtdt-authentication a {
  color: var(--color);
}
.mtdt-authentication a:hover {
  color: darkred;
}

</style>
