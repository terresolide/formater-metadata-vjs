"use strict";(self.webpackChunkformater_metadata_vjs=self.webpackChunkformater_metadata_vjs||[]).push([[612],{9612:(e,t,r)=>{r.r(t),r.d(t,{default:()=>n});const s={name:"FormaterApiRequester",props:{api:{type:String,default:null},cds:{type:String,default:null},depth:{type:Number,default:1}},watch:{$route:function(e,t){this.getRecords(e)}},computed:{isFlatsim:function(){return this.api.indexOf("flatsim")>0}},data:function(){return{headers:{Accept:"application/json, text/plain, */*","Accept-Language":"fr"===this.$store.state.lang?"fre,eng":"eng,fre"},first:!0,dimensions:[],parameters:{},closeMetadataListener:null,resetListener:null,facet:[],type:"opensearch",credentials:{}}},created:function(){this.getRecords(this.$route)},destroyed:function(){},mounted:function(){},methods:{initParameters:function(){this.parameters={index:1,maxRecords:this.$store.state.size.nbRecord},this.$store.state.group&&console.log("group")},getRecords:function(e){this.$store.commit("searchingChange",!0),this.prepareRequest(e),this.requestApi(event)},prepareRequest:function(e){this.initParameters(),this.parameters=Object.assign(this.parameters,e.query),this.mapParameters()},mapParameters:function(){var e=this.$store.state.parameters.others,t=this.$store.state.parameters.mapping;for(var r in this.parameters.renameProperty("bbox",t.box),this.parameters.from&&(this.parameters[t.index]=this.parameters.from,this.parameters.to&&(this.parameters[t.maxRecords]=this.parameters.to-this.parameters.from+1)),this.parameters)void 0!==t[r]?this.parameters.renameProperty(r,t[r]):e.find((function(e){if(e.name===r)return!0}))||delete this.parameters[r]},requestApi:function(e){var t=this;if(this.api){var r=this,s=this.api+(this.api.indexOf("?")>0?"&":"?");s+=Object.keys(this.parameters).map((function(e){return e+"="+r.parameters[e]})).join("&"),this.$emit("registerValues",{depth:e,parameters:this.parameters}),this.$http.get(s).then((function(r){t.treatmentGeojson(r.body,e)}),(function(e){t.treatmentError(e,s)}))}else this.$store.commit("searchingChange",!1)},treatmentError:function(e,t){switch(e.status){case 0:this.$store.commit("setError","Maybe CORS ERROR, try with proxy");break;case 403:this.$store.commit("setError","SERVER RESPONSE FOR "+t+" : ACCESS DENIED");break;case 404:this.$store.commit("setError","SERVER RESPONSE FOR "+t+" : PAGE NOT FOUND");break;default:this.$store.commit("setError","UNKNOWN ERROR FOR "+t)}this.$store.commit("searchingChange",!1)},treatmentGeojson:function(e,t){var r={},s=this,a=[];e.features.forEach((function(e){e.id||(e.id=e.properties.productIdentifier),e.properties.id=e.id,r[e.id]=s.mapToGeonetwork(e.properties),a.push({type:e.type,id:e.id,geometry:e.geometry})})),0===e.features.length&&(r={}),e.properties?e.properties:e.description,this.fill({type:"opensearch",properties:e.properties,features:a,metadata:r},t),this.$store.commit("searchingChange",!1)},mapToGeonetwork:function(e){if((e=Object.assign({},e)).fromOs=!0,e.cds=this.cds,e.productIdentifier&&e.renameProperty("productIdentifier","identifier"),e.startDate&&e.renameProperty("startDate","tempExtentBegin"),e.completionDate&&e.renameProperty("completionDate","tempExtentEnd"),e.updated&&e.renameProperty("updated","revisionDate"),e.published&&e.renameProperty("published","publicationDate"),e.produced&&e.renameProperty("produced","creationDate"),e.type||(e.type="dataset"),e.quicklook&&(e.images=[["",e.quicklook,""]],delete e.quicklook),e.license&&("unlicensed"===e.license.licenseId&&this.isFlatsim?e.legalConstraints=["license: https://creativecommons.org/licenses/by-nc/4.0/"]:e.legalConstraints=[e.license.licenseId],delete e.license),e.osParameters=[],e.mapping=[],e.services&&(e.services.browse&&e.services.browse.layers&&(e.layers=[],e.services.browse.layers.forEach((function(t,r){t.type;var s={id:e.id+"_"+r,name:t.name,description:t.name,href:t.url,type:t.type,checked:!1};e.layers.push(s)}))),e.services.download&&e.services.download.url&&(e.download||(e.download=[]),e.download.push(e.services.download)),delete e.services),e.exportLinks||(e.exportLinks={}),e.links){for(var t=e.links.length;t--;)"application/json"!==e.links[t].type||e.exportLinks.json||(e.exportLinks.json=e.links[t].href,e.links.splice(t,1)),"application/xml"!==e.links[t].type||e.exportLinks.xml||(e.exportLinks.xml=e.links[t].href,e.links.splice(t,1));delete e.links}if(!e.contacts&&(e.contacts={metadata:{},resource:{}},e.organisationName&&"string"==typeof e.organisationName)){var r=new Array(10);r[0]="Point of contact",r[2]=e.organisationName,e.contacts.metadata["Point of contact"]=[r],delete e.organisationName}return e.keywords&&(e.keyword=[],e.keywords.forEach((function(t){e.keyword.push(t.name)})),delete e.keywords),e},fill:function(e,t){e.depth=this.depth,console.log(e);var r=new CustomEvent("fmt:metadataListEvent",{detail:e});document.dispatchEvent(r)}}};var a=r(1900);const i={name:"FormaterOpensearch",components:{FormaterApiRequester:(0,a.Z)(s,(function(){return(0,this._self._c)("div")}),[],!1,null,null,null).exports},props:{describe:{type:String,default:null},cds:{type:String,default:null},uuid:{type:String,default:null},depth:{type:Number,default:null},service:{type:Object,default:null}},watch:{service:function(e){e.domain.indexOf("flatsim")>=0&&(this.osParameters=this.osParameters.filter((function(e){return"processingLevel"!==e.name})),this.$emit("parametersChange",{api:this.api,parameters:this.osParameters,mapping:this.mappingParameters}))}},created:function(){this.load()},mounted:function(){},destroyed:function(){},data:function(){return{api:null,paramNS:"parameters",mappingParameters:[],osParameters:[]}},methods:{load:function(){var e=this;this.$http.get(this.describe).then((function(t){e.extractDescribeParameters(t.body)}),(function(t){if(403===t.status||401===t.status||400===t.status)return console.log("CAN NOT GET "+e.describe),void e.$emit("failed");e.loadWithProxy()}))},loadWithProxy:function(){var e=this;if(this.$store.state.proxy.url){var t=this.$store.state.proxy.url+"?url="+encodeURIComponent(this.describe);this.$http.get(t).then((function(t){e.extractDescribeParameters(t.body)}),(function(t){e.$emit("failed")}))}else console.log("CAN NOT GET "+this.describe),this.$emit("failed")},extractParameter:function(e,t){var r,s,a=this.$store.getters.predefinedParams,i=(r=a,s=t,Object.keys(r).find((function(e){return r[e]===s}))),n=e.getAttribute("name");if(void 0===i){var o={name:n,title:e.getAttribute("title")};if("processingLevel"===n&&this.service&&this.service.domain.indexOf("flatsim")>=0)return;var p=e.getAttribute("pattern");p&&(o=Object.assign(o,{pattern:p}));var c=e.getAttribute("minInclusive");c&&(o=Object.assign(o,{min:c}));var m=e.getAttribute("maxInclusive");m&&(o=Object.assign(o,{max:m}));var l=e.getElementsByTagName(this.paramNS+":Options");if(l){for(var u=[],d=0;d<l.length;d++)u.push(l[d].getAttribute("value"));u.length>0&&(o=Object.assign(o,{options:u}))}(!o.options||o.options.length>1)&&this.osParameters.push(o)}else this.mappingParameters[i]=n},extractNamespaces:function(e){for(var t={},r=0;r<e.length;r++)if(e[r].value.indexOf("parameters")>0){var s=e[r].name.split(":");this.paramNS=s[1]}else e[r].value.indexOf("time")>0?(s=e[r].name.split(":"),t.time=s[1]):e[r].value.indexOf("geo")>0&&(s=e[r].name.split(":"),t.geo=s[1]);this.$store.commit("setNamespaces",t)},extractDescribeParameters:function(e){var t=(new DOMParser).parseFromString(e,"text/xml");this.extractNamespaces(t.firstElementChild.attributes);var r=t.firstElementChild.childNodes,s=null;if(r.forEach((function(e){if(e.tagName&&"url"===e.tagName.toLowerCase()&&e.getAttribute("type").indexOf("json")>=0){var t=e.getAttribute("template").match(/^([^?]*(?:\?)).*$/i);t&&t[1]&&""!=t[1]&&(s=e)}})),s){var a=s.getAttribute("template").match(/^([^?]*(?:\?)).*$/i);if(a[1]){this.api=a[1];for(var i=s.getElementsByTagName(this.paramNS+":Parameter"),n=this.$store.state.parameters.excluedRegex,o=0;o<i.length;o++){var p=i[o].getAttribute("value");n.some((function(e){return new RegExp(e).test(p)}))||this.extractParameter(i[o],p)}this.$emit("parametersChange",{api:this.api,parameters:this.osParameters,mapping:this.mappingParameters})}}}}},n=(0,a.Z)(i,(function(){var e=this,t=e._self._c;return e.api?t("formater-api-requester",{attrs:{api:e.api,cds:e.cds,depth:e.depth}}):e._e()}),[],!1,null,null,null).exports}}]);
//# sourceMappingURL=612.formater-metadata-vjs.js.map