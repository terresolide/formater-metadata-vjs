<i18n>{
   "en":{
     "results": "Results: {from} to {to} among {count}",
     "title": "Title",
     "relevance": "Relevance",
     "changeDate": "Change date",
     "sortBy": "Order by"
   },
   "fr":{
     "results":  "Resultats: {from} à {to} sur {count}",
     "title": "Titre",
     "relevance": "Pertinence",
     "changeDate": "Mise à jour",
     "sortBy": "Trier par"
   }
}
</i18n>
<template>
 <span class="fmt-paging">
  <div style="width:100%;border-bottom: 1px solid #ddd;height:30px;line-height:30px;text-align:center;">
  <span :class="{disabled: (currentPage===1 ? 'disabled': ''), 'fmt-navigation':true}">
  	<span class="fa fa-angle-double-left" @click="goToFirst()"></span>
  	<span class="fa fa-angle-left" @click="changePage(-1)" ></span>
  </span>
  <span style="margin: 0 10px;">{{$tc('results', count, {from: from, to: to, count: count})}}</span>
   <span :class="{disabled: (currentPage===nbPage ? 'disabled': ''), 'fmt-navigation':true}">
	   <span class="fa fa-angle-right " @click="changePage(1)" ></span>
	   <span class="fa fa-angle-double-right" @click="goToLast()"></span>
  </span>
  <div style="float:right;display:inline-block;">
    {{$t('sortBy')}} <formater-select :options="options" name="orderBy" type="associative" @input="sortChange" color="#ffffff"></formater-select>
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
      default: 12
    },
    lang: {
      type: String,
      default: 'en'
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
    document.addEventListener('fmt:metadataListEvent', this.metadataListListener);
    var self = this
    this.orders.forEach( function (order) {
      self.options[order] = self.$i18n.t(order)
    })
    console.log(this.options)
  },
  destroyed () {
    document.removeEventListener('fmt:metadataListEvent', this.metadataListListener);
    this.metadataListListener = null;
  },

  data() {
    return {
      recordPerPage: null,
      count: 0,
      currentPage : 1,
      nbPage: 0,
      from: 1,
      to: 12,
      sortBy: 'relevance',
      orders: ['title', 'relevance', 'changeDate'],
      options: {}
    }
  },
  
  methods: {
   receiveTotalRecord (event) {
     console.log(event.detail.summary)
     this.count = parseInt(event.detail.summary['@count'])
     this.from = parseInt(event.detail['@from'])
     console.log(this.recordPerPage)
     this.to = parseInt(event.detail['@to'])
     this.nbPage = Math.ceil(event.detail.summary['@count'] / this.recordPerPage) 
     
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
     var event = new CustomEvent('fmt:pageChangedEvent', {detail: {from: this.from, to: to, sortBy: this.sortBy}})
     document.dispatchEvent(event)
   }
  }
}
</script>
<style>
.fmt-paging span.fmt-navigation span{
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
.fmt-paging span.fmt-navigation.disabled span{
  opacity:0.3;
  cursor:not-allowed;
}
.fmt-paging span.fmt-navigation:not(.disabled) span:hover{
  opacity:1;
}

</style>