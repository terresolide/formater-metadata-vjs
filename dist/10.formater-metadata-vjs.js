(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{264:function(t,e){t.exports=function(t){t.options.__i18n=t.options.__i18n||[],t.options.__i18n.push('{"en":{"searching":"Searching"},"fr":{"searching":"Recherche en cours"}}'),delete t.options._Ctor}},351:function(t,e,a){"use strict";var s=a(264),i=a.n(s);e.default=i.a},385:function(t,e,a){"use strict";a.r(e);var s=a(287),i=a(288),n=a(290),r=a(291),o=a(48);function d(t){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var m=a(190),u={name:"FormaterSingle",components:{FormaterDrawBbox:r.a,FormaterForm:s.a,FormaterListMetadata:i.default,FormaterMetadata:function(){return a.e(1).then(a.bind(null,382))},FormaterPaging:n.default,AerisTheme:o.a},data:function(){return{metadata:null,fullMetadata:null,uuid:null,first:!0,sortBy:"",metaDisplayed:null,previousRoute:null,metadataListener:null,drawing:!1,aerisSearchListener:null,aerisResetListener:null,backListener:null,temporalExtent:{min:"1900-01-01",max:"now"},previousRoutes:[]}},watch:{$route:function(t,e){this.uuid=t.params.uuid,this.$store.getters.previousRoute.params.uuid!==this.uuid?e.params.uuid!==t.params.uuid&&this.getFullMetadata():this.$store.commit("backChild")}},created:function(){this.uuid=this.$route.params.uuid,this.getFullMetadata(),this.$route.query.sortBy?this.sortBy=this.$route.query.sortBy:this.sortBy=this.$store.state.orderBy,this.initTemporalExtent(),this.keydownListener=this.checkEscape.bind(this),document.addEventListener("keydown",this.keydownListener)},mounted:function(){},destroyed:function(){document.removeEventListener("aerisSearchEvent",this.aerisSearchListener),this.aerisSearchListener=null,document.removeEventListener("aerisResetEvent",this.aerisResetListener),this.aerisResetListener=null},methods:{getFileMetadata:function(){var t=this;this.$http.get(this.$store.state.metadata).then((function(e){t.treatmentSingle(e.body)}))},getFullMetadata:function(){var t=this;this.metadata=null;var e=this.$store.state.geonetwork+"srv/api/0.1/records/"+this.uuid+"/formatters/json?withInfo=true&attachment=false";this.$http.get(e,{headers:{accept:"application/json;charset=utf-8"}}).then((function(e){t.treatmentFull(e.body)}),(function(t){console.log(t.body)}))},getMetadata:function(){var t=this;if(this.$store.state.metadata)this.getFileMetadata();else{var e={Accept:"application/json, text/plain, */*","Accept-Language":"fr"===this.$store.state.lang?"fre":"eng"},a=this.$store.state.geonetwork+"srv/"+("fr"===this.$i18n.locale?"fre":"eng")+"/";a+="q?fast=index&bucket=s101&resultType=step1&_content_type=json&uuid="+this.uuid,this.$http.get(a,{headers:e}).then((function(e){t.treatmentMeta(e.body)}),(function(t){console.log(t.body)}))}},treatmentSingle:function(t){var e=t["geonet:info"].uuid;this.metadata=this.$gn.treatmentMetadata(t,e),this.metadata.appRoot=!0;var a=this.$gn.extractBbox(t.geoBox,e);this.$router.replace({name:this.$route.name,params:{uuid:e},query:this.$route.query});var s=new CustomEvent("fmt:metadataEvent",{detail:{meta:this.metadata,feature:a}});document.dispatchEvent(s)},treatmentMeta:function(t){this.metadata=this.$gn.treatmentMetadata(t.metadata,this.uuid);var e=this.$gn.extractBbox(t.metadata.geoBox,this.uuid),a=new CustomEvent("fmt:metadataEvent",{detail:{meta:this.metadata,feature:e}});document.dispatchEvent(a)},treatmentFull:function(t){var e={},a={};m.query(t,'$..["gmd:language"]["gmd:LanguageCode"]'),e["geonet:info"]=t["geonet:info"],e["geonet:info"].uuid=this.uuid,delete t["geonet:info"],e.id=this.uuid;var s=t["gmd:language"]["gmd:LanguageCode"]["@codeListValue"];e.mdLanguage=[s];var i=t["gmd:locale"],n=(a={fr:"FR",en:"EN"})[this.$store.state.lang],r=this;for(var o in i&&i.length>0&&i.forEach((function(t){var e="fre"===t["gmd:PT_Locale"]["gmd:languageCode"]["gmd:LanguageCode"]["@codeListValue"]?"fr":"en";e===r.$store.state.lang&&(n=t["gmd:PT_Locale"]["@id"]),a[e]=t["gmd:PT_Locale"]["@id"]})),e.contacts={metadata:{},resource:{}},t)switch(o){case"gmd:hierarchyLevel":e.type=t[o]["gmd:MD_ScopeCode"]["@codeListValue"];break;case"gmd:contact":this.$gn.extractContacts(t[o]["gmd:CI_ResponsibleParty"],"metadata",n).forEach((function(t){e.contacts.metadata[t[0]]?e.contacts.metadata[t[0]].push(t):e.contacts.metadata[t[0]]=[t]}));break;case"gmd:parentIdentifier":console.log(t[o]),e.parentIdentifier=t[o]["gco:CharacterString"]["#text"]?t[o]["gco:CharacterString"]["#text"]:t[o]["gco:CharacterString"];break;case"gmd:identificationInfo":this.$gn.extractDataInfo(e,t[o]["gmd:MD_DataIdentification"],n);break;case"gmd:distributionInfo":this.$gn.extractDistributionInfo(e,t[o],n);break;case"gmd:dataQualityInfo":this.$gn.extractLineage(e,t[o],n)}e.exportLinks={xml:this.$store.state.geonetwork+"srv/api/records/"+e.id+"/formatters/xml?attachment=true",pdf:this.$store.state.geonetwork+"srv/api/records/"+e.id+"/formatters/xsl-view?root=div&output=pdf"},this.metadata=e,this.fullMetadata=t;var d=this.$gn.extractBbox(e.geobox,this.uuid),u=new CustomEvent("fmt:metadataEvent",{detail:{meta:this.metadata,feature:d}});document.dispatchEvent(u)},initTemporalExtent:function(){this.$store.state.temporalExtent&&this.$store.state.temporalExtent.min&&(this.temporalExtent.min=this.$store.state.temporalExtent.min),this.$store.temporalExtent&&this.$store.temporalExtent.max&&(this.temporalExtent.max=this.$store.temporalExtent.max)},closeSingle:function(){var t=new CustomEvent("fmt:closeMetadataEvent",{detail:{depth:-1}});document.dispatchEvent(t),this.$store.commit("resetSelectedMetadata")},receiveMetadata:function(t){this.$store.state.metadata&&this.first&&(this.first=!1,this.metadataUui=t.detail.meta.id),this.currentUuid=t.detail.meta.id,this.$store.commit("currentUuidChange",this.currentUuid);var e=null,a=null,s=0;if("string"==typeof t.detail.meta.tempExtentBegin)e=t.detail.meta.tempExtentBegin.substring(0,10),s=1;else if("object"===d(t.detail.meta.tempExtentBegin)){var i=t.detail.meta.tempExtentBegin.map((function(t){return t.substring(0,10)}));i.sort(),e=i[0],s=i.length}if("string"==typeof t.detail.meta.tempExtentEnd&&1===s)a=t.detail.meta.tempExtentEnd.substring(0,10);else if("object"===d(t.detail.meta.tempExtentEnd)&&t.detail.meta.tempExtentEnd.length===s){var n=t.detail.meta.tempExtentEnd.map((function(t){return t.substring(0,10)}));n.sort(),a=n[n.length-1]}var r={min:e||this.temporalExtent.min,max:a||this.temporalExtent.max};this.$store.commit("temporalChange",r)},close:function(){var t=this.$store.getters.previousRoute;this.$router.push({name:t.name,params:t.params,query:t.query}),this.$store.commit("services/resetCurrent"),this.$store.commit("backChild")},back:function(){},checkEscape:function(t){var e=t||window.event;(e.key?"Escape"===e.key||"Esc"===e.key:27===e.keyCode)&&this.$router.go(-1)},setParameters:function(t){this.$store.commit("parametersChange",{parameters:t.osParameters,mapping:t.mapping,type:t.type})},closeError:function(){this.$store.commit("removeError")}}},c=a(1),l=a(351),h=Object(c.a)(u,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"mtdt-catalogue"},[a("div",[t._v(t._s(t.metaDisplayed))]),t._v(" "),a("formater-draw-bbox"),t._v(" "),a("div",[a("div",{staticClass:"mtdt-column-left"},[a("formater-form",{attrs:{disableLevel:1,depth:1}})],1),t._v(" "),a("div",{staticClass:"mtdt-column-right"},[a("div",{attrs:{id:"fmtLargeMap"}}),t._v(" "),t.$store.state.searching?a("div",{staticClass:"fmt-waiting"},[a("div",[t._v(t._s(t.$t("searching"))),a("br"),a("span",{staticClass:"fa fa-spinner animated"})])]):t._e(),t._v(" "),t.$store.state.error?a("div",{staticClass:"fmt-error"},[a("div",[a("span",{staticClass:"fa fa-close fmt-close",on:{click:t.closeError}}),t._v(t._s(t.$store.state.error))])]):t._e(),t._v(" "),t.$store.state.selectedMetadata?a("div",{staticClass:"mtdt-free-capsule"},[a("div",[a("formater-metadata",{attrs:{metadata:t.$store.state.selectedMetadata,depth:-1},on:{close:t.closeSingle}})],1)]):t._e(),t._v(" "),t.metadata?a("formater-metadata",{attrs:{metadata:t.metadata,full:t.fullMetadata,depth:1},on:{parametersChange:t.setParameters,close:t.close}}):t._e()],1)])],1)}),[],!1,null,null,null);"function"==typeof l.default&&Object(l.default)(h),e.default=h.exports}}]);
//# sourceMappingURL=10.formater-metadata-vjs.js.map