(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{342:function(e,t,r){"use strict";r.r(t);var a={name:"FormaterOpensearch",props:{describe:{type:String,default:null},uuid:{type:String,default:null},depth:{type:Number,default:null}},created:function(){this.searchEventListener=this.handleSearch.bind(this),document.addEventListener("aerisSearchEvent",this.searchEventListener),this.load()},destroyed:function(){document.removeEventListener("aerisSearchEvent",this.searchEventListener),this.searchEventListener=null},data:function(){return{searchEventListener:null,api:null,mappingParameters:[],osParameters:[]}},methods:{load:function(){var e=this;this.$http.get(this.describe).then((function(t){e.extractDescribeParameters(t.body)})).catch((function(e,t,r){console.log("erreur requete PEPS")}))},extractParameter:function(e,t){var r=function(e,t){return Object.keys(e).find((function(r){return e[r]===t}))}(this.$store.state.parameters.predefined,t),a=e.getAttribute("name");if(void 0===r){var n={name:a,title:e.getAttribute("title")},i=e.getAttribute("pattern");i&&(n=Object.assign(n,{pattern:i}));var s=e.getAttribute("minInclusive");s&&(n=Object.assign(n,{min:s}));var u=e.getAttribute("maxInclusive");u&&(n=Object.assign(n,{max:u}));var c=e.getElementsByTagName("parameters:Options");if(c){for(var o=[],h=0;h<c.length;h++)o.push(c[h].getAttribute("value"));o.length>0&&(n=Object.assign(n,{options:o}))}(!n.options||n.options.length>1)&&this.osParameters.push(n)}else this.mappingParameters[r]=a},extractDescribeParameters:function(e){var t=null;if((new DOMParser).parseFromString(e,"text/xml").firstChild.childNodes.forEach((function(e){if(e.tagName&&"url"===e.tagName.toLowerCase()&&e.getAttribute("type").indexOf("json")>=0){var r=e.getAttribute("template").match(/^(.*(?:(?:search.json\?)|(?:\?format=FLATSIM))).*$/);r&&r[1]&&""!=r[1]&&(t=e)}})),t){var r=t.getAttribute("template").match(/^(.*(?:(?:search.json\?)|(?:\?format=FLATSIM))).*$/);if(r[1]){this.api=r[1];for(var a=t.getElementsByTagName("parameters:Parameter"),n=this.$store.state.parameters.excluedRegex,i=0;i<a.length;i++){var s=a[i].getAttribute("value");n.some((function(e){return new RegExp(e).test(s)}))||this.extractParameter(a[i],s)}this.$emit("parametersChange",{parameters:this.osParameters,mapping:this.mappingParameters})}}},handleSearch:function(e){this.api&&e.detail.parentUuid===this.uuid&&(e.detail.api=this.api)}}},n=r(1),i=Object(n.a)(a,(function(){var e=this.$createElement;return(this._self._c||e)("div")}),[],!1,null,null,null);t.default=i.exports}}]);
//# sourceMappingURL=7.formater-metadata-vjs.js.map