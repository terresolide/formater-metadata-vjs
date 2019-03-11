
<template>
 <div class="fmt-dimension">

         <label :for="name" @click="handleChange()" style="vertical-align:top;">
              <i class="fa fa-check-square-o" v-if="isChecked"></i>
              <i class="fa fa-square-o" v-if="!isChecked"></i>
         </label>
	    <!--  <input type="checkbox" :name="name" :value="dimension['@name']" v-model="isChecked"/> -->
	     <div class="fmt-dimension-title">
	        {{dimension['@label']}}&#8239;{{ strCount }}
	     </div>
	     <div :class="{deployed: deployed}" style="float:right" @click="deployed = !deployed" v-if="categories.length > 0">
	         <i   class="fa fa-plus-square-o" ></i>
	         <i class="fa fa-minus-square-o"></i>
	     </div>
	     <div class="fmt-child" v-if="categories.length > 0" >
	      	<formater-dimension :defaut="defaut" :name="name" :value="childValue(index)" v-for="(item,index) in categories" :dimension="item" :key="index" @input="childChanged" @init="initCheckFromChild"></formater-dimension>
	     </div>
	  </div>
 </div>
</template>
<script>
import FormaterDimension from './formater-dimension.vue';
export default {
  name: 'FormaterDimension',
  components: {
    FormaterDimension
  },
  props: {
    dimension: {
      type: Object|Array,
      default: []
    },
    checked: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    defaut: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      categories: [],
      deployed: false,
      isChecked: false,
      isFacet: false,
    //  value: null,
      changed: false
    }
  },
  computed: {
   
    strCount () {
      if (this.dimension['@count'] > 0 ){
        return '(' + this.dimension['@count'] + ')';
      } else {
        return '';
      }
    }
  },
  watch: {
    checked (newvalue) {
      this.isChecked = newvalue
    }
  },
  mounted () {
    console.log(this.value);
   this.isChecked = this.checked
   if (this.name.indexOf('facet') >=0) {
     this.isFacet = true
   }
   if (this.isFacet && this.defaut === this.value) {
     this.isChecked = true;
     this.$emit('init', true)
   }
   if (!this.dimension.category) {
     this.categories = []
   }else if (this.dimension.category.length > 0) {
     this.categories = this.dimension.category
     
   } else {
     this.categories = [this.dimension.category]

   }
   this.resetEventListener = this.handleReset.bind(this) 
   document.addEventListener('aerisResetEvent', this.resetEventListener);
   this.searchEventListener = this.handleSearch.bind(this) 
   document.addEventListener('aerisSearchEvent', this.searchEventListener);
  
  },
  destroyed () {
	document.removeEventListener('aerisResetEvent', this.resetEventListener);
	this.resetEventListener = null;
	document.removeEventListener('aerisSearchEvent', this.searchEventListener);
	this.searchEventListener = null;
  },
  methods: {
    handleChange () {
      console.log('handleChange')
      
      this.isChecked = !this.isChecked;
      if (this.isFacet){
        if (this.isChecked) {
          var detail = {}
          detail[this.name] = this.value
          var event = new CustomEvent('fmt:dimensionChangeEvent', {detail: detail})
          document.dispatchEvent(event)
        } else {
          this.$emit('input', this.isChecked)
        }
      }
      if (!this.isFacet) {
          var event = new CustomEvent('fmt:dimensionChangeEvent')
          document.dispatchEvent(event)
      }
      
    }, 
    handleSearch (e) {
      if(!this.isChecked) {
        return
      }
      console.log('passe par search ' + this.name)
      if (!this.isFacet) {
 
        this.searchCommon(e)
      }
    },
    handleReset (e) {
      this.isChecked = false
    },
    searchCommon (e) {
       if (e.detail[this.name]) {
         e.detail[this.name] = e.detail[this.name] + '+or+' + this.value
       } else {
         e.detail[this.name] = this.value
       }

    },
//     searchForFacet (e) {
//       if (!e.detail.facet){
//         e.detail.facet = []
//       }
//       console.log(this.name)
//       if (e.detail.facet[this.name] ) {
//         e.detail.facet[this.name] += '+or+' + this.value
//       } else {
//         e.detail.facet[this.name] = this.value
//       }
//       console.log(e.detail.facet)
//     },
    childChanged (value) {
      this.handleChange()
    },
    childValue (index) {
      var val = this.value ? (this.value + '/') : '';
      val += encodeURIComponent(this.categories[index]['@value'])
      return val;
    },
    initCheckFromChild(e) {
      console.log(e)
      this.isChecked = true
      this.$emit('init', true)
    }
    
  }
}
</script>
<style>
.fmt-dimension div{
  margin-left:5px;
  padding:0px

}
.fmt-dimension input[type="checkbox"] {
  display: none;
}
.fmt-dimension div.fmt-child{
  display:none;
}
.fmt-dimension i.fa-minus-square-o{
 display:none;
}
.fmt-dimension i.fa-plus-quare-o{
 display:inline;
}
.fmt-dimension div.deployed i.fa-minus-square-o{
  display:inline;
}
.fmt-dimension div.deployed i.fa-plus-square-o{
  display:none;
}
.fmt-dimension div.deployed + div.fmt-child{
  display:block;
}
.fmt-dimension-title{
  display: inline-block;
  max-width:calc(100% - 80px);
  line-height:12px;
}
</style>