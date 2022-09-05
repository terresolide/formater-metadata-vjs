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
 <formater-requester  :depth="0" ></formater-requester>
  <!-- component to draw bbox -->
  <formater-draw-bbox ></formater-draw-bbox>

  <div >
   <!-- components can be view -->
 
   <div class="mtdt-column-left" >
       <formater-form  :disableLevel="0" :depth="0"></formater-form>
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
            <formater-metadata :metadata="$store.state.selectedMetadata" :depth="-1" @close="closeSingle()"></formater-metadata>
          </div>
        </div>
        <!-- list of all records with page navigation -->
        <div  v-show="metadatas.length === 0">
            <formater-paging   :depth="0" :orders="['changeDate', 'popularity', 'title']" :order-by="sortBy"></formater-paging>
            <formater-list-metadata :depth="0"></formater-list-metadata>
        </div>
        
        <!-- view of one record -->
        <div>
        <formater-metadata v-for="(meta, index) in metadatas" :key="index" v-show="index === metadatas.length-1"
         :depth="index + 1" :metadata="meta" @parametersChange="setParameters"
         @close="close" ></formater-metadata>
        </div>

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
import FormaterRequester from './components/formater-requester.vue'

// prevent previous and next page for browser
// function disableBack() { window.history.forward() }
// window.onload = function () {
//   disableBack();
// }
//   window.onpageshow = function(evt) { if (evt.persisted) disableBack() }
//   window.onbeforeunload = function() { return "Your work will be lost."; };
export default {
  name: 'FormaterCatalogue',
  components: {
    FormaterDrawBbox,
    FormaterForm,
    FormaterListMetadata,
    FormaterMetadata,
    FormaterPaging,
    FormaterRequester
  },
 
  data() {
    return {
      currentUuid: null,
      first: true,
      sortBy: '',
      metaDisplayed: null,
      // bbox: null,
      // depth: null,
      // array breadcrumb of records
      metadatas: [],
      metadataListener: null,
      drawing: false,
      aerisSearchListener: null,
      aerisResetListener: null,
      backListener: null,
      // default temporalExtent
      temporalExtent: {min: '1900-01-01', max: 'now'}
    }
  },
  watch: {
    $route (newroute, old) {
      if (newroute.query.sortBy) {
        this.sortBy = newroute.query.sortBy
      } else {
        this.sortBy = this.$store.state.orderBy
      }
//       console.log(newroute)
//       var oldDepth = old.query.depth ? old.query.depth : 0
//       var newDepth = newroute.query.depth ? newroute.query.depth : 0
//       if (newDepth < oldDepth) {
//         this.back()
//       } else if (newDepth > oldDepth && !this.currentUuid ){
//        //  this.$router.replace({name: 'FormaterCatalogue', query:{}})
//       }
    }
  },
  created () {
    if (this.$store.state.metadata && this.$route.name !== 'FormaterLogin') {
      console.log('has metadata')
      this.$router.replace({name: 'Metadata', params: {uuid: this.$store.state.metadata}})
      return
    }
    // this.$router.push({name: 'FormaterCatalogue'})
    if (this.$route.query.sortBy) {
      this.sortBy = this.$route.query.sortBy
    } else {
      this.sortBy = this.$store.state.orderBy
    }
    
    this.initTemporalExtent()
   //  this.$gn.init(this.$i18n.locale, this.$store.state.geonetwork, this.$http, this.$store)
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
    if (!this.$store.state.metadata) {
      // this.$router.push({name: 'FormaterCatalogue', query: {}})
    }
    this.$store.commit('services/resetCurrent')
    this.$store.commit('parametersChange', {parameters: [], mapping: [], type: null})
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
//     receiveMetadata (event) {
//       if (this.$store.state.metadata && this.first) {
//         this.first = false
//         this.metadataUui = event.detail.meta.id
//       }
//       this.metadatas.push(event.detail.meta)
//       this.currentUuid = event.detail.meta.id
//       this.$store.commit('currentUuidChange', this.currentUuid)
//       var min = null
//       var max = null
//       var numBegins = 0
      
//       if (typeof event.detail.meta.tempExtentBegin === 'string') {
//         min = event.detail.meta.tempExtentBegin.substring(0, 10)
//         numBegins = 1
//       } else if (typeof event.detail.meta.tempExtentBegin === 'object') {
//         var begins = event.detail.meta.tempExtentBegin.map(function (begin) { return begin.substring(0, 10)})
//         begins.sort()
//         min = begins[0]
//         numBegins = begins.length
//       } 
//       if (typeof event.detail.meta.tempExtentEnd === 'string' && numBegins === 1) {
//         max = event.detail.meta.tempExtentEnd.substring(0, 10)
//       } else if (typeof event.detail.meta.tempExtentEnd === 'object' && event.detail.meta.tempExtentEnd.length === numBegins) {
//         var ended = event.detail.meta.tempExtentEnd.map(function(end) { return end.substring(0, 10)})
//         ended.sort()
//         max = ended[ended.length - 1]
//       }
//       var temp = {
//           min: min ? min : this.temporalExtent.min,
//           max: max ? max : this.temporalExtent.max
//       }
//       this.$store.commit('temporalChange', temp)
//       this.$router.push({name: 'FormaterCatalogue', query:{uuid:event.detail.meta.id, depth: this.metadatas.length}})
//     },
    close () {
      this.$router.go(-1)
    },
    back () {
      //e.preventDefault()
      if (this.$store.state.selectedMetadata) {
        this.$store.commit('resetSelectedMetadata')
      } else {
        this.resetMetadata()
      }
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
    resetMetadata () {
      if (this.metadatas.length === 1 && this.metadatas[0].appRoot) {
        return
      }
      if (this.metadatas.length > 0) {
        this.metadatas.pop()
      }
      if (this.metadatas.length > 0) {

        var metadata = this.metadatas[this.metadatas.length -1]
        this.currentUuid = metadata.id
        var type = metadata.disableType
        var parameters = metadata.osParameters
        var mapping = metadata.mapping
        var min = null
        var max = null
        if (metadata.tempExtentBegin && metadata.tempExtentBegin.substring) {
          min = metadata.tempExtentBegin.substring(0, 10)
        }
        if (metadata.tempExtentEnd && metadata.tempExtentEnd.substring) {
          max = metadata.tempExtentEnd.substring(0, 10)
        }
        var temp = {
            min: min ? min : this.temporalExtent.min,
            max: max ? max : this.temporalExtent.madivx
        }
        this.$store.commit('temporalChange', temp)
      } else {
        this.currentUuid = null
        var parameters = []
        var mapping = []
        var type = null
        this.$store.commit('services/resetCurrent')
        this.$store.commit('temporalChange', this.temporalExtent)
      }
      this.$store.commit('currentUuidChange', this.currentUuid)
      this.$store.commit('parametersChange', {parameters: parameters, mapping: mapping, type: type})
      var event = new CustomEvent('fmt:closeMetadataEvent', {detail:  {depth: this.metadatas.length }})
      document.dispatchEvent(event)
    },
    setParameters (obj) {

      if (obj.depth) {
        this.metadatas[obj.depth - 1].osParameters = obj.osParameters
        this.metadatas[obj.depth - 1].mapping = obj.mapping
        this.metadatas[obj.depth - 1].disableType = obj.disableType
      }
      if (obj.depth === this.metadatas.length) {
        this.$store.commit('parametersChange', {parameters: obj.osParameters, mapping: obj.mapping, type: obj.type})
      }
    },
    registerValues (detail) {
      if (detail.depth) {
        this.metadatas[detail.depth - 1].osParameters.forEach( function (parameter) {
          if (detail.parameters[parameter.name]) {
            parameter.value = detail.parameters[parameter.name]
          } else {
            parameter.value = null
          }
        })
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
    closeError () {
      this.$store.commit('removeError')
    }
  }
}
</script>
<style>


</style>