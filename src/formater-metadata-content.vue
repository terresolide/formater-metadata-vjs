<i18n>{
   "en":{
     "date": "Date | Dates",
     "creationDate": "create",
     "publicationDate": "publication",
     "revisionDate": "revision",
     "contact_resource": "Resource contact | Resource contacts",
     "keyword": "Keyword | Keywords",
     "lineage": "Lineage",
     "constraint": "Constraints",
     "legalConstraints": "legal",
     "securityConstraints": "security",
     "resourceConstraints": "resource",
     "temporal_extent": "Temporal extent",
     "now": "Now",
     "identifier": "Identifier"
     

   },
   "fr":{
      "date": "Date | Dates",
     "creationDate": "création",
     "publicationDate": "publication",
     "revisionDate": "mise à jour",
     "contact_resource": "Contact pour les données | Contacts pour les données",
     "keyword": "Mot-clé | Mots-clés",
      "lineage": "Généalogie",
      "constraint": "Contraintes",
     "legalConstraints": "légales",
     "securityConstraints": "de sécurité",
     "resourceConstraints": "sur les données",
      "temporal_extent": "Etendue temporelle",
      "now": "Aujourd'hui",
      "identifier": "Identifiant"
   }
}
</i18n>
<template>
<div class="mtdt-content">
 <div class="mtdt-description" style="display:block;">
       <formater-quicklooks :quicklooks="metadata.images" :legend="metadata.legend"></formater-quicklooks>
       <dl class="mtdt-identifier" v-if="metadata.identifier && !metadata.description">
             <dt :style="dtStyle()">{{$t('identifier')}}</dt>
              <dd >{{metadata.identifier}}</dd>
       </dl>
       <span v-html="metadata.description" v-if="metadata.description" style="margin-bottom:20px;"></span> 
       <dl class="mtdt-identifier" v-if="metadata.identifier && metadata.description" :style="{clear: (type === 'opensearch' ? 'none' : 'left')}">
             <dt :style="dtStyle()">{{$t('identifier')}}</dt>
              <dd >{{metadata.identifier}}</dd>
       </dl>
       <formater-parameters type="metadata" :metadata="metadata" ></formater-parameters>
</div>
<dl v-if="countDate > 0" class="mtdt-main-parameter">
   <dt :style="dtStyle()">{{$tc('date', countDate)}} </dt>
   <dd>
      <div v-for="key in dateList" v-if="metadata[key]">
           {{date2str(metadata[key])}} ({{$t(key)}})
      </div>
   </dd>
</dl>
<dl v-if="countContactResource > 0 " class="mtdt-main-parameter">
  <dt :style="dtStyle()">{{$tc('contact_resource', countContactResource)}}</dt>
  <dd> <formater-list-contact   :contacts="metadata.contacts.resource" type="resource" ></formater-list-contact></dd>
</dl>
<dl v-if="metadata.keyword.length > 0" class="mtdt-main-parameter">
  <dt :style="dtStyle()">{{$tc('keyword', metadata.keyword.length)}}</dt>
  <dd> <formater-keywords :keywords="metadata.keyword"></formater-keywords></dd>
</dl>
<dl  v-if="metadata.tempExtentBegin" class="mtdt-main-parameter">
  <dt :style="dtStyle()">{{$t('temporal_extent')}}</dt>
  <dd>
      {{date2str(metadata.tempExtentBegin)}}
      <i class="fa fa-long-arrow-right" ></i>
      {{date2str(metadata.tempExtentEnd)}}
  </dd>
</dl>
<dl v-if="metadata.lineage" class="mtdt-main-parameter">
    <dt :style="dtStyle()">{{$t('lineage')}}</dt>
   <dd>{{metadata.lineage}}</dd>
