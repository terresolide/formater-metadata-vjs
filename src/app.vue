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
<div class="mtdt-app">
 <aeris-theme :primary="$store.state.style.primary" :active="true" :emphasis="$store.state.style.emphasis"></aeris-theme>
 <header v-if="authEnabled" >
    <formater-authentication v-if="authEnabled" ></formater-authentication>
    <!--  <i class="fa fa-shopping-cart" style="font-size:1.5rem;opacity:0.6" :style="{color: $store.state.style.primary}"></i>-->
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
 import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue'
 import FormaterService from '@/components/formater-service.vue'
 import FormaterAuthentication from '@/components/formater-authentication.vue'
 export default {
    name: 'App',
    components: {
      AerisTheme,
      FormaterAuthentication,
      FormaterService
    },
    props: {
    },
    created () {
      // this.$root.$i18n.locale = this.$store.state.lang
      // this.getCliendId()
    },
    computed: {
      authEnabled () {
        return (this.$store.state.auth && this.$route.name !== 'FormaterLogin' &&
            this.$route.name !== 'FormaterLogout' )
      }
    },
    data () {
      return {
      }
    },
    mounted () {
      
    },
    methods: {

    }
    
  }
</script>
<style>
.mtdt-app {
}
.mtdt-app #view {
  position: relative;
}
.mtdt-app > header{

  height:40px;
  margin-bottom:0px;
  padding-right: 10px;
  padding-top: 5px;
  border-top: 3px double grey; 
  /* border-bottom: 1px dotted lightgrey;*/
 
 /* box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);*/

 
  text-align:right;
}
.mtdt-app > header i {
  vertical-align: middle;
}
</style>
