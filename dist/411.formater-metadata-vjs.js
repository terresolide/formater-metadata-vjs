(self.webpackChunkformater_metadata_vjs=self.webpackChunkformater_metadata_vjs||[]).push([[411],{7289:e=>{e.exports=function(e){e.options.__i18n=e.options.__i18n||[],e.options.__i18n.push('{"en":{"access_token":"Acess token","all_access":"All access","copied_to_clipboard":"The token &laquo;{client}&raquo; has been copied in clipboard.","copy_in_clipboard":"Copy the access token in clipboard","select_all":"Select all","WAITING":"Waiting for treatment","REJECTED":"Rejected","ACCEPTED":"Accepted"},"fr":{"access_token":"token d\'accès","all_access":"Tout accès","copied_to_clipboard":"Le token &laquo;{client}&raquo; a été copié dans le presse-papier.","copy_in_clipboard":"Copier le token d\'accès dans le presse-papier","select_all":"Tout sélectionner","WAITING":"En attente de traitement","REJECTED":"Refusé","ACCEPTED":"Accepté"}}'),delete e.options._Ctor}},5519:(e,t,n)=>{(t=n(3645)(!1)).push([e.id,"\ndiv.title-client::before {\n  content: ' + ';\n}\ndiv.deployed div.title-client::before {\n  content: ' - ';\n}\ndiv.client-content {\n display:none;\n}\ndiv.deployed + div.client-content {\n  display:block;\n}\ndiv.role-line {\n  display: grid;\n  grid-template-columns: minmax(100px,180px) 50px minmax(50px, 120px) minmax(50px, 120px) minmax(50px, 120px);\n  grid-gap: 5px;\n  text-align:center;\n}\ndiv.client-content div.role-line:nth-child(2n + 1) {\n  background: #f3f3f3;\n}\ndiv.role-line > div {\n}\ndiv.role-line > div:first-child {\n  min-width: 100px;\n  max-width: 180px;\n  text-align: right;\n}\n.clipboard-tooltip {\n  position: absolute;\n  display:none;\n  background-color: #fafafa;\n  border: 1px solid #a3a3a3;\n  font-size: smaller;\n  line-height:1;\n  text-align:left;\n  padding: 5px;\n  cursor: pointer;\n  width: 150px;\n  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);\n  z-index:1;\n}\n.copy-clipboard {\n  position: relative;\n}\nspan div.clipboard-tooltip  {\n  display:none;\n  cursor: pointer;\n  font-size:0.8rem;\n  left:0;\n}\n.tooltip-show + div.clipboard-tooltip {\n  display:block;\n}\n",""]),e.exports=t},2411:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>o});const s={name:"FormaterClient",components:{FormaterTooltip:function(){return n.e(494).then(n.bind(n,494))}},props:{name:{type:String,default:null},client:{type:Object,default:null},checkedRoles:{type:Array,default:function(){return[]}}},computed:{canAskClient:function(){var e=!1,t=!1;if(this.client.groups)for(var n in this.client.groups)this.client.groups[n][0].access||this.client.groups[n][0].status||(e=!0),this.client.groups[n][1].access||this.client.groups[n][1].status||(t=!0);return{view:e,download:t}},lang:function(){return this.$store.state.lang},show:function(){return this.$store.getters["user/show"]}},data:function(){return{selectedClients:[]}},created:function(){},methods:{title:function(e,t){if(e.title){if(e.title[this.lang]&&"en"!==this.lang)return e.title[this.lang];if(e.title.en)return e.title.en}return t||e.name},description:function(e){return e.description&&e.description[this.lang]?e.description[this.lang]:e.description?e.description[Object.keys(e.description)[0]]:null},copyClipboard:function(e){var t=this,n=e.target;navigator.clipboard.writeText(this.client.token).then((function(){n.classList.add("tooltip-show"),setTimeout((function(){n.classList.remove("tooltip-show")}),6e3)}),(function(){alert(t.$i18n.t("unauthorized_clipboard"))})),t=this},removeTooltip:function(e){e.target.previousElementSibling.classList.remove("tooltip-show")},showRole:function(e){return!this.show||!this.show.roles||this.show.roles.indexOf(e)>=0},showGroup:function(e){var t=this;return!this.show||!this.show.roles||this.client.groups[e].filter((function(e){return t.show.roles.includes(e.name)})).length>0},toggleAll:function(e){var t=e.target.value.split("."),n=parseInt(t[1]),s=!1;1===n&&(s=!0);var i=e.target.checked;if(this.client.groups)for(var l in this.client.groups){var a=this.client.groups[l][n],c=this.name+"."+a.name;i&&this.checkedRoles.indexOf(c)<0&&!a.access&&!a.status&&this.emitChange(c,!0),i||this.emitChange(c,!1)}if(this.client.roles)for(var o in this.client.roles)a=this.client.roles[o],c=this.name+"."+a.name,i&&a.parameters.view&&this.checkedRoles.indexOf(c)<0&&(a.access||a.status||!a.parameters.display||this.emitChanges(c,!0)),i&&s&&a.parameters.download&&this.checkedRoles.indexOf(c)<0&&(a.access||a.status||!a.parameters.display||this.emitChanges(c,!0)),i||this.emitChange(c,!1)},toggleClient:function(e){for(var t=e.target;!t.classList.contains("role-line");)t=t.parentNode;t.classList.toggle("deployed")},emitChange:function(e,t){this.$emit("roleChange",{role:e,checked:t})},changeRole:function(e){var t=e.target;this.emitChange(t.value,t.checked)}}};n(9040);var i=n(1900),l=n(7289);const a=n.n(l)();var c=(0,i.Z)(s,(function(){var e=this,t=e._self._c;return t("span",[e.show&&e.show.client?t("div",{staticClass:"role-line deployed"},[t("div",{staticClass:"title-client",staticStyle:{cursor:"pointer","text-align":"left"}},[t("span",{staticStyle:{"font-weight":"800"}},[e._v(e._s(e.title(e.client)))])])]):e.client.groups&&Object.keys(e.client.groups).length>1||e.client.roles&&e.client.roles.length>1?t("div",{staticClass:"role-line"},[t("div",{staticClass:"title-client",staticStyle:{cursor:"pointer","text-align":"left"},on:{click:function(t){return e.toggleClient(t)}}},[t("span",{staticStyle:{"font-weight":"800"}},[e._v(e._s(e.title(e.client)))]),e._v(" "),t("em",{staticStyle:{float:"right","font-size":"0.9rem"}},[e._v("("+e._s(e.$t("all_access"))+")")])]),e._v(" "),t("div",{staticClass:"fmt-center",staticStyle:{clear:"both"}},[t("formater-tooltip",{attrs:{description:e.description(e.client)}})],1),e._v(" "),t("div",{staticClass:"fmt-center"},[e.client.groups&&Object.keys(e.client.groups).length>1?t("span",[e.selectedClients.indexOf(e.name+".1")>=0?t("input",{attrs:{type:"checkbox",title:e.$t("select_all"),disabled:"",value:"no"},domProps:{checked:!0}}):t("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedClients,expression:"selectedClients"}],attrs:{disabled:!e.canAskClient.view,type:"checkbox",title:e.$t("select_all")},domProps:{value:e.name+".0",checked:Array.isArray(e.selectedClients)?e._i(e.selectedClients,e.name+".0")>-1:e.selectedClients},on:{change:[function(t){var n=e.selectedClients,s=t.target,i=!!s.checked;if(Array.isArray(n)){var l=e.name+".0",a=e._i(n,l);s.checked?a<0&&(e.selectedClients=n.concat([l])):a>-1&&(e.selectedClients=n.slice(0,a).concat(n.slice(a+1)))}else e.selectedClients=i},function(t){return e.toggleAll(t)}]}})]):e._e()]),e._v(" "),t("div",{staticClass:"fmt-center"},[e.client.groups&&Object.keys(e.client.groups).length>1?t("span",[t("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedClients,expression:"selectedClients"}],attrs:{disabled:!e.canAskClient.download,type:"checkbox",title:e.$t("select_all")},domProps:{value:e.name+".1",checked:Array.isArray(e.selectedClients)?e._i(e.selectedClients,e.name+".1")>-1:e.selectedClients},on:{change:[function(t){var n=e.selectedClients,s=t.target,i=!!s.checked;if(Array.isArray(n)){var l=e.name+".1",a=e._i(n,l);s.checked?a<0&&(e.selectedClients=n.concat([l])):a>-1&&(e.selectedClients=n.slice(0,a).concat(n.slice(a+1)))}else e.selectedClients=i},function(t){return e.toggleAll(t)}]}})]):e._e()]),e._v(" "),t("div",{staticClass:"fmt-center"},[e.client.token?t("span",{staticClass:"copy-clipboard",attrs:{title:e.$t("copy_in_clipboard")}},[t("span",{staticClass:"fmt-button small fa fa-clipboard",style:{background:e.$store.state.style.primary},on:{click:function(t){return e.copyClipboard(t,e.name)}}},[e._v("\n                 "+e._s(e.$t("access_token"))+"\n               ")]),e._v(" "),t("div",{staticClass:"clipboard-tooltip",domProps:{innerHTML:e._s(e.$t("copied_to_clipboard",{client:e.name}))},on:{click:function(t){return e.removeTooltip(t)}}})]):e._e()])]):e._e(),e._v(" "),t("div",{class:{"client-content":e.client.groups&&Object.keys(e.client.groups).length>1||e.client.roles&&e.client.roles.length>1}},[e._l(e.client.roles,(function(n,s){return t("div",{directives:[{name:"show",rawName:"v-show",value:e.showRole(n.name),expression:"showRole(role.name)"}],staticClass:"role-line"},[t("div",[e._v(e._s(e.title(n)))]),e._v(" "),t("div",{staticClass:"fmt-center"},[t("formater-tooltip",{attrs:{description:e.description(n)}})],1),e._v(" "),t("div",{staticClass:"fmt-center"},[0===Object.keys(n.parameters).length||n.parameters.view?t("span",[n.access?t("span",{attrs:{title:e.$t("ACCEPTED")}},[t("i",{staticClass:"fa fa-check",staticStyle:{color:"green"}})]):e._e(),e._v(" "),n.access||n.status?e._e():t("input",{attrs:{type:"checkbox"},domProps:{value:e.name+"."+n.name,checked:e.checkedRoles.indexOf(e.name+"."+n.name)>=0},on:{click:function(t){return e.changeRole(t)}}})]):e._e()]),e._v(" "),t("div",{staticClass:"fmt-center"},[0===Object.keys(n.parameters).length||n.parameters.download?t("span",[n.access?t("span",{attrs:{title:e.$t("ACCEPTED")}},[t("i",{staticClass:"fa fa-check",staticStyle:{color:"green"}})]):e._e(),e._v(" "),n.access||n.status?e._e():t("input",{attrs:{type:"checkbox"},domProps:{value:e.name+"."+n.name,checked:e.checkedRoles.indexOf(e.name+"."+n.name)>=0},on:{click:function(t){return e.changeRole(t)}}})]):e._e()])])})),e._v(" "),e._l(e.client.groups,(function(n,s){return e.client.groups?t("div",{directives:[{name:"show",rawName:"v-show",value:e.showGroup(s),expression:"showGroup(key)"}],staticClass:"role-line"},[t("div",[e._v(e._s(e.title(n[0],s)))]),e._v(" "),t("div",{staticClass:"fmt-center"},[t("formater-tooltip",{attrs:{description:e.description(n[0])}})],1),e._v(" "),e._l(n,(function(s,i){return t("div",{staticClass:"fmt-center"},[s.access?t("span",{attrs:{title:e.$t("ACCEPTED")}},[t("i",{staticClass:"fa fa-check",staticStyle:{color:"green"}})]):t("span",["WAITING"===s.status?t("span",{attrs:{title:e.$t("WAITING")}},[t("i",{staticClass:"fa fa-clock-o"})]):e._e(),e._v(" "),"REJECTED"===s.status?t("span",{attrs:{title:e.$t("REJECTED")}},[t("i",{staticClass:"fa fa-close",staticStyle:{color:"darkred"}})]):e._e(),e._v(" "),s.status?e._e():t("span",[1===i||e.checkedRoles.indexOf(e.name+"."+n[1].name)<0?t("input",{attrs:{type:"checkbox"},domProps:{value:e.name+"."+s.name,checked:e.checkedRoles.indexOf(e.name+"."+s.name)>=0},on:{click:function(t){return e.changeRole(t)}}}):e._e(),e._v(" "),0===i&&e.checkedRoles.indexOf(e.name+"."+n[1].name)>=0?t("input",{attrs:{type:"checkbox",disabled:"",value:"no"},domProps:{checked:!0}}):e._e()])])])}))],2):e._e()}))],2)])}),[],!1,null,null,null);"function"==typeof a&&a(c);const o=c.exports},9040:(e,t,n)=>{var s=n(5519);s.__esModule&&(s=s.default),"string"==typeof s&&(s=[[e.id,s,""]]),s.locals&&(e.exports=s.locals),(0,n(5346).Z)("a26f926a",s,!0,{})}}]);
//# sourceMappingURL=411.formater-metadata-vjs.js.map