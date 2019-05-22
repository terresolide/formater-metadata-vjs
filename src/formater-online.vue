<i18n>{
   "en":{
     "download": "Download",
     "information": "Information",
     "offlineAccess": "Off line acess",
     "order": "Order",
     "search": "Search"
   },
   "fr":{
     "contact": "Contact | Contacts",
     "children": "Fiches Enfants"
   }
}
</i18n>
<template>
 <div class="fmt-online">
	
 </div>
</template>
<script>
export default {
  name: 'FormaterOnline',
  components: {
  },
  props: {
    lang: {
      type: String,
      default: 'en'
    },
    online: {
      type: Object,
      default: null
    }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue
    }
  },
  data() {
    return {
    }
  },
  created () {
   this.$i18n.locale = this.lang
   this.$setGnLocale(this.lang)
   this.online = this.online
  },
  methods: {
   
  }
}
</script>
<style>

.fmt-online{
  
}


</style>