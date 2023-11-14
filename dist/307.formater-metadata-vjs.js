(self.webpackChunkformater_metadata_vjs=self.webpackChunkformater_metadata_vjs||[]).push([[307],{2647:t=>{t.exports=function(t){t.options.__i18n=t.options.__i18n||[],t.options.__i18n.push('{"en":{"searching":"Searching"},"fr":{"searching":"Recherche en cours"}}'),delete t.options._Ctor}},5307:(t,e,a)=>{"use strict";a.r(e),a.d(e,{default:()=>f});var n=a(1479),s=a(9611),i=a(423),r=a(1224);function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}var m=a(9832);const d={name:"FormaterSingle",components:{FormaterCommandLine:function(){return a.e(503).then(a.bind(a,2503))},FormaterDrawBbox:r.Z,FormaterForm:n.Z,FormaterListMetadata:s.default,FormaterMetadata:function(){return a.e(80).then(a.bind(a,4080))},FormaterPaging:i.default},data:function(){return{metadata:null,fullMetadata:null,uuid:null,first:!0,sortBy:"",metaDisplayed:null,previousRoute:null,metadataListener:null,drawing:!1,aerisSearchListener:null,aerisResetListener:null,backListener:null,temporalExtent:{min:"1900-01-01",max:"now"},previousRoutes:[]}},watch:{$route:function(t,e){this.uuid=t.params.uuid,this.$store.getters.previousRoute,e.path!==t.path&&this.getFullMetadata()}},created:function(){this.uuid=this.$route.params.uuid,this.getFullMetadata(),this.$route.query.sortBy?this.sortBy=this.$route.query.sortBy:this.sortBy=this.$store.state.orderBy,this.initTemporalExtent(),this.keydownListener=this.checkEscape.bind(this),document.addEventListener("keydown",this.keydownListener)},mounted:function(){},destroyed:function(){document.removeEventListener("aerisSearchEvent",this.aerisSearchListener),this.aerisSearchListener=null,document.removeEventListener("aerisResetEvent",this.aerisResetListener),this.aerisResetListener=null},methods:{getFileMetadata:function(){var t=this;this.$http.get(this.$store.state.metadata).then((function(e){t.treatmentSingle(e.body)}))},getFullMetadata:function(){var t=this;this.metadata=null;var e=this.$store.state.geonetwork+"srv/api/0.1/records/"+this.uuid+"/formatters/json?withInfo=true&attachment=false";this.$http.get(e,{headers:{accept:"application/json;charset=utf-8"}}).then((function(e){t.treatmentFull(e.body)}),(function(t){console.log(t.body)}))},getMetadata:function(){var t=this;if(this.$store.state.metadata)this.getFileMetadata();else{var e={Accept:"application/json, text/plain, */*","Accept-Language":"fr"===this.$store.state.lang?"fre":"eng"},a=this.$store.state.geonetwork+"srv/"+("fr"===this.$i18n.locale?"fre":"eng")+"/";a+="q?fast=index&bucket=s101&resultType=step1&_content_type=json&uuid="+this.uuid,this.$http.get(a,{headers:e}).then((function(e){t.treatmentMeta(e.body)}),(function(t){console.log(t.body)}))}},treatmentSingle:function(t){var e=t["geonet:info"].uuid;this.metadata=this.$gn.treatmentMetadata(t,e),this.metadata.appRoot=!0,this.metadata.selected=this.$store.state.metadata===e;var a=this.$gn.extractBbox(t.geoBox,e);this.$router.replace({name:this.$route.name,params:{uuid:e},query:this.$route.query});var n=new CustomEvent("fmt:metadataEvent",{detail:{meta:this.metadata,feature:a}});document.dispatchEvent(n)},treatmentMeta:function(t){this.metadata=this.$gn.treatmentMetadata(t.metadata,this.uuid);var e=this.$gn.extractBbox(t.metadata.geoBox,this.uuid),a=new CustomEvent("fmt:metadataEvent",{detail:{meta:this.metadata,feature:e}});document.dispatchEvent(a)},treatmentFull:function(t){var e={},a={};m.query(t,'$..["gmd:language"]["gmd:LanguageCode"]'),e["geonet:info"]=t["geonet:info"],e["geonet:info"].uuid=this.uuid,delete t["geonet:info"],e.id=this.uuid;var n=t["gmd:language"]["gmd:LanguageCode"]["@codeListValue"];e.mdLanguage=[n];var s=t["gmd:locale"],i=(a={fr:"FR",en:"EN"})[this.$store.state.lang],r=this;for(var o in s&&s.length>0&&s.forEach((function(t){var e="fre"===t["gmd:PT_Locale"]["gmd:languageCode"]["gmd:LanguageCode"]["@codeListValue"]?"fr":"en";e===r.$store.state.lang&&(i=t["gmd:PT_Locale"]["@id"]),a[e]=t["gmd:PT_Locale"]["@id"]})),e.contacts={metadata:{},resource:{}},t)switch(o){case"gmd:hierarchyLevel":e.type=t[o]["gmd:MD_ScopeCode"]["@codeListValue"];break;case"gmd:contact":this.$gn.extractContacts(t[o]["gmd:CI_ResponsibleParty"],"metadata",i).forEach((function(t){e.contacts.metadata[t[0]]?e.contacts.metadata[t[0]].push(t):e.contacts.metadata[t[0]]=[t]}));break;case"gmd:parentIdentifier":e.parentIdentifier=t[o]["gco:CharacterString"]["#text"]?t[o]["gco:CharacterString"]["#text"]:t[o]["gco:CharacterString"];break;case"gmd:identificationInfo":this.$gn.extractDataInfo(e,t[o]["gmd:MD_DataIdentification"],i);break;case"gmd:distributionInfo":this.$gn.extractDistributionInfo(e,t[o],i);break;case"gmd:dataQualityInfo":this.$gn.extractLineage(e,t[o],i)}e.exportLinks={xml:this.$store.state.geonetwork+"srv/api/records/"+e.id+"/formatters/xml?attachment=true",pdf:this.$store.state.geonetwork+"srv/api/records/"+e.id+"/formatters/xsl-view?root=div&output=pdf"},this.metadata=e,this.fullMetadata=t;var d=this.$gn.extractBbox(e.geobox,this.uuid),u={min:e.tempExtentBegin?e.tempExtentBegin:this.temporalExtent.min,max:e.tempExtentEnd?e.tempExtentEnd:this.temporalExtent.max};this.$store.commit("temporalChange",u);var c=new CustomEvent("fmt:metadataEvent",{detail:{meta:this.metadata,feature:d}});document.dispatchEvent(c)},initTemporalExtent:function(){this.$store.state.temporalExtent&&this.$store.state.temporalExtent.min&&(this.temporalExtent.min=this.$store.state.temporalExtent.min),this.$store.temporalExtent&&this.$store.temporalExtent.max&&(this.temporalExtent.max=this.$store.temporalExtent.max)},closeSingle:function(){var t=new CustomEvent("fmt:closeMetadataEvent",{detail:{depth:-1}});document.dispatchEvent(t),this.$store.commit("resetSelectedMetadata")},receiveMetadata:function(t){this.$store.state.metadata&&this.first&&(this.first=!1,this.metadataUui=t.detail.meta.id),this.currentUuid=t.detail.meta.id,this.$store.commit("currentUuidChange",this.currentUuid);var e=null,a=null,n=0;if("string"==typeof t.detail.meta.tempExtentBegin)e=t.detail.meta.tempExtentBegin.substring(0,10),n=1;else if("object"===o(t.detail.meta.tempExtentBegin)){var s=t.detail.meta.tempExtentBegin.map((function(t){return t.substring(0,10)}));s.sort(),e=s[0],n=s.length}if("string"==typeof t.detail.meta.tempExtentEnd&&1===n)a=t.detail.meta.tempExtentEnd.substring(0,10);else if("object"===o(t.detail.meta.tempExtentEnd)&&t.detail.meta.tempExtentEnd.length===n){var i=t.detail.meta.tempExtentEnd.map((function(t){return t.substring(0,10)}));i.sort(),a=i[i.length-1]}var r={min:e||this.temporalExtent.min,max:a||this.temporalExtent.max};this.$store.commit("temporalChange",r)},close:function(){var t=this.$store.getters.previousRoute;this.$store.commit("backChild"),this.$store.commit("temporalChange",this.$store.state.defaultTemporal),this.$router.push({name:t.name,params:t.params,query:t.query})},back:function(){},checkEscape:function(t){var e=t||window.event;(e.key?"Escape"===e.key||"Esc"===e.key:27===e.keyCode)&&this.$router.go(-1)},setParameters:function(t){this.$store.commit("parametersChange",{parameters:t.osParameters,mapping:t.mapping,fixed:t.fixed,type:t.type})},closeError:function(){this.$store.commit("removeError")}}};var u=a(1900),c=a(2647);const l=a.n(c)();var h=(0,u.Z)(d,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"mtdt-catalogue"},[e("div",[t._v(t._s(t.metaDisplayed))]),t._v(" "),e("formater-draw-bbox"),t._v(" "),e("formater-command-line"),t._v(" "),e("div",[e("div",{staticClass:"mtdt-column-left"},[e("formater-form",{attrs:{disableLevel:1,depth:1}})],1),t._v(" "),e("div",{staticClass:"mtdt-column-right"},[e("div",{attrs:{id:"fmtLargeMap"}}),t._v(" "),t.$store.state.searching?e("div",{staticClass:"fmt-waiting"},[e("div",[t._v(t._s(t.$t("searching"))),e("br"),e("span",{staticClass:"fa fa-spinner animated"})])]):t._e(),t._v(" "),t.$store.state.error?e("div",{staticClass:"fmt-error"},[e("div",[e("span",{staticClass:"fa fa-close fmt-close",on:{click:t.closeError}}),t._v(t._s(t.$store.state.error))])]):t._e(),t._v(" "),t.$store.state.selectedMetadata?e("div",{staticClass:"mtdt-free-capsule"},[e("div",[e("formater-metadata",{attrs:{metadata:t.$store.state.selectedMetadata,depth:-1},on:{close:t.closeSingle}})],1)]):t._e(),t._v(" "),t.metadata?e("formater-metadata",{attrs:{metadata:t.metadata,full:t.fullMetadata,depth:1},on:{parametersChange:t.setParameters,close:t.close}}):t._e()],1)])],1)}),[],!1,null,null,null);"function"==typeof l&&l(h);const f=h.exports}}]);
//# sourceMappingURL=307.formater-metadata-vjs.js.map