(self.webpackChunkformater_metadata_vjs=self.webpackChunkformater_metadata_vjs||[]).push([[377],{7289:e=>{e.exports=function(e){e.options.__i18n=e.options.__i18n||[],e.options.__i18n.push('{"en":{"access_token":"Acess token","all_access":"All access","copied_to_clipboard":"The token &laquo;{client}&raquo; has been copied in clipboard.","copy_in_clipboard":"Copy the access token in clipboard","no_charter":"No charter","select_all":"Select all","signed":"Signed","WAITING":"Waiting for treatment","REJECTED":"Rejected","ACCEPTED":"Accepted","CONDITION":"Waiting your signature"},"fr":{"access_token":"token d\'accès","all_access":"Tout accès","copied_to_clipboard":"Le token &laquo;{client}&raquo; a été copié dans le presse-papier.","copy_in_clipboard":"Copier le token d\'accès dans le presse-papier","no_charter":"Aucune charte","select_all":"Tout sélectionner","signed":"Signée","WAITING":"En attente de traitement","REJECTED":"Refusé","ACCEPTED":"Accepté","CONDITION":"En attente de votre signature"}}'),delete e.options._Ctor}},2604:(e,t,s)=>{(t=s(3645)(!1)).push([e.id,"\ndiv.title-client::before {\n  content: ' + ';\n}\ndiv.deployed div.title-client::before {\n  content: ' - ';\n}\ndiv.client-content {\n display:none;\n}\ndiv.deployed + div.client-content {\n  display:block;\n}\ndiv.role-line {\n  display: grid;\n  grid-template-columns: minmax(100px,180px) 50px minmax(50px, 120px) minmax(50px, 120px) minmax(50px, 150px);\n  grid-gap: 5px;\n  text-align:center;\n}\ndiv.client-content div.role-line:nth-child(2n + 1) {\n  background: #f3f3f3;\n}\ndiv.role-line > div {\n}\ndiv.role-line > div:first-child {\n  min-width: 100px;\n  max-width: 180px;\n  text-align: right;\n}\n.clipboard-tooltip {\n  position: absolute;\n  display:none;\n  background-color: #fafafa;\n  border: 1px solid #a3a3a3;\n  font-size: smaller;\n  line-height:1;\n  text-align:left;\n  padding: 5px;\n  cursor: pointer;\n  width: 150px;\n  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);\n  z-index:1;\n}\n.copy-clipboard {\n  position: relative;\n}\nspan div.clipboard-tooltip  {\n  display:none;\n  cursor: pointer;\n  font-size:0.8rem;\n  left:0;\n}\n.tooltip-show + div.clipboard-tooltip {\n  display:block;\n}\n",""]),e.exports=t},4377:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});const n={name:"FormaterClient",components:{FormaterTooltip:function(){return s.e(494).then(s.bind(s,494))}},props:{name:{type:String,default:null},client:{type:Object,default:null},checkedRoles:{type:Array,default:function(){return[]}}},computed:{canAskClient:function(){var e=!1,t=!1;if(this.client.groups)for(var s in this.client.groups)this.client.groups[s][0].access||this.client.groups[s][0].status||(e=!0),this.client.groups[s][1].access||this.client.groups[s][1].status||(t=!0);return{view:e,download:t}},lang:function(){return this.$store.state.lang},show:function(){return this.$store.getters["user/show"]}},data:function(){return{selectedClients:[]}},created:function(){},methods:{title:function(e,t){if(e.title){if(e.title[this.lang]&&"en"!==this.lang)return e.title[this.lang];if(e.title.en)return e.title.en}return t||e.name},description:function(e){return e.description&&e.description[this.lang]?e.description[this.lang]:e.description?e.description[Object.keys(e.description)[0]]:null},copyClipboard:function(e){var t=this,s=e.target;navigator.clipboard.writeText(this.client.token).then((function(){s.classList.add("tooltip-show"),setTimeout((function(){s.classList.remove("tooltip-show")}),6e3)}),(function(){alert(t.$i18n.t("unauthorized_clipboard"))})),t=this},removeTooltip:function(e){e.target.previousElementSibling.classList.remove("tooltip-show")},showRole:function(e){return!this.show||!this.show.roles||this.show.roles.indexOf(e)>=0},showGroup:function(e){var t=this;return!this.show||!this.show.roles||this.client.groups[e].filter((function(e){return t.show.roles.includes(e.name)})).length>0},toggleAll:function(e){var t=e.target.value.split("."),s=parseInt(t[1]),n=!1;1===s&&(n=!0);var i=e.target.checked;if(this.client.groups)for(var a in this.client.groups){var l=this.client.groups[a][s],c=this.name+"."+l.name;i&&this.checkedRoles.indexOf(c)<0&&!l.access&&!l.status&&this.emitChange(c,!0),i||this.emitChange(c,!1)}if(this.client.roles)for(var r in this.client.roles)l=this.client.roles[r],c=this.name+"."+l.name,i&&l.parameters.view&&this.checkedRoles.indexOf(c)<0&&(l.access||l.status||!l.parameters.display||this.emitChanges(c,!0)),i&&n&&l.parameters.download&&this.checkedRoles.indexOf(c)<0&&(l.access||l.status||!l.parameters.display||this.emitChanges(c,!0)),i||this.emitChange(c,!1)},toggleClient:function(e){for(var t=e.target;!t.classList.contains("role-line");)t=t.parentNode;t.classList.toggle("deployed")},emitChange:function(e,t){this.$emit("roleChange",{role:e,checked:t})},changeRole:function(e){var t=e.target;this.emitChange(t.value,t.checked)}}};s(2450);var i=s(1900),a=s(7289);const l=s.n(a)();var c=(0,i.Z)(n,(function(){var e=this,t=e._self._c;return t("span",[e.show&&e.show.client?t("div",{staticClass:"role-line deployed"},[t("div",{staticClass:"title-client",staticStyle:{cursor:"pointer","text-align":"left"}},[t("span",{staticStyle:{"font-weight":"800"}},[e._v(e._s(e.title(e.client)))])])]):e.client.groups&&Object.keys(e.client.groups).length>1||e.client.roles&&e.client.roles.length>1?t("div",{staticClass:"role-line"},[t("div",{staticClass:"title-client",staticStyle:{cursor:"pointer","text-align":"left"},on:{click:function(t){return e.toggleClient(t)}}},[t("span",{staticStyle:{"font-weight":"800"}},[e._v(e._s(e.title(e.client)))]),e._v(" "),t("em",{staticStyle:{float:"right","font-size":"0.9rem"}},[e._v("("+e._s(e.$t("all_access"))+")")])]),e._v(" "),t("div",{staticClass:"fmt-center",staticStyle:{clear:"both"}},[t("formater-tooltip",{attrs:{description:e.description(e.client)}})],1),e._v(" "),t("div",{staticClass:"fmt-center"},[e.client.groups&&Object.keys(e.client.groups).length>1?t("span",[e.selectedClients.indexOf(e.name+".1")>=0?t("input",{attrs:{type:"checkbox",title:e.$t("select_all"),disabled:"",value:"no"},domProps:{checked:!0}}):t("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedClients,expression:"selectedClients"}],attrs:{disabled:!e.canAskClient.view,type:"checkbox",title:e.$t("select_all")},domProps:{value:e.name+".0",checked:Array.isArray(e.selectedClients)?e._i(e.selectedClients,e.name+".0")>-1:e.selectedClients},on:{change:[function(t){var s=e.selectedClients,n=t.target,i=!!n.checked;if(Array.isArray(s)){var a=e.name+".0",l=e._i(s,a);n.checked?l<0&&(e.selectedClients=s.concat([a])):l>-1&&(e.selectedClients=s.slice(0,l).concat(s.slice(l+1)))}else e.selectedClients=i},function(t){return e.toggleAll(t)}]}})]):e._e()]),e._v(" "),t("div",{staticClass:"fmt-center"},[e.client.groups&&Object.keys(e.client.groups).length>1?t("span",[t("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedClients,expression:"selectedClients"}],attrs:{disabled:!e.canAskClient.download,type:"checkbox",title:e.$t("select_all")},domProps:{value:e.name+".1",checked:Array.isArray(e.selectedClients)?e._i(e.selectedClients,e.name+".1")>-1:e.selectedClients},on:{change:[function(t){var s=e.selectedClients,n=t.target,i=!!n.checked;if(Array.isArray(s)){var a=e.name+".1",l=e._i(s,a);n.checked?l<0&&(e.selectedClients=s.concat([a])):l>-1&&(e.selectedClients=s.slice(0,l).concat(s.slice(l+1)))}else e.selectedClients=i},function(t){return e.toggleAll(t)}]}})]):e._e()]),e._v(" "),t("div",{staticClass:"fmt-center"},[e.client.token?t("span",{staticClass:"copy-clipboard",attrs:{title:e.$t("copy_in_clipboard")}},[t("span",{staticClass:"fmt-button small fa fa-clipboard",style:{background:e.$store.state.style.primary},on:{click:function(t){return e.copyClipboard(t,e.name)}}},[e._v("\n                 "+e._s(e.$t("access_token"))+"\n               ")]),e._v(" "),t("div",{staticClass:"clipboard-tooltip",domProps:{innerHTML:e._s(e.$t("copied_to_clipboard",{client:e.name}))},on:{click:function(t){return e.removeTooltip(t)}}})]):e._e()])]):e._e(),e._v(" "),t("div",{class:{"client-content":e.client.groups&&Object.keys(e.client.groups).length>1||e.client.roles&&e.client.roles.length>1}},[e._l(e.client.roles,(function(s,n){return t("div",{directives:[{name:"show",rawName:"v-show",value:e.showRole(s.name),expression:"showRole(role.name)"}],staticClass:"role-line"},[t("div",[e._v(e._s(e.title(s)))]),e._v(" "),t("div",{staticClass:"fmt-center"},[t("formater-tooltip",{attrs:{description:e.description(s)}})],1),e._v(" "),e._l(["view","download"],(function(n){return t("div",{staticClass:"fmt-center"},[s.access?t("span",{attrs:{title:e.$t("ACCEPTED")}},[t("i",{staticClass:"fa fa-check",staticStyle:{color:"green"}})]):s.status?t("span",["WAITING"===s.status?t("span",[t("i",{staticClass:"fa fa-clock-o"})]):s.status&&"REJECTED"===s.status?t("span",[t("i",{staticClass:"fa fa-close",staticStyle:{color:"darkred"}})]):e._e(),e._v(" "),"CONDITION"===s.status?t("span",{attrs:{title:e.$t("CONDITION")}},[t("router-link",{attrs:{to:{name:"Charter",params:{id:s.charterId}}}},[t("i",{staticClass:"fa fa-pencil"})])],1):e._e()]):0!==Object.keys(s.parameters).length&&s.parameters.charter?s.charterId?t("span",{attrs:{title:e.$t("CONDITION")}},[t("i",{staticClass:"fa fa-pencil"})]):e._e():t("span",[t("input",{attrs:{type:"checkbox"},domProps:{value:e.name+"."+s.name,checked:e.checkedRoles.indexOf(e.name+"."+s.name)>=0},on:{click:function(t){return e.changeRole(t)}}})])])})),e._v(" "),t("div",{staticClass:"fmt-center"},[s.charterId?t("span",[s.charterId?t("router-link",{attrs:{to:{name:"Charter",params:{id:s.charterId}}}},[e.$store.getters["charters/isSigned"](s.charterId)?t("span",[e._v("\n                        "+e._s(e.$t("signed"))+"\n                       ")]):t("span",{attrs:{title:e.$t("CONDITION")}},[t("i",{staticClass:"fa fa-pencil"})])]):e._e()],1):t("span",[t("em",[e._v(e._s(e.$t("no_charter")))])])])],2)})),e._v(" "),e._l(e.client.groups,(function(s,n){return e.client.groups?t("div",{directives:[{name:"show",rawName:"v-show",value:e.showGroup(n),expression:"showGroup(key)"}],staticClass:"role-line"},[t("div",[e._v(e._s(e.title(s[0],n)))]),e._v(" "),t("div",{staticClass:"fmt-center"},[t("formater-tooltip",{attrs:{description:e.description(s[0])}})],1),e._v(" "),e._l(s,(function(n,i){return t("div",{staticClass:"fmt-center"},[n.access?t("span",{attrs:{title:e.$t("ACCEPTED")}},[t("i",{staticClass:"fa fa-check",staticStyle:{color:"green"}})]):n.status?t("span",["WAITING"===n.status?t("span",{attrs:{title:e.$t("WAITING")}},[t("i",{staticClass:"fa fa-clock-o"})]):e._e(),e._v(" "),"REJECTED"===n.status?t("span",{attrs:{title:e.$t("REJECTED")}},[t("i",{staticClass:"fa fa-close",staticStyle:{color:"darkred"}})]):e._e(),e._v(" "),"CONDITION"===n.status?t("span",{attrs:{title:e.$t("CONDITION")}},[t("router-link",{attrs:{to:{name:"Charter",params:{id:n.charterId}}}},[t("i",{staticClass:"fa fa-pencil"})])],1):e._e()]):t("span",[1===i||e.checkedRoles.indexOf(e.name+"."+s[1].name)<0?t("input",{attrs:{type:"checkbox"},domProps:{value:e.name+"."+n.name,checked:e.checkedRoles.indexOf(e.name+"."+n.name)>=0},on:{click:function(t){return e.changeRole(t)}}}):e._e(),e._v(" "),0===i&&e.checkedRoles.indexOf(e.name+"."+s[1].name)>=0?t("input",{attrs:{type:"checkbox",disabled:"",value:"no"},domProps:{checked:!0}}):e._e()])])})),e._v(" "),t("div",[s[0].charterId?t("span",[t("router-link",{attrs:{to:{name:"Charter",params:{id:s[0].charterId}}}},[e.$store.getters["charters/isSigned"](s[0].charterId)?t("span",[e._v("\n\t                   "+e._s(e.$t("signed"))+"\n\t                ")]):t("span",{attrs:{title:e.$t("CONDITION")}},[t("i",{staticClass:"fa fa-pencil"})])])],1):t("span",[t("em",[e._v(e._s(e.$t("no_charter")))])])])],2):e._e()}))],2)])}),[],!1,null,null,null);"function"==typeof l&&l(c);const r=c.exports},2450:(e,t,s)=>{var n=s(2604);n.__esModule&&(n=n.default),"string"==typeof n&&(n=[[e.id,n,""]]),n.locals&&(e.exports=n.locals),(0,s(5346).Z)("f34ba420",n,!0,{})}}]);
//# sourceMappingURL=377.formater-metadata-vjs.js.map