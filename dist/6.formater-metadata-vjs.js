(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{285:function(t,e,a){var n=a(382);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals),(0,a(3).default)("6f6dbc2a",n,!0,{})},381:function(t,e,a){"use strict";var n=a(285);a.n(n).a},382:function(t,e,a){(t.exports=a(2)(!1)).push([t.i,"\n.meta-child {\n  margin-left:0px;\n  padding-left:25px;\n  border-left: 1px dotted grey;\n}\n.element-metadata .element-content {\n  display:none;\n}\n.element-metadata .element-content.expand {\n  display:block;\n}\n",""])},383:function(t,e,a){"use strict";a.r(e);var n={name:"ElementMetadata",components:{ElementMetadata:function(){return Promise.resolve().then(a.bind(null,383))}},props:{name:{type:String,default:"gmd:Metadata"},metadata:{type:Object|Array,default:null},depth:{type:Number,default:0}},computed:{},data:function(){return{attr:{},text:null,childs:{},list:[],expand:!0}},created:function(){if(this.metadata)for(var t in this.expand=!(this.depth>0),this.metadata)"string"==typeof t&&("#text"===t?this.text=this.metadata[t]:"@"===t.substring(0,1)?"@xmlns"!==t.substring(0,6)&&"@xsi"!==t.substring(0,4)&&(this.attr[t.substring(1)]=this.metadata[t]):this.childs[t]=this.metadata[t])},methods:{initMeta:function(t){for(var e in t)"string"==typeof e?"#text"===e?this.text=t[e]:"@"===e.substring(0,1)?"@xmlns"!==e.substring(0,6)&&this.$set(this.attr,e.substring(1),t[e]):this.childs[e]=t[e]:this.list.push(mewmeta[e])}}},s=(a(381),a(1)),l=Object(s.a)(n,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.metadata&&Object.keys(t.metadata).length>0?a("span",{staticClass:"element-metadata",staticStyle:{color:"#154360"}},[a("span",{staticStyle:{cursor:"pointer","margin-left":"-10px"},on:{click:function(e){t.expand=!t.expand}}},[t._v(t._s(t.expand?"-":"+"))]),t._v("\n  <"+t._s(t.name)),t._l(t.attr,(function(e,n){return a("span",{staticStyle:{color:"#333"}},[t._v(" "+t._s(n)+"="),a("span",{staticStyle:{color:"darkgreen"}},[t._v('"'+t._s(e)+'"')])])})),t._v(" >\n  "),t.expand&&(t.text||Object.keys(t.metadata).length>0)?a("div",{staticClass:"element-content",class:{expand:t.expand}},[a("div",{staticClass:"meta-child",staticStyle:{color:"#333"}},[t._v(" "+t._s(t.text))]),t._v(" "),t._l(t.metadata,(function(e,n){return e&&"object"==typeof e?a("div",{staticClass:"meta-child"},[a("element-metadata","string"==typeof n?{attrs:{metadata:e,name:n,depth:t.depth+1}}:{attrs:{metadata:Object.values(e)[0],name:Object.keys(e)[0],depth:t.depth+1}})],1):t._e()}))],2):t._e(),t._v(" "),t.expand?a("span",[t._v("</"+t._s(t.name)+">")]):t._e()],2):t._e()}),[],!1,null,null,null);e.default=l.exports},392:function(t,e,a){"use strict";a.r(e);var n={name:"FormaterFullMetadata",components:{ElementMetadata:a(383).default},props:{uuid:{type:String,default:null},metadata:{type:Object,default:null}},data:function(){return{}},created:function(){},methods:{}},s=a(1),l=Object(s.a)(n,(function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"fmt-full-metadata"},[e("element-metadata",{attrs:{metadata:this.metadata}})],1)}),[],!1,null,null,null);e.default=l.exports}}]);
//# sourceMappingURL=6.formater-metadata-vjs.js.map