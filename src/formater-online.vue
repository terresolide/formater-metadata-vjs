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
 <div class="mtdt-online">
 <a :href="$gnExtractText(online.url, lang)">
	<i class="fa" :class="toClass(online.function)"></i>{{$gnExtractText(online.title, lang)}}
 </a>
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
      icons: {
        download: 'fa-download',
        information: 'fa-info',
        'offlineAccess': 'fa-times-rectangle-o',
        order: 'fa-sign-in',
        search: 'fa-search'
        
      }
    }
  },
  created () {
   this.$i18n.locale = this.lang
   this.$setGnLocale(this.lang)
   this.online = this.online
  },
  methods: {
    toClass () {
      if (this.icons[this.online.function]) {
       return this.icons[this.online.function]
      } else {
        return 'fa-link'
      }
    }
  }
}
</script>
<style>

.mtdt-online{
  margin-left:5px;
}
.mtdt-catalogue a{
  color:#754a15;
}
.mtdt-catalogue a:hover{
  color:#8c0209;
}

</style>