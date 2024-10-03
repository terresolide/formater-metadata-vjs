
<template>
 <div class="mtdt-dimension-block">
      	
	      	<formater-dimension :ref="name" :disable="disable" :value="item.value" :checked="item.checked"
	      	 v-for="(item,index) in values" :dimension="item" :key="index" :name="name" @change="change"></formater-dimension>
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
    this.fill()
  },
  computed: {

  },
  watch:{
    dimension (newvalue) {
      this.fill()
    }
  },
  methods: {
    fill () {
      var checked = []
      if (this.$route.query[this.name]) {
        var param = decodeURIComponent(this.$route.query[this.name])
        var checked = param.split('+or+')
      }
      var dimensions = []
      for (var key in this.dimension) {
        var dimension = this.dimension[key]
        dimension.value = dimension['@value']
        dimension.checked = checked.indexOf(dimension.value) >= 0
        dimensions.push(dimension)
      }
      dimensions.sort(function (a, b) {
        if (a['@label'] < b['@label']) {
          return -1
        } else {
          return 1
        }
      })
      this.values = dimensions
    },
    change (event) {
      var values = []
      this.$refs[this.name].forEach(function (dimension) {
        var value = dimension.getValue()
        if (value !== null) {
          values.push(value)
        }
      })
      // change query
      var query = {}
      for (var prop in this.$route.query) {
        query[prop] = this.$route.query[prop]
      }
      if (values.length > 0) {
        query[this.name] = values.join('+or+')
      } else {
        delete query[this.name]
      }
      this.$router.push({name: this.$route.name, params: this.$route.params, query: query})
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