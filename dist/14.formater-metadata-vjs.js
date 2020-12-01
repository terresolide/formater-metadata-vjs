(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{289:function(e,t,r){"use strict";r.r(t);var a={name:"FormaterRequester",props:{depth:{type:Number,default:0}},watch:{$route:function(e,t){this.getRecords(e)}},data:function(){return{srv:null,api:null,headers:{Accept:"application/json, text/plain, */*","Accept-Language":"fr"===this.$store.state.lang?"fre,eng":"eng,fre"},first:!0,dimensions:[],parameters:{},changePageListener:null,temporalChangedListener:null,spatialChangedListener:null,dimensionChangedListener:null,textChangedListener:null,selectChangedListener:null,closeMetadataListener:null,resetListener:null,facet:[],type:"geonetwork",credentials:{}}},created:function(){this.$store.state.geonetwork&&(this.srv=this.$store.state.geonetwork+"srv/"+("fr"===this.$i18n.locale?"fre":"eng")+"/"),this.getRecords(this.$route)},destroyed:function(){},mounted:function(){},methods:{initParameters:function(){this.parameters={_content_type:"json",fast:"index",bucket:"s101",from:1,to:this.$store.state.size.nbRecord,sortBy:this.$store.state.orderBy,sortOrder:"ordering",type:"dataset+or+series+or+publication"}},getRecords:function(e){this.$store.commit("searchingChange",!0),this.type="geonetwork",this.prepareRequest(e),this.requestApi(e)},createGeometry:function(e){var t=e.split(","),r=t[3],a=t[1],s=t[2],n=t[0],i="POLYGON(("+n+"+"+r+",";return i+=s+"+"+r+",",i+=s+"+"+a+",",(i+=n+"+"+a+",")+(n+"+")+r+"))"},prepareRequest:function(e){this.initParameters(),"Metadata"===e.name?(this.parameters.resultType=this.$store.state.summaryType.step2,this.parameters.parentUuid=e.params.uuid):(this.parameters.isChild=!1,this.parameters.resultType=this.$store.state.summaryType.step1)},searchSimpleMetadata:function(){var e=this;this.$http.get(this.$store.state.metadata).then((function(t){var r=t.body,a=r["geonet:info"].uuid,s=e.$gn.treatmentMetadata(r,a);s.appRoot=!0;var n=new CustomEvent("fmt:metadataEvent",{detail:{meta:s,depth:0}});document.dispatchEvent(n)}))},requestApi:function(e){var t=this;if(this.srv){var r={Accept:"application/json, text/plain, */*","Accept-Language":"fr"===this.$store.state.lang?"fre":"eng"};this.parameters=Object.assign(this.parameters,e.query),this.parameters.renameProperty("start","extFrom"),this.parameters.renameProperty("end","extTo"),this.parameters.box&&(this.parameters.geometry=this.createGeometry(this.parameters.box),delete this.parameters.box);var a=this;"FormaterCatalogue"===e.name&&this.$store.state.gnParameters.step2.forEach((function(e){delete a.parameters[e]})),"Metadata"===e.name&&this.$store.state.gnParameters.step1.forEach((function(e){delete a.parameters[e]})),["index","maxRecords","page"].forEach((function(e){delete a.parameters[e]})),"title"===this.parameters.sortBy?this.parameters.sortOrder="ordering":delete this.parameters.sortOrder;var s=this.srv+"q?"+Object.keys(this.parameters).map((function(e){return e+"="+a.parameters[e]})).join("&");this.$http.get(s,{headers:r}).then((function(e){t.treatmentGeonetwork(e.body,0)}),(function(e){t.treatmentError(e,s)}))}},treatmentError:function(e,t){switch(e.status){case 0:this.$store.commit("setError","Maybe CORS ERROR, try with proxy");break;case 403:this.$store.commit("setError","SERVER RESPONSE FOR "+t+" : ACCESS DENIED");break;case 404:this.$store.commit("setError","SERVER RESPONSE FOR "+t+" : PAGE NOT FOUND");break;default:this.$store.commit("setError","UNKNOWN ERROR FOR "+t)}this.$store.commit("searchingChange",!1)},treatmentGeojson:function(e,t){var r={},a=this,s=[];e.features.forEach((function(e){e.properties.id=e.id,r[e.id]=a.mapToGeonetwork(e.properties),s.push({type:e.type,id:e.id,geometry:e.geometry})})),0===e.features.length&&(r={}),e.properties?e.properties:e.description,this.fill({type:"opensearch",properties:e.properties,features:s,metadata:r},t),this.$store.commit("searchingChange",!1)},treatmentGeonetwork:function(e,t){var r={};this.treatmentDimension(e.summary.dimension);var a=[],s=this;if(e.metadata)if(e.metadata&&!e.metadata.forEach){var n=e.metadata["geonet:info"].uuid;r[n]=s.$gn.treatmentMetadata(e.metadata,n);var i=s.$gn.extractBbox(e.metadata.geoBox,n);i&&a.push(i)}else e.metadata.forEach((function(e,t){var n=e["geonet:info"].uuid;r[n]=s.$gn.treatmentMetadata(e,n);var i=s.$gn.extractBbox(e.geoBox,n);i&&a.push(i)}));else r=null;e.metadata=r,e.type="geonetwork",e.features=a,this.fill(e,t),this.$store.commit("searchingChange",!1),this.searchGnStep2Parameters(e.summary.dimension)},treatmentDimension:function(e){if(1===this.$store.state.group.length){e?Array.isArray(e)||(e=[e]):e=[];var t=e.findIndex((function(e){return"groupOwner"===e["@name"]}));t>=0&&e.splice(t,1)}},searchGnStep2Parameters:function(e){var t=this;if(this.first&&(0===this.depth&&this.$store.commit("gnParametersChange",{step:1,dimension:e}),this.$store.state.summaryType.step1!==this.$store.state.summaryType.step2)){var r={Accept:"application/json, text/plain, */*","Accept-Language":"fr"===this.$i18n.locale?"fre":"eng"},a={_content_type:"json",from:1,to:9,type:"dataset+or+series+or+publications",resultType:this.$store.state.summaryType.step2},s=this.srv+"q?"+Object.keys(a).map((function(e){return e+"="+a[e]})).join("&");this.$http.get(s,{headers:r}).then((function(e){t.addGnParameters(e.body)})),this.first=!1}},addGnParameters:function(e){this.$store.commit("gnParametersChange",{step:2,dimension:e.summary.dimension})},mapToGeonetwork:function(e){if((e=Object.assign({},e)).fromOs=!0,e.productIdentifier&&e.renameProperty("productIdentifier","identifier"),e.startDate&&e.renameProperty("startDate","tempExtentBegin"),e.completionDate&&e.renameProperty("completionDate","tempExtentEnd"),e.updated&&e.renameProperty("updated","revisionDate"),e.published&&e.renameProperty("published","publicationDate"),e.produced&&e.renameProperty("produced","creationDate"),e.type||(e.type="dataset"),e.quicklook&&(e.images=[["",e.quicklook,""]],delete e.quicklook),e.license&&(e.legalConstraints=[e.license.licenseId],delete e.license),e.osParameters=[],e.mapping=[],e.services&&(e.services.browse&&e.services.browse.layers&&(e.layers=[],e.services.browse.layers.forEach((function(t,r){t.type;var a={id:e.id+"_"+r,name:t.name,description:t.name,href:t.url,type:t.type,checked:!1};e.layers.push(a)}))),e.services.download&&e.services.download.url&&(e.download||(e.download=[]),e.download.push(e.services.download)),delete e.services),e.exportLinks||(e.exportLinks={}),e.links){for(var t=e.links.length;t--;)"application/json"!==e.links[t].type||e.exportLinks.json||(e.exportLinks.json=e.links[t].href,e.links.splice(t,1)),"application/xml"!==e.links[t].type||e.exportLinks.xml||(e.exportLinks.xml=e.links[t].href,e.links.splice(t,1));delete e.links}if(!e.contacts&&(e.contacts={metadata:{},resource:{}},e.organisationName&&"string"==typeof e.organisationName)){var r=new Array(10);r[0]="Point of contact",r[2]=e.organisationName,e.contacts.metadata["Point of contact"]=[r],delete e.organisationName}return e.keywords&&(e.keyword=[],e.keywords.forEach((function(t){e.keyword.push(t.name)})),delete e.keywords),e},fill:function(e,t){e.depth=this.depth;var r=new CustomEvent("fmt:metadataListEvent",{detail:e});document.dispatchEvent(r)}}},s=r(1),n=Object(s.a)(a,(function(){var e=this.$createElement;return(this._self._c||e)("div")}),[],!1,null,null,null);t.default=n.exports}}]);
//# sourceMappingURL=14.formater-metadata-vjs.js.map