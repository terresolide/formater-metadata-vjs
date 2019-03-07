
<template>
 <div class="fmt-dimension-block">

	      	<formater-dimension v-for="(item,index) in dimensions" :dimension="item" :key="index"></formater-dimension>
 </div>
</template>
<script>
import FormaterDimension from './formater-dimension.vue';
export default {
  name: 'FormaterDimensionBlock',
  components: {
    FormaterDimension
  },
  props: {
    dimension: {
      type: Object|Array,
      default: []
    }
  },
  data() {
    return {
      dimensions: []
    }
  },
  mounted () {
   if (this.dimension.length > 0) {
     this.dimensions = this.dimension
     
   } else {
     this.dimensions = [this.dimension]
   }
  
  },
  method: {
    handleSearch (e) {
      
    },
    handleReset (e) {
      
    }
    
  }
}
</script>
<style>
.fmt-dimension-block {
 margin-left: 15px;
}

</style>