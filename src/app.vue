<i18n>
{
  "en": {
    "back": "Catalog",
    "choose_calculation": "Choose a calculation"
   },
  "fr": {
    "back": "Catalogue",
    "choose_calculation": "Choisir un calcul"
  }
 }
</i18n>
<template>
<div class="mtdt-app" >
 <!-- <aeris-theme :primary="$store.state.style.primary" :active="true" :emphasis="$store.state.style.emphasis"></aeris-theme> -->
 <header v-if="authEnabled && $route.name !== 'FormaterLogin' && $route.name !== 'FormaterLogout'" >
    <div style="float:left;margin-left:10px;" v-if="$route.name  === 'Charter'">
      <router-link :title="$t('request_info')" class="link" :to="{name: 'FormaterCatalogue'}">
       <i class="fa fa-home" style="vertical-align:baseline;"></i>
       {{$t('back')}}
       </router-link>
     </div>
    <formater-authentication v-if="authEnabled" ></formater-authentication>
    <!--  <i class="fa fa-shopping-cart" style="font-size:1.5rem;opacity:0.6" :style="{color: $store.state.style.primary}"></i>-->
 </header>      
 <div v-if="message && showMessage" class="catalog-message" @click="showMessage=false">
  <div style="position:absolute;right:4px;top:-15px;">&times;</div>
    <div v-html="message"></div>
 </div>
  <!--     <iframe id="myIframe" style="display:none;"src='' @load="getUrl" ></iframe>
-->
      <div id="view">
        <div id="page">
           <router-view ></router-view>
        </div>
      </div>
      <div style="clear:both;height:10px;"></div>
</div>  
</template>

