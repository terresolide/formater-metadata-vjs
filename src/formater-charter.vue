/**
 * Main component
 */
<i18n>{
   "en":{
     "need_log": "You must login to access this page!"
   },
   "fr":{
     "need_log": "Vous devez vous connecter pour accéder à cette page!"
   }
}
</i18n>
<template>
 <div class="mtdt-charter">
   <div v-if="!email" class="blurry-background">
     <div class="connect-msg" :style="{color: $store.state.style.primary}"> {{$t('need_log')}} </div>
  
   </div>
   <div v-else-if="src" class="charter-view">
      <h2>Je signe la charte</h2>
      <formater-pdf-viewer :src="src" :lang="$store.state.lang" :fa="true"></formater-pdf-viewer>
      <a :href="src" target="_blank"><i class="fa fa-file"></i> Accès en ligne</a>
      <div>
        <input type="checkbox" v-model="accept" /> Je signe  &laquo;{{title}}&raquo; 
       <div> <input type="button" value="Enregistrer" /></div>
      </div>
   </div>
   <div v-else>Pas de source</div>
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
      src: 'https://catalog.formater/pdf/charte-GDM-OPT.pdf',
      title: null,
      accept: false
    }
  },
  computed: {
    email () {
      this.getCharter()
      return this.$store.getters['user/email']
    },
    user () {
      return this.$store.getters['user/get']
    },
    id () {
      console.log(this.$route)
      return 1
    }
  },
  created () {
    this.$store.commit('services/resetCurrent')
    this.getCharter()
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    getCharter () {
      if (!this.user) {
        return
      }
      var url = this.$store.state.checkSSO + '/api/charter' 
       this.$http.post(url, {userId: this.user.id, charterId: this.id, lang: this.$store.state.lang }, {emulateJSON: true})
       .then(resp => {
         console.log(resp.body)
       })
    }
  }
}
</script>
<style scoped>
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
.mtdt-charter {
  border-top: 1px dotted grey;
}
div.charter-view {
  max-width: 900px;
  margin:auto;
}
</style>