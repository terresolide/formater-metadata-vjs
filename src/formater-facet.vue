
<template>
 <div class="fmt-facet" :class="{disable: disable && level===0}" >

         <label :for="name" @click="handleChange()" style="vertical-align:top;">
              <i class="fa fa-check-square-o" v-if="isChecked"></i>
              <i class="fa fa-square-o" v-if="!isChecked"></i>
         </label>
	    <!--  <input type="checkbox" :name="name" :value="dimension['@name']" v-model="isChecked"/> -->
	     <div class="fmt-facet-title">
	        {{label}}&#8239;{{ strCount }}
	     </div>
	     <div :class="{deployed: deployed}" style="float:right" @click="deployed = !deployed" v-if="dimension.category && dimension.category.length > 0">
	         <i   class="fa fa-plus-square-o" ></i>
	         <i class="fa fa-minus-square-o"></i>
	     </div>
	     <div class="fmt-child" v-if="dimension.category && dimension.category.length > 0" >
	      	<formater-facet  :level="level + 1" :defaut="defaut" :checked="isChecked" :name="name" :value="childValue(index)" v-for="(item,index) in dimension.category" :dimension="item" :key="index" @input="childChanged"></formater-facet>
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
    },
    checked: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categories: [],
      deployed: false,
      isChecked: false,
      changed: false,
      label: ''
    }
  },
  computed: {
   
    strCount () {
      if (this.dimension['@count'] > 0 ){
        return '(' + this.dimension['@count'] + ')';
      } else {
        return '(0)';
      }
    }
  },
  watch: {
    defaut (newvalue) {
         // if new facet value is in the item value
	      if (newvalue && newvalue.indexOf(this.value) >= 0) {
	        this.isChecked = true
	      } else {
	        this.isChecked = false
	      }
    },
    checked (newvalue) {
      if (!newvalue) {
        this.isChecked = newvalue
      }
    }
  },
  mounted () {
   if (this.defaut.indexOf(this.value)>=0) {
     this.isChecked = true;
   } else {
     this.isChecked = false;
   }
   // extract last term 
   this.label = this.dimension['@label'].split('|').pop()

//    if (!this.dimension.category) {
//      this.categories = []
//    }else if (this.dimension.category.length > 0) {
//      this.categories = this.dimension.category
     
//    } else {
//      this.categories = [this.dimension.category]
//    }
//    this.resetEventListener = this.handleReset.bind(this) 
//    document.addEventListener('aerisResetEvent', this.resetEventListener);
//    this.searchEventListener = this.handleSearch.bind(this) 
//    document.addEventListener('aerisSearchEvent', this.searchEventListener);
   // do not listen to aerisSearchEvent: when change trigger event and value is register formater form variable arry 
   // facet[name]
  
  },
  destroyed () {
// 	document.removeEventListener('aerisResetEvent', this.resetEventListener);
// 	this.resetEventListener = null;
	
//    document.addEventListener('aerisSearchEvent', this.searchEventListener);
//    this.searchEventListener = null
  },
  methods: {
    handleChange () {
      if (this.disable) {
        return
      }
      this.isChecked = !this.isChecked;
      this.spreadChange()
      
    },
    spreadChange () {
      if (this.isChecked) {
         // if check a node => new facet value
         var detail = {}
         detail[this.name] = this.value
         var event = new CustomEvent('fmt:facetChangeEvent', {detail: detail})
         document.dispatchEvent(event)
       } else if (!this.isChecked && this.level === 0){
         // if unckecked a root node => remove facet value
         var detail = {}
         detail[this.name] = ''
         var event = new CustomEvent('fmt:facetChangeEvent', {detail: detail})
         document.dispatchEvent(event)
       }
       // trigger to parent this child change (@see method childChanged)
       this.$emit('input', this.isChecked)
     
    },
    handleReset (e) {
      this.isChecked = false
    },
    handleSearch (e) {
      console.log(e)
      if (this.isChecked) {
        if (!e.detail.facet) {
          e.detail.facet = []
        }
        e.detail.facet[this.name] = this.value
      }
    },
    childChanged (childChecked) { 
      if(childChecked && !this.isChecked) {
        this.isChecked = true
        this.$emit('input', this.isChecked)
      }
      if(!childChecked && this.isChecked){
        this.spreadChange()
      }
    },
    childValue (index) {
      var val = this.value ? (this.value + '/') : '';
      val += encodeURIComponent(this.dimension.category[index]['@value'])
      return val;
    }
    
  }
}
</script>
<style>
.fmt-facet div{
  margin-left:5px;
  padding:0px

}
.fmt-facet.disable{
 opacity: 0.8;
}

.fmt-facet input[type="checkbox"] {
  display: none;
}
.fmt-facet div.fmt-child{
  display:none;
}
.fmt-facet i.fa-minus-square-o{
 display:none;
}
.fmt-facet i.fa-plus-quare-o{
 display:inline;
}
.fmt-facet div.deployed i.fa-minus-square-o{
  display:inline;
}
.fmt-facet div.deployed i.fa-plus-square-o{
  display:none;
}
.fmt-facet div.deployed + div.fmt-child{
  display:block;
}
.fmt-facet-title{
  display: inline-block;
  max-width:calc(100% - 80px);
  line-height:12px;
}
</style>