</dl>
<dl v-if="countConstraint > 0" class="mtdt-main-parameter">
  <dt :style="dtStyle()">{{$t('constraint')}}</dt>
  <dd>
     <dl v-for="key in constraintList" v-if="metadata[key]">
       <dt>{{$t(key)}}</dt>
       <dd><div v-for="line in metadata[key]">{{line}}</div></dd>
     </dl>
  </dd>
</dl>
          
 <dl>         <hr style="margin:60px 50px;"/> </dl>
 <dl><dt :style="dtStyle()">{{$t('identifier')}}</dt><dd>{{metadata.id}}</dd></dl>
 <dl v-if="Object.keys(metadata.contacts.metadata).length > 0">
   <dt :style="dtStyle()">Contacts métadonnées</dt>
   <dd>
           <formater-list-contact   :contacts="metadata.contacts.metadata" type="metadata" ></formater-list-contact>
   </dd>
 </dl>
</div>
</template>
<script>
import FormaterQuicklooks from './formater-quicklooks.vue'
import FormaterParameters from './formater-parameters.vue'
import FormaterListContact from './formater-list-contact.vue'
import FormaterKeywords from './formater-keywords.vue'
export default {
  name: 'FormaterMetadataContent',
  components: {
    FormaterQuicklooks,
    FormaterParameters,
    FormaterListContact,
    FormaterKeywords
  },
  props:{
    metadata: {
      type: Object,
      default: null
    }
  },
  computed: {
    countDate() {
      var n = 0
      var _this = this
      this.dateList.forEach(function (key){
        if (_this.metadata.hasOwnProperty(key)) {
          n ++
        }
      })
      return n;
    },
    countContactResource () {
      var n = 0
      for(var key in this.metadata.contacts.resource) {
        n += this.metadata.contacts.resource[key].length
      }
      return n;
    },
    countConstraint () {
      var n = 0
      var _this = this
      this.constraintList.forEach( function (key) {
        if (_this.metadata.hasOwnProperty(key)) {
          n++
        }
      })
      return n
    }
  },
  created () {
    console.log(this.metadata.identifier)
  },
  data () {
    return {
      dateList: ['createDate', 'publicationDate', 'revisionDate'],
      constraintList: ['legalConstraints', 'securityConstraints', 'resourceConstraints']
    }
  },
  methods:{

    date2str (date) {
      //return 'hello';
      var myDate = moment(date, 'YYYY-MM-DD')
      if (myDate.isValid()) {
        return myDate.format('ll')
      } else {
        return this.$i18n.t('now')
      }

    },
    dtStyle () {
      return {color: this.$store.state.style.primary}
    }
  }
}
</script>
<style>
.mtdt-metadata .mtdt-content dl{
  display: block;
 /* clear:left;*/
 /* width:100%;*/
 /* padding-top: 20px;*/
  margin:0;
  padding-top:20px;
}
.mtdt-metadata .mtdt-content dd dl:first-child {
  padding-top:0px;
}
.mtdt-metadata .mtdt-content dt{
  width:130px;
  display: inline-block;
  word-break: break-word;
  font-size:1.1em;
  font-weight:600;
  vertical-align: top;
}
.mtdt-metadata .mtdt-content dd{
  width:auto;
  display: inline-block;
  word-break: break-all;
  line-height: 1.3em;
  vertical-align: top;
}
.mtdt-metadata .mtdt-content dl.mtdt-main-parameter{
  clear: left;
}
.mtdt-metadata .mtdt-content dl.mtdt-main-parameter dd{
  width: calc(100% - 180px);
}
/*.mtdt-metadata .mtdt-content dd div,
.mtdt-metadata .mtdt-content dd span{
  display: inline-block;
}*/
/*.mtdt-metadata .mtdt-content dd dl {
  padding-top:8px;
}

.mtdt-metadata .mtdt-content dd dl dt{
  width:100%;
  font-size:1em;
}
.mtdt-metadata .mtdt-content dd dl dd{
  width:100%;
  font-size:1em;
}*/
</style>