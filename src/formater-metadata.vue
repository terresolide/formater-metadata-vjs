<i18n>{
   "en":{
     "main": "Decription",
     "complement": "Others informations",
     "temporal_extent": "Temporal extent"
   },
   "fr":{
      "main": "Decription",
       "complement": "Informations complémentaires",
      "temporal_extent": "Etendue temporelle"
      
   }
}
</i18n>
<template>
 <div class="fmt-metadata fmt-capsule">
    
   <span class="fmt-metadata-close fa fa-close" @click="close"></span>
   <div v-if="meta">
      <h1 class="fmt-metadata-header">
           <a v-if="meta.groupWebsite" :href="meta.groupWebsite" :title="$gn('group-'+ meta.groupOwner)" starget="_blank" class="fmt-group-logo">
             <img :src="meta.logo"/>
          </a>
          <a v-else href="#" :alt="$gn('group-'+ meta.groupOwner)" :title="$gn('group-'+ meta.groupOwner)" class="fmt-group-logo">
              <img :src="meta.logo"  />
          </a>
          <i  class="fa" :class="meta.type === 'series' ? 'fa-files-o' : 'fa-file'"  v-if="['dataset','series'].indexOf(meta.type) >= 0"></i>
          <div>
          
          {{meta.title ? meta.title: meta.defaultTitle}}
          </div>
        
      </h1> 
      <hr style="border:1px solid grey;margin-bottom:0px;clear:both;"/>
      <div class="fmt-tabs">
         <div v-for="(tab,index) in tabs" v-if="tab === true" class="fmt-tab" :class="{'selected': currentTab === index}" @click="currentTab = index">{{$t(index)}}</div>
         <formater-export-links :uuid="uuid" v-if="uuid"></formater-export-links>
      </div>
      <div v-if="currentTab === 'main'" style="margin-top:20px;">
	      <div class="fmt-description">
	        <formater-quicklooks :quicklooks="meta.images"></formater-quicklooks>
	        <span v-html="meta.description"></span>
	      </div>
		  <div class="fmt-temporalExtent" style="clear:both;" v-if="meta.tempExtentBegin">
			<h2><i class="fa fa-clock-o"></i>{{$t('temporal_extent')}}</h2>
			 <div>
			    {{date2str(meta.tempExtentBegin)}}
			    <i class="fa fa-long-arrow-right" ></i>
			    {{date2str(meta.tempExtentEnd)}}
			</div>
		  </div>
		  <div v-if="!tabs.complement">
	          <formater-list-contact  :lang="lang" :responsible-party="meta.responsibleParty" :responsible-party2="metaLang2.responsibleParty"></formater-list-contact>
	     </div>
	     <div v-else>
	      <formater-paging :lang="lang" :nb-record="4" :depth="depth + 1"></formater-paging>
       <formater-list-metadata :lang="lang" :depth="depth + 1"></formater-list-metadata>
	     </div>
      </div>
      <div v-if="currentTab === 'complement'" >
             <formater-list-contact  :lang="lang" :responsible-party="meta.responsibleParty" :responsible-party2="metaLang2.responsibleParty"></formater-list-contact>
      </div>
       <div v-if="currentTab === 'quality'" >
             <formater-list-contact  :lang="lang" :responsible-party="meta.responsibleParty" :responsible-party2="metaLang2.responsibleParty"></formater-list-contact>
      </div>
   </div>
 </div>
</template>
<script>
import FormaterListContact from './formater-list-contact.vue'
import FormaterQuicklooks from './formater-quicklooks.vue'
import FormaterExportLinks from './formater-export-links.vue'
const FormaterPaging = () => import('./formater-paging.vue')
const FormaterListMetadata = () => import('./formater-list-metadata.vue')
import moment from 'moment';
// import { extendMoment } from 'moment-range';
// window.momentCst = extendMoment(moment);

