
<template>
 <div class="fmt-dimension">

 
	     <input type="checkbox" />{{dimension['@label']}} ({{dimension['@count']}})
	     <div :class="{deployed: deployed}" style="float:right" @click="deployed = !deployed">
	         <i   class="fa fa-plus-square-o" ></i>
	         <i class="fa fa-minus-square-o"></i>
	     </div>
	     <div class="fmt-child" >
	        deploayer
	      	<formater-dimension v-for="(item,index) in categories" :dimension="item" :key="index"></formater-dimension>
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
    }
  },
  data() {
    return {
      categories: [],
      deployed: false
    }
  },
  mounted () {
   console.log(typeof this.dimension)
   console.log(this.dimension.length)
   if (!this.dimension.category) {
     this.categories = []
   }else if (this.dimension.category.length > 0) {
     console.log('objet')
     this.categories = this.dimension.category
     
   } else {
     this.categories = [this.dimension.category]

   }
  
  },
  method: {
    handleSearch (e) {
      
    },
    handleReset (e) {
      
    }
    
  }
}
</script>
<style>
.fmt-dimension div{
  margin-left:5px;
  padding:0px

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

</style>