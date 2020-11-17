<i18n>
{
  "en": {
    "login": "Sign in",
    "logout": "Sign out"
  },
  "fr": {
    "login": "Se connecter",
    "logout": "Se déconnecter"
  }
}
</i18n>
<template>
 <span class="mtdt-authentication">
    <formater-service v-show="currentService === index"
     v-for="(service, index) in services" :key="index" :service="service">
     </formater-service>
    <div v-if="!$store.state.metadata" class="mtdt-user" :class="{searching: searching}"> 
      <span   v-if="email">{{email}}</span>
		  <span   v-if="email">
		  
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
	 <!--  <i class="fa fa-user" :style="{color:$store.state.style.primary}"></i>  -->
 </span>

</template>
<script>
import FormaterService from '@/components/formater-service.vue'
// import jwt_decode from 'jwt-decode'
export default {
  name: 'FormaterAuthentication',
  components: {
    FormaterService
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
    nonce () {
      return this.$store.getters['user/nonce']
    },
    clientId () {
      return this.$store.getters['user/clientId']
    },
    loginUrl () {
      return this.$store.getters['user/loginUrl']
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
    services () {
      return this.$store.getters['services/all']
    }
  },
  data() {
    return {
      codeListener: null,
      searching: false,
      popup: null
    }
  },
  created () {
    // this.$i18n.locale = this.$store.state.lang
     // logout in iframe
//     this.logoutUrl = this.root + '/realms/' + this.realm + '/protocol/openid-connect/logout'
//     this.loginUrl = this.root + '/realms/' + this.realm + '/protocol/openid-connect/auth'
    this.codeListener = this.getMessage.bind(this)
    window.addEventListener('message', this.codeListener)
    // case already connected
    this.getTokens()
  },
  destroyed () {
    window.removeEventListener('message', this.codeListener)
    this.codeListener = null
  },
  methods: {
   loginParams (redirectUrl) {
     return this.$store.getters['user/loginParams'](redirectUrl, true)
   },
   getMessage (e) {
     if (e.data.code && e.data.state == this.$store.getters['user/getState']) {
       this.$store.commit('user/setCode', e.data.code)
       this.getTokens()
     } else if (e.data === 'logout') {
       this.resetUser()
     }
   },
   getUserRoles () {
     // https://sso.aeris-data.fr/auth/realms/test/protocol/openid-connect/userinfo?schema=openid
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
             emulateJSON: true
           }
         )
       .then(function (resp) {
         this.setTokens(resp.body)
         var expires = resp.body.expires_in - 50
         var _this = this
         var next = function () {
           _this.updateTokens()
         }
         setTimeout(next, expires * 1000)
       }, this.resetUser)
     }
   },
   setTokens (data) {
     this.searching = false
     this.$store.commit('user/setTokens', data)
   },
   updateTokens () {
     console.log('UPDATE TOKENS')
     if (!this.$store.getters['user/refreshToken']) {
       return
     }
     var postdata = {
       refresh_token: this.$store.getters['user/refreshToken'],
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
       var expires = resp.body.expires_in - 50
       var _this = this
       var next = function () {
         _this.updateTokens()
       }
       setTimeout(next, expires * 1000)
     }, this.resetUser)
   },
   logout () {
     this.searching = true
     var redirectUri = this.$store.state.ssoLogout ? this.$store.state.ssoLogout : this.baseUrl + '/logout?'
         
     var url = this.logoutUrl + '?redirect_uri=' + redirectUri 
     this.openPopup(url)
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
   login () {
     this.searching = true
     // var redirectUri = this.baseUrl + '/login?'
     var redirectUri = this.$store.state.ssoLogin ? this.$store.state.ssoLogin : this.baseUrl + '/login?'
       
    // var redirectUri = 'https://www.poleterresolide.fr/sso-login/'
     var url = this.loginUrl + '?' + this.loginParams(redirectUri)  
     this.$store.commit('user/setRedirectUri', redirectUri)
     this.openPopup(url)
     // window.open(url, "_blank", "height=750, width=850, status=yes, toolbar=no, menubar=no, location=no,addressbar=no");
   },
   resetUser () {
     this.searching = false
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
