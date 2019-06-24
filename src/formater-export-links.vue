
<template>
 <span class="mtdt-export-links">
  <div  class="mtdt-tab-export">
    <i class="fa fa-chevron-down"></i>
  	<span style="">{{$gn('export')}}</span>
  </div>
  <div class="mtdt-expand">
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
  data() {
    return {
      xml: null,
      pdf: null
    }
  },
  
  mounted () {
    console.log('mounted')
    this.$setGnLocale(this.lang)
    this.xml = process.env.GEONETWORK +'srv/api/records/'+ this.uuid + '/formatters/xml?attachment=true'
    this.pdf = process.env.GEONETWORK + 'srv/api/records/'+ this.uuid + '/formatters/xsl-view?root=div&output=pdf'
    console.log(this.$gnLang)
  }
}
</script>
<style>
.mtdt-export-links{
  float:right;
  margin-right:5px;
}
.mtdt-tab-export{
  min-width: 80px;
  text-align:center;
}
.mtdt-export-links div.mtdt-expand{
  display: none;
  text-align: center;
  position:absolute;
  min-width:102px;
  z-index: 10;
}
.mtdt-export-links div.mtdt-expand div{
   line-height:2;
   padding: 3px 0;
   background: #eee;
   border:1px dotted grey;
   border-top:0px;
}
.mtdt-export-links a{
   color: black;
   text-decoration:none;
}
.mtdt-export-links div.mtdt-expand div:hover{
   background: #ccc;
}
.mtdt-tab-export:hover + div.mtdt-expand,
div.mtdt-expand:hover{
  display: block;
}
</style>