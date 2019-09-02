<i18n>{
   "en":{
   },
   "fr":{
      
   }
}
</i18n>
<template>
 <span class="formater-contact" v-if="fields">
   <address>
     <div class="formater-organism">{{fields[2]}}</div>
     <div><a :href="'mailto:'+ fields[4]">{{fields[4]}}</a></div>
     <div class="formater-name" v-if="fields[3]">{{fields[3]}}</div>
     <div v-for="(line,index) in address">{{line}}</div>

    <!--   <div class="formater-address" v-if="addresse"></div>-->
   </address>
 </span>
</template>
<script>

export default {
  name: 'FormaterContact',
  components: {
  },
  props: {
    contact: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
     fields: null,
     address: []
    }
  },
  
  mounted () {
    this.fields = this.contact
    this.extractAddress()
  },
  methods: {
    extractAddress() {
      if (this.fields[7]) {
        this.address = this.fields[7].split(',')
      }
    }

  }
}
</script>
<style>
.formater-contact{
  font-size: 1em;
  max-width:300px;
  min-width:250px;
  margin: 5px 10px;
  float:left;
  vertical-align:text-top;
}
.formater-contact h3 {
	margin-bottom: 0px;
}
.formater-contact h3 + div {
  margin-left:24px;
  margin-bottom: 5px;
}
.formater-contact address{
  margin-left:16px;
}
.formater-contact .formater-organism{
  font-weight: 800;
}
</style>