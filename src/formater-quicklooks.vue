<template>
 <span class="mtdt-quicklooks" v-if="images">
    <i class="fa fa-chevron-circle-left" v-if="selected > 0" @click="selected -= 1"></i>
    <i class="fa fa-chevron-circle-right" v-if="images.length>0 && selected < images.length - 1" @click="selected += 1"></i>
    <div class="wrapper">
    <div v-for="(image, index) in images" :key="index" :class="{'selected': selected === index}">

      <img :src="image[1]" :alt="image[2].substring(0, 50)" />
      <div style="max-height:34px; padding:3px;margin:0;line-height:1">{{image[2].substring(0,100)}}</div>
    </div>
	</div>
 </span>
</template>
<script>

export default {
  name: 'FormaterQuicklooks',
  components: {
  },
  props: {
    quicklooks: {
      type: String | Array,
      default: null
    }
  },
  data() {
    return {
     images: null,
     selected: 0
    }
  },
  
  mounted () {
    this.images = this.quicklooks
  }
}
</script>
<style>
.mtdt-quicklooks{
  position: relative;
   float:left;
   max-width: 340px;
  /* max-height:260px;*/
   background: #ddd;
   margin: 0px 15px 10px 0;
}
.mtdt-quicklooks div.wrapper{
   text-align:center;
   max-width: 340px;
   max-height:296px;
   line-height:260px;
   margin:auto;
   width: 340px;
}
.mtdt-quicklooks div.wrapper > div{
  display:none;
}
.mtdt-quicklooks div.wrapper .selected{
  display:inline-block;
  text-align:center;
  vertical-align: middle;
  margin:auto;
}
.mtdt-quicklooks img{
  width:100%;
  max-width:320px;
  max-height:260px;
  display:block;
  margin:auto;
  vertical-align:middle;
}
.mtdt-quicklooks .fa-chevron-circle-right,
.mtdt-quicklooks .fa-chevron-circle-left{
  position: absolute;
  font-size:40px;
  top: 110px;
  z-index:1;
  opacity:0;
  cursor: pointer;
}
 .mtdt-quicklooks:hover .fa {
   opacity:0.3
 }
.mtdt-quicklooks .fa-chevron-circle-right:hover,
.mtdt-quicklooks .fa-chevron-circle-left:hover{
  opacity: 0.7;
}
.mtdt-metadata .mtdt-quicklooks .fa-chevron-circle-right{
  right:1px;
  margin-right:0;
}
.mtdt-metadata .mtdt-quicklooks .fa-chevron-circle-left{
  left:1px;
  margin-left:0;
}
</style>