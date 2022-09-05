/**
 * Main component
 */
<i18n>{
   "en":{
     "searching": "Searching"
   },
   "fr":{
     "searching": "Recherche en cours"
   }
}
</i18n>
<template>
 <div class="mtdt-catalogue">
 <div>{{metaDisplayed}}</div>
  <!-- components not visible  -->


  <!-- component to draw bbox -->
  <formater-draw-bbox ></formater-draw-bbox>

  <div >
   <!-- components can be view -->
 
   <div class="mtdt-column-left" >
       <formater-form  :disableLevel="1" :depth="1"></formater-form>
   </div>
   <div class="mtdt-column-right" >
        <!-- div where append map when enlarge it -->
        <div id="fmtLargeMap"></div>
        <!-- icon search -->
        <div class="fmt-waiting" v-if="$store.state.searching"><div>{{$t('searching')}}<br /><span class="fa fa-spinner animated"></span></div></div>
        
        <!--error msg -->
        <div class="fmt-error" v-if="$store.state.error"><div><span class="fa fa-close fmt-close" @click="closeError"></span>{{$store.state.error}}</div></div>
        
        <!-- independant metadata -->
        <div class="mtdt-free-capsule" v-if="$store.state.selectedMetadata" >
          <div >
            <formater-metadata :metadata="$store.state.selectedMetadata"  :depth="-1" @close="closeSingle"></formater-metadata>
          </div>
        </div>
       <formater-metadata v-if="metadata" :metadata="metadata" :full="fullMetadata" @parametersChange="setParameters" @close="close" :depth="1"></formater-metadata>
     
        <!-- view of one record -->
       <!--   <div>
        <formater-metadata v-for="(meta, index) in metadatas" :key="index" v-show="index === metadatas.length-1"
         :depth="index + 1" :metadata="meta" @parametersChange="setParameters"
         @close="close" ></formater-metadata>
        </div> -->

     </div>
    </div>
  </div>
</template>
<script>
import FormaterForm from './components/formater-form.vue';
import FormaterListMetadata from './components/formater-list-metadata.vue';
const FormaterMetadata = () => import('./components/formater-metadata.vue')
import FormaterPaging from './components/formater-paging.vue';
import FormaterDrawBbox from './components/formater-draw-bbox.vue';
// import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue'

