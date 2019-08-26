<i18n>{
   "en":{
     "results": "Results: {from} to {to} among {notExactly}{count}",
     "title": "Title",
     "relevance": "Relevance",
     "changeDate": "Change date",
     "sortBy": "Order by",
     "per_page": "per page"
   },
   "fr":{
     "results":  "Résultats: <strong>{from}</strong> à <strong>{to}</strong> sur {notExactly}{count}",
     "title": "Titre",
     "relevance": "Pertinence",
     "changeDate": "Mise à jour",
     "sortBy": "Trier par",
     "per_page": "par page"
   }
}
</i18n>
<template>
 <span class="mtdt-paging">
  <div style="width:100%;border-bottom: 1px solid #ddd;height:30px;line-height:30px;text-align:center;">
  <span :class="{disabled: (currentPage===1 ? 'disabled': ''), 'mtdt-navigation':true}">
  	<span class="fa fa-angle-double-left" @click="goToFirst()"></span>
  	<span class="fa fa-angle-left" @click="changePage(-1)" ></span>
  </span>
  <span style="margin: 0 10px;" v-html="$tc('results', count, {from: (count === 0) ? 0 : from, to: to, notExactly: notExactly, count: count})"></span>
   (<formater-select name="recordPerPage" :options="recordsPerPage" :defaut="recordPerPage + ''" type="associative" @input="nbRecordChange" color="#ffffff"></formater-select>)
   <span :class="{disabled: (!notExactly && (currentPage===nbPage || count=== 0) ? 'disabled': ''), 'mtdt-navigation':true}">
	   <span class="fa fa-angle-right " @click="changePage(1)" ></span>
	   <span class="fa fa-angle-double-right" @click="goToLast()"></span>
  </span>
  <div style="float:right;display:inline-block;" v-if="orders.length > 0">
    {{$t('sortBy')}} <formater-select :options="options" name="sortBy" type="associative" defaut="title" @input="sortChange" color="#ffffff"></formater-select>
  </div>
   </div>
 </span>
