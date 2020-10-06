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
<div class="mtdt-app" >
 <aeris-theme :primary="$store.state.style.primary" :active="true" :emphasis="$store.state.style.emphasis"></aeris-theme>
 <header v-if="authEnabled" >
    <formater-authentication v-if="authEnabled" ></formater-authentication>
    <!--  <i class="fa fa-shopping-cart" style="font-size:1.5rem;opacity:0.6" :style="{color: $store.state.style.primary}"></i>-->
 </header>      

  <!--     <iframe id="myIframe" style="display:none;"src='' @load="getUrl" ></iframe>
-->
      <div id="view">
        <div id="page">
           <router-view ></router-view>
        </div>
      </div>
      <div style="clear:both;"></div>
</div>  
</template>

<script>
 import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue'
 import FormaterService from '@/components/formater-service.vue'
 import FormaterAuthentication from '@/components/formater-authentication.vue'
 
//prevent previous and next page for browser
// function disableBack() { window.history.forward() }
// window.onload = function () {
// disableBack();
// }
// window.onpageshow = function(evt) { if (evt.persisted) disableBack() }
// window.onbeforeunload = function() { return "Your work will be lost."; };

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
        resizeListener: null
      }
    },
    created () {
      this.$gn.init(this.$i18n.locale, this.$store.state.geonetwork, this.$http, this.$store)
      this.resizeListener = this.resize.bind(this)
      window.addEventListener('resize', this.resizeListener);
     // this.resize()
    },
    mounted () {
      var node = document.querySelector('#internetExplorer')
      if (node) {
        node.style.display = 'none'
      }
      // need soustract 10px because of scroll bar?
      this.$store.commit('sizeChange', this.$el.clientWidth - 10)
    },
    destroyed () {
      window.removeEventListener('resize', this.resizeListener)
      this.resizeListener = null
    },
    methods: {
      resize () {
        this.$store.commit('sizeChange', this.$el.clientWidth)
     },

    }
    
  }
</script>
<style>
.mtdt-app {
  margin:auto;
}
.mtdt-app #view {
  position: relative;
  min-width:800px;
 
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
.content-component {
  position:relative;
}
</style>
