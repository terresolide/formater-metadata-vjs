<i18n>{
   "en":{
     "contact": "Contact | Contacts"
   },
   "fr":{
     "contact": "Contact | Contacts"
   }
}
</i18n>
<template>
 <div class="formater-metadata">
   <div v-if="meta">
      <h1>
          <i class="fa fa-database" v-if="['dataset','serie'].indexOf(meta.type) >= 0"></i>
          {{meta.title ? meta.title: meta.defaultTitle}}</h1>
      <hr />
      <div class="formater-tabs">
         <div v-for="(tab,index) in tabs" style="display:inline-block; padding: 5px 10px; border:1px dotted grey;">{{tab.title}}</div>
      </div>
      <div class="formater-description" v-html="meta.abstract ? meta.abstract: meta.defaultAbstract"></div>
      <div v-if="meta.responsibleParty">
        <h2><i class="fa fa-users"></i>{{$tc('contact', meta.responsibleParty.length)}}</h2>
        <formater-contact v-for="(item, index) in meta.responsibleParty" :key="index" :contact="item" :lang="lang"></formater-contact>
      </div>
   </div>
 </div>
</template>
<script>
import FormaterContact from './formater-contact.vue'
export default {
  name: 'FormaterMetadata',
  components: {
    FormaterContact
  },
  props: {
    lang: {
      type: String,
      default: 'en'
    },
    metadata: {
      type: Object,
      default: null
    },
    url: {
      type: String,
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
     tabs: [
       {title: 'Aperçu', value: 'tab1'},
       {title: 'Complet', value: 'tab2'}
     ],
     currentTab: 'tab1',
     meta: null,
     fields : {text: [''], date:[], array:[]}
    }
  },
  mounted () {
   this.$i18n.locale = this.lang
   if (this.metadata) {
     this.data = this.metadata
   }
   if (this.url) {
     // get meta from url
     this.getMetaFromUrl()
     
   }
  },
  methods: {
      getMetaFromUrl () {
        let _this = this
        this.$http.get(this.url).then(
            response => { _this.handleSuccess(response) },
            response => { _this.handleError('no_file')}
         )
      },
      handleSuccess (response) {
        console.log(response)
        this.meta = response.body.metadata[39]
        this.meta.abstract = this.meta.abstract.replace(/(?:\\[rn]|[\r\n])/g, '<br />')
      },
      handleError () {
        console.log('metadata_not_find')
      }
  }
}
</script>
<style>
.formater-metadata{
  font-size: 12px;
  max-width: 900px;
  margin: auto;
}
.formater-metadata i.fa {
  margin-right: 12px;
}
.formater-metadata h1,
.formater-metadata h2,
.formater-metadata h3,
.formater-metadata h4{
    color:#8C0209;
}
.formater-metadata h2 {

  font-size: 1.2rem;
  margin-bottom:0;
}
.formater-metadata h1{
  font-size:1.5rem;
}
.formater-metadata div.formater-description{
  line-height:1.5;
}
</style>