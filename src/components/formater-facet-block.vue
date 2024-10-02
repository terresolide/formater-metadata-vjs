
<template>
 <div class="mtdt-dimension-block" >
      	
	      	<formater-facet  :disable="disable" :level="0" :defaut="defaut" :value="encodeURIComponent(item['@value'])" 
	      	v-for="(item,index) in dimensions" :label="item['@label']" :dimension="item" :key="index" :facet-name="filteredName"></formater-facet>
 </div>
</template>
<script>
import FormaterFacet from './formater-facet.vue';


Object.defineProperty(
    Object.prototype, 
    'renameProperty',
    {
        writable : false, // Cannot alter this property
        enumerable : false, // Will not show up in a for-in loop.
        configurable : false, // Cannot be deleted via the delete operator
        value : function (oldName, newName) {
            // Do nothing if the names are the same
            if (oldName == newName) {
                return this;
            }
            // Check for the old property name to 
            // avoid a ReferenceError in strict mode.
            if (this.hasOwnProperty(oldName)) {
                this[newName] = this[oldName];
                delete this[oldName];
            }
            return this;
        }
    }
);
export default {
  name: 'FormaterFacetBlock',
  components: {
    FormaterFacet
  },
  props: {
    dimension: {
      type: Object|Array,
      default: []
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
      default: null
    }
  },
  data() {
    return {
      dimensions: [],
      facetChangeListener: null
//       aerisSearchEvent: null,
//       aerisResetEvent: null
    }
  },

  mounted () {
    console.log(this.dimension)
   	if (this.dimension.length > 0) {
	  this.dimensions = this.dimension
// 	  .sort(function compare(a, b) {
// 	    if (a['@label'] est inférieur à b selon les critères de tri)
// 	      return -1;
// 	   if (a['@label'] est supérieur à b selon les critères de tri)
// 	      return 1;
// 	   // a doit être égal à b
// 	   return 0;
// 	 })
     
   	} 
    // else {
    //   this.dimensions = [this.dimension]
    // }
    this.facetChangeListener = this.facetChange.bind(this) 
    document.addEventListener('fmt:facetChangeEvent', this.facetChangeListener);
//     this.aerisSearchListener = this.handleSearch.bind(this)
//     document.addEventListener('aerisSearchEvent', this.aerisSearchListener);
//     this.aerisResetListener = this.handleReset.bind(this)
//     document.addEventListener('aerisResetEvent', this.aerisResetListener);
  },
  destroyed () {
    document.removeEventListener('fmt:facetChangeEvent', this.facetChangeListener)
    this.facetChangeListener = null
//     document.addEventListener('aerisSearchEvent', this.aerisSearchListener)
//     this.aerisSearchListener = null
//     document.addEventListener('aerisResetEvent', this.aerisResetListener)
//     this.aerisResetListener = null
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
    facetChange (e) {
	  if (typeof e.detail[this.name] != 'undefined') {
	    // this.defaut = e.detail[this.name]
	     // change query
      var query = {}
      for (var prop in this.$route.query) {
        query[prop] = this.$route.query[prop]
      }
	    
      if (e.detail[this.name] !== '') {
        query[this.name] =  e.detail[this.name]
      } else {
        delete query[this.name]
      }
      
      this.$router.push({name: this.$route.name, params: this.$route.params, query: query})
// 	    var event = new CustomEvent('fmt:dimensionChangeEvent', {detail: e.detail})
// 	    document.dispatchEvent(event)
	  }
	},
// 	handleSearch (e) {
// 	  if (this.defaut.length === 0) {
// 	    return
// 	  }
// 	  if (!e.detail.facet) {
// 	    e.detail.facet = []
// 	  }
// 	  e.detail.facet[this.name] = this.defaut
// 	},
// 	handleReset () {
// 	  this.defaut = ''
// 	}
  }
}
</script>
<style>
.mtdt-dimension-block {
 margin-left: 5px;
 font-size:14px;
 line-height:18px;
 
}
.mtdt-dimension-block i{
 font-size:14px;
}

</style>