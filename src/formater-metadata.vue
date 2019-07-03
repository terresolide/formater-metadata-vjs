<i18n>{
   "en":{
     "main": "Decription",
     "complement": "Others informations",
     "temporal_extent": "Temporal extent",
     "search": "Search"
   },
   "fr":{
      "main": "Decription",
       "complement": "Informations complémentaires",
      "temporal_extent": "Etendue temporelle",
      "search": "Rechercher"
      
   }
}
</i18n>
<template>
 <div class="mtdt-metadata mtdt-capsule">
    
   <span class="mtdt-metadata-close fa fa-close" @click="close"></span>
   <div v-if="meta">
      <h1 class="mtdt-metadata-header">
           <a v-if="meta.groupWebsite" :href="meta.groupWebsite" :title="$gn('group-'+ meta.groupOwner)" starget="_blank" class="mtdt-group-logo">
             <img :src="meta.logo"/>
          </a>
          <a v-else href="#" :alt="$gn('group-'+ meta.groupOwner)" :title="$gn('group-'+ meta.groupOwner)" class="mtdt-group-logo">
              <img :src="meta.logo"  />
          </a>
          <i  class="fa" :class="meta.type === 'series' ? 'fa-files-o' : 'fa-file'"  v-if="['dataset','series'].indexOf(meta.type) >= 0"></i>
          <div>
          
          {{meta.title ? meta.title: meta.defaultTitle}}
          </div>
        
      </h1> 
      <hr style="border:1px solid grey;margin-bottom:0px;clear:both;"/>
      <div class="mtdt-tabs">
         <div v-for="(tab,index) in tabs" v-if="tab === true" class="mtdt-tab" :class="{'selected': currentTab === index}" @click="currentTab = index">{{$t(index)}}</div>
         <formater-export-links :uuid="uuid" v-if="uuid"></formater-export-links>
      </div>
      <!--  tab search if have child -->
      <div v-if="tabs.search" v-show="currentTab === 'search'">
           <formater-paging :lang="lang" :nb-record="nbRecord" :type="type" :record-by-line="recordByLine" :depth="depth + 1"></formater-paging>
      		<formater-list-metadata :lang="lang" :depth="depth + 1"  @records="recordsPerLineChange"></formater-list-metadata>
      </div>
      <!--  others tab -->
      <div v-if="currentTab === 'main'" style="margin-top:20px;">
	      <div class="mtdt-description">
	        <formater-quicklooks :quicklooks="meta.images"></formater-quicklooks>
	        <span v-html="meta.description"></span>
	      </div>
		  <div class="mtdt-temporalExtent" style="clear:both;" v-if="meta.tempExtentBegin">
			<h2><i class="fa fa-clock-o"></i>{{$t('temporal_extent')}}</h2>
			 <div>
			    {{date2str(meta.tempExtentBegin)}}
			    <i class="fa fa-long-arrow-right" ></i>
			    {{date2str(meta.tempExtentEnd)}}
			</div>
		  </div>
		  <div >
	          <formater-list-contact  :lang="lang" :responsible-party="meta.responsibleParty" :responsible-party2="metaLang2.responsibleParty"></formater-list-contact>
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
//     nbRecords: {
//       type: Number,
//       default: 4
//     }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue
    	moment.locale(newvalue)
    	this.srv = process.env.GEONETWORK + 'srv/' + (newvalue === 'fr' ? 'fre' : 'eng') + '/'
    	this.headers['Accept-Language'] =  newvalue === 'fr' ? 'fre': 'eng'
    },
    metadata: {
      immediate: true,
      handler (newvalue) {
        this.computeHasChild(newvalue)
      }
    } //,
