<i18n>{
   "en":{
     "date": "Date | Dates",
     "createDate": "create",
     "publicationDate": "publication",
     "revisionDate": "revision",
     "contact": "Contact | Contacts",
     "keyword": "Keyword | Keywords",
     "lineage": "Lineage",
     "constraint": "Constraints",
     "legalConstraints": "legal",
     "securityConstraints": "security",
     "resourceConstraints": "resource",
     "temporal_extent": "Temporal extent",
     "now": "Now",
     "identifier": "Identifier",
     "about_resource": "About the resource",
     "about_metadata": "About the metadata"
     

   },
   "fr":{
     "date": "Date | Dates",
     "createDate": "création",
     "publicationDate": "publication",
     "revisionDate": "mise à jour",
     "contact": "Contact | Contacts",
     "keyword": "Mot-clé | Mots-clés",
      "lineage": "Généalogie",
      "constraint": "Contraintes",
     "legalConstraints": "légales",
     "securityConstraints": "de sécurité",
     "resourceConstraints": "sur les données",
      "temporal_extent": "Etendue temporelle",
      "now": "Aujourd'hui",
      "identifier": "Identifiant",
      "about_resource": "A propos des données",
     "about_metadata": "A propos des métadonnées"
   }
}
</i18n>
<template>
<div class="mtdt-content">

<h1 :style="{color:$store.state.style.primary}">{{$t('about_resource')}}</h1>
 <div style="float:right;background:#eee;margin-left:5px;max-width:300px;min-width:200px;width:25%;" v-if="hasRelated">
 <formater-related type="metadata" :download="metadata.download" :id="metadata.id"
         :layers="metadata.layers"  :links="metadata.links" :related="metadata.related" :order="metadata.order" :siblings="metadata.siblings"></formater-related>
    
</div>
 <div class="mtdt-description" style="display:block;">
       <formater-quicklooks :quicklooks="metadata.images"></formater-quicklooks>
       <dl  class="mtdt-identifier" v-if="metadata.identifier && !metadata.description">
             <dt :style="dtStyle()">{{$t('identifier')}}</dt>
              <dd :style="{width:  'calc(100% - 700px)', minWidth: '300px'}">
              {{metadata.identifier}}
              </dd>
             
       </dl>
       <p v-html="metadata.description" v-if="metadata.description" style="margin-bottom:20px;"></p> 
       <dl class="mtdt-identifier" v-if="metadata.identifier && metadata.description" :style="{clear: (type === 'opensearch' ? 'none' : 'left')}">
             <dt :style="dtStyle()">{{$t('identifier')}}</dt>
              <dd style="max-width:calc(100% - 380px);">{{metadata.identifier}}</dd>
       </dl>
       <formater-parameters type="metadata" :metadata="metadata" ></formater-parameters>
</div>
<dl v-if="countDate > 0" class="mtdt-main-parameter">
   <dt :style="dtStyle()">{{$tc('date', countDate)}} </dt>
   <dd>
      <div v-for="key in $store.state.dateList" v-if="metadata[key]">
           {{date2str(metadata[key])}} ({{$t(key)}})
      </div>
   </dd>
</dl>
<dl v-if="countContactResource > 0 " class="mtdt-main-parameter">
  <dt :style="dtStyle()">{{$tc('contact', countContactResource)}}</dt>
  <dd> <formater-list-contact   :contacts="metadata.contacts.resource" type="resource" ></formater-list-contact></dd>
</dl>
<dl v-if="metadata.keyword.length > 0" class="mtdt-main-parameter">
  <dt :style="dtStyle()">{{$tc('keyword', metadata.keyword.length)}}</dt>
  <dd style="max-width:calc(100% - 305px);"> <formater-keywords :keywords="metadata.keyword"></formater-keywords></dd>
