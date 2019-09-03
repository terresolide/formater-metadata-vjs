<template>
  <span class="mtdt-parameters" :class="'mtdt-parameters-' + type">
         <div v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].identifier.indexOf(key) >=0">
           <label style="text-transform:capitalize;" :style="{color:primary}">{{key}}: </label> {{item}}
         </div>
         <div v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].acquisition.indexOf(key) >=0">
           <label style="text-transform:capitalize;" :style="{color:primary}">{{key}}: </label> {{item}}
         </div>
         <div v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].quality.indexOf(key) >=0">
           <label style="text-transform:capitalize;" :style="{color:primary}">{{key}}: </label> {{item}}
         </div>
         <div v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].process.indexOf(key) >=0">
           <label style="text-transform:capitalize;" :style="{color:primary}">{{key}}: </label> {{item}}
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
.mtdt-parameters-metadata label{
  min-width: 120px;
}

</style>
