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
    },
    metadata: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      // metadata: null
    }
  },
  created () {
    // search metadata
    // this.load()
  },
  methods: {
  }
}
</script>