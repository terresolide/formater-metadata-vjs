
<template>
 <div class="mtdt-dimension-block">
      	
	      	<formater-dimension :disable="disable" :value="encodeURIComponent(item['@value'])"
	      	 v-for="(item,index) in dimension" :dimension="item" :key="index" :name="filteredName" @change="change"></formater-dimension>
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
  data () {
    return {
      values: {}
    }
  },
  created () {
    this.values = this.dimension
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
    change (event) {
      console.log(event)
//       this.values[event.name] = event.value
//       var checked = this.values.filter(function (value) {
//         return value
//       })
//       console.log(checked)
    }
  }
}
</script>
<style>
.mtdt-dimension-block {
 margin-left: 5px;
 line-height:18px;
 
}
.mtdt-dimension-block i{
 font-size:14px;
}

</style>