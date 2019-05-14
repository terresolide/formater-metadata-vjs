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
 <div class="fmt-list-contact" v-if="responsibleParty || responsibleParty2">
    

      <div class="fmt-contacts" v-if="contacts.resource">
	        <h2><i class="fa fa-users"></i>{{$tc('resource_contact', Object.keys(contacts.resource).length)}}</h2>
	        <div v-for="(fonction, key) in contacts.resource" :key="key" style="float:left;">
		         <h3><i class="fa fa-user"></i>{{$gn(key)}}</h3>
		        <formater-contact  v-for="(item, index) in fonction" :key="index" :contact="item" :lang="lang"></formater-contact>
	        </div>
	        <div style="clear:both;"></div>
	      </div>

	       <div class="fmt-contacts" v-if="contacts.metadata">
	        <h2><i class="fa fa-users"></i>{{$tc('metadata_contact', Object.keys(contacts.metadata).length)}}</h2>
	         <div v-for="(fonction, key) in contacts.metadata" :key="key" >
		         <h3><i class="fa fa-user"></i>{{$gn(key)}}</h3>
		        <formater-contact  v-for="(item, index) in fonction" :key="index" :contact="item" :lang="lang"></formater-contact>
	        </div>  
	       </div>
	    </div>

</template>
<script>
import FormaterContact from './formater-contact.vue'

export default {
  name: 'FormaterListContact',
  components: {
    FormaterContact
  },
  props: {
    lang: {
      type: String,
      default: 'en'
    },
    responsibleParty: {
      type: Array,
      default: () => []
    },
    responsibleParty2: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue
    },
    responsibleParty2 (newvalue) {
       this.updateContacts(newvalue)
    }
  },
  data() {
    return {
       contacts: {
         metadata:{},
         resource:{}
       }
    }
  },
  created () {
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    this.updateContacts(this.responsibleParty)
    this.updateContacts(this.responsibleParty2)
    

   
  },
  methods: {
    updateContacts (responsibleParty) {
      var _this = this
      responsibleParty.forEach( function (contact)  {
	      var fields = contact.split('|');
	      if (fields[1] === 'metadata' || fields[1] === 'metadonnées') {
	       if (_this.contacts.metadata[fields[0]]){
	         _this.contacts.metadata[fields[0]].push(fields)
	       } else {
	         _this.contacts.metadata[fields[0]] = [fields]
	       }
	      }else{
	        if (_this.contacts.resource[fields[0]]){
		         _this.contacts.resource[fields[0]].push(fields)
		       } else {
		         _this.contacts.resource[fields[0]] = [fields]
		       }
	      }
		        
	})
    }
  }
}
</script>
<style>

.fmt-metadata .fmt-contacts h3{
    margin-bottom:0;
}

</style>