<template>
 <span class="mtdt-service">
 <div class="mtdt-tab" @click="start" style="display:inline-block;color:darkred;border:1px solid blackred;border-radius:3px;">Autorise {{this.domain}} to acess your data</div>
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
    }
  },
  data() {
    return {
      src: null,
      root: null,
      clientId: null,
      domain: null,
      baseUrl: null,
      codeListener: null
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
    var found = window.location.href.match(/.*\/#/)
    if (found && found.length > 0) {
      this.baseUrl = found[0]
    }
    // this.$store.commit('services/add', {domain: 'machin', token: 'untoken'})
    // console.log(this.token)
//     this.getClientId()
//       .then(clientId => this.searchCode(clientId))
    
  },
  methods: {
    start () {
      this.getClientId()
      .then(clientId => this.searchCode(clientId))
    },
    getClientId () {
      var _this = this
      var url = this.host + '/atdistrib/resto2/api/auth/aeris/clientid'
      return new Promise ((resolve, reject) => {
	      _this.$http.get(url).then(function (response) {
	        if (response.body && response.body.clientId) {
	          _this.clientId = response.body.clientId
	          resolve(_this.clientId)
	        } else {
	          reject()
	        }
	      }, response => reject(response))
      })
    },
    searchCode (clientId) {
      console.log(clientId)
      if (!clientId) {
        return null
      }
      console.log('continue')
      var params = {
          response_type: 'code',
          client_id: clientId,
          scope: 'openid',
          state: this.domain,
          redirect_uri: this.baseUrl + 'login/'
      }
      var url = process.env.SSO_URL + '/realms/' + process.env.SSO_REALM + '/protocol/openid-connect/auth?' 
      url += Object.keys(params).map(function (key) {
        return key + '=' + encodeURIComponent(params[key])
      }).join('&')
      // this.src = url
//       window.onerror = function (e) {
//         console.log('erreur')
//       }
//       window.onload = function (e) {
//         console.log(e)
//       }
      window.addEventListener('message', function (e) {
        console.log('receive message')
        console.log(e.data)
      }, false);
      var childWin = window.open(url, "_blank", "height=750, width=850, status=yes, toolbar=no, menubar=no, location=no,addressbar=no");
      console.log(childWin)
//       childWin.onload = function (e) {
//         console.log(e.data)
//         console.log('load window')
//       }
//       console.log(window.opener)
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
    },
    getToken () {
      
    }
  }
}
</script>
