<template>
<span class="fmt-full-metadata">
@todo xslt A CREER DANS GEONETWORK
  <div v-html="html"></div>
</span>
</template>
<script>
export default{
  props:{
    uuid: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      html: ''
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