<script>


 // import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue'
 import FormaterService from '@/components/formater-service.vue'
 import FormaterAuthentication from '@/components/formater-authentication.vue'
 import dataCenter from '@/assets/json/dataCenter.json'
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
     //  AerisTheme,
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
        return (this.$store.state.app && this.$route.name !== 'FormaterLogin' &&
            this.$route.name !== 'FormaterLogout' )
      },
      message () {
        return this.$store.state.message
      }
    },
    data () {
      return {
        showMessage: true,
        resizeListener: null
      }
    },
    created () {
      this.$gn.init(this.$i18n.locale, this.$store.state.geonetwork, this.$http, this.$store)
      this.resizeListener = this.resize.bind(this)
      window.addEventListener('resize', this.resizeListener);
      this.$store.commit('dataCenters/init', dataCenter)
//       if (this.$store.state.metadata && this.$route.name !== 'FormaterLogin') {
//       console.log('has metadata')
//         this.$router.replace({name: 'Metadata', params: {uuid: this.$store.state.metadata}})
//       }
//       var center = this.$store.getters['dataCenters/byId']('https://w3id.org/formater/data-center/CNES')
//       console.log(center)
     // this.resize()
    },
    mounted () {
      var node = document.querySelector('#internetExplorer')
      if (node) {
        node.style.display = 'none'
      }
      // need soustract 10px because of scroll bar?
      this.$store.commit('sizeChange', this.$el.clientWidth - 10)
      window.onunload = () => {
        writableStream.abort()
        // also possible to call abort on the writer you got from `getWriter()`
        writer.abort()
      }
      var _this = this
      window.onbeforeunload = evt => {
        if (_this.$store.state.downloading) {
          evt.stopPropagation()
          evt.preventDefault()
          evt.returnValue = 'Are you sure'
          return false
        }
        
      }
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
<style src="formater-commons-components-vjs/src/assets/css/formater-icon.css"></style>

<style>
.catalog-message {
  position:absolute;
  width: 700px;
  top: 10%;
  left: calc(50% - 350px);
  color: darkred;
  font-size: 2rem;
  z-index: 1000;
  background: white;
  border: 2px solid darkred;
  text-align:center;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
}
.mtdt-app {
  margin:auto;
  font-family: inherit;
  font-size: 16px;
}
.mtdt-app strong {
  font-family: inherit;
}

.wrapper-content .mtdt-app a:hover {
   background:inherit;
  color:#b8412c;
}
.mtdt-app div, 
.mtdt-app span {
  letter-spacing:0px;
  box-sizing: content-box;
} 
.mtdt-app a,
.mtdt-app p,
.mtdt-app em,
.mtdt-app dl,
.mtdt-app dd,
.mtdt-app strong,
.mtdt-app th,
.mtdt-app td {
  letter-spacing:0px;
  text-decoration: none;
}
/* h1, h2, h3, h4, h5, h6, p, em, img, strong, b, u, i, dl, dt, dd, ol, ul, li, form, label, legend, table, tbody, tfoot, thead, tr, th, td
*/
.mtdt-app div[id="page"] {
  padding:0;
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
  text-align:right;
}
.mtdt-app > header i {
  vertical-align: middle;
}

.mtdt-app h1::after {
  display:none;
}

.content-component {
  position:relative;
}
.mtdt-catalogue{
  color: #000000;
  font-size: 15px;
  line-height: 16px;
  height:auto;
  width:100%;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  position:relative !important;
  }

  .mtdt-catalogue h1,
  .mtdt-catalogue h2,
  .mtdt-catalogue h3  {
    border:none;
    font-family: inherit;
    font-weight:700;
    color: inherit;
    text-transform:none;
  }
  .mtdt-catalogue h4,
  .mtdt-catalogue h5 {
    font-family: inherit;
    color: inherit;
  } 
  .mtdt-catalogue input,
  .mtdt-catalogue select, 
  .mtdt-catalogue textarea{
         font-family: Roboto,Arial,sans-serif;
     font-size: 15px;
  }
  .mtdt-catalogue button,
  .mtdt-catalogue input[type="button"]{

    letter-spacing: .5px;
  }
  .mtdt-catalogue dd{
    margin:0;
  }
 .mtdt-catalogue .formater-search-box .box-title h4 {
    margin: 0;
    font-size: 18px;
    color: inherit;
    font-family: inherit;
    font-weight: 600;
}
 .mtdt-catalogue .fa{
  font-size: inherit;
 }

.mtdt-capsule{
  border: 1px solid #ccc;
  border-radius: 0 0 5px 5px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
.mtdt-catalogue .mtdt-column-left{
  width:300px;
  margin-left:5px;
  float:left;
}
.mtdt-catalogue .mtdt-column-right{
  position:relative;
  width:calc(100% - 315px);
  min-height:1000px;
  float:left;
  display:box;
  margin-left:10px;
}
.mtdt-catalogue  .formater-select select {
  font-family: inherit;
  padding:6.5px 32px 6.5px 6.5px;
  line-height:1.3;
}
.mtdt-catalogue .mtdt-paging .formater-select select {
  font-family: inherit;
  font-size: 13px;
  padding:0 32px 0px 6.5px;
}
.mtdt-catalogue .fmt-waiting,
.mtdt-catalogue .fmt-error {
   text-align: center;
   display:inline-block;
   position: absolute;
   width:100%;
   height: 100%;
   z-index:1;
   background: rgba(255, 255, 255, 0.8);
}
.mtdt-catalogue .fmt-error {
  font-size: 1.5rem;
  color: darkred;
  line-height: 1.5rem;
}
.mtdt-catalogue .fmt-error div {
  position:relative;
  padding: 15px;
  border: 1px solid darkred;
  background: rgba(0,0,0,0.05);
  border-radius: 5px;
  box-shadow: 1px 2px 5px -5pxrgb(0, 0, 0);
  margin: 150px 5px 0 5px;
}
.mtdt-catalogue .fmt-error div span.fa-close{
  position: absolute;
  top:1px;
  right: 4px;
  cursor: pointer;
}
.mtdt-catalogue .fmt-waiting div {
  padding-top:150px;

  opacity:0.7;
}

.mtdt-catalogue .fmt-waiting div span{
    font-size:3rem;
}
@keyframes spin { 
  from { 
      transform: rotate(0deg); 
  } to { 
      transform: rotate(360deg); 
  }
}
.fa-refresh.animated,
.fa-circle-o-notch.animated,
.fa-spinner.animated{
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}
.mtdt-free-capsule {
  position:absolute;
  z-index:101;

  width: 100%;
  background: rgba(0,0,0,0.3);
  min-height:100%;
}
.mtdt-free-capsule > div {
  position:relative;
  margin: 10px auto;
  min-width:800px;
  width:99%;
  max-width:1200px;
}
.clearfix:after {
  content: "";
  display: table;
  clear: both;
}
</style>