const JSONPATH = require('jsonpath')
// prevent previous and next page for browser
// function disableBack() { window.history.forward() }
// window.onload = function () {
//   disableBack();
// }
//   window.onpageshow = function(evt) { if (evt.persisted) disableBack() }
//   window.onbeforeunload = function() { return "Your work will be lost."; };
export default {
  name: 'FormaterSingle',
  components: {
    FormaterDrawBbox,
    FormaterForm,
    FormaterListMetadata,
    FormaterMetadata,
    FormaterPaging,
   // FormaterRequester,
   // AerisTheme
  },
  data() {
    return {
      metadata: null,
      fullMetadata: null,
      uuid: null,
      first: true,
      sortBy: '',
      metaDisplayed: null,
      previousRoute: null,
      // bbox: null,
      // depth: null,
      // array breadcrumb of records
      metadataListener: null,
      drawing: false,
      aerisSearchListener: null,
      aerisResetListener: null,
      backListener: null,
      // default temporalExtent
      temporalExtent: {min: '1900-01-01', max: 'now'},
      previousRoutes: []
    }
  },
  watch: {
    $route (newroute, old) {
//       if (old.params.uuid !== newroute.params.uuid) {
//         this.previousRoutes.push(old)
//       }
      this.uuid = newroute.params.uuid
      var previous = this.$store.getters['previousRoute']
//       if (previous.params.uuid === this.uuid) {
//         this.$store.commit('backChild')
//         return
//       }
      if (old.path !== newroute.path) {
        this.getFullMetadata()
      }
     // this.getMetadata()
    }
  },
  created () {
    
    this.uuid = this.$route.params.uuid
    this.getFullMetadata()
   // this.getMetadata()
    // this.$router.push({name: 'FormaterCatalogue'})
    if (this.$route.query.sortBy) {
      this.sortBy = this.$route.query.sortBy
    } else {
      this.sortBy = this.$store.state.orderBy
    }
    
    this.initTemporalExtent()
    // this.$gn.init(this.$i18n.locale, this.$store.state.geonetwork, this.$http, this.$store)
//     this.metadataListener = this.receiveMetadata.bind(this)
//     document.addEventListener('fmt:metadataEvent', this.metadataListener);
//     this.aerisSearchListener = this.handleSearch.bind(this)
//     document.addEventListener('aerisSearchEvent', this.aerisSearchListener)
//     this.aerisResetListener = this.handleReset.bind(this)
//     document.addEventListener('aerisResetEvent', this.aerisResetListener)
    this.keydownListener = this.checkEscape.bind(this)
    document.addEventListener('keydown', this.keydownListener)

    // this.resize()

//       var headers =  {
//           'Accept': 'application/xml'
//       }
    
//     this.$http.get('https://gravi165.step.univ-paris-diderot.fr/geonetwork/srv/api/0.1/records/86a28260-dc26-4b40-8433-9d06e9b9e628', {headers: headers})
//     .then(resp => console.log(this.displayMeta(resp)))
//     this.backListener = this.back.bind(this)
//     window.addEventListener('beforeunload', this.backListener);
  },
  mounted () {
//     var evt = new CustomEvent('fmt:pageChangedEvent')
//     document.dispatchEvent(evt)
   // if (!this.$store.state.metadata) {
      // this.$router.push({name: 'FormaterCatalogue', query: {}})
   // }
  },
  destroyed () {
//     document.removeEventListener('fmt:metadataEvent', this.metadataListener);
//     this.metadataListener = null;
    document.removeEventListener('aerisSearchEvent', this.aerisSearchListener)
    this.aerisSearchListener = null
    document.removeEventListener('aerisResetEvent', this.aerisResetListener)
    this.aerisResetListener = null

//     window.removeEventListener('beforeunload', this.backListener);
//     this.backListener = null
  },
  methods: {
//     displayMeta(obj) {
//       console.log(obj.body) 
//     },
    getFileMetadata () {
      this.$http.get(this.$store.state.metadata)
      .then(response => { this.treatmentSingle(response.body)})
    },
    getFullMetadata () {
      this.metadata = null
      // curl -X GET "http://localhost:8280/geonetwork/srv/api/0.1/records/86a28260-dc26-4b40-8433-9d06e9b9e628/formatters/json?withInfo=true&attachment=false" -H  "accept: application/json;charset=utf-8" -H  "Accept: application/json" -H  "X-XSRF-TOKEN: null"
      var headers =  {
          'accept': 'application/json;charset=utf-8',
      }
      var url = this.$store.state.geonetwork +  'srv/api/0.1/records/' + this.uuid + '/formatters/json?withInfo=true&attachment=false'
      this.$http.get(url, {headers: headers}).then(
          response => { this.treatmentFull(response.body)},
          response => { console.log(response.body)})
    },
    getMetadata () {
     if (this.$store.state.metadata) {
       this.getFileMetadata()
       return
     }
      var headers =  {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': this.$store.state.lang === 'fr' ? 'fre': 'eng'
      }
//      _content_type: 'json',
//       fast: 'index', // more quick
//    //  'facet.q': '',
//      bucket: 's101',
// get json https://demo.formater/geonetwork/srv/eng/md.format.json?uuid=86a28260-dc26-4b40-8433-9d06e9b9e628&xsl=jsonld&schema=iso19139
      var url = this.$store.state.geonetwork +  'srv/' + (this.$i18n.locale === 'fr'? 'fre' : 'eng') + '/'
      url +=  'q?fast=index&bucket=s101&resultType=step1&_content_type=json&uuid=' + this.uuid
      this.$http.get(url, {headers: headers}).then(
        response => { this.treatmentMeta(response.body)},
        response => { console.log(response.body)})
    },
    treatmentSingle(data) {
      var uuid = data['geonet:info'].uuid
      this.metadata = this.$gn.treatmentMetadata(data, uuid)
     
      this.metadata.appRoot = true
      this.metadata.selected = this.$store.state.metadata === uuid
      var feature = this.$gn.extractBbox(data.geoBox, uuid)
      this.$router.replace({name: this.$route.name, params: {uuid: uuid}, query: this.$route.query})
      var event = new CustomEvent('fmt:metadataEvent', {detail:  {meta: this.metadata, feature:feature}})
      document.dispatchEvent(event)
    },
    treatmentMeta(data) {
      this.metadata = this.$gn.treatmentMetadata(data.metadata ,this.uuid)
      // console.log(JSON.stringify(this.metadata))
      var feature = this.$gn.extractBbox(data.metadata.geoBox, this.uuid)
      var event = new CustomEvent('fmt:metadataEvent', {detail:  {meta: this.metadata, feature:feature}})
      document.dispatchEvent(event)
    },
    treatmentFull(data) {
      var metadata = {
      }
      var langs = {}
      var result = JSONPATH.query(data, '$..["gmd:language"]["gmd:LanguageCode"]')
      metadata['geonet:info'] = data['geonet:info']
      metadata['geonet:info'].uuid = this.uuid
      delete data['geonet:info']
      metadata.id = this.uuid
      // search main language code
      var _locale = data['gmd:language']['gmd:LanguageCode']['@codeListValue']
      metadata.mdLanguage = [_locale]
      // search if translation
      var others = data['gmd:locale']
      var langs = {'fr': 'FR', 'en': 'EN'}
      var _idLang = langs[this.$store.state.lang]
      var _this = this
      if (others && others.length > 0) {
        others.forEach(function (locale) {
          var lg = locale['gmd:PT_Locale']['gmd:languageCode']['gmd:LanguageCode']['@codeListValue'] === 'fre' ? 'fr' : 'en'
          if (lg === _this.$store.state.lang) {
            _idLang = locale['gmd:PT_Locale']['@id']
          }
          langs[lg] = locale['gmd:PT_Locale']['@id']
        })
      }
      metadata.contacts = {metadata: {}, resource: {}}
      for(var key in data) {
        switch(key) {
         case 'gmd:hierarchyLevel':
           metadata.type = data[key]['gmd:MD_ScopeCode']['@codeListValue']
           break
         case 'gmd:contact':
           var contacts = this.$gn.extractContacts(data[key]['gmd:CI_ResponsibleParty'], 'metadata', _idLang)
           contacts.forEach (function (contact) {
             if (metadata.contacts.metadata[contact[0]]) {
                 metadata.contacts.metadata[contact[0]].push(contact)
               } else {
                 metadata.contacts.metadata[contact[0]] = [contact]
               }
           })
           break
         case 'gmd:parentIdentifier':
           metadata.parentIdentifier = data[key]['gco:CharacterString']['#text'] ? data[key]['gco:CharacterString']['#text'] : data[key]['gco:CharacterString'] 
           break
         case 'gmd:identificationInfo':
           this.$gn.extractDataInfo(metadata, data[key]['gmd:MD_DataIdentification'], _idLang )
           break
         case 'gmd:distributionInfo':
           this.$gn.extractDistributionInfo(metadata, data[key], _idLang)
           break
         case 'gmd:dataQualityInfo':
           this.$gn.extractLineage(metadata, data[key], _idLang)
           break
        }
      }
      metadata.exportLinks = {
        xml:  this.$store.state.geonetwork + 'srv/api/records/' + metadata.id + '/formatters/xml?attachment=true',
        pdf:  this.$store.state.geonetwork + 'srv/api/records/' + metadata.id + '/formatters/xsl-view?root=div&output=pdf'
      }
      this.metadata = metadata
      this.fullMetadata = data
//       this.metadata = this.$gn.treatmentFull(data.metadata ,this.uuid)
      var feature = this.$gn.extractBbox(metadata.geobox, this.uuid)
      var temp = {
          min: metadata.tempExtentBegin ? metadata.tempExtentBegin : this.temporalExtent.min,
          max: metadata.tempExtentEnd ? metadata.tempExtentEnd : this.temporalExtent.max
      }
      this.$store.commit('temporalChange', temp)
      var event = new CustomEvent('fmt:metadataEvent', {detail:  {meta: this.metadata, feature:feature}})
      document.dispatchEvent(event)
    },
    initTemporalExtent () {
      if(this.$store.state.temporalExtent && this.$store.state.temporalExtent.min) {
        this.temporalExtent.min = this.$store.state.temporalExtent.min
      }
      if(this.$store.temporalExtent && this.$store.temporalExtent.max) {
        this.temporalExtent.max = this.$store.temporalExtent.max
      }
    },
    closeSingle () {
      var event = new CustomEvent('fmt:closeMetadataEvent', {detail: {depth: -1}})
      document.dispatchEvent(event)  
      this.$store.commit('resetSelectedMetadata')
    //  this.$store.commit('services/resetCurrent')
    },
    receiveMetadata (event) {
      if (this.$store.state.metadata && this.first) {
        this.first = false
        this.metadataUui = event.detail.meta.id
      }
      // this.metadatas.push(event.detail.meta)
      this.currentUuid = event.detail.meta.id
      this.$store.commit('currentUuidChange', this.currentUuid)
      var min = null
      var max = null
      var numBegins = 0
      
      if (typeof event.detail.meta.tempExtentBegin === 'string') {
        min = event.detail.meta.tempExtentBegin.substring(0, 10)
        numBegins = 1
      } else if (typeof event.detail.meta.tempExtentBegin === 'object') {
        var begins = event.detail.meta.tempExtentBegin.map(function (begin) { return begin.substring(0, 10)})
        begins.sort()
        min = begins[0]
        numBegins = begins.length
      } 
      if (typeof event.detail.meta.tempExtentEnd === 'string' && numBegins === 1) {
        max = event.detail.meta.tempExtentEnd.substring(0, 10)
      } else if (typeof event.detail.meta.tempExtentEnd === 'object' && event.detail.meta.tempExtentEnd.length === numBegins) {
        var ended = event.detail.meta.tempExtentEnd.map(function(end) { return end.substring(0, 10)})
        ended.sort()
        max = ended[ended.length - 1]
      }
      var temp = {
          min: min ? min : this.temporalExtent.min,
          max: max ? max : this.temporalExtent.max
      }
      this.$store.commit('temporalChange', temp)
     // this.$router.push({name: 'FormaterCatalogue', query:{uuid:event.detail.meta.id, depth: this.metadatas.length}})
    },
    close () {
      var route = this.$store.getters['previousRoute'] 
      this.$store.commit('backChild')
      this.$store.commit('temporalChange', this.$store.state.defaultTemporal)
      this.$router.push({name: route.name, params: route.params, query: route.query})
        
    },
    back () {
      //e.preventDefault()
//       if (this.$store.state.selectedMetadata) {
//         this.$store.commit('resetSelectedMetadata')
//       } else {
//         this.resetMetadata()
//       }
    },
    checkEscape (e) {
        var event = e || window.event
        var isEscape = false;
        if (event.key) {
          isEscape = (event.key === 'Escape' || event.key === 'Esc');
        } else {
          isEscape = (event.keyCode === 27);
        }
        if (isEscape) {
           this.$router.go(-1)
//          this.back()
//           if (this.$store.state.selectedMetadata) {
//             this.$store.commit('resetSelectedMetadata')
//           } else {
//             this.resetMetadata(e)
//           }
        }
      },

//     handleReset (event) {
//    this.$store.commit('resetSelectedMetadata')
//      if (this.metadatas[0] && this.metadatas[0].appRoot) {

//        event.detail.depth = 1
//        var metadata = this.metadatas[0]
//        this.metadatas = this.metadatas.slice(0, 1)
//        this.currentUuid = this.metadatas[0].id
//        this.metadatas.length = 1
//        this.metadatas[0].osParameters.forEach(function (parameter) {
//            parameter.value = null
//        })
//        var parameters = this.metadatas[0].osParameters
//        var mapping = this.metadatas[0].mapping
//        var type = this.metadatas[0].disableType
//        var min = null
//        var max = null
//        if (metadata.tempExtentBegin) {
//          min = metadata.tempExtentBegin.substring(0, 10)
//        }
//        if (metadata.tempExtentEnd) {
//          max = metadata.tempExtentEnd.substring(0, 10)
//        }
//        var temp = {
//            min: min ? min : this.temporalExtent.min,
//            max: max ? max : this.temporalExtent.max
//        }
//        this.$store.commit('temporalChange', temp)
//        this.$store.commit('currentUuidChange', this.currentUuid)
//        this.$store.commit('parametersChange', {parameters: parameters, mapping: mapping, type: type})

//      } else {
//       event.detail.depth = 0
//       this.metadatas = []
//       this.metadatas.length = 0
//       this.currentUuid = null
//       this.$store.commit('currentUuidChange', this.currentUuid)
//       this.$store.commit('parametersChange', {parameters: [], mapping: [], type: 'geonetwork'})
//      }
//     },
//     handleSearch (event) {
//       // mettre plutôt dans formater-metadata ??
//       if (this.metadatas.length > 0) {
//         event.detail.parentUuid = this.currentUuid
//       }
//     },
    setParameters (obj) {
//       if (obj.depth) {
//         this.metadatas[obj.depth - 1].osParameters = obj.osParameters
//         this.metadatas[obj.depth - 1].mapping = obj.mapping
//         this.metadatas[obj.depth - 1].disableType = obj.disableType
//       }
//       if (obj.depth === this.metadatas.length) {
        this.$store.commit('parametersChange', {parameters: obj.osParameters, mapping: obj.mapping, type: obj.type})
//     }
    },
    closeError () {
      this.$store.commit('removeError')
    }
  }
}
</script>
<style>

</style>