export default {
  name: 'FormaterMetadata',
  components: {
    FormaterListContact,
    FormaterQuicklooks,
    FormaterExportLinks,
    FormaterPaging,
    FormaterListMetadata
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
    depth: {
      type: Number,
      default:0
    }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue
    	this.srv = process.env.GEONETWORK + 'srv/' + (newvalue === 'fr' ? 'fre' : 'eng') + '/'
    	this.headers['Accept-Language'] =  newvalue === 'fr' ? 'fre': 'eng'
    },
    metadata: {
      immediate: true,
      handler (newvalue) {
        console.log('dans metadata')
        console.log(newvalue)
      }
    }
  },
  data() {
    return {
     tabs: {
       main: true,
       complement: false,
       quality: false
     },
     uuid: null,
     currentTab: 'main',
     meta: null,
     metaLang2: {},
     uuid: null,
     popstateListener: null,
     keydownListener: null,
     srv: process.env.GEONETWORK + 'srv/' + (this.lang === 'fr'? 'fre' : 'eng') + '/',
     api: process.env.GEONETWORK + '/srv/api/',
     headers: {
       'Accept': 'application/json, text/plain, */*',
       'Accept-Language': this.lang === 'fr' ? 'fre': 'eng'
     },
     parameters: {}
    }
  },
  created () {
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    moment.locale(this.lang)
    this.uuid = this.metadata['geonet:info'].uuid
    this.popstateListener = this.close.bind(this)
    document.addEventListener('popstate', this.popstateListener)
    this.keydownListener = this.checkEscape.bind(this)
    document.addEventListener('keydown', this.keydownListener)
  },
  watch: {
    meta: {
      handler(val) {
        if (val.related && val.related.children) {
          this.getRecords()
          this.$set(this.tabs, 'complement', true)
        } else {
          this.$set(this.tabs, 'complement', false)
        }
      }
    }
  },
 /* computed: {
    hasChild () {
      if (this.meta && this.meta.related && this.meta.related.children) {
        console.log(this.meta.related)
        this.tabs.complement = true
        console.log(this.tabs)
        return true;
      } else {
        this.$delete(this.tabs, 1 )
        return false;
      }
    }
  },*/
  mounted () {
   if (this.metadata) {
     this.meta = this.metadata
     this.fillMetadata()
   }
  },
  destroyed () {
    document.removeEventListener('popstate', this.popstateListener)
    this.popstateListener = null
    document.removeEventListener('keydown', this.keydownListener)
    this.keydownListener = this.checkEscape.bind(this)
  },
  methods: {
      date2str (date) {
        //return 'hello';
        return moment(date, 'YYYY-MM-DD').format('ll')
      },
      checkEscape (event) {
        var event = event || window.event
        var isEscape = false;
        if ("key" in event) {
          isEscape = (event.key === "Escape" || event.key === "Esc");
        } else {
          isEscape = (event.keyCode === 27);
        }
        if (isEscape) {
          this.close(event);
        }
      },
      close (event) {
        event.preventDefault();
        this.$emit('close');
      },

	  fillMetadata () {
	     //get meta from other language if meta._locale != meta.docLocale
	     this.uuid = this.meta['geonet:info'].uuid;
	     
	     if (this.meta._locale ===  this.meta.docLocale) {
	       
	       return
	     }
	     
	     var url = process.env.GEONETWORK + 'srv/'+this.meta.docLocale+'/q?_content_type=json&fast=index&uuid=' + this.uuid;
	     var _this = this
	     this.$http.get(url).then(
               response => {
                 console.log(response.body)
                // _this.extract(response.body.metadata)
                 _this.metaLang2 = response.body.metadata
               } 
       	 )
	  },
	  getRecords () {
      
      	  // lance le requeteur
      	  var event = new CustomEvent('fmt:metadataWithChildEvent', {detail: {uuid: this.uuid, depth: this.depth+1}})
      	  document.dispatchEvent(event)
    }
	    
  }
}
</script>
<style>
.fmt-metadata{
  position:relative;
  padding: 10px;
  max-width: 100%;
  margin: auto;
  height: auto;
  overflow: hidden;
 
}
.fmt-metadata span.fmt-metadata-close{
  position: absolute;
  top:3px;
  right:5px;
  cursor: pointer;
  opacity:0.5;
}
.fmt-metadata span.fmt-metadata-close:hover{
  opacity:1;
}
.fmt-metadata h1.fmt-metadata-header div{
  float:left;
  max-width:calc(100% - 150px);
  display:inline-block;
}
.fmt-metadata h1.fmt-metadata-header i.fa{
  float:left;
}
.fmt-metadata i.fa {
  margin-right: 12px;
}
.fmt-metadata h1,
.fmt-metadata h2,
.fmt-metadata h3,
.fmt-metadata h4{
    max-width: 100%;
    color:#754a15;
}
.fmt-metadata h2 {

  font-size: 1.2rem;
  margin-bottom:0;
}
.fmt-metadata h1{
  font-size:1.5rem;
}
.fmt-metadata div.fmt-tab,
.fmt-metadata .fmt-tab-export{
  display:inline-block;
  padding: 5px 10px;
  border:1px dotted grey;
  border-top:0px;
  background: #eee;
  cursor: pointer;
}
.fmt-metadata div.fmt-tab:hover,
.fmt-metadata .fmt-tab-export:hover{
   background: #ccc;
}
.fmt-metadata div.fmt-tab.selected{
  background: #ddd;
}
.fmt-metadata div.fmt-description{
  line-height:1.5;
}
.fmt-metadata .fmt-group-logo{
    float:right;
    margin-top:-5px;
}
.fmt-metadata .fmt-group-logo img{
	max-width:100px; 
	height:40px;
}
.fmt-metadata .fmt-contacts h3{
    margin-bottom:0;
}
.fmt-metadata .fmt-temporalExtent div{
  margin: 5px 30px;
}
.fmt-metadata .fmt-temporalExtent i.fa.fa-long-arrow-right {
  margin-left:12px;
}
</style>