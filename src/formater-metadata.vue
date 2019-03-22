<i18n>{
   "en":{
     "resource_contact": "Contact | Contacts"
   },
   "fr":{
     "resource_contact": "Contact | Contacts"
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
          <i class="fa fa-database" v-if="['dataset','serie'].indexOf(meta.type) >= 0"></i>
          <div>
          
          {{meta.title ? meta.title: meta.defaultTitle}}
          </div>
        
      </h1> 
      <hr style="border:1px solid grey;margin-bottom:0px;clear:both;"/>
      <div class="fmt-tabs">
         <div v-for="(tab,index) in tabs" class="fmt-tab" :class="{'selected': currentTab === tab.value}" @click="currentTab = tab.value">{{tab.title}}</div>
         <formater-export-links :uuid="uuid" v-if="uuid"></formater-export-links>
      </div>
      <div v-if="currentTab === 'tab1'" style="margin-top:20px;">
	      <div class="fmt-description">
	        <formater-quicklooks :quicklooks="meta.images"></formater-quicklooks>
	        <span v-html="meta.description"></span>
	      </div>
	      
	      <div v-if="contacts.resource" style="clear:both;">
	        <h2><i class="fa fa-users"></i>{{$tc('resource_contact', contacts.resource.length)}}</h2>
	        {{contacts.resource}}
	        <div v-for="(fonction, key) in contacts.resource" :key="key" >
	        {{fonction}}
		         <h3><i class="fa fa-user"></i>{{$gn(key)}} key</h3>
		        <formater-contact  v-for="(item, index) in fonction" :key="index" :contact="item" :lang="lang"></formater-contact>
	        </div>
	      </div>
	      
	       <div v-if="contacts.metadata" style="clear:both;">
	        <h2><i class="fa fa-users"></i>{{$tc('resource_contact', contacts.metadata.length)}}</h2>
	        {{contacts.metadata}}
	         <div v-for="(fonction, key) in contacts.metadata" :key="key" >
	        {{fonction}}
		         <h3><i class="fa fa-user"></i>{{$gn(key)}} key</h3>
		        <formater-contact  v-for="(item, index) in fonction" :key="index" :contact="item" :lang="lang"></formater-contact>
	        </div>  </div>
	      
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
     uuid: null,
     popstateListener: null,
     keydownListener: null,
     contacts: {
       metadata: [],
       resource: []
     }
    }
  },
  created () {
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    this.popstateListener = this.close.bind(this)
    document.addEventListener('popstate', this.popstateListener)
    this.keydownListener = this.checkEscape.bind(this)
    document.addEventListener('keydown', this.keydownListener)
  },
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
	     console.log(this.uuid)
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

        this.extractContact(meta2)
	  },
	  extractContact (meta2 =[]) {
	    console.log(meta2)
	    this.contacts = {
	      resource: [],
	      metadata: []
	    }
	    console.log(this.meta.responsibleParty)
	    if (this.meta.responsibleParty) {
	        var _this = this
		    this.meta.responsibleParty.forEach( function (contact)  {
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
	    } else 
	    if (meta2.responsibleParty) {
	        console.log('loop')
		    var _this = this
		    meta2.responsibleParty.forEach( function (contact)  {
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
}
</script>
<style>
.fmt-metadata{
  position:relative;
  padding: 10px;
  max-width: 900px;
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
  width:calc(100% - 130px);
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
</style>