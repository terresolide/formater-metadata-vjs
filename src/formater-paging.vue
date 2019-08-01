<i18n>{
   "en":{
     "results": "Results: {from} to {to} among {count}",
     "title": "Title",
     "relevance": "Relevance",
     "changeDate": "Change date",
     "sortBy": "Order by",
     "per_page": "per page"
   },
   "fr":{
     "results":  "Résultats: <strong>{from}</strong> à <strong>{to}</strong> sur {count}",
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
  <span style="margin: 0 10px;" v-html="$tc('results', count, {from: (count === 0) ? 0 : from, to: to, count: count})"></span>
   (<formater-select name="recordPerPage" :options="recordsPerPage" :defaut="recordPerPage + ''" type="associative" @input="nbRecordChange" color="#ffffff"></formater-select>)
   <span :class="{disabled: (currentPage===nbPage || count=== 0 ? 'disabled': ''), 'mtdt-navigation':true}">
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
    nbRecord: {
      type: Number,
      default: 4
    },
    lang: {
      type: String,
      default: 'en'
    },
    depth: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#754a15'
    },
    orders: {
      type: Array,
      default: () => []
    },
    recordByLine: {
      type: Number,
      value: 4
    },
    orderBy: {
      type: String,
      default: null
    }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue
    	
    },
    recordByLine (newvalue) {
      console.log('recordByLine change')
      this.updateRecordsPerPage(newvalue)
    },
    color (newvalue) {
      console.log('color changed')
    }
  },
  created: function() {
    this.recordPerPage = this.nbRecord
    this.$i18n.locale = this.lang
    this.metadataListListener = this.receiveTotalRecord.bind(this)
    document.addEventListener('fmt:metadataListEvent', this.metadataListListener)
    this.searchEventListener = this.handleSearch.bind(this) 
	document.addEventListener('aerisSearchEvent', this.searchEventListener);
    var self = this
    this.orders.forEach( function (order) {
      self.options[order] = self.$i18n.t(order)
    })
    console.log(this.type)
    console.log('charge formater-paging avec depth = ' + this.depth)
    this.updateRecordsPerPage(this.recordByLine)
//     if (this.orders.length == 0) {
//       this.emitChange()
//     }
  },
  mounted () {
    this.updateColor()
    // this.updateRecordsPerPage(this.recordByLine)
  },
  destroyed () {
    document.removeEventListener('fmt:metadataListEvent', this.metadataListListener);
    this.metadataListListener = null;
    document.addEventListener('aerisSearchEvent', this.searchEventListener);
    this.searchEventListener = null;
  },

  data() {
    return {
      initialize: true,
      recordPerPage: 24,
      recordsPerPage: { 
         "24": "24 per page"
      },
      count: 0,
      currentPage : 1,
      nbPage: 0,
      from: 1,
      to: 12,
     // sortBy: 'title',
     // orders: ['title', 'changeDate'],
      options: {},
      metadataListListener: null,
      searchEventListener: null,
      type: 'geonetwork'
    }
  },
  
  methods: {
   receiveTotalRecord (event) {
     if (event.detail.depth !=  this.depth ){
       return;
     }
     if (event.detail.summary) {
       this.type = 'geonetwork'
     } else {
       this.type = 'opensearch'
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
         this.to = this.from + event.detail.metadata.length -1
         this.nbPage = Math.ceil(this.count/ this.recordPerPage)
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
   updateColor () {
     var nodes = this.$el.querySelectorAll('.mtdt-paging span.mtdt-navigation span')
     var _this = this
     nodes.forEach( function (node) {
       node.style.backgroundColor = _this.color
     })
   },
   updateRecordsPerPage (recordsByLine) {
     var options = {}
     var i = 1
     var nbRecords = recordsByLine * i
     while(i < 9) {
       if (!this.initialize && this.recordPerPage < nbRecords && this.recordPerPage > (i-1) * recordsByLine ) {
         options[this.recordPerPage] = this.recordPerPage + ' ' + this.$t('per_page')
       }
		options[nbRecords] = nbRecords + ' ' + this.$t('per_page')
		i++
		nbRecords = recordsByLine * i
     }
     
     
     //if (this.initialize) {
       this.recordPerPage = 4 * recordsByLine
     //  this.initialize = false
       this.recordsPerPage = options
       
//      } else {
//        this.recordPerPage = 4 * recordsByLine
//        this.recordsPerPage = options
//      }
     console.log('valeur de recordPerPage = ' +  this.recordPerPage)
     // this.emitChange()
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
   changePage(sens) {
     if (sens < 0 && this.currentPage === 1 ){
       return
     }
     if (sens > 0 && this.currentPage === this.nbPage) {
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