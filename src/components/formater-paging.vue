<i18n>{
   "en":{
     "results": "Results: <strong>{from}</strong> to <strong>{to}</strong> among {notExactly}{count}",
     "results_simple": "Results: <strong>{from}</strong> to <strong>{to}</strong>",
     "title": "Title",
     "relevance": "Relevance",
     "changeDate": "Change date",
     "popularity": "Popularity",
     "sortBy": "Order by",
     "per_page": "per page"
   },
   "fr":{
     "results":  "Résultats: <strong>{from}</strong> à <strong>{to}</strong> sur {notExactly}{count}",
     "results_simple":  "Résultats: <strong>{from}</strong> à <strong>{to}</strong>",
    
     "title": "Titre",
     "relevance": "Pertinence",
     "changeDate": "Mise à jour",
     "popularity": "Popularité",
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
  <span v-if="hasTotal" style="margin: 0 10px;" v-html="$tc('results', count, {from: (count === 0) ? 0 : from, to: to, notExactly: notExactly, count: count})"></span>
   <span v-else style="margin: 0 10px;" v-html="$t('results_simple',  {from: from, to: to})"></span>
  
   (<formater-select name="recordPerPage" :options="recordsPerPage" :defaut="recordPerPage + ''" type="associative" @input="nbRecordChange" color="#ffffff"></formater-select>)
   <span :class="{disabled: (!nextLink ? 'disabled': ''), 'mtdt-navigation':true}">
	   <span class="fa fa-angle-right " @click="changePage(1)" ></span>
	   <span v-if="hasTotal" class="fa fa-angle-double-right" @click="goToLast()"></span>
  </span>
  <div style="float:right;display:inline-block;" v-if="orders.length > 0">
    {{$t('sortBy')}} <formater-select :options="options" name="sortBy" type="associative" :defaut="orderBy" @input="sortChange" color="#ffffff"></formater-select>
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
//     uuid: {
//       type: String,
//       default: null
//     },
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
     // this.updateRecordsPerPage(this.$store.state.size.recordByLine)
      return this.$store.state.size.recordByLine
    }
  },
  watch: {
    $route (newvalue) {
      if (newvalue.query.from && newvalue.query.to) {
        this.recordPerPage = newvalue.query.to - newvalue.query.from + 1
        // this.updateRecordsPerPage(this.recordByLine)
      } else {
        this.recordPerPage = this.$store.state.size.nbRecord
      }
    }
  },
  created: function() {
//     if (this.$route.query.from) {
//       this.recordPerPage = this.$route.query.to - this.$route.query.from + 1
//     }
    
    if (this.$route && this.$route.query.from && this.$route.query.to) {
      this.recordPerPage = parseInt(this.$route.query.to) - parseInt(this.$route.query.from) + 1
      // insert in options list
    } else {
      this.recordPerPage = this.$store.state.size.nbRecord
    }
    this.updateRecordsPerPage(this.recordByLine)
    if (this.$route.query.from) {
      this.from = parseInt(this.$route.query.from)
      this.currentPage = (this.from - 1) / this.recordPerPage + 1
    }
    this.sortBy = this.orderBy
    if (this.$route.query.sortBy) {
      this.sortBy = this.$route.query.sortBy
    }
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
    
  },
  mounted () {
    // this.handleTheme()
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
      initializeSort: true,
      initializeMaxRecords: true,
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
      nextLink: true,
      notExactly: '',
      hasTotal: true,
      options: {},
      metadataListListener: null,
      searchEventListener: null
    }
  },
  
  methods: {
   receiveTotalRecord (event) {
//      if (event.detail.depth !=  this.depth ){
//        return;
//      }
     console.log(event)
     if (!event.detail.metadata) {
       this.count = 0
       this.from = 1
       this.to = 0
     }
     switch (event.detail.type) {
       case 'geonetwork':
         if (event.detail.summary) {
	         this.count = parseInt(event.detail.summary['@count'])
	         this.from = parseInt(event.detail['@from'])
	         this.to = parseInt(event.detail['@to'])
	         this.currentPage = (this.from - 1) / this.recordPerPage + 1
	         this.nbPage = Math.ceil(event.detail.summary['@count'] / this.recordPerPage) 
	         this.hasTotal = true
	         if (this.currentPage=== this.nbPage || this.count=== 0) {
	           this.nextLink = false
	         } else {
             this.nextLink = true
	         }
         }
         break
       case 'opensearch':
         if (event.detail.properties) {
	         this.count = event.detail.properties.totalResults
	         this.to = this.from + Object.keys(event.detail.metadata).length -1
	         this.nbPage = Math.ceil(this.count/ this.recordPerPage)
	         if (typeof event.detail.properties.exactCount !== 'undefined') {
	           this.notExactly = (event.detail.properties.exactCount ? '': '~')
	         }
	         this.hasTotal = true
	         if (!this. notExactly && (this.currentPage=== this.nbPage || this.count=== 0)) {
             this.nextLink = false
           } else {
             this.nextLink = true
           }
         }
         break
       case 'sensorthings':
         if (event.detail.properties) {
           console.log(event.detail)
           this.hasTotal = false
           this.nextLink = event.detail.properties.next
           this.from = event.detail.properties.startIndex
           this.to = this.from + event.detail.properties.count - 1
           this.currentPage = (event.detail.properties.startIndex - 1) / this.recordPerPage + 1
           this.count = 0
         }
         break
     }
     if (this.count === 0 && this.hasTotal) {
       this.from = 1
       this.currentPage = 1
     }
     if (this.count!=0 && this.currentPage > this.nbPage) {
       this.goToLast()
     }
   },
   updateRecordsPerPage (recordsByLine) {
    // var isCurrent = (this.$store.state.currentUuid === this.uuid
    // var line = this.recordPerPage / recordsByLine
     var options = {}
     var i = 1
     var nbRecords = recordsByLine * i
     while(i < 9) {
       if (this.recordPerPage < nbRecords && this.recordPerPage > (i-1) * recordsByLine ) {
         // keep the value in list of options
         options[this.recordPerPage] = this.recordPerPage + ' ' + this.$t('per_page')
       }
			options[nbRecords] = nbRecords + ' ' + this.$t('per_page')
			i++
			nbRecords = recordsByLine * i
     }
     if (!this.recordPerPage) {
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
//    handleTheme () {
//      var nodes = this.$el.querySelectorAll('.mtdt-paging span.mtdt-navigation span')
//      var self = this
//      nodes.forEach( function (node) {
//        node.style.backgroundColor = self.$store.state.style.primary
//      })
//    },
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
     if (this.initializeMaxRecord) {
       this.initializeMaxRecord = false
     } else {
       this.emitChange()
     }
   },
   sortChange (event) {
     this.sortBy = event
//      if (this.initializeSort) {
//        // this.emitChange()
//        this.initializeSort = false
//      } else {
       this.emitChange()
     // }
   },
   emitChange() {
     var to = this.from + this.recordPerPage - 1
     var detail = {
         from: Math.round(this.from),
         to: Math.round(to)
     }
     if (this.type === 'geonetwork') {
       detail.sortBy = this.sortBy
     }
     var event = new CustomEvent('fmt:pageChangedEvent', {detail:detail})
     document.dispatchEvent(event)
   }
  }
}
</script>
<style>
.mtdt-paging span.mtdt-navigation span{
  font-size: 1.3em;
  cursor: pointer;
  margin: 0 1px;
  padding:5px;
 cursor:pointer;
 border-radius:3px;
 /*background:#8c0209;*/
 background:#754a15;
 padding:3px 5px;
 color:white;
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