//     meta: {
//       handler(val, old) {
//         if (val.related && val.related.children) {
//          // this.$set(this.tabs, 'complement', true)
//           if (!this.hasChild) {
//             this.getRecords()
//             this.hasChild = true
//             this.$set(this.tabs, 'search', true)
//             this.currentTab = 'search'
//           }
//         } else {
//           this.hasChild = false
//           this.$set(this.tabs, 'search', false)
//         }
//       }
//     }
  },
  data() {
    return {
     tabs: {
       search: false,
       main: true,
       complement: false,
       quality: false
     },
     uuid: null,
     currentTab: 'main',
     meta: null,
     hasChild: false,
     metaLang2: {},
     popstateListener: null,
     keydownListener: null,
     searchEventListener: null,
    // srv: process.env.GEONETWORK + 'srv/' + (this.lang === 'fr'? 'fre' : 'eng') + '/',
    // api: process.env.GEONETWORK + '/srv/api/',
     headers: {
       'Accept': 'application/json, text/plain, */*',
       'Accept-Language': this.lang === 'fr' ? 'fre': 'eng'
     },
     parameters: {},
     recordByLine: 4,
     nbRecord: 12,
     // use for opensearch api
     api: null,
     geographic: ['geometry', 'box', 'lat', 'lon', 'radius'],
     paging: ['maxRecords', 'index', 'page'],
     removedFields: ['lang', 'name', 'q', 'organisationName', 'parentIdentifier'],
     osParameters: [],
     geoParameters: [],
     pagingParameters: [],
     type: 'geonetwork'
    }
  },
  created () {
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    moment.locale(this.lang)
    if (this.metadata['geonet:info']) {
       this.uuid = this.metadata['geonet:info'].uuid
    } else {
       this.uuid = this.metadata.id
    }
    this.popstateListener = this.close.bind(this)
    document.addEventListener('popstate', this.popstateListener)
    this.keydownListener = this.checkEscape.bind(this)
    document.addEventListener('keydown', this.keydownListener)
    this.searchEventListener = this.handleSearch.bind(this) 
  	document.addEventListener('aerisSearchEvent', this.searchEventListener);
  },
  watch: {
    
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
     this.computeHasChild(this.metadata)
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
      computeHasChild (val) {
        console.log(val)
        if (val.related && val.related.children) {
          // this.$set(this.tabs, 'complement', true)
           if (!this.hasChild) {
            
             this.getRecords()
             this.hasChild = true
             this.$set(this.tabs, 'search', true)
             this.currentTab = 'search'
           }
         } else if (val.api) {
           if (!this.hasChild) {
             this.getApiParameters(val.api)
             
           }
           
         } else {
           this.hasChild = false
           this.$set(this.tabs, 'search', false)
         }
      },
      recordsPerLineChange (count) {
    	  this.recordByLine = count
    	  this.nbRecord = count * 4
//     	  var evt = new CustomEvent('fmt:pageChangedEvent')
//     	  document.dispatchEvent(evt)
      },
	  fillMetadata () {
	     //get meta from other language if meta._locale != meta.docLocale
	     if (this.meta['geonet:info']) {
	       this.uuid = this.meta['geonet:info'].uuid;
	     } else {
	       this.uuid = this.meta.id
	     }
	     
	     
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
       	 this.searchOnlines()
       	 if (this.meta.related && this.meta.related.children) {
       	   this.hasChild = true
       	   this.getRecords()
       	 } 
	  },
	  searchOnlines () {
      if (!this.metadatas) {
        return
      }
       var headers =  {
         'Accept': 'application/json, text/plain, */*',
         'Accept-Language': this.lang === 'fr' ? 'fre': 'eng'
       }
//        var url = process.env.GEONETWORK + 'srv/api/records/'+this.uuid+'related?type=onlines'
//        var self = this
//        this.$http.get(url, {
//              headers: headers
//            }).then( response => { self.addOnlines(response.body)})
        
      },
//       addOnlines (data) {
//         console.log(data)
//       },
	  getRecords () {
          // useless, it's trigger when load formater-page-changed
      	  // lance le requeteur
//       	  console.log('search child from metadata')
      	  var event = new CustomEvent('fmt:metadataWithChildEvent', {detail: {uuid: this.uuid, depth: this.depth}})
      	  document.dispatchEvent(event)
      },
      getApiParameters (describe) {
        this.$http.get(describe.http)
        .then(
            response => { this.extractDescribeParameters(response.body);}
         )
      },
      extractDescribeParameters (parameters) {
        var parser = new DOMParser()
        var xml = parser.parseFromString(parameters, 'text/xml')
        console.log(xml)
        var urls = xml.firstChild.childNodes
       var url = null
       console.log(urls)
        urls.forEach(function (node) {
           if (node.tagName && node.tagName.toLowerCase() === 'url' && node.getAttribute('type').indexOf('json') >= 0) {
               url = node
           }
        })
        if (!url)  {
          return
        }
        var template = url.getAttribute('template')
        var extract = template.match(/^(.*?search.json).*$/)
        console.log(extract[1])
        if (!extract[1]) {
          return
        } else {
          this.api = extract[1]
          console.log(extract[1])
        }
        var parameters = url.getElementsByTagName('parameters:Parameter')
        console.log(parameters)
        var self = this
        for(var i=0; i < parameters.length; i++){
          var name = parameters[i].getAttribute('name')
          var obj= {
              name: name,
              title: parameters[i].getAttribute('title')
          }
          var pattern = parameters[i].getAttribute('pattern')
          if (pattern) {
            obj = Object.assign(obj, {pattern: pattern})
          }
          var min = parameters[i].getAttribute('minInclusive')
          if (min) {
            obj= Object.assign(obj, {min: min})
          }
          var max = parameters[i].getAttribute('maxInclusive')
          if (max) {
            obj = Object.assign(obj, {max: max})
          }
          var nodes = parameters[i].getElementsByTagName('parameters:Options')
          if (nodes) {
            var options= []
            for(var k=0; k < nodes.length; k++) {
              options.push(nodes[k].getAttribute('value'))
            }
            if (options.length > 0)
            obj = Object.assign(obj, {options: options})
          }
          if (self.removedFields.indexOf(name) >=0) {
            
//           }else if (name.toLowerCase() === 'platform') {
//             this.platform = obj
//           } else if (name.toLowerCase() === 'q'){
//             this.hasQ = true
          } else if (self.geographic.indexOf(name) >=0) {
            self.geoParameters.push(obj)
          } else if (self.paging.indexOf(name) >= 0) {
             self.pagingParameters.push(obj)
          }else if (name.indexOf('Date') === -1 && name.indexOf('Cover') === -1 && (!obj.options || obj.options.length > 1)) {
          	self.osParameters.push(obj)
          }
          
        }
        console.log('osParameters', this.osParameters)
        var evt = new CustomEvent('fmt:changeParametersEvent', {detail: {parameters: this.osParameters}})
        document.dispatchEvent(evt)
        this.hasChild = true
        this.$set(this.tabs, 'search', true)
        this.currentTab = 'search'
        this.getRecords()
        // this.requestApi(searchParameters)
      },
      handleSearch(e) {
        if (this.api && e.detail.parentUuid === this.uuid) {
          e.detail.api = this.api
        }
        console.log('search dans metadata ', e.detail)
      }
	    
  }
}
</script>
<style>
.mtdt-metadata{
  position:relative;
  padding: 0px 5px 300px 5px;
  max-width: 100%;
  margin: auto;
  padding-bottom: 600px;
  height: auto;
  overflow: hidden;
 
}
.mtdt-metadata span.mtdt-metadata-close{
  position: absolute;
  top:3px;
  right:5px;
  cursor: pointer;
  opacity:0.5;
}
.mtdt-metadata span.mtdt-metadata-close:hover{
  opacity:1;
}
.mtdt-metadata h1.mtdt-metadata-header div{
  float:left;
  max-width:calc(100% - 150px);
  display:inline-block;
}
.mtdt-metadata h1.mtdt-metadata-header i.fa{
  float:left;
}
.mtdt-metadata i.fa {
  margin-right: 12px;
}
.mtdt-metadata h1,
.mtdt-metadata h2,
.mtdt-metadata h3,
.mtdt-metadata h4{
    max-width: 100%;
    color:#754a15;
}
.mtdt-metadata h2 {

  font-size: 1.2rem;
  margin-bottom:0;
}
.mtdt-metadata h1{
  font-size:1.5rem;
}
.mtdt-metadata div.mtdt-tab,
.mtdt-metadata .mtdt-tab-export{
  display:inline-block;
  padding: 5px 10px;
  border:1px dotted grey;
  border-top:0px;
  background: #eee;
  cursor: pointer;
}
.mtdt-metadata div.mtdt-tab:hover,
.mtdt-metadata .mtdt-tab-export:hover{
   background: #ccc;
}
.mtdt-metadata div.mtdt-tab.selected{
  background: #ddd;
}
.mtdt-metadata div.mtdt-description{
  line-height:1.5;
}
.mtdt-metadata .mtdt-group-logo{
    float:right;
    margin-top:-5px;
    margin-right: 15px;
}
.mtdt-metadata .mtdt-group-logo img{
	max-width:100px; 
	height:40px;
}
.mtdt-metadata .mtdt-contacts h3{
    margin-bottom:0;
}
.mtdt-metadata .mtdt-temporalExtent div{
  margin: 5px 30px;
}
.mtdt-metadata .mtdt-temporalExtent i.fa.fa-long-arrow-right {
  margin-left:12px;
}
</style>