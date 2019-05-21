
<template>
 <div class="fmt-dimension-block">
      	
	      	<formater-dimension :disable="disable" :value="encodeURIComponent(item['@value'])" v-for="(item,index) in dimension" :dimension="item" :key="index" :name="filteredName"></formater-dimension>
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
      default:  () => []
    },
    name: {
      type: String,
      default: ''
    },
    disable: {
      type: Boolean,
      default: false
    },
    defaut: {
      type: String,
      default: ''
    }
  },

  computed: {
    filteredName () {
      switch (this.name) {
      case 'groupOwner':
        return '_' + this.name;
      default:
        return this.name
      }
    }
  },
  methods: {
    
  }
}
</script>
<style>
.fmt-dimension-block {
 margin-left: 5px;
 font-size:12px;
 line-height:18px;
 
}
.fmt-dimension-block i{
 font-size:14px;
}

</style>