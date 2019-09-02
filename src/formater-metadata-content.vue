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
<div class="mtdt-content">
<dl v-if="Object.keys(metadata.contacts.resource).length  > 0 ">
  <dt>Contacts resource</dt>
  <dd> <formater-list-contact   :contacts="metadata.contacts.resource" type="resource" ></formater-list-contact></dd>
</dl>
<dl v-if="metadata.keyword.length > 0">
  <dt>mot clés</dt>
  <dd> <formater-keywords :keywords="metadata.keyword"></formater-keywords></dd>
</dl>
<dl  v-if="metadata.tempExtentBegin">
  <dt>{{$t('temporal_extent')}}</dt>
  <dd>
      {{date2str(metadata.tempExtentBegin)}}
      <i class="fa fa-long-arrow-right" ></i>
      {{date2str(metadata.tempExtentEnd)}}
  </dd>
</dl>
          
          <hr style="margin:60px 50px;"/>
           <formater-list-contact   :contacts="metadata.contacts.metadata" type="metadata" ></formater-list-contact>
</div>
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
.mtdt-metadata .mtdt-content dl{
  display: block;
  clear:left;
  padding-top: 10px;
  margin-bottom:0;
  padding-bottom:10px;
}
.mtdt-metadata .mtdt-content dt{
  width:160px;
  float:left;
}
.mtdt-metadata .mtdt-content dd{
  width:calc(100% - 200px);
  float:left;
}
</style>