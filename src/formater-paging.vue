<i18n>{
   "en":{
     "results": "Results: {from} to {to} among {count}",
     "title": "Title",
     "relevance": "Relevance",
     "changeDate": "Change date",
     "sortBy": "Order by"
   },
   "fr":{
     "results":  "Résultats: <strong>{from}</strong> à <strong>{to}</strong> sur {count}",
     "title": "Titre",
     "relevance": "Pertinence",
     "changeDate": "Mise à jour",
     "sortBy": "Trier par"
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
    type: {
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
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue
    	this.to = this.nbRecord
    	
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
    if (this.orders.length == 0) {
      this.emitChange()
    }
  },
  destroyed () {
    document.removeEventListener('fmt:metadataListEvent', this.metadataListListener);
    this.metadataListListener = null;
    document.addEventListener('aerisSearchEvent', this.searchEventListener);
    this.searchEventListener = null;
  },

  data() {
    return {
      recordPerPage: null,
      count: 0,
      currentPage : 1,
      nbPage: 0,
      from: 1,
      to: 12,
     // sortBy: 'title',
     // orders: ['title', 'changeDate'],
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
       case 'flatsim':
         this.count = event.detail.properties.totalResults
         this.to = this.from + event.detail.features.length -1
         this.nbPage = Math.ceil(this.count/ this.recordPerPage)
         break
       default:
         this.count = parseInt(event.detail.summary['@count'])
         this.from = parseInt(event.detail['@from'])
         this.to = parseInt(event.detail['@to'])
         this.nbPage = Math.ceil(event.detail.summary['@count'] / this.recordPerPage) 
     }
     if (this.count === 0) {
       this.from = 1
       this.currentPage = 1
     }
     if (this.count!=0 && this.currentPage > this.nbPage) {
       this.goToLast()
     }
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
     if (this.type === 'flatsim') {
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
}
.mtdt-paging span.mtdt-navigation.disabled span{
  opacity:0.3;
  cursor:not-allowed;
}
.mtdt-paging span.mtdt-navigation:not(.disabled) span:hover{
  opacity:1;
}

</style>