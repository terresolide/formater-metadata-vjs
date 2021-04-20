(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{382:function(e,t,r){"use strict";r.r(t);var s={name:"FormaterApiRequester",props:{api:{type:String,default:null},depth:{type:Number,default:1}},watch:{$route:function(e,t){this.getRecords(e)}},data:function(){return{headers:{Accept:"application/json, text/plain, */*","Accept-Language":"fr"===this.$store.state.lang?"fre,eng":"eng,fre"},first:!0,dimensions:[],parameters:{},closeMetadataListener:null,resetListener:null,facet:[],type:"opensearch",credentials:{}}},created:function(){this.getRecords(this.$route)},destroyed:function(){},mounted:function(){},methods:{initParameters:function(){this.parameters={index:1,maxRecords:this.$store.state.size.nbRecord}},getRecords:function(e){this.$store.commit("searchingChange",!0),this.prepareRequest(e),this.requestApi(event)},prepareRequest:function(e){this.initParameters(),this.parameters=Object.assign(this.parameters,e.query),this.mapParameters()},mapParameters:function(){var e=this.$store.state.parameters.others,t=this.$store.state.parameters.mapping;for(var r in this.parameters.renameProperty("bbox",t.box),this.parameters.from&&(this.parameters[t.index]=this.parameters.from,this.parameters.to&&(this.parameters[t.maxRecords]=this.parameters.to-this.parameters.from+1)),this.parameters)void 0!==t[r]?this.parameters.renameProperty(r,t[r]):e.find((function(e){if(e.name===r)return!0}))||delete this.parameters[r]},requestApi:function(e){var t=this;if(this.api){var r=this,s=this.api+(this.api.indexOf("?")>0?"&":"?");s+=Object.keys(this.parameters).map((function(e){return e+"="+r.parameters[e]})).join("&"),this.$emit("registerValues",{depth:e,parameters:this.parameters}),this.$http.get(s).then((function(r){t.treatmentGeojson(r.body,e)}),(function(e){t.treatmentError(e,s)}))}else this.$store.commit("searchingChange",!1)},treatmentError:function(e,t){switch(e.status){case 0:this.$store.commit("setError","Maybe CORS ERROR, try with proxy");break;case 403:this.$store.commit("setError","SERVER RESPONSE FOR "+t+" : ACCESS DENIED");break;case 404:this.$store.commit("setError","SERVER RESPONSE FOR "+t+" : PAGE NOT FOUND");break;default:this.$store.commit("setError","UNKNOWN ERROR FOR "+t)}this.$store.commit("searchingChange",!1)},treatmentGeojson:function(e,t){var r={},s=this,a=[];e.features.forEach((function(e){e.properties.id=e.id,r[e.id]=s.mapToGeonetwork(e.properties),a.push({type:e.type,id:e.id,geometry:e.geometry})})),0===e.features.length&&(r={}),e.properties?e.properties:e.description,this.fill({type:"opensearch",properties:e.properties,features:a,metadata:r},t),this.$store.commit("searchingChange",!1)},mapToGeonetwork:function(e){if((e=Object.assign({},e)).fromOs=!0,e.productIdentifier&&e.renameProperty("productIdentifier","identifier"),e.startDate&&e.renameProperty("startDate","tempExtentBegin"),e.completionDate&&e.renameProperty("completionDate","tempExtentEnd"),e.updated&&e.renameProperty("updated","revisionDate"),e.published&&e.renameProperty("published","publicationDate"),e.produced&&e.renameProperty("produced","creationDate"),e.type||(e.type="dataset"),e.quicklook&&(e.images=[["",e.quicklook,""]],delete e.quicklook),e.license&&(e.legalConstraints=[e.license.licenseId],delete e.license),e.osParameters=[],e.mapping=[],e.services&&(e.services.browse&&e.services.browse.layers&&(e.layers=[],e.services.browse.layers.forEach((function(t,r){t.type;var s={id:e.id+"_"+r,name:t.name,description:t.name,href:t.url,type:t.type,checked:!1};e.layers.push(s)}))),e.services.download&&e.services.download.url&&(e.download||(e.download=[]),e.download.push(e.services.download)),delete e.services),e.exportLinks||(e.exportLinks={}),e.links){for(var t=e.links.length;t--;)"application/json"!==e.links[t].type||e.exportLinks.json||(e.exportLinks.json=e.links[t].href,e.links.splice(t,1)),"application/xml"!==e.links[t].type||e.exportLinks.xml||(e.exportLinks.xml=e.links[t].href,e.links.splice(t,1));delete e.links}if(!e.contacts&&(e.contacts={metadata:{},resource:{}},e.organisationName&&"string"==typeof e.organisationName)){var r=new Array(10);r[0]="Point of contact",r[2]=e.organisationName,e.contacts.metadata["Point of contact"]=[r],delete e.organisationName}return e.keywords&&(e.keyword=[],e.keywords.forEach((function(t){e.keyword.push(t.name)})),delete e.keywords),e},fill:function(e,t){e.depth=this.depth;var r=new CustomEvent("fmt:metadataListEvent",{detail:e});document.dispatchEvent(r)}}},a=r(1),i={name:"FormaterOpensearch",components:{FormaterApiRequester:Object(a.a)(s,(function(){var e=this.$createElement;return(this._self._c||e)("div")}),[],!1,null,null,null).exports},props:{describe:{type:String,default:null},uuid:{type:String,default:null},depth:{type:Number,default:null},service:{type:Object,default:null}},watch:{service:function(e){e.domain.indexOf("flatsim")>=0&&(this.osParameters=this.osParameters.filter((function(e){return"processingLevel"!==e.name})),this.$emit("parametersChange",{api:this.api,parameters:this.osParameters,mapping:this.mappingParameters}))}},created:function(){this.load()},mounted:function(){},destroyed:function(){},data:function(){return{api:null,mappingParameters:[],osParameters:[]}},methods:{load:function(){var e=this;this.$http.get(this.describe).then((function(t){e.extractDescribeParameters(t.body)}),(function(t){if(403===t.status||401===t.status||400===t.status)return console.log("CAN NOT GET "+e.describe),void e.$emit("failed");e.loadWithProxy()}))},loadWithProxy:function(){var e=this;if(this.$store.state.proxy.url){var t=this.$store.state.proxy.url+"?url="+encodeURIComponent(this.describe);this.$http.get(t).then((function(t){e.extractDescribeParameters(t.body)}),(function(t){e.$emit("failed")}))}else console.log("CAN NOT GET "+this.describe),this.$emit("failed")},extractParameter:function(e,t){var r=function(e,t){return Object.keys(e).find((function(r){return e[r]===t}))}(this.$store.state.parameters.predefined,t),s=e.getAttribute("name");if(void 0===r){var a={name:s,title:e.getAttribute("title")};switch(s){case"processingLevel":if(this.service&&this.service.domain.indexOf("flatsim")>=0)return}var i=e.getAttribute("pattern");i&&(a=Object.assign(a,{pattern:i}));var n=e.getAttribute("minInclusive");n&&(a=Object.assign(a,{min:n}));var o=e.getAttribute("maxInclusive");o&&(a=Object.assign(a,{max:o}));var p=e.getElementsByTagName("parameters:Options");if(p){for(var c=[],m=0;m<p.length;m++)c.push(p[m].getAttribute("value"));c.length>0&&(a=Object.assign(a,{options:c}))}(!a.options||a.options.length>1)&&this.osParameters.push(a)}else this.mappingParameters[r]=s},extractDescribeParameters:function(e){var t=null;if((new DOMParser).parseFromString(e,"text/xml").firstChild.childNodes.forEach((function(e){if(e.tagName&&"url"===e.tagName.toLowerCase()&&e.getAttribute("type").indexOf("json")>=0){var r=e.getAttribute("template").match(/^(.*(?:(?:search.json\?)|(?:\?format=FLATSIM))).*$/);r&&r[1]&&""!=r[1]&&(t=e)}})),t){var r=t.getAttribute("template").match(/^(.*(?:(?:search.json\?)|(?:\?format=FLATSIM))).*$/);if(r[1]){this.api=r[1];for(var s=t.getElementsByTagName("parameters:Parameter"),a=this.$store.state.parameters.excluedRegex,i=0;i<s.length;i++){var n=s[i].getAttribute("value");a.some((function(e){return new RegExp(e).test(n)}))||this.extractParameter(s[i],n)}this.$emit("parametersChange",{api:this.api,parameters:this.osParameters,mapping:this.mappingParameters})}}}}},n=Object(a.a)(i,(function(){var e=this.$createElement,t=this._self._c||e;return this.api?t("formater-api-requester",{attrs:{api:this.api,depth:this.depth}}):this._e()}),[],!1,null,null,null);t.default=n.exports}}]);
//# sourceMappingURL=11.formater-metadata-vjs.js.map