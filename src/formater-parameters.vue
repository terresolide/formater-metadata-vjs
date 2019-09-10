<i18n>
{
  "en": {
    "parentIdentifier": "Parent Id.",
    "productType": "Product type",
    "parameters": "Parameters"
  },
  "fr": {
    "parentIdentifier": "Parent Id.",
    "productType": "Type de produit",
    "parameters": "Paramètres"
  }
}
</i18n>
<template>
  <span class="mtdt-parameters" :class="'mtdt-parameters-' + type">
       
         <dl class="mtdt-content" v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].identifier.indexOf(key) >=0">
           <dt style="text-transform:capitalize;" :style="{color:primary}">{{$t(key)}}</dt> 
           <dd>{{item}}</dd>
         </dl>
         <div class="mtdt-block-parameters">
          <dl class="mtdt-content mtdt-parameter-title" style="padding-bottom:5px;" v-if="type === 'metadata' & countParameters > 0"><dt :style="{color:primary}">{{$t('parameters')}}</dt><dd></dd></dl>
         <dl v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].acquisition.indexOf(key) >=0" class="mtdt-simple-parameter">
           <dt style="text-transform:capitalize;" :style="{color:primary}">{{key}}</dt> <dd>{{item}}</dd>
         </dl>
         <dl v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].quality.indexOf(key) >=0" class="mtdt-simple-parameter">
           <dt style="text-transform:capitalize;" :style="{color:primary}">{{key}}</dt> <dd>{{item}}</dd>
         </dl>
         <dl v-for="(item, key) in metadata" :key="key" v-if="$store.state.osFields[type].process.indexOf(key) >=0" class="mtdt-simple-parameter">
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
  created () {
    if (this.metadata['geonet:info']) {
      this.uuid = this.metadata['geonet:info'].uuid
      this.metaType = 'geonetwork'
   } else {
      this.uuid = this.metadata.id
      this.metaType = 'opensearch'
   }
  },
  data () {
    return {
      uuid: null,
      metaType: 'opensearch',
      countParameters: 0
    }
  },
  computed: {
    primary() {
      return this.$store.state.style.primary
    }
  },
  mounted () {
    var nodeParameters = this.$el.querySelectorAll('.mtdt-simple-parameter')
    this.countParameters = nodeParameters.length
  }
}
</script>
<style>
.mtdt-parameters-metadata .mtdt-block-parameters{
  display: block;
}
dl.mtdt-simple-parameter:parent{
  display:block;
}
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
  line-height: 1em;
  vertical-align: bottom;
  margin:0;
}
.mtdt-content .mtdt-parameters-metadata  dl.mtdt-simple-parameter{
  padding-top: 3px;
  line-height: 1;
}
.mtdt-content .mtdt-parameters-metadata  dl.mtdt-simple-parameter dt{
  font-weight:500;
  width: 160px;
  padding-left: 10px;
  line-height:1;
}
dl.mtdt-parameter-title{
  display:none;
}
dl.mtdt-parameter-title + .mtdt-simple-parameter{
  display: block;
}
/*mtdt-parameters-metadata dt{
  margin-left: 0px;
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
/*.mtdt-parameters-metadata dl.mtdt-content dt{
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
}*/

</style>
