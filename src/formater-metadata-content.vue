<i18n>{
   "en":{
     "creationDate": "Date (create)",
     "temporal_extent": "Temporal extent"

   },
   "fr":{
      "temporal_extent": "Etendue temporelle",
      "creationDate": "Date (création)"
      
   }
}
</i18n>
<template>
<span class="mtdt-content">
         <formater-list-contact   :contacts="metadata.contacts.resource" type="resource" ></formater-list-contact>



         <div class="mtdt-temporalExtent" style="clear:both;" v-if="metadata.tempExtentBegin">
            <h2 :style="{color:$store.state.style.primary}"><i class="fa fa-clock-o"></i>{{$t('temporal_extent')}}</h2>
             <div>
                {{date2str(metadata.tempExtentBegin)}}
                <i class="fa fa-long-arrow-right" ></i>
                {{date2str(metadata.tempExtentEnd)}}
            </div>
          </div>
          <formater-keywords :keywords="metadata.keyword"></formater-keywords>
          
          <hr />
           <formater-list-contact   :contacts="metadata.contacts.metadata" type="metadata" ></formater-list-contact>
</span>
</template>
<script>
import FormaterListContact from './formater-list-contact.vue'
import FormaterKeywords from './formater-keywords.vue'
export default {
  name: 'FormaterMetadataContent',
  components: {
    FormaterListContact,
    FormaterKeywords
  },
  props:{
    metadata: {
      type: Object,
      default: null
    }
  },
  created () {
    console.log(this.metadata.contacts)
    console.log(this.metadata.contacts.resource)
  },
  methods:{
    date2str (date) {
      //return 'hello';
      return moment(date, 'YYYY-MM-DD').format('ll')
    },
  }
}
</script>
<style>
</style>