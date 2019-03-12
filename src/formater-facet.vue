
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
	      	<formater-facet  :level="level + 1" :defaut="defaut" :checked="isChecked" :name="name" :value="childValue(index)" v-for="(item,index) in categories" :dimension="item" :key="index" @input="childChanged"></formater-facet>
	     </div>
	  </div>
 </div>
</template>
<script>
import FormaterFacet from './formater-facet.vue';
export default {
  name: 'FormaterFacet',
  components: {
    FormaterFacet
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
    level: {
      type: Number,
      default: 0
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
      if(!newvalue) {
        this.isChecked = newvalue
      }
    },
    defaut (newvalue) {
         // if new facet value is in the item value
	      if (newvalue && newvalue.indexOf(this.value) >= 0) {
	        this.isChecked = true
	      } else {
	        this.isChecked = false
	      }
    }
  },
  mounted () {
   this.isChecked = this.checked
   if (this.defaut.indexOf(this.value)>=0) {
     this.isChecked = true;
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
   // do not listen to aerisSearchEvent: when change trigger event and value is register formater form variable arry 
   // facet[name]
  
  },
  destroyed () {
	document.removeEventListener('aerisResetEvent', this.resetEventListener);
	this.resetEventListener = null;
  },
  methods: {
    handleChange () {
      
      this.isChecked = !this.isChecked;
      this.spreadChange()
      
    },
    spreadChange () {
      if (this.isChecked) {
         // if check a node => new facet value
         var detail = {}
         detail[this.name] = this.value
         var event = new CustomEvent('fmt:dimensionChangeEvent', {detail: detail})
         document.dispatchEvent(event)
       } else if (!this.isChecked && this.level === 0){
         // if unckecked a root node => remove facet value
         var detail = {}
         detail[this.name] = null
         var event = new CustomEvent('fmt:dimensionChangeEvent', {detail: detail})
         document.dispatchEvent(event)
       }
       // trigger to parent this child change (@see method childChanged)
       this.$emit('input', this.isChecked)
     
    },
    handleReset (e) {
      this.isChecked = false
    },
    childChanged (childChecked) { 
      if(!childChecked && this.isChecked){
        this.spreadChange()
      }
    },
    childValue (index) {
      var val = this.value ? (this.value + '/') : '';
      val += encodeURIComponent(this.categories[index]['@value'])
      return val;
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