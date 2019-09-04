<template>
  <span class="mtdt-parameters" :class="'mtdt-parameters-' + type">
       
         <dl class="mtdt-content" v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].identifier.indexOf(key) >=0">
           <dt style="text-transform:capitalize;" :style="{color:primary}">{{key}}</dt> 
           <dd>{{item}}</dd>
         </dl>
         <div style="display:block;">
          <dl class="mtdt-content" style="padding-bottom:5px;" v-if="type === 'metadata'"><dt :style="{color:primary}">Parameters</dt><dd></dd></dl>
         <dl v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].acquisition.indexOf(key) >=0">
           <dt style="text-transform:capitalize;" :style="{color:primary}">{{key}}</dt> <dd>{{item}}</dd>
         </dl>
         <dl v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].quality.indexOf(key) >=0">
           <dt style="text-transform:capitalize;" :style="{color:primary}">{{key}}</dt> <dd>{{item}}</dd>
         </dl>
         <dl v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].process.indexOf(key) >=0">
           <dt style="text-transform:capitalize;" :style="{color:primary}">{{key}}</dt> <dd>{{item}}</dd>
         </dl>
         </div>
     </div>
 </span>
</template>
<script>
export default{
  name: 'FormaterParameters',
  props: {
    type: {
      type: String,
      default: 'cartouche'
    },
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    primary() {
      return this.$store.state.style.primary
    }
  }
}
</script>
<style>
.mtdt-parameters-cartouche dl{
  display: block;
  padding:0;
  margin:0;
}
.mtdt-parameters-cartouche dl.mtdt-content dt,
.mtdt-parameters-cartouche dl dt{
  display: inline;
  float: none;
  font-weight:500;
  font-size:1em;
  word-break: break-word;

}
.mtdt-parameters-cartouche dl dd,
.mtdt-parameters-cartouche dl.mtdt-content dd{
  display: inline;
  float: none;
  width: auto;
   word-break: break-all;
  line-height: 1.3em;
  vertical-align: bottom;
  margin:0;
}
.mtdt-parameters-metadata dt{
  margin-left: 10px;
  min-width: 150px;
  width: 150px;
  display: inline-block;
  font-size: 1em;
}
.mtdt-parameters-metadata dl {
  margin: 0 0 5px 0;
  line-height:1.1;
}
.mtdt-parameters-metadata dd{
  display: inline;
  font-size: 1em;
}
.mtdt-parameters-metadata  dl.mtdt-content{
  display: block;
  padding-top: 0px;
  margin-bottom:0;
  padding-bottom:30px;
}
.mtdt-parameters-metadata dl.mtdt-content dt{
  width:120px;
  display: inline-block;
  word-break: break-word;
  font-size:1.1em;
  font-weight:600;
}
.mtdt-parameters-metadata dl.mtdt-content dd{
  display: inline;
  float: none;
  width: auto;
   word-break: break-all;
  line-height: 1.3em;
  vertical-align: bottom;
}

</style>
