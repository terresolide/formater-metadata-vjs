/**
 * Main component
 */
<i18n>{
   "en":{
     "searching": "Searching"
   },
   "fr":{
     "searching": "Recherche en cours"
   }
}
</i18n>
<template>
 <div class="mtdt-charter">
   <div v-if="!email">Connectez-vous!</div>
 </div>
</template>
<script>
export default {
  name: 'FormaterCharter',
  components: {

  },
  data() {
    return {
    }
  },
  created () {
   
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
  }
}
</script>
<style>

</style>