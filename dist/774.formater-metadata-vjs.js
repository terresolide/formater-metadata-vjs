(self.webpackChunkformater_metadata_vjs=self.webpackChunkformater_metadata_vjs||[]).push([[774],{1458:t=>{t.exports=function(t){t.options.__i18n=t.options.__i18n||[],t.options.__i18n.push('{"en":{"parentIdentifier":"Parent Id.","productType":"Product type","parameters":"Parameters"},"fr":{"parentIdentifier":"Parent Id.","productType":"Type de produit","parameters":"Paramètres"}}'),delete t.options._Ctor}},5065:(t,e,a)=>{(e=a(3645)(!1)).push([t.id,"\n.mtdt-parameters-metadata .mtdt-block-parameters{\n  display: block;\n  max-width:calc(100% - 305px);\n}\ndl.mtdt-simple-parameter:parent{\n  display:block;\n}\n.mtdt-parameters-cartouche dl{\n  display: block;\n  padding:0;\n  margin:0;\n}\n.mtdt-parameters-cartouche dl.mtdt-content dt,\n.mtdt-parameters-cartouche dl dt{\n  display: inline;\n  float: none;\n  font-weight:500;\n  font-size:1em;\n  word-break: break-word;\n}\n.mtdt-parameters-cartouche dl dd,\n.mtdt-parameters-cartouche dl.mtdt-content dd{\n  display: inline;\n  float: none;\n  width: auto;\n   word-break: break-all;\n  line-height: 1em;\n  vertical-align: bottom;\n  margin:0;\n}\n.mtdt-content .mtdt-parameters-metadata  dl.mtdt-simple-parameter{\n  padding-top: 3px;\n  line-height: 1;\n}\n.mtdt-content .mtdt-parameters-metadata  dl.mtdt-simple-parameter dt{\n  font-weight:500;\n  width: 165px;\n  padding-left: 10px;\n  line-height:1;\n}\n.mtdt-content .mtdt-parameters-metadata  dl.mtdt-simple-parameter dd{\n  min-width: 0;\n  font-weight:500;\n  padding-left: 10px;\n  line-height:1;\n  display:inline-block;\n  width:auto;\n}\ndl.mtdt-parameter-title{\n  display:none;\n}\ndl.mtdt-parameter-title + .mtdt-simple-parameter{\n  display: block;\n}\n/*mtdt-parameters-metadata dt{\n  margin-left: 0px;\n  min-width: 150px;\n  width: 150px;\n  display: inline-block;\n  font-size: 1em;\n}\n.mtdt-parameters-metadata dl {\n  margin: 0 0 5px 0;\n  line-height:1.1;\n}\n.mtdt-parameters-metadata dd{\n  display: inline;\n  font-size: 1em;\n}\n.mtdt-parameters-metadata  dl.mtdt-content{\n  display: block;\n  padding-top: 0px;\n  margin-bottom:0;\n  padding-bottom:30px;\n}\n/*.mtdt-parameters-metadata dl.mtdt-content dt{\n  width:120px;\n  display: inline-block;\n  word-break: break-word;\n  font-size:1.1em;\n  font-weight:600;\n}\n.mtdt-parameters-metadata dl.mtdt-content dd{\n  display: inline;\n  float: none;\n  width: auto;\n   word-break: break-all;\n  line-height: 1.3em;\n}*/\n\n",""]),t.exports=e},1774:(t,e,a)=>{"use strict";a.r(e),a.d(e,{default:()=>m});const n={name:"FormaterParameters",props:{type:{type:String,default:"cartouche"},metadata:{type:Object,default:function(){}}},created:function(){this.metadata["geonet:info"]?(this.uuid=this.metadata["geonet:info"].uuid,this.metaType="geonetwork"):(this.uuid=this.metadata.id,this.metaType="opensearch")},data:function(){return{uuid:null,metaType:"opensearch",countParameters:0}},computed:{primary:function(){return this.$store.state.style.primary}},mounted:function(){var t=this.$el.querySelectorAll(".mtdt-simple-parameter");this.countParameters=t.length}};a(7420);var r=a(1900),d=a(1458);const i=a.n(d)();var s=(0,r.Z)(n,(function(){var t=this,e=t._self._c;return e("span",{staticClass:"mtdt-parameters",class:"mtdt-parameters-"+t.type},[t._l(t.metadata,(function(a,n){return t.$store.state.osFields[t.type].identifier.indexOf(n)>=0?e("dl",{key:n,staticClass:"mtdt-content"},[e("dt",{staticStyle:{"text-transform":"capitalize"},style:{color:t.primary}},[t._v(t._s(t.$t(n)))]),t._v(" "),e("dd",{staticStyle:{"max-width":"300px"}},[t._v(t._s(a))])]):t._e()})),t._v(" "),e("div",{staticClass:"mtdt-block-parameters"},["metadata"===t.type&t.countParameters>0?e("dl",{staticClass:"mtdt-content mtdt-parameter-title",staticStyle:{"padding-bottom":"5px"}},[e("dt",{staticStyle:{width:"99%"},style:{color:t.primary}},[t._v(t._s(t.$t("parameters")))]),t._v(" "),e("dd",{staticStyle:{width:"0px"}})]):t._e(),t._v(" "),t._l(t.metadata,(function(a,n){return t.$store.state.osFields[t.type].acquisition.indexOf(n)>=0?e("dl",{key:n,staticClass:"mtdt-simple-parameter"},[e("dt",{staticStyle:{"text-transform":"capitalize"},style:{color:t.primary}},[t._v(t._s(n))]),t._v(" "),Array.isArray(a)?e("dd",[t._v(t._s(a.join(", ")))]):e("dd",[t._v(t._s(a))])]):t._e()})),t._v(" "),t._l(t.metadata,(function(a,n){return t.$store.state.osFields[t.type].quality.indexOf(n)>=0?e("dl",{key:n,staticClass:"mtdt-simple-parameter"},[e("dt",{staticStyle:{"text-transform":"capitalize"},style:{color:t.primary}},[t._v(t._s(n))]),t._v(" "),Array.isArray(a)?e("dd",[t._v(t._s(a.join(", ")))]):e("dd",[t._v(t._s(a))])]):t._e()})),t._v(" "),t._l(t.metadata,(function(a,n){return t.$store.state.osFields[t.type].process.indexOf(n)>=0?e("dl",{key:n,staticClass:"mtdt-simple-parameter"},[e("dt",{staticStyle:{"text-transform":"capitalize"},style:{color:t.primary}},[t._v(t._s(n))]),t._v(" "),Array.isArray(a)?e("dd",[t._v(t._s(a.join(", ")))]):e("dd",[t._v(t._s(a))])]):t._e()}))],2)],2)}),[],!1,null,null,null);"function"==typeof i&&i(s);const m=s.exports},7420:(t,e,a)=>{var n=a(5065);n.__esModule&&(n=n.default),"string"==typeof n&&(n=[[t.id,n,""]]),n.locals&&(t.exports=n.locals),(0,a(5346).Z)("080229e2",n,!0,{})}}]);
//# sourceMappingURL=774.formater-metadata-vjs.js.map