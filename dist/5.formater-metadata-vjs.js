(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{332:function(e,t,a){"use strict";a.r(t);var r={name:"FormaterOpensearch",props:{describe:{type:String,default:null},uuid:{type:String,default:null},depth:{type:Number,default:null}},created:function(){this.searchEventListener=this.handleSearch.bind(this),document.addEventListener("aerisSearchEvent",this.searchEventListener),this.load()},destroyed:function(){document.removeEventListener("aerisSearchEvent",this.searchEventListener),this.searchEventListener=null},data:function(){return{searchEventListener:null,api:null,mappingParameters:[],osParameters:[]}},methods:{load:function(){var e=this;this.$http.get(this.describe).then(function(t){e.extractDescribeParameters(t.body)})},extractParameter:function(e,t){var a=function(e,t){return Object.keys(e).find(function(a){return e[a]===t})}(this.$store.state.parameters.predefined,t),r=e.getAttribute("name");if(void 0===a){var n={name:r,title:e.getAttribute("title")},i=e.getAttribute("pattern");i&&(n=Object.assign(n,{pattern:i}));var s=e.getAttribute("minInclusive");s&&(n=Object.assign(n,{min:s}));var u=e.getAttribute("maxInclusive");u&&(n=Object.assign(n,{max:u}));var c=e.getElementsByTagName("parameters:Options");if(c){for(var h=[],o=0;o<c.length;o++)h.push(c[o].getAttribute("value"));h.length>0&&(n=Object.assign(n,{options:h}))}(!n.options||n.options.length>1)&&this.osParameters.push(n)}else this.mappingParameters[a]=r},extractDescribeParameters:function(e){var t=null;if((new DOMParser).parseFromString(e,"text/xml").firstChild.childNodes.forEach(function(e){if(e.tagName&&"url"===e.tagName.toLowerCase()&&e.getAttribute("type").indexOf("json")>=0){var a=e.getAttribute("template").match(/^(.*(?:(?:search.json\?)|(?:\?format=FLATSIM))).*$/);a&&a[1]&&""!=a[1]&&(t=e)}}),t){var a=t.getAttribute("template").match(/^(.*(?:(?:search.json\?)|(?:\?format=FLATSIM))).*$/);if(a[1]){this.api=a[1];for(var r=t.getElementsByTagName("parameters:Parameter"),n=this.$store.state.parameters.excluedRegex,i=0;i<r.length;i++){var s=r[i].getAttribute("value");n.some(function(e){return new RegExp(e).test(s)})||this.extractParameter(r[i],s)}this.$emit("parametersChange",{parameters:this.osParameters,mapping:this.mappingParameters})}}},handleSearch:function(e){this.api&&e.detail.parentUuid===this.uuid&&(e.detail.api=this.api)}}},n=a(1),i=Object(n.a)(r,function(){var e=this.$createElement;return(this._self._c||e)("div")},[],!1,null,null,null);t.default=i.exports}}]);
//# sourceMappingURL=5.formater-metadata-vjs.js.map