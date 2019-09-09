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
  <formater-draw-bbox ></formater-draw-bbox>

  <div >
   <!-- components can be view -->
   <div class="mtdt-column-left" >
       <formater-form  :disableLevel="metadatas.length > 0 ? 1 : 0"  ></formater-form>
   </div>
   <div class="mtdt-column-right" >
        <!-- div where append map when enlarge it -->
        <div id="fmtLargeMap"></div>
        <!-- list of all records with page navigation -->
        <div v-if="!$store.state.metadata" v-show="metadatas.length === 0">
            <formater-paging   :depth="0" :orders="['title','changeDate']" order-by="title"></formater-paging>
            <formater-list-metadata  :depth="0"></formater-list-metadata>
        </div>
        <!-- view of one record -->
        <div  v-if="metadatas.length > 0" >
            <formater-metadata v-for="(meta, index) in metadatas" :key="index" v-show="index === metadatas.length-1" :depth="index + 1" :metadata="meta" 
             @close="resetMetadata" ></formater-metadata>
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
import FormaterRequester from './formater-requester.vue'

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
      // default temporalExtent
      temporalExtent: {min: '1900-01-01', max: 'now'}
    }
  },
  
  created () {
    this.initTemporalExtent()
    this.$gn.init(this.$i18n.locale, this.$store.state.geonetwork, this.$http)
    this.metadataListener = this.receiveMetadata.bind(this)
    document.addEventListener('fmt:metadataEvent', this.metadataListener);
    this.aerisSearchListener = this.handleSearch.bind(this)
    document.addEventListener('aerisSearchEvent', this.aerisSearchListener)
    this.aerisResetListener = this.handleReset.bind(this)
    document.addEventListener('aerisResetEvent', this.aerisResetListener)
    this.resizeListener = this.resize.bind(this)
    window.addEventListener('resize', this.resizeListener);
    this.resize()
  },
  mounted () {
//     var evt = new CustomEvent('fmt:pageChangedEvent')
//     document.dispatchEvent(evt)
  },
  destroyed () {
    document.removeEventListener('fmt:metadataEvent', this.metadataListener);
    this.metadataListener = null;
    document.removeEventListener('aerisSearchEvent', this.aerisSearchListener)
    this.aerisSearchListener = null
    document.removeEventListener('aerisResetEvent', this.aerisResetListener)
    this.aerisResetListener = null
    window.removeEventListener('resize', this.resizeListener)
    this.resizeListener = null

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
    receiveMetadata (event) {
      this.metadatas.push(event.detail.meta)
      this.currentUuid = event.detail.meta.id
      this.$store.commit('currentUuidChange', this.currentUuid)
      var min = null
      var max = null
      if (typeof event.detail.meta.tempExtentBegin === 'string') {
        min = event.detail.meta.tempExtentBegin.substring(0, 10)
      }
      if (typeof event.detail.meta.tempExtentEnd === 'string') {
        max = event.detail.meta.tempExtentEnd.substring(0, 10)
      }
      var temp = {
          min: min ? min : this.temporalExtent.min,
          max: max ? max : this.temporalExtent.max
      }
      this.$store.commit('temporalChange', temp)
    },
    resetMetadata (event) {
      if (this.metadatas.length === 1 && this.metadatas[0].appRoot) {
        return
      }
      this.metadatas.pop()
      if (this.metadatas.length > 0) {
        var metadata = this.metadatas[this.metadatas.length -1]
        this.currentUuid = metadata.id
        var type = metadata.disableType
        var parameters = metadata.osParameters
        var mapping = metadata.mapping
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
        var mapping = []
        var type = null
        this.$store.commit('temporalChange', this.temporalExtent)
      }
      this.$store.commit('currentUuidChange', this.currentUuid)
      this.$store.commit('parametersChange', {parameters: parameters, mapping: mapping, type: type})
      var event = new CustomEvent('fmt:closeMetadataEvent', {detail:  {depth: this.metadatas.length }})
      document.dispatchEvent(event)
    },
   resize () {
      this.$store.commit('sizeChange')
   },
    handleReset (event) {
     if (this.metadatas[0] && this.metadatas[0].appRoot) {
       this.resetMetadata()
     } else {
      this.metadatas = []
      this.metadatas.length = 0
      this.currentUuid = null
      this.$store.commit('currentUuidChange', this.currentUuid)
      this.$store.commit('parametersChange', {parameters: [], mapping: [], type: 'geonetwork'})
     }
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
  font-family: "Times New Roman", Times, serif;
  color: #000000;
  font-size: 15px;
  line-height: 16px;
  height:auto;
  width:100%;
  }
  
  .mtdt-catalogue h1,
  .mtdt-catalogue h2,
  .mtdt-catalogue h3  {
    border:none;
    font-family: "Times New Roman", Times, serif;
    font-weight:700;
    color: inherit;
  }
  .mtdt-catalogue h4,
  .mtdt-catalogue h5 {
    font-family: inherit;
    color: inherit;
  } 
  .mtdt-catalogue input,
  .mtdt-catalogue select, 
  .mtdt-catalogue textarea{
         font-family: Roboto,Arial,sans-serif;
     font-size: 15px;
  }
  .mtdt-catalogue button,
  .mtdt-catalogue input[type="button"]{

    letter-spacing: .5px;
  }
  .mtdt-catalogue dd{
    margin:0;
  }
 .mtdt-catalogue .formater-search-box .box-title h4 {
    margin: 0;
    font-size: 18px;
    color: inherit;
    font-family: inherit;
    font-weight: 600;
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
.mtdt-catalogue .formater-select select {
  font-family: inherit;
  font-size: 13px;
  padding:0 32px 3.5px 6.5px;
}

</style>