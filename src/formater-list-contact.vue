<i18n>
{
   "en":{
     "distributor": "Distributor",
     "owner": "Owner",
     "point of contact": "Point of contact"
   },
   "fr":{
      "distributor": "Distributeur",
     "owner": "Propriétaire",
     "point of contact": "Point de contact"
   }
}
</i18n>
<template>
 <span class="mtdt-contacts"  >
     <div v-for="(fonction, key) in contacts" :key="key" style="float:left;">
       <h3 :style="{color:$store.state.style.primary}">{{$t(key.toLowerCase())}}</h3>
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
  }
}
</script>
<style>

.mtdt-metadata .mtdt-contacts h3{
    margin:0 0 8px 0;
}
.mtdt-metadata .mtdt-contacts > div{
  margin-left:0px;
}

</style>