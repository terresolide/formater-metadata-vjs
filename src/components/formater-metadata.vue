<i18n>{
   "en":{
     "main": "Description",
     "complement": "Others informations",
     "temporal_extent": "Temporal extent",
     "search": "Search",
     "full": "ISO19139 view",
     "platform": "Platform"
   },
   "fr":{
     "main": "Description",
     "complement": "Informations complémentaires",
     "temporal_extent": "Etendue temporelle",
     "search": "Rechercher",
     "full": "Vue ISO19139",
     "platform": "Plateforme"
      
   }
}
</i18n>
<template>
 <div class="mtdt-metadata mtdt-capsule" :class="{'fmt-free': depth === -1}">
    <formater-requester  v-if="depth >= 0 && !protocol" :depth="depth"  ></formater-requester>
      
      <formater-opensearch v-if="depth >= 0 && describe && protocol.toLowerCase()==='opensearch' " :access="access"
      :service="service" :cds="metadata.cds" :describe="describe" :uuid="uuid" :depth="depth"
       @parametersChange="setParameters" @failed="removeDescribe"></formater-opensearch>
      <formater-sensorthings v-if="depth > 0 && protocol.toLowerCase()==='sensorthings'" 
      :access="access" :service="service" :cds="metadata.cds" :api="describe" :uuid="uuid" :depth="depth"></formater-sensorthings>
   <span v-if="metadata && !metadata.appRoot && !isRoot" class="mtdt-metadata-close fa fa-close" @click="close"></span>
   <div v-if="metadata">
      <h1 class="mtdt-metadata-header" :style="{color:$store.state.style.primary}">
           <a v-if="dataCenter" :href="dataCenter.href" :title="dataCenter.title[$store.state.lang]" target="_blank" class="mtdt-group-logo">
             <img :src="dataCenter.logo"/>
          </a>
          <i  class="fa" :class="{'fa-files-o':metadata.type === 'series', 'fa-file': metadata.type === 'dataset', 'fa-map-marker': metadata.type === 'feature'}"  v-if="['dataset','series', 'feature'].indexOf(metadata.type) >= 0"></i>
          <div>
          <span v-if="metadata.initiativeType">{{$t(metadata.initiativeType)}}: </span>
          {{metadata.title ? metadata.title: metadata.defaultTitle}}
          </div>
        
      </h1> 
      <hr style="border:1px solid grey;margin-bottom:0px;clear:both;"/>
      <div class="mtdt-tabs">
         <div v-for="(tab,index) in tabs" v-if="tab === true" class="mtdt-tab" :class="{'selected': currentTab === index}" @click="currentTab = index">{{$t(index)}}</div>
      <!--   <formater-service v-if="osApi" :api="osApi"></formater-service>-->  
     
        <formater-export-links v-if="metadata.exportLinks" :export-links="metadata.exportLinks"></formater-export-links> 
      </div>
      <!--  tab search if have child -->
        <div  v-if="depth >= 0 " v-show="currentTab === 'search' && hasChild">
           
           <formater-paging  :uuid="uuid"  :depth="depth" order-by="changeDate" :type="describe ? 'opensearch': 'geonetwork'"></formater-paging>
           <formater-list-metadata :depth="depth"  :access="access" :cds="metadata.cds" @hasChild="setHasChild"></formater-list-metadata>
      </div>
      <!--  others tab -->
      <div v-if="currentTab === 'main'" style="margin-top:20px;">
        <div class="mtdt-column-content" >
          <!--  <div class="mtdt-description" style="display:block;">
            <formater-quicklooks :quicklooks="meta.images" :legend="meta.legend"></formater-quicklooks>
            <dl class="mtdt-content" v-if="meta.identifier"><dt :style="{color: $store.state.style.primary}">Identifiant</dt><dd>{{meta.identifier}}</dd></dl>
             <span v-html="meta.description"></span>
            <formater-parameters type="metadata" :metadata="meta"></formater-parameters>
          </div> -->
          <formater-metadata-content :metadata="metadata" :depth="depth" :type="type"></formater-metadata-content>


        </div>
       <!--  <div class="mtdt-column-right" v-if="hasRelated">
        <formater-related type="metadata" :download="metadata.download" :id="metadata.id"
         :layers="metadata.layers"  :links="metadata.links" :related="metadata.related" :order="metadata.order" :siblings="metadata.siblings"></formater-related>
      </div>-->
      </div>
      

   <!--    <div v-show="currentTab === 'full'" style="margin:20px;">
             <formater-full-metadata :uuid="uuid" :metadata="full"></formater-full-metadata>
      </div> --> 
      
   
   </div>
 </div>
