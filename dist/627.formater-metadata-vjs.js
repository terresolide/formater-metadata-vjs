(self.webpackChunkformater_metadata_vjs=self.webpackChunkformater_metadata_vjs||[]).push([[627],{7443:e=>{e.exports=function(e){e.options.__i18n=e.options.__i18n||[],e.options.__i18n.push('{"fr":{"test":"test"}}'),delete e.options._Ctor}},3477:(e,t,n)=>{(t=n(3645)(!1)).push([e.id,"\n.fmt-parameters-form .fmt-input-block{\n\tmargin: 5px 10px;\n\tdisplay:block;\n}\n.fmt-parameters-form .fmt-input-block.fmt-input-group{\n  \tmargin: 5px 10px;\n}\n.fmt-parameters-form input {\n    border: none;\n    background-color: transparent;\n    padding: 0 10px;\n    outline: none;\n   /* padding: .5em; */\n    line-height: 35px;\n}\n.fmt-parameters-form label{\n\tdisplay: block;\n\tfont-size: 1.1em;\n\ttext-transform:capitalize;\n    letter-spacing: -0.5px;\n}\n",""]),e.exports=t},9627:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>l});const s={name:"FormaterParametersForm",components:{FormaterSelect:n(493).Z},props:{lang:{type:String,default:"en"},parameters:{type:Array,default:[]},depth:{type:Number,default:0}},watch:{$route:function(e){this.initValues(e.query),this.$forceUpdate()}},data:function(){return{inputColor:null,textColor:null,aerisResetListener:null,values:{}}},computed:{},created:function(){this.initValues(this.$route.query),this.textColor=this.$store.state.style.primary,this.handleTheme(this.$store.state.style.emphasis),this.aerisResetListener=this.handleReset.bind(this),document.addEventListener("aerisResetEvent",this.aerisResetListener)},destroyed:function(){document.removeEventListener("aerisResetEvent",this.aerisResetListener),this.aerisResetListener=null},methods:{initValues:function(e){var t=this;this.parameters.forEach((function(n){n.options?t.$set(t.values,n.name,e[n.name]||"---"):e.hasOwnProperty(n.name)?t.$set(t.values,n.name,e[n.name]):t.$set(t.values,n.name,n.value||null)}))},handleTheme:function(e){if(this.inputColor=this.$shadeColor(e,.8),this.$el&&this.$el.querySelector){var t=this.$el.querySelectorAll(".flt-input"),n=this;t.forEach((function(t){t.style.backgroundColor=n.$shadeColor(e,.8)}))}},changeTextOnEnter:function(e){if(13==e.which||13==e.keyCode)return this.changeText(e),!1},changeText:function(e){var t=e.target.name,n=e.target.value.trim(),s={};for(var a in this.$route.query)s[a]=this.$route.query[a];n&&""!==n?s[t]=n:delete s[t],this.$router.push({name:this.$route.name,params:this.$route.params,query:s})},selectChange:function(e,t){var n={};for(var s in this.$route.query)n[s]=this.$route.query[s];t&&"---"!==t?n[e]=t:delete n[e],this.$router.push({name:this.$route.name,params:this.$route.params,query:n})},handleReset:function(e){for(var t in this.values)this.values[t]=null;this.$forceUpdate()}}};n(2370);var a=n(1900),r=n(7443);const o=n.n(r)();var i=(0,a.Z)(s,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"fmt-parameters-form"},e._l(e.parameters,(function(n,s){return t("div",{staticClass:"fmt-input-block fmt-input-group"},[t("label",{style:{color:e.textColor}},[e._v(e._s(n.name))]),e._v(" "),n.options&&n.options.length>0?t("formater-select",{attrs:{depth:e.depth,name:n.name,width:"260px",options:n.options,color:e.$store.state.style.emphasis,defaut:null,"set-value":e.values[n.name]},on:{input:function(t){e.selectChange(n.name,t)}}}):e._e(),e._v(" "),n.options&&1===n.options.length?t("div",{staticClass:"fmt-input disable",style:{backgroundColor:e.inputColor}},[t("span",[e._v(e._s(n.options[0]))])]):e._e(),e._v(" "),n.options?e._e():t("div",{staticClass:"fmt-input",style:{backgroundColor:e.inputColor}},[t("input",{directives:[{name:"model",rawName:"v-model",value:e.values[n.name],expression:"values[item.name]"}],attrs:{type:"text",name:n.name,default:e.values[n.name],pattern:n.pattern,title:n.title,placeholder:n.title},domProps:{value:e.values[n.name]},on:{change:e.changeText,keypress:e.changeTextOnEnter,input:function(t){t.target.composing||e.$set(e.values,n.name,t.target.value)}}})])],1)})),0)}),[],!1,null,null,null);"function"==typeof o&&o(i);const l=i.exports},2370:(e,t,n)=>{var s=n(3477);s.__esModule&&(s=s.default),"string"==typeof s&&(s=[[e.id,s,""]]),s.locals&&(e.exports=s.locals),(0,n(5346).Z)("0ae7d53e",s,!0,{})}}]);
//# sourceMappingURL=627.formater-metadata-vjs.js.map