<i18n>{
   "en":{
     "localize": "Localize on the map"
   },
   "fr":{
     "localize": "Localiser sur la carte, cliquer pour garder la position"
   }
}
</i18n>
<template>
   <span>
  </span>
  </template>
  <script>
  export default {
    name: 'FormaterLogin',
    components: {
    },
    props: {
    },
    created () {
    },
    mounted () {
      setTimeout(function(){var ww = window.open(window.location, '_self'); ww.close();})
      return false;
    },
    data () {
      return {
      }
    },

    methods: {
    }
    
  }
  </script>
  <style>
 
  </style>