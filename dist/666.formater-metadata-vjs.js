(self.webpackChunkformater_metadata_vjs=self.webpackChunkformater_metadata_vjs||[]).push([[666],{7289:t=>{t.exports=function(t){t.options.__i18n=t.options.__i18n||[],t.options.__i18n.push('{"en":{"access_token":"Acess token","all_access":"All access","copied_to_clipboard":"The token &laquo;{client}&raquo; has been copied in clipboard.","copy_in_clipboard":"Copy the access token in clipboard","no_charter":"No charter","select_all":"Select all","signed":"Signed","WAITING":"Waiting for treatment","REJECTED":"Rejected","ACCEPTED":"Accepted","CONDITION":"Waiting your signature"},"fr":{"access_token":"token d\'accès","all_access":"Tout accès","copied_to_clipboard":"Le token &laquo;{client}&raquo; a été copié dans le presse-papier.","copy_in_clipboard":"Copier le token d\'accès dans le presse-papier","no_charter":"Aucune charte","select_all":"Tout sélectionner","signed":"Signée","WAITING":"En attente de traitement","REJECTED":"Refusé","ACCEPTED":"Accepté","CONDITION":"En attente de votre signature"}}'),delete t.options._Ctor}},1874:(t,e,s)=>{(e=s(3645)(!1)).push([t.id,"\ndiv.title-client::before {\n  content: ' + ';\n}\ndiv.deployed div.title-client::before {\n  content: ' - ';\n}\ndiv.client-content {\n display:none;\n}\ndiv.deployed + div.client-content {\n  display:block;\n}\ndiv.role-line {\n  display: grid;\n  grid-template-columns: minmax(100px,180px) 50px minmax(50px, 120px) minmax(50px, 120px) minmax(50px, 150px);\n  grid-gap: 5px;\n  text-align:center;\n}\ndiv.client-content div.role-line:nth-child(2n + 1) {\n  background: #f3f3f3;\n}\ndiv.role-line > div {\n}\ndiv.role-line > div:first-child {\n  min-width: 100px;\n  max-width: 180px;\n  text-align: right;\n}\n.clipboard-tooltip {\n  position: absolute;\n  display:none;\n  background-color: #fafafa;\n  border: 1px solid #a3a3a3;\n  font-size: smaller;\n  line-height:1;\n  text-align:left;\n  padding: 5px;\n  cursor: pointer;\n  width: 150px;\n  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);\n  z-index:1;\n}\n.copy-clipboard {\n  position: relative;\n}\nspan div.clipboard-tooltip  {\n  display:none;\n  cursor: pointer;\n  font-size:0.8rem;\n  left:0;\n}\n.tooltip-show + div.clipboard-tooltip {\n  display:block;\n}\n",""]),t.exports=e},8666:(t,e,s)=>{"use strict";s.r(e),s.d(e,{default:()=>r});const n={name:"FormaterClient",components:{FormaterTooltip:function(){return s.e(494).then(s.bind(s,494))}},props:{name:{type:String,default:null},client:{type:Object,default:null},checkedRoles:{type:Array,default:function(){return[]}}},computed:{canAskClient:function(){var t=!1,e=!1;if(this.client.groups)for(var s in this.client.groups)this.client.groups[s][0].access||this.client.groups[s][0].status||(t=!0),this.client.groups[s][1].access||this.client.groups[s][1].status||(e=!0);return{view:t,download:e}},lang:function(){return this.$store.state.lang},show:function(){return this.$store.getters["user/show"]}},data:function(){return{selectedClients:[]}},created:function(){},methods:{title:function(t,e){if(t.title){if(t.title[this.lang]&&"en"!==this.lang)return t.title[this.lang];if(t.title.en)return t.title.en}return e||t.name},description:function(t){return t.description&&t.description[this.lang]?t.description[this.lang]:t.description?t.description[Object.keys(t.description)[0]]:null},copyClipboard:function(t){var e=this,s=t.target;navigator.clipboard.writeText(this.client.token).then((function(){s.classList.add("tooltip-show"),setTimeout((function(){s.classList.remove("tooltip-show")}),6e3)}),(function(){alert(e.$i18n.t("unauthorized_clipboard"))})),e=this},removeTooltip:function(t){t.target.previousElementSibling.classList.remove("tooltip-show")},showRole:function(t){return!this.show||!this.show.roles||this.show.roles.indexOf(t)>=0},showGroup:function(t){var e=this;return!this.show||!this.show.roles||this.client.groups[t].filter((function(t){return e.show.roles.includes(t.name)})).length>0},toggleAll:function(t){var e=t.target.value.split("."),s=parseInt(e[1]),n=!1;1===s&&(n=!0);var i=t.target.checked;if(this.client.groups)for(var a in this.client.groups){var l=this.client.groups[a][s],c=this.name+"."+l.name;i&&this.checkedRoles.indexOf(c)<0&&!l.access&&!l.status&&this.emitChange(c,!0),i||this.emitChange(c,!1)}if(this.client.roles)for(var r in this.client.roles)l=this.client.roles[r],c=this.name+"."+l.name,i&&l.parameters.view&&this.checkedRoles.indexOf(c)<0&&(l.access||l.status||!l.parameters.display||this.emitChanges(c,!0)),i&&n&&l.parameters.download&&this.checkedRoles.indexOf(c)<0&&(l.access||l.status||!l.parameters.display||this.emitChanges(c,!0)),i||this.emitChange(c,!1)},toggleClient:function(t){for(var e=t.target;!e.classList.contains("role-line");)e=e.parentNode;e.classList.toggle("deployed")},emitChange:function(t,e){this.$emit("roleChange",{role:t,checked:e})},changeRole:function(t){var e=t.target;this.emitChange(e.value,e.checked)}}};s(7675);var i=s(1900),a=s(7289);const l=s.n(a)();var c=(0,i.Z)(n,(function(){var t=this,e=t._self._c;return e("span",[t.show&&t.show.client?e("div",{staticClass:"role-line deployed"},[e("div",{staticClass:"title-client",staticStyle:{cursor:"pointer","text-align":"left"}},[e("span",{staticStyle:{"font-weight":"800"}},[t._v(t._s(t.title(t.client)))])])]):t.client.groups&&Object.keys(t.client.groups).length>1||t.client.roles&&t.client.roles.length>1?e("div",{staticClass:"role-line"},[e("div",{staticClass:"title-client",staticStyle:{cursor:"pointer","text-align":"left"},on:{click:function(e){return t.toggleClient(e)}}},[e("span",{staticStyle:{"font-weight":"800"}},[t._v(t._s(t.title(t.client)))])]),t._v(" "),e("div",{staticClass:"fmt-center",staticStyle:{clear:"both"}},[e("formater-tooltip",{attrs:{description:t.description(t.client)}})],1),t._v(" "),e("div",{staticClass:"fmt-center"}),t._v(" "),e("div",{staticClass:"fmt-center"}),t._v(" "),e("div",{staticClass:"fmt-center"},[t.client.token?e("span",{staticClass:"copy-clipboard",attrs:{title:t.$t("copy_in_clipboard")}},[e("span",{staticClass:"fmt-button small fa fa-clipboard",style:{background:t.$store.state.style.primary},on:{click:function(e){return t.copyClipboard(e,t.name)}}},[t._v("\n                 "+t._s(t.$t("access_token"))+"\n               ")]),t._v(" "),e("div",{staticClass:"clipboard-tooltip",domProps:{innerHTML:t._s(t.$t("copied_to_clipboard",{client:t.name}))},on:{click:function(e){return t.removeTooltip(e)}}})]):t._e()])]):t._e(),t._v(" "),e("div",{class:{"client-content":t.client.groups&&Object.keys(t.client.groups).length>1||t.client.roles&&t.client.roles.length>1}},[t.showRole(null)&&t.client.groups&&Object.keys(t.client.groups).length>1?e("div",{staticClass:"role-line"},[e("div",[e("span",{staticStyle:{"font-size":"1.2rem"}},[t._v(t._s(t.$t("select_all")))])]),t._v(" "),e("div",{staticClass:"fmt-center",staticStyle:{clear:"both"}}),t._v(" "),e("div",{staticClass:"fmt-center"},[e("span",[t.selectedClients.indexOf(t.name+".1")>=0?e("input",{attrs:{type:"checkbox",title:t.$t("select_all"),disabled:"",value:"no"},domProps:{checked:!0}}):e("input",{directives:[{name:"model",rawName:"v-model",value:t.selectedClients,expression:"selectedClients"}],attrs:{disabled:!t.canAskClient.view,type:"checkbox",title:t.$t("select_all")},domProps:{value:t.name+".0",checked:Array.isArray(t.selectedClients)?t._i(t.selectedClients,t.name+".0")>-1:t.selectedClients},on:{change:[function(e){var s=t.selectedClients,n=e.target,i=!!n.checked;if(Array.isArray(s)){var a=t.name+".0",l=t._i(s,a);n.checked?l<0&&(t.selectedClients=s.concat([a])):l>-1&&(t.selectedClients=s.slice(0,l).concat(s.slice(l+1)))}else t.selectedClients=i},function(e){return t.toggleAll(e)}]}})])]),t._v(" "),e("div",{staticClass:"fmt-center"},[e("span",[e("input",{directives:[{name:"model",rawName:"v-model",value:t.selectedClients,expression:"selectedClients"}],attrs:{disabled:!t.canAskClient.download,type:"checkbox",title:t.$t("select_all")},domProps:{value:t.name+".1",checked:Array.isArray(t.selectedClients)?t._i(t.selectedClients,t.name+".1")>-1:t.selectedClients},on:{change:[function(e){var s=t.selectedClients,n=e.target,i=!!n.checked;if(Array.isArray(s)){var a=t.name+".1",l=t._i(s,a);n.checked?l<0&&(t.selectedClients=s.concat([a])):l>-1&&(t.selectedClients=s.slice(0,l).concat(s.slice(l+1)))}else t.selectedClients=i},function(e){return t.toggleAll(e)}]}})])])]):t._e(),t._v(" "),t._l(t.client.roles,(function(s,n){return e("div",{directives:[{name:"show",rawName:"v-show",value:t.showRole(s.name),expression:"showRole(role.name)"}],staticClass:"role-line"},[e("div",[t._v(t._s(t.title(s)))]),t._v(" "),e("div",{staticClass:"fmt-center"},[e("formater-tooltip",{attrs:{description:t.description(s)}})],1),t._v(" "),t._l(["view","download"],(function(n){return e("div",{staticClass:"fmt-center"},[s.access?e("span",{attrs:{title:t.$t("ACCEPTED")}},[e("i",{staticClass:"fa fa-check",staticStyle:{color:"green"}})]):s.status?e("span",["WAITING"===s.status?e("span",[e("i",{staticClass:"fa fa-clock-o"})]):s.status&&"REJECTED"===s.status?e("span",[e("i",{staticClass:"fa fa-close",staticStyle:{color:"darkred"}})]):t._e(),t._v(" "),"CONDITION"===s.status?e("span",{attrs:{title:t.$t("CONDITION")}},[e("router-link",{attrs:{to:{name:"Charter",params:{id:s.charterId}}}},[e("i",{staticClass:"fa fa-pencil"})])],1):t._e()]):0!==Object.keys(s.parameters).length&&s.parameters.charter?s.charterId?e("span",{attrs:{title:t.$t("CONDITION")}},[e("router-link",{attrs:{to:{name:"Charter",params:{id:s.charterId}}}},[e("i",{staticClass:"fa fa-pencil"})])],1):t._e():e("span",[e("input",{attrs:{type:"checkbox"},domProps:{value:t.name+"."+s.name,checked:t.checkedRoles.indexOf(t.name+"."+s.name)>=0},on:{click:function(e){return t.changeRole(e)}}})])])})),t._v(" "),e("div",{staticClass:"fmt-center"},[s.charterId?e("span",[s.charterId?e("router-link",{attrs:{to:{name:"Charter",params:{id:s.charterId}}}},[t.$store.getters["charters/isSigned"](s.charterId)?e("span",[t._v("\n                        "+t._s(t.$t("signed"))+"\n                       ")]):e("span",{attrs:{title:t.$t("CONDITION")}},[e("i",{staticClass:"fa fa-pencil"})])]):t._e()],1):e("span",[e("em",[t._v(t._s(t.$t("no_charter")))])])])],2)})),t._v(" "),t._l(t.client.groups,(function(s,n){return t.client.groups?e("div",{directives:[{name:"show",rawName:"v-show",value:t.showGroup(n),expression:"showGroup(key)"}],staticClass:"role-line"},[e("div",[t._v(t._s(t.title(s[0],n)))]),t._v(" "),e("div",{staticClass:"fmt-center"},[e("formater-tooltip",{attrs:{description:t.description(s[0])}})],1),t._v(" "),t._l(s,(function(n,i){return e("div",{staticClass:"fmt-center"},[n.access?e("span",{attrs:{title:t.$t("ACCEPTED")}},[e("i",{staticClass:"fa fa-check",staticStyle:{color:"green"}})]):n.status?e("span",["WAITING"===n.status?e("span",{attrs:{title:t.$t("WAITING")}},[e("i",{staticClass:"fa fa-clock-o"})]):t._e(),t._v(" "),"REJECTED"===n.status?e("span",{attrs:{title:t.$t("REJECTED")}},[e("i",{staticClass:"fa fa-close",staticStyle:{color:"darkred"}})]):t._e(),t._v(" "),"CONDITION"===n.status?e("span",{attrs:{title:t.$t("CONDITION")}},[e("router-link",{attrs:{to:{name:"Charter",params:{id:n.charterId}}}},[e("i",{staticClass:"fa fa-pencil"})])],1):t._e()]):e("span",[1===i||t.checkedRoles.indexOf(t.name+"."+s[1].name)<0?e("input",{attrs:{type:"checkbox"},domProps:{value:t.name+"."+n.name,checked:t.checkedRoles.indexOf(t.name+"."+n.name)>=0},on:{click:function(e){return t.changeRole(e)}}}):t._e(),t._v(" "),0===i&&t.checkedRoles.indexOf(t.name+"."+s[1].name)>=0?e("input",{attrs:{type:"checkbox",disabled:"",value:"no"},domProps:{checked:!0}}):t._e()])])})),t._v(" "),e("div",[s[0].charterId?e("span",[e("router-link",{attrs:{to:{name:"Charter",params:{id:s[0].charterId}}}},[t.$store.getters["charters/isSigned"](s[0].charterId)?e("span",[t._v("\n\t                   "+t._s(t.$t("signed"))+"\n\t                ")]):e("span",{attrs:{title:t.$t("CONDITION")}},[e("i",{staticClass:"fa fa-pencil"})])])],1):e("span",[e("em",[t._v(t._s(t.$t("no_charter")))])])])],2):t._e()}))],2)])}),[],!1,null,null,null);"function"==typeof l&&l(c);const r=c.exports},7675:(t,e,s)=>{var n=s(1874);n.__esModule&&(n=n.default),"string"==typeof n&&(n=[[t.id,n,""]]),n.locals&&(t.exports=n.locals),(0,s(5346).Z)("2f83d2b3",n,!0,{})}}]);
//# sourceMappingURL=666.formater-metadata-vjs.js.map