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
          {{meta.title ? meta.title: meta.defaultTitle}}
          <a v-if="meta.groupWebsite" :href="meta.groupWebsite" :title="$gn('group-'+ meta.groupOwner)" starget="_blank" class="formater-group-logo">
             <img :src="meta.logo"/>
          </a>
          <a v-else href="#" :alt="$gn('group-'+ meta.groupOwner)" :title="$gn('group-'+ meta.groupOwner)" class="formater-group-logo">
              <img :src="meta.logo"  />
          </a>
      </h1> 
      <hr style="border:1px solid grey;margin-bottom:0px;"/>
      <div class="formater-tabs">
         <div v-for="(tab,index) in tabs" class="formater-tab" :class="{'selected': currentTab === tab.value}" @click="currentTab = tab.value">{{tab.title}}</div>
         <formater-export-links :uuid="uuid" v-if="uuid"></formater-export-links>
      </div>
      <div v-if="currentTab === 'tab1'" style="margin-top:20px;">
	      <div class="formater-description">
	        <formater-quicklooks :quicklooks="meta.image"></formater-quicklooks>
	        <span v-html="meta.description"></span>
	      </div>
	      
	      <div v-if="meta.responsibleParty" style="clear:both;">
	        <h2><i class="fa fa-users"></i>{{$tc('contact', meta.responsibleParty.length)}}</h2>
	        <formater-contact  v-for="(item, index) in meta.responsibleParty" :key="index" :contact="item" :lang="lang"></formater-contact>
	      </div>
      </div>
      <div v-if="currentTab === 'tab2'">sous forme de xml</div>
   </div>
 </div>
</template>
<script>
import FormaterContact from './formater-contact.vue'
import FormaterQuicklooks from './formater-quicklooks.vue'
import FormaterExportLinks from './formater-export-links.vue'
export default {
  name: 'FormaterMetadata',
  components: {
    FormaterContact,
    FormaterQuicklooks,
    FormaterExportLinks
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
     uuid: null
    }
  },
  mounted () {
   console.log(this.lang)
   this.$i18n.locale = this.lang
   this.$setGnLocale(this.lang)
   if (this.metadata) {
     this.meta = this.metadata
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
        console.log(response.body.metadata[0])
        this.meta = response.body.metadata[25]
        // this.meta.abstract = this.meta.abstract.replace(/(?:\\[rn]|[\r\n])/g, '<br />');
        this.fillMetadata();
      },
      handleError () {
        console.log('metadata_not_find')
      },
	  fillMetadata () {
	     //get meta from other language if meta._locale != meta.docLocale
	     this.uuid = this.meta['geonet:info'].uuid;
	     if (this.meta._locale ===  this.meta.docLocale) {
	       this.extract()
	       return
	     }
	     
	     var url = process.env.GEONETWORK + 'srv/'+this.meta.docLocale+'/q?_content_type=json&fast=index&uuid=' + this.uuid;
	     var _this = this
	     this.$http.get(url).then(
               response => {
                 console.log(response.body)
                 _this.extract(response.body.metadata)
               } 
       	 )
	  },
      extract (meta2) {
        // search info in the other language
        // l'uuid est geonet:info > uuid
        // pour obtenir sous forme de json xml affichage "complet"
        // url process.env.GEONETWORK + srv/api/records/+ uuid
        // url pour le xml? process.env.GEONETWORK + 'srv/api/records/''+ uuid + 'formatters/xml?attachment=true'
        // url pour le pdf (qu'en est-il de la langue)? process.env.GEONETWORK + 'srv/api/records/''+ uuid + 'formatters/xsl-view?root=div&output=pdf'
        this.meta.url = {}
        var uuid = this.meta['geonet:info'].uuid
        this.meta.logo = process.env.GEONETWORK + this.meta.logo
        if (this.meta.abstract) {
          this.meta.abstract = this.meta.abstract.replace(/(?:\\[rn]|[\r\n])/g, '<br />');
        }
        if (this.meta.defaultAbstract) {
          this.meta.defaultAbstract = this.meta.defaultAbstract.replace(/(?:\\[rn]|[\r\n])/g, '<br />');
        }
        this.meta.description = this.meta.abstract ? this.meta.abstract: this.meta.defaultAbstract
        this.extractContact(meta2)
	  },
	  extractContact (meta2 =[]) {
	    console.log(meta2)
	    if (this.meta.responsibleParty) {
		    this.meta.responsibleParty.forEach( function (contact)  {
		      console.log(contact)
		        
		    })
	    }
	    if (meta2.responsibleParty) {
	        console.log('loop')
		    meta2.responsibleParty.forEach( function (contact) {
		      console.log(contact)
		    })
	    }
	    
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
.formater-metadata div.formater-tab,
.formater-metadata .formater-tab-export{
  display:inline-block;
  padding: 5px 10px;
  border:1px dotted grey;
  border-top:0px;
  background: #eee;
  cursor: pointer;
}
.formater-metadata div.formater-tab:hover,
.formater-metadata .formater-tab-export:hover{
   background: #ccc;
}
.formater-metadata div.formater-tab.selected{
  background: #ddd;
}
.formater-metadata div.formater-description{
  line-height:1.5;
}
.formater-metadata .formater-group-logo{
    float:right;
    margin-top:-5px;
}
.formater-metadata .formater-group-logo img{
	max-width:100px; 
	height:40px;
}
</style>