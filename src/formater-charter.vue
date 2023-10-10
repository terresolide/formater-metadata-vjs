/**
 * Main component
 */
<i18n>{
   "en":{
     "accept": "I accept the terms of use by signing &laquo;{charter}&raquo;",
     "already_signed": "You have already signed &laquo;{charter}&raquo;!",
     "need_idp": "For sign a charter, you must connect with one of the identity providers (Orcid or Edugain)",
     "need_log": "You must login to access this page!",
     "new_roles": "New roles have been assigned to you: {newroles}<br>Log out/log in for them to take effect!",
     "no_charter": "No charter match!",
     "sign_charter": "Sign the &laquo;{charter}&raquo;",
     "sign_saved": "Your signature has been saved."
   },
   "fr":{
     "accept": "J'accepte les conditions d'utilisation en signant  &laquo;{charter}&raquo;",
     "already_signed": "Vous avez déjà signé &laquo;{charter}&raquo;!",
     "need_idp": "Pour signer cette charte, vous devez vous connecter avec l'un des fournisseurs d'identité (Orcid ou Edugain)",
     "need_log": "Vous devez vous connecter pour accéder à cette page!",
     "new_roles": "De nouveaux roles vous ont été attribués: {newroles}<br>Déconnectez-vous/reconnectez-vous pour qu'ils soient pris en compte!",
     "no_charter": "Aucune charte ne correspond!",
     "sign_charter": "Signer &laquo;{charter}&raquo;",
     "sign_saved": "Votre signature a bien été enregistrée."
   }
}
</i18n>
<template>
 <div class="mtdt-charter">
   <div v-if="!email" class="blurry-background">
     <div class="connect-msg" :style="{color: $store.state.style.primary}"> {{$t('need_log')}} </div>
  
   </div>
   <div v-else-if="src" class="charter-view">
      <h2 v-html="$t('sign_charter', {charter: title})"></h2>
      <div style="text-align:center;">
          <a :href="src" target="_blank"><i class="fa fa-file"></i> {{title}}</a>
      </div>
      <formater-pdf-viewer :src="src" :lang="$store.state.lang" :fa="true"></formater-pdf-viewer>
      <div v-if="!identityProvider && !alreadySigned" class="warning">
          <i class="fa fa-exclamation-triangle" ></i>
           <span>{{$t('need_idp')}}</span>
      </div>
      <div class="form-charter">
        <div v-if="alreadySigned" style="color:darkred;" v-html="$t('already_signed', {charter: title})"></div>
          <input type="checkbox" v-model="accept" :disabled="!identityProvider || alreadySigned || searching || success" required /> 
        <span v-html="$t('accept', {charter: title})"></span> 
        <div v-if="success" style="color:green;" v-html="$t('sign_saved', {charter: title})"></div>
        <div v-if="success & newRoles.length > 0" style="color:green;" v-html="$t('new_roles', {newroles: newRoles.join(',')})"></div>
        <div style="margin:20px;text-align:right;">
             <input type="button" value="Enregistrer" :disabled="!identityProvider || alreadySigned || searching || success" @click="send"/>
        </div>
      </div>
   </div>
   <div v-else class="blurry-background">
        <div class="connect-msg"  :style="{color: $store.state.style.primary}">{{$t('no_charter')}}</div>
   </div>
 </div>
</template>
<script>
import FormaterPdfViewer from 'formater-pdf-viewer-vjs'
export default {
  name: 'FormaterCharter',
  components: {
    FormaterPdfViewer
  },
  data() {
    return {
      src: null,
      title: null,
      accept: false,
      alreadySigned: true,
      searching: false,
      success: false,
      newRoles: []
    }
  },
  computed: {
    email () {
      this.getCharter(this.id)
      return this.$store.getters['user/email']
    },
    user () {
      return this.$store.getters['user/get']
    },
    identityProvider ()  {
      if (!this.user) {
        return null
      }
      return this.user.identityProvider
    },
    id () {
      return this.$route.params.id
    }
  },
  created () {
    // remove menu service
    this.$store.commit('services/resetCurrent')
    // close popup account
    this.$store.commit('user/toggleShow', null)
  },
  mounted () {
    this.getCharter(this.id)
  },
  destroyed () {
  },
  methods: {
    check (data) {
      if (data.error) {
        return
      }
      if (data.success) {
        this.success = true
        this.$store.commit('charters/addSigned', this.id )
        var _this = this
        data.roles.forEach(function (role) {
          // var partrole = role.split('.')
          if (role.status === 'ACCEPTED') {
            _this.newRoles.push(role.name)
          }
          
          _this.$store.commit('roles/setStatus', role)
        })
      }
      
    },
    getCharter (id) {
      this.reset()
      if (!this.user) {
        return
      }
      var url = this.$store.state.checkSSO + '/charters/get' 
      url += '?userId=' + this.user.id + '&charterId=' + this.$route.params.id + '&lang=' + this.$store.state.lang
       this.$http.get(url)
       .then(resp => {
         if (resp.body) {
           this.initialize(resp.body)
         }
       })
    },
    initialize (data) {
      if (data.error) {
        return
      }
      this.accept = data.userId
      this.alreadySigned = this.accept
      this.success = false
      this.title = data.title
      this.src = data.url
    },
    reset () {
      this.accept = null
      this.alreadySigned = true
      this.title = '---'
      this.src = null
    },
    send () {
      if (!this.user || !this.accept) {
        return
      }
      this.searching = true
      var location = this.$custURL(window.location.href)
      var url = this.$store.state.checkSSO + '/charters/sign' 
       this.$http.post(url, {
         userId: this.user.id, 
         email: this.email, 
         app: 'catalog',
         realm: this.$store.getters['user/realm'],
         charterId: this.$route.params.id, 
         domain: location.base + '#/',
         lang: this.$store.state.lang, 
         url: window.location.href
       }, {emulateJSON: true})
       .then(resp => {
         this.searching = false
         if (resp.body) {
           this.check(resp.body)
         }
       }, resp => {
         this.searching = false
       })
    }
  }
}
</script>
<style scoped>
div.warning {
  border: 2px solid darkred;
  border-radius: 5px;
  padding: 10px;
  color: darkred;
  font-weight:700;
  margin: 10px 0;
}
div.warning span {
  display:inline-block;
  width:calc(100% - 60px);
  margin-left:10px;
}
div.warning i {
  vertical-align:top;
  margin-top:5px;
}

.blurry-background{
   background: url('./assets/img/background-sign.png') no-repeat center center fixed;
   width:100%;
   min-height:500px;
   height:100vh;
   padding: 30px;
   -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  text-align: center;
}
.connect-msg {
  background: rgba(255,255,255,0.5);
  padding: 50px;
  max-width:450px;
  border-radius: 10px;
  margin: 5% auto;
  border:none;

}
.form-charter {
   margin: 10px 0;
   padding:10px;
   border:1px dotted grey;
}
.mtdt-charter {
  border-top: 1px dotted grey;
}
div.charter-view {
  max-width: 900px;
  margin:auto;
}
</style>