</template> 
<script>
// import FormaterQuicklooks from './formater-quicklooks.vue'
import FormaterExportLinks from './formater-export-links.vue'
const FormaterPaging = () => import('./formater-paging.vue')
const FormaterListMetadata = () => import('./formater-list-metadata.vue')
const FormaterRequester = () => import('./formater-requester.vue')
const FormaterOpensearch = () => import('./formater-opensearch.vue')
const FormaterSensorthings = () => import('./formater-sensorthings.vue')
// const FormaterService = () => import('./formater-service.vue')
// const FormaterFullMetadata = () => import('./formater-full-metadata.vue')
// import FormaterRelated from './formater-related.vue';
import FormaterMetadataContent from './formater-metadata-content.vue'
// const FormaterParameters = () => import('./formater-parameters.vue')
import moment from 'moment'
export default {
  name: 'FormaterMetadata',
  components: {
   // FormaterQuicklooks,
    FormaterExportLinks,
    FormaterPaging,
    FormaterListMetadata,
    FormaterOpensearch,
  //  FormaterService,
  //  FormaterRelated,
  //  FormaterFullMetadata ,
    FormaterMetadataContent,
    FormaterRequester,
    FormaterSensorthings
   // FormaterParameters
  },
  props: {
    metadata: {
      type: Object,
      default: null
    },
    full: {
      type: Object,
      default: null
    },
    depth: {
      type: Number,
      default:0
    }
  },
  computed: {
    dataCenter () {
      if (!this.metadata.dataCenter) {
        return false
      }
      return this.$store.getters['dataCenters/byId'](this.metadata.dataCenter)
    },
    isRoot () {
      return this.$store.state.metadata === this.metadata.id
    }
  },
  watch: {
    metadata: {
      immediate: true,
      handler (newvalue) {
        this.setHasChild(false)
        this.computeHasChild(newvalue)
      }
    }
    
  },
  
  data() {
    return {
     tabs: {
       search: false,
       main: true
     },
     uuid: null,
     currentTab: 'main',
     // meta: null,
     hasChild: false,
     access: {search: 'free', view: 'free', download: 'free'},
     metaLang2: {},
     popstateListener: null,
     keydownListener: null,
     describe: null,
     protocol: null,
     serviceId: -1,
     service: null,
     type: 'geonetwork',
     aerisSearchListener: null,
     aerisResetListener: null
    }
  },
  created () {
    moment.locale(this.$i18n.locale)
    if (this.metadata['geonet:info']) {
       this.uuid = this.metadata['geonet:info'].uuid
       // full view for geonetwork metadata
//        if (this.full) {
//          this.tabs.full = true
//        }
    } else {
       this.uuid = this.metadata.id
       this.type = 'opensearch'
    }
    this.popstateListener = this.close.bind(this)
    document.addEventListener('popstate', this.popstateListener)
  },
  mounted () {
   if (this.metadata) {
     // this.meta = this.metadata
     this.computeHasChild(this.metadata)
     this.fillMetadata()
   }
  },
  destroyed () {
    
    document.removeEventListener('popstate', this.popstateListener)
    this.popstateListener = null
//     document.removeEventListener('keydown', this.keydownListener)
//     this.keydownListener = null
  },
  methods: {
//       checkEscape (e) {
//         var event = e || window.event
//         var isEscape = false;
//         if (event.key) {
//           isEscape = (event.key === 'Escape' || event.key === 'Esc');
//         } else {
//           isEscape = (event.keyCode === 27);
//         }
//         if (isEscape) {
//           this.close(event);
//         }
//       },
      removeDescribe (e) {
        this.describe = null
        this.setHasChild(false)
      },
      close (event) {
        event.preventDefault();
//         if (this.serviceId >= 0) {
//           this.$store.commit('services/resetCurrent')
//         }
        this.$emit('close');
      },
      computeHasChild (val) {
        if (val.api) {
           console.log(val.api)
           if (!this.hasChild) {
           // case child from a custom api opensearch
              this.describe = val.api.http
              this.protocol = val.api.protocol
              this.access = val.api.access
           }
         }
      },
      setParameters(osParameters) {
    	  //         this.metadata.osParameters = osParameters.parameters
//         this.metadata.mapping = osParameters.mapping
        this.osParameters = osParameters.parameters
        this.mapping = osParameters.mapping
        this.fixed = osParameters.fixed
        if (osParameters.api) {
          var url = new URL(osParameters.api)
    	    this.$store.commit('services/add', {domain: url.hostname, api: osParameters.api, access: this.access, uuid: this.uuid})
    	    this.serviceId = this.$store.getters['services/current']
          this.service = this.$store.getters['services/byId'](this.serviceId)
        }
        this.disableType =  this.describe ? 'opensearch' : 'geonetwork'
        this.$emit('parametersChange', {osParameters: this.osParameters, mapping: this.mapping, fixed: this.fixed, type: this.disableType, depth: this.depth})

        this.setHasChild(true)
      },
      setHasChild(value) {
        if (this.depth === -1) {
          return
        }
        this.hasChild = value

        
        this.$set(this.tabs, 'search', value)
        if (value) {
          this.currentTab = 'search'
//           var type = this.describe ? 'opensearch' : 'geonetwork'
//           this.metadata.disableType = type
         // this.$store.commit('parametersChange', {parameters:this.osParameters, mapping: this.mapping, type: this.disableType})
            
          // this.getRecords()
        } else {
          this.currentTab = 'main'
          this.disableType = 'noChild'
        	 // this.$emit('parametersChange', {osParameters: [], mapping: [], type: 'noChild', depth: this.depth})

        //  this.$store.commit('parametersChange', {parameters: [], mapping:[], type: 'noChild'})
        }
      },
      fillMetadata () {
         //get meta from other language if meta._locale != meta.docLocale
         if (this.metadata['geonet:info']) {
           this.uuid = this.metadata['geonet:info'].uuid;
         } else {
           this.uuid = this.metadata.id
         }
         return
        /* if (this.metadata._locale ===  this.metadata.docLocale) {
           
           return
         }
         
         var url = this.$store.state.geonetwork + 'srv/'+this.metadata.docLocale+'/q?_content_type=json&fast=index&uuid=' + this.uuid;
         var _this = this
         this.$http.get(url).then(
               response => {
                // _this.extract(response.body.metadata)
                 _this.metaLang2 = response.body.metadata
               } 
            )
            if (this.metadata.related && this.metadata.related.children) {
              this.hasChild = true
              this.getRecords()
            } */
      }
  }
}
</script>
<style>
.mtdt-metadata{
  position:relative;
  padding: 0px 5px 50px 5px;
  max-width: 100%;
  margin: auto;
  height: auto;
  background: #fff;
  overflow: hidden;
 
}
.mtdt-metadata h1 {
  margin: 15px 0;
}
.mtdt-metadata.fmt-free{
  background: #f6f6f6;
  border-color:black;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.5)
}
.mtdt-metadata div.mtdt-column-content{
  width:calc(100% - 15px);
  padding-left: 10px;
  padding-right: 5px;
  text-align:justify;
}

.mtdt-metadata .mtdt-column-right{
  width: 200px;
  background: #eee;
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
  margin-bottom:10px;
  line-height:1em;
  word-break:break-word;
}
.mtdt-metadata.fmt-free h1.mtdt-metadata-header div {
  max-width: calc(100% - 50px);
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
  border:none;
}
.mtdt-metadata h2 {

  font-size: 1.1em;
  margin: 20px 0 0 0;
}
.mtdt-metadata h1{
  font-size:1.5em;
}
.mtdt-metadata h3,
.mtdt-metadata h4{
  font-size: 1em;
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