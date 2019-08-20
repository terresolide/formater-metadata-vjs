/**
 * Main component
 */
<i18n>{
   "en":{
   },
   "fr":{
   }
}
</i18n>
<template>
 <div class="mtdt-catalogue">
  <!-- components not visible  -->
  <aeris-theme :primary="$store.state.style.primary" :active="true" :emphasis="$store.state.style.emphasis"></aeris-theme>
  <formater-requester  :depth="metadatas.length"></formater-requester>
  <!-- component to draw bbox -->
  <formater-draw-bbox color="#fff" :lang="$i18n.locale"  :search-area="bounds"></formater-draw-bbox>

  <div >
   <!-- components can be view -->
   <div class="mtdt-column-left" >
       <formater-form :lang="$i18n.locale" :disableLevel="metadatas.length > 0 ? 1 : 0"   @boundsChange="boundsChange"></formater-form>
   </div>
   <div class="mtdt-column-right" >
        <!-- div where append map when enlarge it -->
        <div id="fmtLargeMap"></div>
        <!-- list of all records with page navigation -->
        <div v-show="metadatas.length === 0">
            <formater-paging :lang="$i18n.locale" :nb-record="nbRecord" :record-by-line="recordByLine" :depth="0" :orders="['title','changeDate']" order-by="title"></formater-paging>
            <formater-list-metadata :lang="$i18n.locale" :depth="0" :capsule-width="capsuleWidth"></formater-list-metadata>
        </div>
        <!-- view of one record -->
        <div  v-if="metadatas.length > 0" >
            <formater-metadata v-for="(meta, index) in metadatas" :key="index" v-show="index === metadatas.length-1" :depth="index" :metadata="meta" :lang="$i18n.locale"
             :capsule-width="capsuleWidth - 10" :record-by-line="recordByLine" @close="resetMetadata" ></formater-metadata>
        </div>
     </div>
    </div>
  </div>
  
 </div>
</template>
<script>
import FormaterForm from './formater-form.vue';
import FormaterListMetadata from './formater-list-metadata.vue';
const FormaterMetadata = () => import('./formater-metadata.vue')
import FormaterPaging from './formater-paging.vue';
import FormaterDrawBbox from './formater-draw-bbox.vue';
import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue'
import FormaterRequester from './formater-requester.vue';

export default {
  name: 'FormaterCatalogue',
  components: {
    FormaterDrawBbox,
    FormaterForm,
    FormaterListMetadata,
    FormaterMetadata,
    FormaterPaging,
    FormaterRequester,
    AerisTheme
  },
  data() {
    return {
      currentUuid: null,
      // bbox: null,
      

      depth: null,
      // array breadcrumb of records
      metadatas: [],
      metadataListener: null,
      drawing: false,
      aerisSearchListener: null,
      aerisResetListener: null,
      resizeListener: null,
      recordByLine: 4,
      nbRecord: 24,
      capsuleWidth: 300, 
      bounds: null,
      temporalExtent: {min: '1900-01-01', max: 'now'}
    }
  },
  
  created () {
    console.log(this.$store.state.style.primary)
    this.initTemporalExtent()
   // this.$i18n.locale = this.lang
    this.$setGnLocale(this.$i18n.locale)
    this.metadataListener = this.receiveMetadata.bind(this)
    document.addEventListener('fmt:metadataEvent', this.metadataListener);
    this.aerisSearchListener = this.handleSearch.bind(this)
    document.addEventListener('aerisSearchEvent', this.aerisSearchListener)
    this.aerisResetListener = this.handleReset.bind(this)
    document.addEventListener('aerisResetEvent', this.aerisResetListener)
    this.resizeListener = this.resize.bind(this)
    window.addEventListener('resize', this.resizeListener);
    this.resize()
    console.log(this.$store)
  },
  mounted () {
    var evt = new CustomEvent('fmt:pageChangedEvent')
    document.dispatchEvent(evt)
  },
  destroyed () {
    document.removeEventListener('fmt:metadataEvent', this.metadataListener);
    this.metadataListener = null;
    document.removeEventListener('aerisSearchEvent', this.aerisSearchListener)
    this.aerisSearchListener = null
    document.removeEventListener('aerisResetEvent', this.aerisResetListener)
    this.aerisResetListener = null
  },
  methods: {
    initTemporalExtent () {
      if(this.$store.state.temporalExtent && this.$store.state.temporalExtent.min) {
        this.temporalExtent.min = this.$store.state.temporalExtent.min
      }
      if(this.$store.temporalExtent && this.$store.temporalExtent.max) {
        this.temporalExtent.max = this.$store.temporalExtent.max
      }
    },
    boundsChange (bounds) {
      console.log('dans catalogue bounds change', bounds)
      this.bounds = bounds
    },
    receiveMetadata (event) {
      this.metadatas.push(event.detail.meta)
      this.currentUuid = event.detail.meta.id

      var min = null
      var max = null
      if (event.detail.meta.tempExtentBegin) {
        min = event.detail.meta.tempExtentBegin.substring(0, 10)
      }
      if (event.detail.meta.tempExtentEnd) {
        max = event.detail.meta.tempExtentEnd.substring(0, 10)
      }
      var temp = {
          min: min ? min : this.temporalExtent.min,
          max: max ? max : this.temporalExtent.max
      }
      this.$store.commit('temporalChange', temp)
    },
    resetMetadata (event) {
      this.metadatas.pop()
      if (this.metadatas.length > 0) {
        var metadata = this.metadatas[this.metadatas.length -1]
        this.currentUuid = metadata['geonet:info'].uuid
        var parameters = metadata.osParameters
        var min = null
        var max = null
        if (metadata.tempExtentBegin) {
          min = metadata.tempExtentBegin.substring(0, 10)
        }
        if (metadata.tempExtentEnd) {
          max = metadata.tempExtentEnd.substring(0, 10)
        }
        var temp = {
            min: min ? min : this.temporalExtent.min,
            max: max ? max : this.temporalExtent.max
        }
        this.$store.commit('temporalChange', temp)
      } else {
        this.currentUuid = null
        var parameters = []
        this.$store.commit('temporalChange', this.temporalExtent)
      }
      var event = new CustomEvent('fmt:closeMetadataEvent', {detail:  {depth: this.metadatas.length, parameters: parameters }})
      document.dispatchEvent(event)
    },
   resize () {
      var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      width -= 350
      var count = parseInt(width/334)
      this.capsuleWidth = parseInt(width / count - 16)
      this.recordByLine = count
      this.nbRecord = count * 4
   },
    handleReset (event) {
      this.metadatas = []
      this.metadatas.length = 0
      this.currentUuid = null
    },
    handleSearch (event) {
      if (this.metadatas.length > 0) {
        event.detail.parentUuid = this.currentUuid
      }
    }
  }
}
</script>
<style src="formater-commons-components-vjs/src/assets/css/formater-icon.css"></style>
<style>
.mtdt-catalogue{
  font-size: 12px;
  height:auto;
  width:100%;
  }
 .mtdt-catalogue .fa{
  font-size: inherit;
 }

.mtdt-capsule{
  border: 1px solid #ccc;
  border-radius: 0 0 5px 5px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
.mtdt-catalogue .mtdt-column-left{
  width:300px;
  float:left;
}
.mtdt-catalogue .mtdt-column-right{
  width:calc(100% - 340px);
  float:left;
  margin-left:10px;
  margin-bottom:120px;
}
</style>