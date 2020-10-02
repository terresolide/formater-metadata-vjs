
<template>
 <div class="mtdt-dimension" :class="{disable: disable}">

         <label :for="name" @click="handleChange()" style="vertical-align:top;">
              <i class="fa fa-check-square-o" v-if="isChecked"></i>
              <i class="fa fa-square-o" v-if="!isChecked"></i>
         </label>
	    <!--  <input type="checkbox" :name="name" :value="dimension['@name']" v-model="isChecked"/> -->
	     <div class="mtdt-dimension-title">
	        {{dimension['@label']}}&#8239;{{ strCount }}
	     </div>
	  </div>
 </div>
</template>
<script>
export default {
  name: 'FormaterDimension',
  components: {
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
    disable: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    count: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isChecked: false
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
    checked (newvalue) {
      if(!newvalue) {
        this.isChecked = newvalue
      }
    }
  },
  mounted () {
   this.isChecked = this.checked
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
    getValue () {
      if (!this.isChecked) {
        return null
      } else {
        return this.value
      }
    },
    handleChange () {
      if (this.disable) {
        return
      }
      this.isChecked = !this.isChecked;
//       var event = new CustomEvent('fmt:dimensionChangeEvent', {detail: {name: this.name}})
//       document.dispatchEvent(event)
      this.$emit('change', {name: this.value, value: this.isChecked})
    },
    handleSearch (e) {
      if(!this.isChecked) {
        return
      }
 
      if (e.detail[this.name]) {
        e.detail[this.name] = e.detail[this.name] + '+or+' + this.value
      } else {
        e.detail[this.name] = this.value
      }
    },
    handleReset (e) {
      this.isChecked = false
    }
    
  }
}
</script>
<style>
.mtdt-dimension div{
  margin-left:5px;
  padding:0px;
  opacity: 1;
}
.mtdt-dimension.disable div{
  pointer-events:none;
  opacity: 0.8
}

.mtdt-dimension input[type="checkbox"] {
  display: none;
}
.mtdt-dimension div.mtdt-child{
  display:none;
}
.mtdt-dimension i.fa-minus-square-o{
 display:none;
}
.mtdt-dimension i.fa-plus-quare-o{
 display:inline;
}
.mtdt-dimension div.deployed i.fa-minus-square-o{
  display:inline;
}
.mtdt-dimension-title{
  display: inline-block;
  max-width:calc(100% - 80px);
  line-height:12px;
}
</style>