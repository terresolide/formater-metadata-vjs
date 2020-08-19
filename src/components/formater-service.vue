<template>
 <span class="mtdt-service">
 <div class="mtdt-tab" v-show="email" @click="searchCode" style="display:inline-block;color:darkred;border:1px solid blackred;border-radius:3px;">
 Autorise {{this.service.domain}} to acess your data</div>
<!--   <iframe :show="false" style="display:none;" :src="src" @load="getCode"></iframe>
 --></span>
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
    token () {
      return this.$store.getters['services/token'](this.domain)
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
      state: null
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
          this.$store.commit('services/setClientId', {id: this.service.id, clientId: this.clientId})
          this.state = 'php' + btoa(this.clientId).replace(/=|\+|\//gm, '0')
        }
	    })
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
          state: this.state,
          prompt: 'none'
          
      }
      var url = this.authUrl + '?'
      var paramsStr = Object.keys(params).map(function (key) {
        return key + '=' + params[key]
      }).join('&')
      url += paramsStr
      window.open(url, "_blank", "height=750, width=850, status=yes, toolbar=no, menubar=no, location=no,addressbar=no");
    },
    getMessage(e) {
      console.log(e.data.code)
      console.log(this.state)
      console.log(e.data.state)
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
