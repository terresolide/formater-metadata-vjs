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
            <formater-metadata :metadata="$store.state.selectedMetadata" :depth="-1" @close="closeSingle"></formater-metadata>
          </div>
        </div>
       <formater-metadata v-if="metadata" :metadata="metadata" @parametersChange="setParameters" @close="close" :depth="1"></formater-metadata>
     
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
import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue'


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
    AerisTheme
  },
  data() {
    return {
      metadata: null,
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
      if (previous.params.uuid === this.uuid) {
        this.$store.commit('backChild')
      }
      this.getMetadata()
    }
  },
  created () {
    
    this.uuid = this.$route.params.uuid
    this.getMetadata()
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
    getMetadata () {
      var headers =  {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': this.$store.state.lang === 'fr' ? 'fre': 'eng'
      }
//      _content_type: 'json',
//       fast: 'index', // more quick
//    //  'facet.q': '',
//      bucket: 's101',
      var url = this.$store.state.geonetwork +  'srv/' + (this.$i18n.locale === 'fr'? 'fre' : 'eng') + '/'
      url +=  'q?fast=index&bucket=s101&resultType=step1&_content_type=json&uuid=' + this.uuid
      this.$http.get(url, {headers: headers}).then(
        response => { this.treatmentMeta(response.body)},
        response => { console.log(response.body)})
    },
    treatmentMeta(data) {
      this.metadata = this.$gn.treatmentMetadata(data.metadata ,this.uuid)
      var feature = this.$gn.extractBbox(data.metadata.geoBox, this.uuid)
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
      var event = new CustomEvent('fmt:closeMetadataEvent', {detail: {depth: 2}})
      document.dispatchEvent(event)
      this.$store.commit('resetSelectedMetadata')
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
        this.$router.push({name: route.name, params: route.params, query: route.query})
        this.$store.commit('services/resetCurrent')
        this.$store.commit('backChild')
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