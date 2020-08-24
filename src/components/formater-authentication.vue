<template>
 <span class="mtdt-authentication">
    <formater-service v-show="currentService === index" v-for="(service, index) in services" :key="index" :service="service"></formater-service>
    <div v-if="!$store.state.metadata" style="display:inline-block;"> {{email}}
		  <a @click="logout" v-if="email" class="fa fa-sign-out" title="logout"></a>
		  <a @click="login" v-else class="fa fa-sign-in" title="login" > login</a>
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
    api: {
      type: String,
      default: null
    }
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
      codeListener: null
    }
  },
  created () {
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
       console.log('logout')
       this.resetUser()
     }
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
     var redirect_uri = this.baseUrl + 'logout'
     var url = this.logoutUrl + '?redirect_uri=' + redirect_uri 
     window.open(url, "_blank", "height=750, width=850, status=yes, toolbar=no, menubar=no, location=no,addressbar=no");
   },
   login () {
     var url = this.loginUrl + '?' + this.loginParams(this.baseUrl + '/login?')  
     this.$store.commit('user/setRedirectUri', this.baseUrl + '/login?')
     window.open(url, "_blank", "height=750, width=850, status=yes, toolbar=no, menubar=no, location=no,addressbar=no");
   },
   resetUser () {
     this.$store.commit('user/reset')
     this.$store.commit('services/reset')
   }
  }
}
</script>
<style>
.mtdt-authentication ,
.mtdt-authentication  a,
.mtdt-authentication span,
.mtdt-authentication  i {
  vertical-align:middle;
}
.mtdt-authentication a {
  cursor: pointer;
}
.mtdt-authentication  i {
 font-size: 1.5rem;
}
</style>
