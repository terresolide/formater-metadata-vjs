(self.webpackChunkformater_metadata_vjs=self.webpackChunkformater_metadata_vjs||[]).push([[526,508],{5418:t=>{t.exports=function(t){t.options.__i18n=t.options.__i18n||[],t.options.__i18n.push('{"fr":{"SERVICE_UNAVAILABLE":"Le service est indisponible. Veuillez revenir plus tard!"},"en":{"SERVICE_UNAVAILABLE":"The service is unavailable. Please come back later!"}}'),delete t.options._Ctor}},7778:t=>{t.exports=function(t){t.options.__i18n=t.options.__i18n||[],t.options.__i18n.push('{"en":{"searching":"Searching"},"fr":{"searching":"Recherche en cours"}}'),delete t.options._Ctor}},1508:(t,e,a)=>{"use strict";a.r(e),a.d(e,{default:()=>m});const s={name:"FormaterRequester",props:{depth:{type:Number,default:0}},watch:{$route:function(t,e){this.getRecords(t)}},data:function(){return{srv:null,api:null,headers:{Accept:"application/json, text/plain, */*","Accept-Language":"fr"===this.$store.state.lang?"fre,eng":"eng,fre"},first:!0,dimensions:[],parameters:{},changePageListener:null,temporalChangedListener:null,spatialChangedListener:null,dimensionChangedListener:null,textChangedListener:null,selectChangedListener:null,closeMetadataListener:null,resetListener:null,facet:[],type:"geonetwork",credentials:{}}},created:function(){this.$store.state.geonetwork&&(this.srv=this.$store.state.geonetwork+"srv/"+("fr"===this.$i18n.locale?"fre":"eng")+"/"),this.getRecords(this.$route)},destroyed:function(){},mounted:function(){},methods:{initParameters:function(){this.parameters={_content_type:"json",fast:"index",bucket:"s101",from:1,to:this.$store.state.size.nbRecord,sortBy:this.$store.state.orderBy,sortOrder:"ordering",type:"dataset+or+series+or+publication"}},getRecords:function(t){this.$store.commit("searchingChange",!0),this.type="geonetwork",this.prepareRequest(t),this.requestApi(t)},createGeometry:function(t){var e=t.split(","),a=e[3],s=e[1],r=e[2],n=e[0],i="POLYGON(("+n+"+"+a+",";return i+=r+"+"+a+",",i+=r+"+"+s+",",(i+=n+"+"+s+",")+(n+"+")+a+"))"},prepareRequest:function(t){this.initParameters(),"Metadata"===t.name?(this.parameters.resultType=this.$store.state.summaryType.step2,this.parameters.parentUuid=t.params.uuid):(this.parameters.isChild=!1,this.parameters.resultType=this.$store.state.summaryType.step1)},searchSimpleMetadata:function(){var t=this;this.$http.get(this.$store.state.metadata).then((function(e){var a=e.body,s=a["geonet:info"].uuid;console.log(a);var r=t.$gn.treatmentMetadata(a,s);r.appRoot=!0;var n=new CustomEvent("fmt:metadataEvent",{detail:{meta:r,depth:0}});document.dispatchEvent(n)}))},requestApi:function(t){var e=this;if(this.srv){var a={Accept:"application/json, text/plain, */*","Accept-Language":"fr"===this.$store.state.lang?"fre":"eng"};this.parameters=Object.assign(this.parameters,t.query),this.parameters.renameProperty("start","extFrom"),this.parameters.renameProperty("end","extTo"),this.parameters.box&&(this.parameters.geometry=this.createGeometry(this.parameters.box),delete this.parameters.box);var s=this;"FormaterCatalogue"===t.name&&this.$store.state.gnParameters.step2.forEach((function(t){delete s.parameters[t]})),"Metadata"===t.name&&this.$store.state.gnParameters.step1.forEach((function(t){delete s.parameters[t]})),["index","maxRecords","page"].forEach((function(t){delete s.parameters[t]})),"title"===this.parameters.sortBy?this.parameters.sortOrder="ordering":delete this.parameters.sortOrder,"FormaterCatalogue"===t.name&&this.$store.state.group&&!this.parameters._groupOwner&&(this.parameters._groupOwner=this.$store.state.group.join("+or+")),console.log(this.srv);var r=this.srv+"q?"+Object.keys(this.parameters).map((function(t){return t+"="+s.parameters[t]})).join("&");this.$http.get(r,{headers:a}).then((function(t){e.treatmentGeonetwork(t.body,0)}),(function(t){e.treatmentError(t,r)}))}},treatmentError:function(t,e){switch(t.status){case 0:this.$store.commit("setError",this.$i18n.t("SERVICE_UNAVAILABLE"));break;case 403:this.$store.commit("setError","SERVER RESPONSE FOR "+e+" : ACCESS DENIED");break;case 404:this.$store.commit("setError","SERVER RESPONSE FOR "+e+" : PAGE NOT FOUND");break;default:this.$store.commit("setError","UNKNOWN ERROR FOR "+e)}this.$store.commit("searchingChange",!1)},treatmentGeonetwork:function(t,e){var a={};this.treatmentDimension(t.summary.dimension);var s=[],r=this;if(t.metadata)if(t.metadata&&!t.metadata.forEach){var n=t.metadata["geonet:info"].uuid;a[n]=r.$gn.treatmentMetadata(t.metadata,n);var i=r.$gn.extractBbox(t.metadata.geoBox,n);i&&s.push(i)}else t.metadata.forEach((function(t,e){var n=t["geonet:info"].uuid;a[n]=r.$gn.treatmentMetadata(t,n);var i=r.$gn.extractBbox(t.geoBox,n);i&&s.push(i)}));else a=null;t.metadata=a,t.type="geonetwork",t.features=s,this.fill(t,e),this.$store.commit("searchingChange",!1),this.searchGnStep2Parameters(t.summary.dimension)},treatmentDimension:function(t){if(1===this.$store.state.group.length){t?Array.isArray(t)||(t=[t]):t=[];var e=t.findIndex((function(t){return"groupOwner"===t["@name"]}));e>=0&&t.splice(e,1)}},searchGnStep2Parameters:function(t){var e=this;if(this.first&&(0===this.depth&&this.$store.commit("gnParametersChange",{step:1,dimension:t}),this.$store.state.summaryType.step1!==this.$store.state.summaryType.step2)){var a={Accept:"application/json, text/plain, */*","Accept-Language":"fr"===this.$store.state.lang?"fre":"eng"},s={_content_type:"json",from:1,to:9,type:"dataset+or+series+or+publications",resultType:this.$store.state.summaryType.step2},r=this.srv+"q?"+Object.keys(s).map((function(t){return t+"="+s[t]})).join("&");this.$http.get(r,{headers:a}).then((function(t){e.addGnParameters(t.body)})),this.first=!1}},addGnParameters:function(t){this.$store.commit("gnParametersChange",{step:2,dimension:t.summary.dimension})},mapToGeonetwork:function(t){if((t=Object.assign({},t)).fromOs=!0,t.productIdentifier&&t.renameProperty("productIdentifier","identifier"),t.startDate&&t.renameProperty("startDate","tempExtentBegin"),t.completionDate&&t.renameProperty("completionDate","tempExtentEnd"),t.updated&&t.renameProperty("updated","revisionDate"),t.published&&t.renameProperty("published","publicationDate"),t.produced&&t.renameProperty("produced","creationDate"),t.type||(t.type="dataset"),t.quicklook&&(t.images=[["",t.quicklook,""]],delete t.quicklook),t.license&&delete t.license,t.osParameters=[],t.mapping=[],t.services&&(t.services.browse&&t.services.browse.layers&&(t.layers=[],t.services.browse.layers.forEach((function(e,a){e.type;var s={id:t.id+"_"+a,name:e.name,description:e.name,href:e.url,type:e.type,checked:!1};t.layers.push(s)}))),t.services.download&&t.services.download.url&&(t.download||(t.download=[]),t.download.push(t.services.download)),delete t.services),t.exportLinks||(t.exportLinks={}),t.links){for(var e=t.links.length;e--;)"application/json"!==t.links[e].type||t.exportLinks.json||(t.exportLinks.json=t.links[e].href,t.links.splice(e,1)),"application/xml"!==t.links[e].type||t.exportLinks.xml||(t.exportLinks.xml=t.links[e].href,t.links.splice(e,1));delete t.links}if(!t.contacts&&(t.contacts={metadata:{},resource:{}},t.organisationName&&"string"==typeof t.organisationName)){var a=new Array(10);a[0]="Point of contact",a[2]=t.organisationName,t.contacts.metadata["Point of contact"]=[a],delete t.organisationName}return t.keywords&&(t.keyword=[],t.keywords.forEach((function(e){t.keyword.push(e.name)})),delete t.keywords),t},fill:function(t,e){t.depth=this.depth;var a=new CustomEvent("fmt:metadataListEvent",{detail:t});document.dispatchEvent(a)}}};var r=a(1900),n=a(5418);const i=a.n(n)();var o=(0,r.Z)(s,(function(){return(0,this._self._c)("div")}),[],!1,null,null,null);"function"==typeof i&&i(o);const m=o.exports},8526:(t,e,a)=>{"use strict";a.r(e),a.d(e,{default:()=>l});var s=a(3914),r=a(8108),n=a(5095),i=a(3188),o=a(1508);const m={name:"FormaterCatalogue",components:{FormaterDrawBbox:i.Z,FormaterForm:s.Z,FormaterListMetadata:r.default,FormaterMetadata:function(){return a.e(574).then(a.bind(a,2574))},FormaterPaging:n.default,FormaterRequester:o.default},data:function(){return{currentUuid:null,first:!0,sortBy:"",metaDisplayed:null,metadatas:[],metadataListener:null,drawing:!1,aerisSearchListener:null,aerisResetListener:null,backListener:null,temporalExtent:{min:"1900-01-01",max:"now"}}},watch:{$route:function(t,e){t.query.sortBy?this.sortBy=t.query.sortBy:this.sortBy=this.$store.state.orderBy}},created:function(){this.$store.state.metadata&&"FormaterLogin"!==this.$route.name?this.$router.replace({name:"Metadata",params:{uuid:this.$store.state.metadata}}):(this.$route.query.sortBy?this.sortBy=this.$route.query.sortBy:this.sortBy=this.$store.state.orderBy,this.initTemporalExtent(),this.keydownListener=this.checkEscape.bind(this),document.addEventListener("keydown",this.keydownListener))},mounted:function(){this.$store.state.metadata,this.$store.commit("services/resetCurrent"),this.$store.commit("parametersChange",{parameters:[],mapping:[],fixed:{},type:null})},destroyed:function(){document.removeEventListener("aerisSearchEvent",this.aerisSearchListener),this.aerisSearchListener=null,document.removeEventListener("aerisResetEvent",this.aerisResetListener),this.aerisResetListener=null},methods:{initTemporalExtent:function(){this.$store.state.temporalExtent&&this.$store.state.temporalExtent.min&&(this.temporalExtent.min=this.$store.state.temporalExtent.min),this.$store.temporalExtent&&this.$store.temporalExtent.max&&(this.temporalExtent.max=this.$store.temporalExtent.max)},closeSingle:function(){var t=new CustomEvent("fmt:closeMetadataEvent",{detail:{depth:2}});document.dispatchEvent(t),this.$store.commit("resetSelectedMetadata")},close:function(){this.$router.go(-1)},back:function(){this.$store.state.selectedMetadata?this.$store.commit("resetSelectedMetadata"):this.resetMetadata()},checkEscape:function(t){var e=t||window.event;(e.key?"Escape"===e.key||"Esc"===e.key:27===e.keyCode)&&this.$router.go(-1)},resetMetadata:function(){if(1!==this.metadatas.length||!this.metadatas[0].appRoot){if(this.metadatas.length>0&&this.metadatas.pop(),this.metadatas.length>0){var t=this.metadatas[this.metadatas.length-1];this.currentUuid=t.id;var e=t.disableType,a=t.osParameters,s=t.mapping,r=t.fixed,n=null,i=null;t.tempExtentBegin&&t.tempExtentBegin.substring&&(n=t.tempExtentBegin.substring(0,10)),t.tempExtentEnd&&t.tempExtentEnd.substring&&(i=t.tempExtentEnd.substring(0,10));var o={min:n||this.temporalExtent.min,max:i||this.temporalExtent.madivx};this.$store.commit("temporalChange",o)}else this.currentUuid=null,a=[],s=[],r={},e=null,this.$store.commit("services/resetCurrent"),this.$store.commit("temporalChange",this.temporalExtent);this.$store.commit("currentUuidChange",this.currentUuid),this.$store.commit("parametersChange",{parameters:a,mapping:s,fixed:r,type:e});var m=new CustomEvent("fmt:closeMetadataEvent",{detail:{depth:this.metadatas.length}});document.dispatchEvent(m)}},setParameters:function(t){t.depth&&(this.metadatas[t.depth-1].osParameters=t.osParameters,this.metadatas[t.depth-1].mapping=t.mapping,this.metadatas[t.depth-1].fixed=t.fixed,this.metadatas[t.depth-1].disableType=t.disableType),t.depth===this.metadatas.length&&this.$store.commit("parametersChange",{parameters:t.osParameters,mapping:t.mapping,fixed:t.fixed,type:t.type})},registerValues:function(t){t.depth&&this.metadatas[t.depth-1].osParameters.forEach((function(e){t.parameters[e.name]?e.value=t.parameters[e.name]:e.value=null}))},closeError:function(){this.$store.commit("removeError")}}};var d=a(1900),c=a(7778);const p=a.n(c)();var h=(0,d.Z)(m,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"mtdt-catalogue"},[e("div",[t._v(t._s(t.metaDisplayed))]),t._v(" "),e("formater-requester",{attrs:{depth:0}}),t._v(" "),e("formater-draw-bbox"),t._v(" "),e("div",[e("div",{staticClass:"mtdt-column-left"},[e("formater-form",{attrs:{disableLevel:0,depth:0}})],1),t._v(" "),e("div",{staticClass:"mtdt-column-right"},[e("div",{attrs:{id:"fmtLargeMap"}}),t._v(" "),t.$store.state.searching?e("div",{staticClass:"fmt-waiting"},[e("div",[t._v(t._s(t.$t("searching"))),e("br"),e("span",{staticClass:"fa fa-spinner animated"})])]):t._e(),t._v(" "),t.$store.state.error?e("div",{staticClass:"fmt-error"},[e("div",[e("span",{staticClass:"fa fa-close fmt-close",on:{click:t.closeError}}),t._v(t._s(t.$store.state.error))])]):t._e(),t._v(" "),t.$store.state.selectedMetadata?e("div",{staticClass:"mtdt-free-capsule"},[e("div",[e("formater-metadata",{attrs:{metadata:t.$store.state.selectedMetadata,depth:-1},on:{close:function(e){return t.closeSingle()}}})],1)]):t._e(),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:0===t.metadatas.length,expression:"metadatas.length === 0"}]},[e("formater-paging",{attrs:{depth:0,orders:["changeDate","popularity","title"],"order-by":t.sortBy}}),t._v(" "),e("formater-list-metadata",{attrs:{depth:0}})],1),t._v(" "),e("div",t._l(t.metadatas,(function(a,s){return e("formater-metadata",{directives:[{name:"show",rawName:"v-show",value:s===t.metadatas.length-1,expression:"index === metadatas.length-1"}],key:s,attrs:{depth:s+1,metadata:a},on:{parametersChange:t.setParameters,close:t.close}})})),1)])])],1)}),[],!1,null,null,null);"function"==typeof p&&p(h);const l=h.exports}}]);
//# sourceMappingURL=526.formater-metadata-vjs.js.map