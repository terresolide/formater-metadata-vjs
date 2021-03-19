<template>
<span class="fmt-full-metadata">
  <element-metadata :metadata="metadata"></element-metadata>
</span>
</template>
<script>
import ElementMetadata from './element-metadata.vue'
export default{
  name: 'FormaterFullMetadata',
  components: {
    ElementMetadata
  },
  props:{
    uuid: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      metadata: null
    }
  },
  created () {
    // search metadata
    this.load()
  },
  methods: {
    load() {
      if (!this.uuid) {
        return
      }
      var headers =  {
          'accept': 'application/json;charset=utf-8',
      }
      var url = this.$store.state.geonetwork +  'srv/api/0.1/records/' + this.uuid + '/formatters/json?withInfo=true&attachment=false'
      this.$http.get(url, {headers: headers}).then(
          response => { 
            this.metadata = response.body
            console.log(this.metadata)
          },
          response => { console.log(response.body)})
     // var url = this.$store.state.geonetwork + 'srv/api/'+  this.$store.state.apiVersion + '/records/' + this.uuid +'/formatters/formater-view?output=xml'
     // this.$http.get(url).then( response => this.display(response.body))
    } ,
    display (html) {
      console.log(html)
      this.html = html
    }
  }
}
</script>