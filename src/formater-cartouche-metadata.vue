<i18n>{
   "en":{
     "contact": "Contact | Contacts",
     "children": "Children"
   },
   "fr":{
     "contact": "Contact | Contacts",
     "children": "Fiches Enfants"
   }
}
</i18n>
<template>
 <div class="fmt-cartouche-metadata fmt-capsule">
	 <div class="fmt-header" @click="displayMetadata" @dblclick="displayMetadata" >
		<i class="fa" :class="meta.type === 'series' ? 'fa-files-o' : 'fa-file'" v-if="['dataset','series'].indexOf(meta.type) >= 0" :title="$gn(meta.type)"></i>
		<div>{{meta.title ? meta.title: meta.defaultTitle}}</div>
	 </div>
	 <div class="fmt-description" style="">
	    <img :src="meta.thumbnail" v-if="meta.thumbnail"/>
	 	<span v-html="meta.description"></span>
	 </div>
	 <div class="fmt-footer">
	   <div class="fmt-group">
	     <a v-if="meta.groupWebsite" :href="meta.groupWebsite" :title="$gn('group-'+ meta.groupOwner)" target="_blank" class="fmt-group-logo">
             <img :src="meta.logo"/>
          </a>
          <a v-else href="#" :alt="$gn('group-'+ meta.groupOwner)" :title="$gn('group-'+ meta.groupOwner)" class="fmt-group-logo">
              <img :src="meta.logo"  />
          </a>
	   </div>
	   <div class="fmt-related" v-if="meta.related">
	     <div v-if="(meta.related.children || meta.related.parent)" style="position:relative;">
		     <div class="fmt-related-type fa fa-code-fork">
		        <span class="fa fa-caret-down"></span>
		     </div>
		     <div class="fmt-expand">
		         <label v-if="meta.related.parent">{{$t('parent')}}</label>
		         <ul v-if="meta.related.parent">
		          <li v-for="(item,index) in meta.related.children">
			        {{item.title[(lang === 'fr'? 'fre' : 'eng')]}}
			     </li>
		         </ul>	
		         <label v-if="meta.related.children">{{$t('children')}}</label>
		         <ul v-if="meta.related.children">
		          <li v-for="(item,index) in meta.related.children">
			       {{item.title[(lang === 'fr'? 'fre' : 'eng')]}}
			     </li>
		         </ul>		
		     </div>
	     </div>
	   </div>
	 </div>
 </div>
</template>
<script>
export default {
  name: 'FormaterCartoucheMetadata',
  components: {
  },
  props: {
    lang: {
      type: String,
      default: 'en'
    },
    metadata: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: 'step1'
    }
  },
  watch: {
    lang (newvalue) {
    	this.$i18n.locale = newvalue
    }
  },
  data() {
    return {
     meta: {},
     uuid: null
    }
  },
  created () {
   this.$i18n.locale = this.lang
   this.$setGnLocale(this.lang)
   this.meta = this.metadata
  },
  methods: {
    displayMetadata () {
      var event = new CustomEvent('fmt:metadataEvent', {detail: {meta:this.meta, name: this.name}})
      document.dispatchEvent(event)
    }
  }
}
</script>
<style>

.fmt-cartouche-metadata{
  position: relative;
  font-size: 12px;
/*  width: calc(30% - 15px);*/
  max-width: 370px;
  min-width: 370px;
  margin: 5px;
  height: 250px;
  max-height:250px;
  text-align:left;
  display: inline-block;
  float:left;
}
.fmt-cartouche-metadata div.fmt-header{
  color: white;
  background-color: #dd9946;
  margin: 0;
  font-weight:600;
  font-size: 1.1em;
  min-height:29px;
  padding: 5px;
  cursor: pointer;
}
.fmt-cartouche-metadata div.fmt-header div{
	display:inline-block;
	float:left;
	width:calc(100% - 28px); 
	margin-left:7px;
	overflow: hidden;
	max-height:29px;
}
.fmt-cartouche-metadata div.fmt-header i.fa{
	float:left;
	vertical-align:middle;
	font-size: 18px;
	margin-right: 0;

}
.fmt-cartouche-metadata div.fmt-description{
	max-height:165px;
	overflow:hidden;
	padding: 5px;
	min-width: 360px;
	font-size:0.9em;
}
.fmt-cartouche-metadata div.fmt-description img {
  position: relative;
   float:left;
   max-width: 150px;
   max-height:120px;
   background: #ddd;
   margin: 0px 15px 10px 0;
}
.fmt-cartouche-metadata .fmt-footer{
  position: absolute;
  margin: 0 2px;
  bottom:0;
  width:100%;
}
.fmt-cartouche-metadata .fmt-footer > div{
  display: inline-block;
}
.fmt-cartouche-metadata .fmt-footer .fmt-group-logo img{
  max-width:80px;
  max-height:25px;
}
.fmt-cartouche-metadata .fmt-footer .fmt-related{
 float: right;
 margin-right:3px;
 max-height: 25px;
 max-width: 50%;
}
.fmt-cartouche-metadata .fmt-footer .fmt-related-type{
 text-align:center;
 min-width:20px;
 vertical-align:bottom;
 cursor:pointer;
 border-radius:3px;
 /*background:#8c0209;*/
 background:#754a15;
 padding:3px 5px;
 color:white;
 font-size:1.3em;
 margin-right:3px;
}
.fmt-cartouche-metadata .fmt-footer .fmt-related-type:hover{
  background:#8c0209;
}
.fmt-related-type + .fmt-expand{
	display:none;
	position:absolute;
	top: 21px;
	right:0;
	z-index:100;
	height:auto;
	min-width:200px;
	background:white;
	padding:5px;
	border-radius:3px;
	border:1px dotted grey;
	box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.5);
	width:auto;
	text-align:left;
}
.fmt-expand:hover {
  display: block;
}
.fmt-cartouche-metadata .fmt-footer .fmt-related-type:hover + .fmt-expand{
  display:block;
}
.fmt-cartouche-metadata .fmt-footer .fmt-related-type span{
 font-size:0.8em;
 margin-left:3px;
}
.fmt-cartouche-metadata .fmt-expand label{
  font-weight: 800;
}
 
.fmt-cartouche-metadata .fmt-expand ul {
  padding:0;
  list-style-position: outside;
  margin:  5px 3px 5px 9px;
}
.fmt-cartouche-metadata .fmt-expand ul li {
  padding: 0px;
  margin:  0;
}
</style>