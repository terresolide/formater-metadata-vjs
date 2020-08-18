<template>
 <span class="mtdt-service">
 <div class="mtdt-tab" v-show="email" @click="searchCode" style="display:inline-block;color:darkred;border:1px solid blackred;border-radius:3px;">Autorise {{this.domain}} to acess your data</div>
<!--   <iframe :show="false" style="display:none;" :src="src" @load="getCode"></iframe>
 --></span>
</template>
<script>

export default {
  name: 'FormaterService',
  components: {
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
    var url = new URL(this.api)
    if (url.pathname.indexOf('atdistrib/resto2') > 0) {
      this.type = 'resto2'
    }
    console.log(url.host)
    console.log(url.hash)
    console.log(window.location.href)
//     this.baseUrl = base.hash
//     console.log(this.baseUrl)
    this.host = url.protocol + '//' + url.hostname
    this.domain = url.hostname
    this.getClientId()
    this.codeListener = this.getMessage.bind(this)
    window.addEventListener('message', this.codeListener)
    // var location = this.$custURL(window.location.href)
    // this.redirectUri = location.base + '/login?'
    
   
    // this.$store.commit('services/add', {domain: 'machin', token: 'untoken'})
    // console.log(this.token)
//     this.getClientId()
//       .then(clientId => this.searchCode(clientId))
    
  },
  destroyed () {
    window.removeEventListener('message', this.codeListener)
    this.codeListener = null
  },
  methods: {
    getClientId () {
      var url = this.host + '/atdistrib/resto2/api/auth/aeris/clientid'
      this.$http.get(url, {credentials: true}).then(function (response) {
        if (response.body && response.body.clientId) {
          this.clientId = response.body.clientId
          this.state = 'php' + btoa(this.clientId).replace(/=|\+|\//gm, '0')
        }
	    })
    },
    searchCode () {
      if (!this.clientId) {
        return null
      }
      console.log(this.redirectUri)
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
      console.log(url)
      // this.src = url
//       window.onerror = function (e) {
//         console.log('erreur')
//       }
//       window.onload = function (e) {
//         console.log(e)
//       }
     
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
      var url = this.host + '/atdistrib/resto2/api/auth/aeris'
      var params = {
        code: code,
        redirect_uri: this.redirectUri
      }
      this.$http.post(url, params, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application.json'
         }
      })
      .then(resp => console.log(resp.body))
    },
    getCode (e) {
      if (!this.clientId) {
        return null
      }
      console.log(e.target.contentDocument.URL)
      var url = new URL(e.target.contentDocument.URL);
      var code = url.searchParams.get("code");
      console.log('code = ', code)
      var app = url.searchParams.get('state')
      console.log('app = ', app)
      alert(code)
      if (code && app) {
        this.getToken(app, code, url)
      }
      var token = url.searchParams.get('token')
      this.count = this.count + 1
      console.log(this.count)
    }
  }
}
</script>
