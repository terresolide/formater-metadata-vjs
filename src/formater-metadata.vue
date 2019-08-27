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
      <h1 class="mtdt-metadata-header" :style="{color:$store.state.style.primary}">
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
      <formater-opensearch v-if="describe"  :describe="describe" :uuid="uuid" :depth="depth" @parametersChange="setParameters"></formater-opensearch>
      <div v-if="tabs.search" v-show="currentTab === 'search'">
           
           <formater-paging  :uuid="uuid"  :depth="depth" :type="describe ? 'opensearch': 'geonetwork'"></formater-paging>
           <formater-list-metadata  :depth="depth"  ></formater-list-metadata>
      </div>
      <!--  others tab -->
      <div v-if="currentTab === 'main'" style="margin-top:20px;">
        <div class="mtdt-column-left">
          <div class="mtdt-description">
            <formater-quicklooks :quicklooks="meta.images"></formater-quicklooks>
            <span v-html="meta.description"></span>
          </div>
          <div class="mtdt-temporalExtent" style="clear:both;" v-if="meta.tempExtentBegin">
            <h2 :style="{color:$store.state.style.primary}"><i class="fa fa-clock-o"></i>{{$t('temporal_extent')}}</h2>
             <div>
                {{date2str(meta.tempExtentBegin)}}
                <i class="fa fa-long-arrow-right" ></i>
                {{date2str(meta.tempExtentEnd)}}
            </div>
          </div>
          <div >
              <formater-list-contact   :responsible-party="meta.responsibleParty" :responsible-party2="metaLang2.responsibleParty"></formater-list-contact>
         </div>
        </div>
              <div class="mtdt-column-right">
        <formater-related type="metadata" :download="meta.download" :id="meta.id" :layers="meta.layers" :related="meta.related"></formater-related>
      </div>
      </div>

      <div v-if="currentTab === 'complement'" >
             <formater-list-contact   :responsible-party="meta.responsibleParty" :responsible-party2="metaLang2.responsibleParty"></formater-list-contact>
      </div>
       <div v-if="currentTab === 'quality'" >
             <formater-list-contact   :responsible-party="meta.responsibleParty" :responsible-party2="metaLang2.responsibleParty"></formater-list-contact>
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
const FormaterOpensearch = () => import('./formater-opensearch.vue')
import FormaterRelated from './formater-related.vue';
// import { extendMoment } from 'moment-range';
// window.momentCst = extendMoment(moment);

export default {
  name: 'FormaterMetadata',
  components: {
    FormaterListContact,
    FormaterQuicklooks,
    FormaterExportLinks,
    FormaterPaging,
    FormaterListMetadata,
    FormaterOpensearch,
    FormaterRelated
  },
  props: {
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
    metadata: {
      immediate: true,
      handler (newvalue) {
        this.computeHasChild(newvalue)
      }
    } 
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

     describe: null,
     type: 'geonetwork'
    }
  },
  created () {

    moment.locale(this.$i18n.locale)
    if (this.metadata['geonet:info']) {
       this.uuid = this.metadata['geonet:info'].uuid
    } else {
       this.uuid = this.metadata.id
    }
    this.popstateListener = this.close.bind(this)
    document.addEventListener('popstate', this.popstateListener)
    this.keydownListener = this.checkEscape.bind(this)
    document.addEventListener('keydown', this.keydownListener)
//     var post = {
//         "clientId":"lJ9NjcIZLGYkgRzvRlBDQS_LeVoa",
//         "code":"62d32c7eb43e579b82713f8d04cfe7",
//         "redirectUri": "https://muscatemaj-pp.theia-land.fr/atdistrib/rocket/",
//          "state": "q9m4whb4nvldywjh7oahco"
//     }
// //      this.$http.get('https://muscatemaj-pp.theia-land.fr/atdistrib/resto2/api/collections//describe.xml').then(
// //         response => console.log(response));
// //     this.$http.post('https://muscatemaj-pp.theia-land.fr/atdistrib/resto2/api/auth/theia', JSON.stringify(post), {credentials: true}).then(
// //          response => console.log(response));
//      var xhr = new XMLHttpRequest();
//     xhr.open('POST', 'https://muscatemaj-pp.theia-land.fr/atdistrib/resto2/api/auth/theia', true);
//   //  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//     xhr.withCredentials = true;
//     xhr.send(JSON.stringify(post));
  },
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
        if (val.related && val.related.children) {
          // case child in geonetwork
           if (!this.hasChild) {
             this.setHasChild(true)
           }
         } else if (val.api) {
           if (!this.hasChild) {
           // case child from a custom api opensearch
              this.describe = val.api.http
           }
         } else {
           this.setHasChild(false)
         }
      },
      setParameters(osParameters) {
        this.metadata.osParameters = osParameters.parameters
        this.metadata.mapping = osParameters.mapping
        this.setHasChild(true)
      },
      setHasChild(value) {
        this.hasChild = value
        this.$set(this.tabs, 'search', value)
        if (value) {
          this.currentTab = 'search'
          this.getRecords()
        } else {
          this.$store.commit('parametersChange', {parameters: [], mapping:[]})
        }
      },
      fillMetadata () {
         //get meta from other language if meta._locale != meta.docLocale
         if (this.meta['geonet:info']) {
           this.uuid = this.meta['geonet:info'].uuid;
         } else {
           this.uuid = this.meta.id
         }
         return
         if (this.meta._locale ===  this.meta.docLocale) {
           
           return
         }
         
         var url = this.$store.state.geonetwork + 'srv/'+this.meta.docLocale+'/q?_content_type=json&fast=index&uuid=' + this.uuid;
         var _this = this
         this.$http.get(url).then(
               response => {
                // _this.extract(response.body.metadata)
                 _this.metaLang2 = response.body.metadata
               } 
            )
            if (this.meta.related && this.meta.related.children) {
              this.hasChild = true
              this.getRecords()
            } 
      },
      getRecords () {
          // useless, it's trigger when load formater-page-changed
         // var event = new CustomEvent('fmt:metadataWithChildEvent', {detail: {uuid: this.uuid, depth: this.depth}})
         // document.dispatchEvent(event)
      },
     
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
.mtdt-metadata .mtdt-column-left{
  width:calc(100% - 330px);
  padding-left: 10px;
}
.mtdt-metadata .mtdt-column-right{
  width: 300px;
  background: #eee;
  min-height:500px;
  margin:0 10px 0 0;
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