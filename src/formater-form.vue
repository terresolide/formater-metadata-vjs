<i18n>{
   "en":{
   },
   "fr":{
      
   }
}
</i18n>
<template>
 <span class="fmt-form">
  <input type="text" name="any" />
  <formater-temporal-search :lang="lang" daymin="1900-01-01"></formater-temporal-search>
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
    list: {
      type: Array,
      default: null
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
        // 'facet.q': '',
        // bucket: 's101',
        isChild: false,
        from: 1,
        to: 24,
        resultType: 'details',
        sortBy: 'relevance'
      }
    }
  },
  
  mounted () {
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    this.getRecords()
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
        var event = new CustomEvent('metadataListEvent', {detail: data.metadata})
        document.dispatchEvent(event)
      }
    }
  }
}
</script>
<style>

</style>