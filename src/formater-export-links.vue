
<template>
 <span class="fmt-export-links">
  <div  class="fmt-tab-export">
    <i class="fa fa-chevron-down"></i>
  	<span style="">{{$gn('export')}}</span>
  </div>
  <div class="fmt-expand">
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
.fmt-export-links{
  float:right;
  margin-right:5px;
}
.fmt-tab-export{
  min-width: 80px;
  text-align:center;
}
.fmt-export-links div.fmt-expand{
  display: none;
  text-align: center;
  position:absolute;
  min-width:102px;
}
.fmt-export-links div.fmt-expand div{
   line-height:2;
   padding: 3px 0;
   background: #eee;
   border:1px dotted grey;
   border-top:0px;
}
.fmt-export-links a{
   color: black;
   text-decoration:none;
}
.fmt-export-links div.fmt-expand div:hover{
   background: #ccc;
}
.fmt-tab-export:hover + div.fmt-expand,
div.fmt-expand:hover{
  display: block;
}
</style>