</template>
<script>
import {FormaterSelect} from 'formater-commons-components-vjs'
export default {
  name: 'FormaterPaging',
  components: {
    FormaterSelect
  },
  props: {

    depth: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'geonetwork'
    },
    uuid: {
      type: String,
      default: null
    },
    orders: {
      type: Array,
      default: () => []
    },

    orderBy: {
      type: String,
      default: null
    }
  },
  computed: {
    recordByLine () {
      return this.$store.state.size.recordByLine
    }
  },
  watch: {
    recordByLine (newvalue) {
      this.updateRecordsPerPage(newvalue)
    }
  },
  created: function() {
    this.recordPerPage = this.$store.state.size.nbRecord
    this.metadataListListener = this.receiveTotalRecord.bind(this)
    document.addEventListener('fmt:metadataListEvent', this.metadataListListener)
    this.searchEventListener = this.handleSearch.bind(this) 
	document.addEventListener('aerisSearchEvent', this.searchEventListener);
    this.resetEventListener = this.handleReset.bind(this) 
  	document.addEventListener('aerisResetEvent', this.resetEventListener);
    var self = this
    this.orders.forEach( function (order) {
      self.options[order] = self.$i18n.t(order)
    })
    this.updateRecordsPerPage(this.recordByLine)
    this.emitChange()
  },
  mounted () {
    this.handleTheme()
  },
  destroyed () {
    document.removeEventListener('fmt:metadataListEvent', this.metadataListListener);
    this.metadataListListener = null;
    document.addEventListener('aerisSearchEvent', this.searchEventListener);
    this.searchEventListener = null;
    document.addEventListener('aerisResetEvent', this.resetEventListener);
    this.resetEventListener = null;
  },

  data() {
    return {
      initialize: true,
      recordPerPage: 24,
      // recordByLine: 4,
      recordsPerPage: { 
         "24": "24 per page"
      },
      count: 0,
      currentPage : 1,
      nbPage: 0,
      from: 1,
      to: 24,
      notExactly: '',
      options: {},
      metadataListListener: null,
      searchEventListener: null
    }
  },
  
  methods: {
   receiveTotalRecord (event) {
     if (event.detail.depth !=  this.depth ){
       return;
     }
     switch (this.type) {
       case 'geonetwork':
         this.count = parseInt(event.detail.summary['@count'])
         this.from = parseInt(event.detail['@from'])
         this.to = parseInt(event.detail['@to'])
         this.nbPage = Math.ceil(event.detail.summary['@count'] / this.recordPerPage) 
         break
       case 'opensearch':
         this.count = event.detail.properties.totalResults
         this.to = this.from + Object.keys(event.detail.metadata).length -1
         this.nbPage = Math.ceil(this.count/ this.recordPerPage)
         if (typeof event.detail.properties.exactCount !== 'undefined') {
           this.notExactly = (event.detail.properties.exactCount ? '': '~')
         }
         break
     }
     if (this.count === 0) {
       this.from = 1
       this.currentPage = 1
     }
     if (this.count!=0 && this.currentPage > this.nbPage) {
       this.goToLast()
     }
   },
   updateRecordsPerPage (recordsByLine) {
     var isCurrent = (this.$store.state.currentUuid === this.uuid)
     var options = {}
     var i = 1
     var nbRecords = recordsByLine * i
     while(i < 9) {
       if (!isCurrent && this.recordPerPage < nbRecords && this.recordPerPage > (i-1) * recordsByLine ) {
         // keep the value in list of options
         options[this.recordPerPage] = this.recordPerPage + ' ' + this.$t('per_page')
       }
		options[nbRecords] = nbRecords + ' ' + this.$t('per_page')
		i++
		nbRecords = recordsByLine * i
     }
     if (isCurrent) {
       // change the record per page only for the current metadata
       this.recordPerPage = 4 * recordsByLine
     }
     // change the list of options for all
     this.recordsPerPage = options
   },
   goToFirst () {
     this.from = 1
     this.currentPage = 1
     this.emitChange()
   },
   goToLast () {
     this.from = (this.nbPage -1) * this.recordPerPage + 1
     this.currentPage = this.nbPage
     this.emitChange()
   },
   handleReset(event) {
     this.from = 1
     this.currentPage = 1
   },
   handleSearch (event) {
     if (this.depth != event.detail.depth) {
       return
     }
     if (this.type === 'opensearch') {
       event.detail.index = this.from
       event.detail.maxRecords = this.recordPerPage
     } else {
      event.detail.from = this.from
      event.detail.to = this.from + this.recordPerPage - 1
     }
     if (this.sortBy) {
     	event.detail.sortBy = this.sortBy
     }
   },
   handleTheme () {
     var nodes = this.$el.querySelectorAll('.mtdt-paging span.mtdt-navigation span')
     var self = this
     nodes.forEach( function (node) {
       node.style.backgroundColor = self.$store.state.style.primary
     })
   },
   changePage(sens) {
     if (sens < 0 && this.currentPage === 1 ){
       return
     }
     if (sens > 0 && this.currentPage === this.nbPage && !this.notExactly) {
       return;
     }
     this.currentPage += sens
     this.from = (this.currentPage - 1) * this.recordPerPage +1
     this.emitChange()
   },
   nbRecordChange (value) {
     this.recordPerPage = parseInt(value)
     this.emitChange()
   },
   sortChange (event) {
     this.sortBy = event
     this.emitChange()
   },
   emitChange() {
     var to = this.from + this.recordPerPage - 1
     var event = new CustomEvent('fmt:pageChangedEvent', {detail:{ depth: this.depth}})
     document.dispatchEvent(event)
   }
  }
}
</script>
<style>
.mtdt-paging span.mtdt-navigation span{
  font-size: 14px;
  cursor: pointer;
  margin: 0 1px;
  padding:5px;
 cursor:pointer;
 border-radius:3px;
 /*background:#8c0209;*/
 background:#754a15;
 padding:3px 5px;
 color:white;
 font-size:1.3em;;
  vertical-align:middle;
  opacity:0.9;
}
.mtdt-paging span.mtdt-navigation.disabled span{
  opacity:0.3;
  cursor:not-allowed;
}
.mtdt-paging span.mtdt-navigation:not(.disabled) span:hover{
  opacity:1;
  font-size:1.31em;
}

</style>