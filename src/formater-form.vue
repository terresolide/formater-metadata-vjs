<i18n>{
   "en":{
   },
   "fr":{
      
   }
}
</i18n>
<template>
 <span class="fmt-form">
  <div style="max-width:250px;">
  <div class="formater-input-group" >
 <input id="any" placeholder="any" >
 </div>
  <formater-temporal-search :lang="lang" daymin="1900-01-01"></formater-temporal-search>
   </div>
 </span>

</template>
<script>

import {FormaterTemporalSearch} from 'formater-commons-components-vjs'
export default {
  name: 'FormaterForm',
  components: {
    FormaterTemporalSearch
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
    	this.$setGnLocale(newvalue)
    	this.srv = process.env.GEONETWORK + 'srv/' + (newvalue === 'fr' ? 'fre' : 'eng') + '/'
    	this.headers['Accept-Language'] =  newvalue === 'fr' ? 'fre': 'eng'
    }
  },
  data() {
    return {
      srv: process.env.GEONETWORK + 'srv/' + (this.lang === 'fr'? 'fre' : 'eng') + '/',
      api: process.env.GEONETWORK + '/srv/api/',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': this.lang === 'fr' ? 'fre': 'eng'
      },
      fields: [],
      parameters: {
        _content_type: 'json',
        fast: 'index',
        'facet.q': '',
        bucket: '26041996',
        isChild: false,
        from: 1,
        to: 18,
        resultType: 'details',
        sortBy: 'relevance'
      },
      changePageListener:null
    }
  },
  created () {
    this.parameters.from = 1
    this.parameters.to = this.nbRecord
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    this.getRecords()
    this.pageChangedListener = this.changePage.bind(this)
    document.addEventListener('fmt:pageChangedEvent', this.pageChangedListener);
  },
  destroyed () {
    document.removeEventListener('fmt:pageChangedEvent', this.pageChangedListener);
    this.pageChangedListener = null;
  },
  mounted () {
  
    // url="http://demo.formater/geonetwork/srv/fre/qi?_content_type=json&bucket=2365825987452666&fast=index&from=1&to=41"
  },
  methods: {
    getRecords () {
      var self = this
      var url = this.srv + 'q?' + Object.keys(this.parameters).map(function (prop) {
        return prop + '=' + self.parameters[prop]
      }).join('&');
      this.$http.get(url).then(
          response => { this.fill(response.body);}
       )
    },
    fill (data) {
      this.fields = data.summary
      if (data.metadata) {
        var event = new CustomEvent('fmt:metadataListEvent', {detail:  data})
        document.dispatchEvent(event)
      }
    },
    changePage (event) {
      this.parameters = Object.assign(this.parameters, event.detail)
      this.getRecords()
    }
  }
}
</script>
<style>

</style>