</dl>
<dl  v-if="metadata.tempExtentBegin" class="mtdt-main-parameter">
  <dt :style="dtStyle()">{{$t('temporal_extent')}}</dt>
  <dd>
     <formater-temporal-extent :start="metadata.tempExtentBegin"  :end="metadata.tempExtentEnd" />
  </dd>
</dl>
<dl v-if="metadata.lineage" class="mtdt-main-parameter">
    <dt :style="dtStyle()">{{$t('lineage')}}</dt>
   <dd style="word-break:break-word;text-align:justify;" v-html="toHTML(metadata.lineage)"></dd>
</dl>
<dl v-if="countConstraint > 0" class="mtdt-main-parameter">
  <dt :style="dtStyle()">{{$t('constraint')}}</dt>
  <dd>
     <div v-for="key in $store.state.constraintList" v-if="metadata[key]">

       <div v-for="line in metadata[key]" style="line-height:1;margin-bottom:5px;">{{line}}</div>
     </div>
  </dd>
</dl>
          
 <dl>         <hr /> </dl>
 <h1 :style="{color:$store.state.style.primary}">{{$t('about_metadata')}}</h1>
 <dl><dt :style="dtStyle()">{{$t('identifier')}}</dt><dd>{{metadata.id}}</dd></dl>
 <dl v-if="countMetadataDate > 0" class="mtdt-main-parameter">
   <dt :style="dtStyle()">{{$tc('date', countDate)}} </dt>
   <dd>
      <div v-for="key in $store.state.dateList" v-if="metadata['geonet:info'][key]">
           {{date2str(metadata['geonet:info'][key])}} ({{$t(key)}})
      </div>
   </dd>
</dl>
 <dl v-if="Object.keys(metadata.contacts.metadata).length > 0">
   <dt :style="dtStyle()">Contacts</dt>
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
import FormaterTemporalExtent from './formater-temporal-extent.vue'
import FormaterRelated from './formater-related.vue';

export default {
  name: 'FormaterMetadataContent',
  components: {
    FormaterQuicklooks,
    FormaterParameters,
    FormaterListContact,
    FormaterKeywords,
    FormaterTemporalExtent,
    FormaterRelated
  },
  props:{
    metadata: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: 'geonetwork'
    }
  },
  computed: {
    countDate() {
      var n = 0
      var _this = this
      this.$store.state.dateList.forEach(function (key){
        if (_this.metadata.hasOwnProperty(key)) {
          n ++
        }
      })
      return n;
    },
    countMetadataDate() {
      if (!this.metadata['geonet:info']) {
        return
      }
      var n = 0
      var _this = this
      this.$store.state.dateList.forEach(function (key){
        if (_this.metadata['geonet:info'].hasOwnProperty(key)) {
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
      this.$store.state.constraintList.forEach( function (key) {
        if (_this.metadata.hasOwnProperty(key)) {
          n++
        }
      })
      return n
    },
    hasRelated () {
      return this.metadata.download || this.metadata.layers || this.metadata.links || this.metadata.related
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
    },
    toHTML (str) {
      return str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
  }
}
</script>
<style>
.mtdt-content hr{
margin: 20px 50px;
border: 0;
height: 1px;
background: #333;
    background-image: none;
background-image: linear-gradient(to right, #ccc, #333, #ccc);
}

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
  min-width:85px;
  width:15%;
  max-width:170px;
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
  line-height: 1em;
  vertical-align: top;
}
.mtdt-metadata .mtdt-content dl.mtdt-main-parameter{
  clear: left;
}
.mtdt-metadata .mtdt-content dl.mtdt-main-parameter dd{
  width: calc(100% - 305px);
}

.mtdt-metadata .mtdt-content .mtdt-description span.mtdt-quicklooks + span > ul,
.mtdt-metadata .mtdt-content .mtdt-description span.mtdt-quicklooks + span > div{
   max-width: calc(100% - 400px);
   float:left;
   margin-left: 0px;
   display: block;
}
.mtdt-metadata .mtdt-content .mtdt-description ul {
  padding-left:12px;
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