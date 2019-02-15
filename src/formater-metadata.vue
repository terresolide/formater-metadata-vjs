<template>
 <span class="formater-metadata">
   <div v-if="meta">
      <h1>{{meta.title ? meta.title: meta.defaultTitle}}</h1>
      <hr />
      <div class="formater-tabs">
         <div v-for="(tab,index) in tabs" style="display:inline-block; padding: 5px 10px; border:1px dotted grey;">{{tab.title}}</div>
      </div>
      <div class="formater-description" v-html="meta.abstract ? meta.abstract: meta.defaultAbstract"></div>
   </div>
 </span>
</template>
<script>
export default {
  name: 'FormaterMetadata',
  components: {
  },
  props: {
    metadata: {
      type: Object,
      default: null
    },
    url: {
      type: String,
      default: null
    }
  },
  data() {
    return {
     tabs: [
       {title: 'Aperçu', value: 'tab1'},
       {title: 'Complet', value: 'tab2'}
     ],
     currentTab: 'tab1',
     meta: null,
     fields : {text: [''], date:[], array:[]}
    }
  },
  mounted () {
   if (this.metadata) {
     this.data = this.metadata
   }
   if (this.url) {
     // get meta from url
     this.getMetaFromUrl()
     
   }
  },
  methods: {
      getMetaFromUrl () {
        let _this = this
        this.$http.get(this.url).then(
            response => { _this.handleSuccess(response) },
            response => { _this.handleError('no_file')}
         )
      },
      handleSuccess (response) {
        console.log(response)
        this.meta = response.body.metadata[39]
        this.meta.abstract = this.meta.abstract.replace(/(?:\\[rn]|[\r\n])/g, '<br />')
        for(var key in this.meta) {
          console.log(key)
        }
        console.log(typeof this.meta.defaultTitle)
      },
      handleError () {
        console.log('metadata_not_find')
      }
  }
}
</script>
<style>
.formater-metadata{
  font-size: 12px;
}
.formater-metadata h1{
  color:#8C0209;
  font-size:1.2rem;
}
.formater-metadata div.formater-description{
  line-height:1.5;
}
</style>