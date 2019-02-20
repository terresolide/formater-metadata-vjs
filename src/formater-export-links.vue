<i18n>{
   "en":{
   },
   "fr":{
      
   }
}
</i18n>
<template>
 <span class="formater-export-links">
  <div  class="formater-tab-export">
    <i class="fa fa-chevron-down"></i>
  	<span style="">{{$gn('export')}}</span>
  </div>
  <div class="formater-expand" style="position:absolute;min-width:102px;">
     <div><a :href="xml">{{$gn('exportXML')}}</a></div>
     <div><a :href="pdf" target="_blank">{{$gn('exportPDF')}}</a></div>
  </div>
 </span>
</template>
<script>
export default {
  name: 'FormaterExportLinks',
  components: {
  },
  props: {
    uuid: {
      type: String,
      default: null
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
      xml: null,
      pdf: null
    }
  },
  
  mounted () {
    this.$i18n.locale = this.lang
    this.$setGnLocale(this.lang)
    this.xml = process.env.GEONETWORK +'srv/api/records/'+ this.uuid + '/formatters/xml?attachment=true'
    this.pdf = process.env.GEONETWORK + 'srv/api/records/'+ this.uuid + '/formatters/xsl-view?root=div&output=pdf'
    console.log(this.$gnLang)
  },
  methods: {

  }
}
</script>
<style>
.formater-export-links{
  float:right;
  margin-right:5px;
}
.formater-tab-export{
  min-width: 80px;
  text-align:center;
}
.formater-export-links div.formater-expand{
  display: none;
  text-align: center;
}
.formater-export-links div.formater-expand div{
   line-height:2;
   padding: 3px 0;
   background: #eee;
   border:1px dotted grey;
   border-top:0px;
}
.formater-export-links a{
   color: black;
   text-decoration:none;
}
.formater-export-links div.formater-expand div:hover{
   background: #ccc;
}
.formater-tab-export:hover + div.formater-expand,
div.formater-expand:hover{
  display: block;
}
</style>