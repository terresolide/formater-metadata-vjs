<template>
 <span class="fmt-quicklooks" v-if="images">
    <i class="fa fa-chevron-circle-left" v-if="selected > 0" @click="selected -= 1"></i>
    <i class="fa fa-chevron-circle-right" v-if="images.length>0 && selected < images.length - 1" @click="selected += 1"></i>
    <div class="wrapper">
    <div v-for="(image, index) in images" :key="index" :class="{'selected': selected === index}">

      <img :src="image[1]" :alt="image[2]" />
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
.fmt-quicklooks{
  position: relative;
   float:left;
   max-width: 340px;
   max-height:260px;
   background: #ddd;
   margin: 0px 15px 10px 0;
}
.fmt-quicklooks div.wrapper{
   text-align:center;
   max-width: 340px;
   max-height:260px;
   line-height:260px;
   margin:auto;
   width: 340px;
   height: 260px;
}
.fmt-quicklooks div.wrapper div{
  display:none;
}
.fmt-quicklooks div.wrapper .selected{
  display:inline-block;
  text-align:center;
  vertical-align: middle;
  margin:auto;
}
.fmt-quicklooks img{
  width:100%;
  max-width:320px;
  max-height:260px;
  display:block;
  vertical-align:middle;
}
.fmt-quicklooks .fa-chevron-circle-right,
.fmt-quicklooks .fa-chevron-circle-left{
  position: absolute;
  font-size:40px;
  top: 110px;
  z-index:1;
  opacity:0;
}
 .fmt-quicklooks:hover .fa {
   opacity:0.3
 }
.fmt-quicklooks .fa-chevron-circle-right:hover,
.fmt-quicklooks .fa-chevron-circle-left:hover{
  opacity: 0.7;
}
.fmt-metadata .fmt-quicklooks .fa-chevron-circle-right{
  right:1px;
  margin-right:0;
}
.fmt-metadata .fmt-quicklooks .fa-chevron-circle-left{
  left:1px;
  margin-left:0;
}
</style>