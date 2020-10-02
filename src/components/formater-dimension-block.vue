
<template>
 <div class="mtdt-dimension-block">
      	
	      	<formater-dimension :ref="filteredName" :disable="disable" :value="encodeURIComponent(item['@value'])"
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
      console.log(this.$refs[this.filteredName])
      var values = []
      this.$refs[this.filteredName].forEach(function (dimension) {
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
        query[this.filteredName] = values.join('+or+')
      } else {
        delete query[this.filteredName]
      }
      this.$router.push({name: this.$route.name, params: this.$route.params, query: query})
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