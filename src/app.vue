<i18n>
{
  "en": {
    "choose_calculation": "Choose a calculation"
   },
  "fr": {
    "choose_calculation": "Choisir un calcul"
  }
 }
</i18n>
<template>
<div>
 <aeris-theme :primary="$store.state.style.primary" :active="true" :emphasis="$store.state.style.emphasis"></aeris-theme>
 
       <header style="width:100%;margin-left:5px;height:45px;margin-bottom:5px;border: 1px solid #ccc; 
box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);text-align:right;">
        <formater-service v-if="$route.name !== 'FormaterLogins'" v-for="(service, index) in services" :key="index" :api="service.api" :domain="service.domain"></formater-service>
        {{email}}
        <a v-if="!email" @click="login">Login</a>
        <a v-else @click="logout">Logout</a>
         | <a @click='getFlatsimCliendId'>test</a>
         
</header>
  <!--     <iframe id="myIframe" style="display:none;"src='' @load="getUrl" ></iframe>
-->
      <div id="view">
        <div id="page">
           <router-view></router-view>
        </div>
      </div>
</div>  
</template>

<script>
 import {keycloak} from './main.js'
 import jwt_decode from 'jwt-decode'
 var token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxQzJyeVltTWxhS2tXRjQ0Q1RvX1c2MzNaOHA0TlZPbmJ2YVBXYlY3bEpVIn0.eyJqdGkiOiI3NDJhZDdjMy1lNTU3LTRiYjgtOGViMi1lNWI4MzdjYzA3YjIiLCJleHAiOjE1OTc2NjUyMjgsIm5iZiI6MCwiaWF0IjoxNTk3NjY0OTI4LCJpc3MiOiJodHRwczovL3Nzby5hZXJpcy1kYXRhLmZyL2F1dGgvcmVhbG1zL3Rlc3QiLCJhdWQiOiJmb3JtYXRlci12anMiLCJzdWIiOiI2YTQ3ZDFlNy1mNjY0LTQ4ZWEtOTdhNi02NDA2NWM1ZWFiYTUiLCJ0eXAiOiJJRCIsImF6cCI6ImZvcm1hdGVyLXZqcyIsIm5vbmNlIjoiMWNjMDM0NmItY2E1Zi00MjgxLTgzM2ItYTZkMTlmZDRiYjNiIiwiYXV0aF90aW1lIjoxNTk3NjYwOTA4LCJzZXNzaW9uX3N0YXRlIjoiY2EwMWM5M2YtZGU4OS00ZjkyLWIxMmItMzJiZGRhN2NlZTI4IiwiYWNyIjoiMCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoidGVzdCB0ZXN0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGVzdCIsImdpdmVuX25hbWUiOiJ0ZXN0IiwiZmFtaWx5X25hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QHNlZG9vLmZyIn0.bhpqAWOkaJRv9LEEJwLrINQ5T5nI7HTYbaaUDq1GPCt3ITsh_3mqC1ENtFIFLQvcrAC5P6h99cN_cTPLv9hZ5JeRfl86qHtQcoOp_o3r_7BEdNf45eSB1B1J83o1SLE-VnwUDBaBEsUG1jbarD-cQYUVqYNyUnSWGo_0P7KaZwpRE4BvC1b8wXKpywEyC18JE1flAVn6Cw6Q1xVFRxf4AZIBRe2NmnLoWe0o5NeRa8j3qNyGj6yaJZuVxWJyXNiw7RBWOCurYQUtmUiQRsp1xSs1XHzlelANcuc6YtfBzLUFEjN5-IV4GYvm7gGCGuRAnenxFAf8jn9oAJ3krptyKw'
 console.log(jwt_decode(token))
 import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue'
 import FormaterService from '@/components/formater-service.vue'
 export default {
    name: 'App',
    components: {
      AerisTheme,
      FormaterService
    },
    props: {
    },
    created () {
      // this.getCliendId()
    },
    computed: {
      email () {
        return this.$store.getters['user/email']
      },
      services () {
        return this.$store.getters['services/all']
      }
    },
    data () {
      return {
        iframe: null,
        count: 0,
      }
    },
    mounted () {
//        this.iframe = this.$el.querySelector('#myIframe')
//        console.log(this.iframe)      
    },
    methods: {
      login () {
        // log to aeris
        if (keycloak) {
          keycloak.login()
        }
      },
      logout () {
        if (keycloak) {
          keycloak.logout()
          this.$store.commit('user/reset')
        }
      },
      getUrl (e) {
        console.log(e.target.baseURI)
        return
        var url = new URL(e.target.baseURI);
      var code = url.searchParams.get("code");
        console.log('code = ', code)
        var app = url.searchParams.get('state')
        console.log('app = ', app)
        if (code && app) {
          this.getToken(app, code, url)
        }
        var token = url.searchParams.get('token')
        console.log('token', token)
        console.log(this.iframe.contentWindow.location.href)
        this.count = this.count + 1
        console.log(this.count)
      },
      getCliendId () {
        var url = 'https://flatsimdev-pp.cnes.fr/atdistrib/resto2/api/auth/aeris/clientid'
          
        this.$http.get(url).then(function(response) {
          console.log(response)
          this.clientId = response.body.clientId
        })
      },
      // A ajouter au CNES
//       if($_SERVER['REQUEST_METHOD'] == 'OPTIONS' && ENV == 'devel') {
//     header('Access-Control-Allow-Origin: *');
//     header('Access-Control-Allow-Headers: X-Requested-With');
//     header("HTTP/1.1 200 OK");
//     die();
// }

      getToken (app, code, url) {
        var urlflatsim = 'https://flatsimdev-pp.cnes.fr/atdistrib/resto2/api/auth/aeris'
        // this.iframe.src = url + '?code=' + code + '&state=flatsimdev-pp&redirect_uri=//localhost:8080/#/'
//            this.$http.get(urlflatsim).then(function (resp) {
//              console.log(resp.body)
//            }, function (resp) {
//              console.log(resp)
//            })
        this.$http.post(
          urlflatsim, 
          'code=' + code + '&redirect_uri=https://localhost:8080/#/login'
        ).then(
         function (resp ) {
           console.log(resp)
         }    
        )
      },
      // test
      getFlatsimCliendId () {
      
        var sso = 'https://sso.aeris-data.fr/auth/realms/test/protocol/openid-connect/auth'
          this.iframe.src = sso + '?response_type=code&client_id=formater-php&scope=openid&state=flatsimdev-pp&redirect_uri=https://localhost:8080/#/login/'
          return
        this.$http.post(sso + '?response_type=code&client_id=formater-php&redirect_uri=https://localhost:8080/#/').then(
         function (resp ) {
           console.log(resp)
         }    
        )
        
      }
    }
    
  }
</script>

