
<template>
 <div class="mtdt-facet" :class="{disable: disable && level===0}" >

         <label  @click="handleChange()" style="vertical-align:top;">
              <i class="fa fa-check-square-o" v-if="isChecked"></i>
              <i class="fa fa-square-o" v-if="!isChecked"></i>
         </label>
	    <!--  <input type="checkbox" :name="name" :value="dimension['@name']" v-model="isChecked"/> -->
	     <div class="mtdt-facet-title">
	        {{name}}&#8239;{{ strCount }}
	     </div>
	     <div :class="{deployed: deployed}" style="float:right" @click="deployed = !deployed" v-if="dimension.category && dimension.category.length > 0">
	         <i   class="fa fa-plus-square-o" ></i>
	         <i class="fa fa-minus-square-o"></i>
	     </div>
	     <div class="mtdt-child" v-if="dimension.category && dimension.category.length > 0" >
	      	<formater-facet  :level="level + 1" :defaut="defaut"  :facet-name="facetName" :label="item['@label']" :value="childValue(index)" v-for="(item,index) in dimension.category" :dimension="item" :key="index" @input="childChanged"></formater-facet>
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
    facetName: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: null
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
      name: '',
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
        console.log(newvalue)
        console.log(this.value)
         // if new facet value is in the item value
	      if (newvalue && newvalue.indexOf(this.value) >= 0) {
	        this.isChecked = true
	      } else {
	        this.isChecked = false
	      }
        console.log(this.isChecked)
        console.log(this.label)
    },
    label (newvalue) {
      this.name = this.label.split('|').pop()
      if (this.defaut && this.defaut.indexOf(this.value) >= 0) {
          this.isChecked = true
        } else {
          this.isChecked = false
        }
    }// ,
//     checked (newvalue) {
//       if (!newvalue) {
//         this.isChecked = newvalue
//       }
//     }
  },
  mounted () {
    this.name = this.label.split('|').pop()
   if (this.defaut && this.defaut.indexOf(this.value)>=0) {
     this.isChecked = true;
   } else {
     this.isChecked = false;
   }
   // extract last term 
   // this.label = this.dimension['@label'].split('|').pop()

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
         detail[this.facetName] = this.value
         var event = new CustomEvent('fmt:facetChangeEvent', {detail: detail})
         document.dispatchEvent(event)
       } else if (!this.isChecked && this.level === 0){
         // if unckecked a root node => remove facet value
         var detail = {}
         detail[this.facetName] = ''
         var event = new CustomEvent('fmt:facetChangeEvent', {detail: detail})
         document.dispatchEvent(event)
       }
       // trigger to parent this child change (@see method childChanged)
       this.$emit('input', this.isChecked)
     
    },
//     handleReset (e) {
//       this.isChecked = false
//     },
//     handleSearch (e) {
//       if (this.isChecked) {
//         if (!e.detail.facet) {
//           e.detail.facet = []
//         }
//         e.detail.facet[this.facetName] = this.value
//       }
//     },
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
.mtdt-facet div{
  margin-left:5px;
  padding:0px

}
.mtdt-facet.disable{
 opacity: 0.8;
}

.mtdt-facet input[type="checkbox"] {
  display: none;
}
.mtdt-facet div.mtdt-child{
  display:none;
}
.mtdt-facet i.fa-minus-square-o{
 display:none;
}
.mtdt-facet i.fa-plus-quare-o{
 display:inline;
}
.mtdt-facet div.deployed i.fa-minus-square-o{
  display:inline;
}
.mtdt-facet div.deployed i.fa-plus-square-o{
  display:none;
}
.mtdt-facet div.deployed + div.mtdt-child{
  display:block;
}
.mtdt-facet-title{
  display: inline-block;
  max-width:calc(100% - 80px);
  text-align:left;
  line-height:12px;
}
</style>