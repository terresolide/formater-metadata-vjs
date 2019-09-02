<i18n>
{
   "en":{
     "resource_contact": "Resource Contact | Resource Contacts",
     "metadata_contact": "Metadata Contact | Metadata Contacts"
   },
   "fr":{
     "resource_contact": "Contact pour les données| Contacts pour les données",
     "metadata_contact": "Contact pour les métadonnées | Contacts pour les métadonnées"
   }
}
</i18n>
<template>
 <span class="mtdt-contacts"  v-if="Object.keys(contacts).length > 0">

     <h2 :style="{color:$store.state.style.primary}"><i class="fa fa-users"></i>{{title()}}</h2>
     <div v-for="(fonction, key) in contacts" :key="key" style="float:left;">
       <h3 :style="{color:$store.state.style.primary}"><i class="fa fa-user"></i>{{$gn.t(key)}}</h3>
      <formater-contact  v-for="(item, index) in fonction" :key="index" :contact="item" ></formater-contact>
     </div>
     <div style="clear:both;"></div>

 </span>

</template>
<script>
import FormaterContact from './formater-contact.vue'

export default {
  name: 'FormaterListContact',
  components: {
    FormaterContact
  },
  props: {
//     lang: {
//       type: String,
//       default: 'en'
//     },
    contacts: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'resource'
    }
  },
  watch: {
//     lang (newvalue) {
//     	this.$i18n.locale = newvalue
//     },

  },
//   data() {
    
//   },
  created () {
   console.log(this.contacts)
  },
  methods: {
    title () {
      
      if (this.type === 'metadata') {
        return this.$i18n.tc('metadata_contact', Object.keys(this.contacts).length)
      } else {
        return this.$i18n.tc('resource_contact', Object.keys(this.contacts).length)
      }
    }

  }
}
</script>
<style>

.mtdt-metadata .mtdt-contacts h3{
    margin:0 0 8px 0;
}
.mtdt-metadata .mtdt-contacts > div{
  margin-left:30px;
}

</style>