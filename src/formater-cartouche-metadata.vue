<i18n>{
   "en":{
     "contact": "Contact | Contacts"
   },
   "fr":{
     "contact": "Contact | Contacts"
   }
}
</i18n>
<template>
 <div class="fmt-cartouche-metadata fmt-capsule">
	 <div class="fmt-header" @click="displayMetadata">
		<i class="fa fa-database" v-if="['dataset','serie'].indexOf(meta.type) >= 0" :title="$gn(meta.type)"></i>
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
      var event = new CustomEvent('metadataEvent', {detail: this.meta})
      document.dispatchEvent(event)
    }
  }
}
</script>
<style>
.fmt-cartouche-metadata{
  position: relative;
  font-size: 12px;
  width: calc(30% - 15px);
  max-width: 370px;
  min-width: 300px;
  margin: 5px;
  overflow:hidden;
  height: 250px;
  max-height:250px;
  overflow:hidden;
  text-align:left;
  display: inline-block;
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
	width:calc(100% - 23px); 
	margin-left:7px;
		overflow: hidden;
	max-height:29px;
}
.fmt-cartouche-metadata div.fmt-header i.fa{
	float:left;
	vertical-align:middle;
	font-size: 18px;

}
.fmt-cartouche-metadata div.fmt-description{
	max-height:165px;
	overflow:hidden;
	padding: 5px;
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
}
.fmt-cartouche-metadata .fmt-footer .fmt-group-logo img{
  max-width:80px;
  max-height:25px;
}
</style>