<i18n>{
   "en":{
   },
   "fr":{
      
   }
}
</i18n>
<template>
 <span class="formater-contact" v-if="fields">
   <h3><i class="fa fa-user"></i>{{$gn(fields[0])}}</h3>
   <div>({{fields[1]}})</div>
   <div class="formater-address">
     <div class="formater-organism">{{fields[2]}}</div>
     <div class="formater-name" v-if="fields[3]">{{fields[3]}}</div>
     <div class="formater-email">{{fields[4]}}</div>
   </div>
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
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue
    	this.$setGnLocale(this.lang)
    }
  },
  data() {
    return {
     fields: null
    }
  },
  
  mounted () {
    console.log(this.contact)
    this.fields = this.contact
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
  },
  methods: {

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
}
.formater-contact h3 {
	margin-bottom: 0px;
}
.formater-contact h3 + div {
  margin-left:24px;
  margin-bottom: 5px;
}
.formater-contact .formater-address{
  margin-left:20px;
}
.formater-contact .formater-organism{
  font-weight: 800;
}
</style>