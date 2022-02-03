(function(t){function e(e){for(var n,o,c=e[0],r=e[1],u=e[2],d=0,h=[];d<c.length;d++)o=c[d],Object.prototype.hasOwnProperty.call(s,o)&&s[o]&&h.push(s[o][0]),s[o]=0;for(n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n]);l&&l(e);while(h.length)h.shift()();return a.push.apply(a,u||[]),i()}function i(){for(var t,e=0;e<a.length;e++){for(var i=a[e],n=!0,c=1;c<i.length;c++){var r=i[c];0!==s[r]&&(n=!1)}n&&(a.splice(e--,1),t=o(o.s=i[0]))}return t}var n={},s={app:0},a=[];function o(e){if(n[e])return n[e].exports;var i=n[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=t,o.c=n,o.d=function(t,e,i){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(i,n,function(e){return t[e]}.bind(null,n));return i},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],r=c.push.bind(c);c.push=e,c=c.slice();for(var u=0;u<c.length;u++)e(c[u]);var l=r;a.push([0,"chunk-vendors"]),i()})({0:function(t,e,i){t.exports=i("56d7")},"034f":function(t,e,i){"use strict";i("85ec")},"558e":function(t,e,i){},"56d7":function(t,e,i){"use strict";i.r(e);i("e260"),i("e6cf"),i("cca6"),i("a79d");var n=i("2b0e"),s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("SumaClient")],1)},a=[],o=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{role:"main"}},[i("div",{staticClass:"header_content"},[i("button",{staticClass:"menubutton headerbuttons leftalign",class:{"fa-stack fa-1x":t.menuShown},attrs:{"aria-label":"toggle menu"},on:{click:function(e){t.menuShown=!t.menuShown}}},[t.menuShown?i("span",[i("i",{staticClass:"fas fa-bars fa-stack-1x"}),i("i",{staticClass:"fas fa-caret-left fa-stack-1x barcaret"}),i("span",{staticClass:"fa-stack-text arrowpadding"},[t._v("|")])]):i("span",[i("i",{staticClass:"fas fa-bars"})])]),i("button",{staticClass:"headerbuttons leftalign",attrs:{"aria-label":"Abandon initiative counts",disabled:t.hasNoCounts},on:{click:function(e){return t.resetCounts()}}},[i("span",{staticClass:"buttontext"},[t._v("Abandon Counts")]),i("i",{staticClass:"fas fa-trash-alt toolbar-icons"})]),i("button",{staticClass:"headerbuttons leftalign",attrs:{"aria-label":"Undo last count",disabled:""===t.compCounts},on:{click:function(e){return t.undoLastCount()}}},[i("span",{staticClass:"buttontext"},[t._v("Undo Last Count")]),i("i",{staticClass:"fas fa-undo toolbar-icons"})]),t.settings.hideDateTime?t._e():i("div",{staticClass:"datetime filler",domProps:{innerHTML:t._s(t.datetime)}}),t.settings.hideDateTime?i("div",{staticClass:"filler"}):t._e(),t.ignoreSettings.length<4?i("button",{staticClass:"headerbuttons rightalign",attrs:{"aria-label":"settings"},on:{click:function(e){return t.$modal.show("settings")}}},[i("i",{staticClass:"fas fa-cog"})]):t._e(),i("button",{staticClass:"headerbuttons rightalign",attrs:{id:"finishcollecting","aria-label":"finish collecting",disabled:t.hasNoStoredCounts},on:{click:function(e){return t.submitCounts()}}},[i("span",{staticClass:"buttontext"},[t._v("Finish collecting")]),i("i",{staticClass:"fas fa-check-circle toolbar-icons"})])]),i("modal",{attrs:{name:"settings"}},[i("i",{staticClass:"fas fa-times closemodal",on:{click:function(e){return t.$modal.hide("settings")}}}),i("h2",{staticClass:"settingsheader",staticStyle:{"text-align":"center"}},[t._v("Settings")]),i("div",{staticClass:"settingslist"},[-1==t.ignoreSettings.indexOf("hideDateTime")?i("div",[i("input",{directives:[{name:"model",rawName:"v-model.lazy",value:t.settings["hideDateTime"],expression:"settings['hideDateTime']",modifiers:{lazy:!0}}],attrs:{type:"checkbox",id:"hideDateTime"},domProps:{checked:Array.isArray(t.settings["hideDateTime"])?t._i(t.settings["hideDateTime"],null)>-1:t.settings["hideDateTime"]},on:{change:function(e){var i=t.settings["hideDateTime"],n=e.target,s=!!n.checked;if(Array.isArray(i)){var a=null,o=t._i(i,a);n.checked?o<0&&t.$set(t.settings,"hideDateTime",i.concat([a])):o>-1&&t.$set(t.settings,"hideDateTime",i.slice(0,o).concat(i.slice(o+1)))}else t.$set(t.settings,"hideDateTime",s)}}}),i("label",{attrs:{for:"hideDateTime"}},[t._v("Hide Date Time")]),i("i",{directives:[{name:"tippy",rawName:"v-tippy",value:{theme:"info",arrow:!0,interactive:!0,placement:"top",trigger:"click",maxWidth:"1000px"},expression:"{ theme : 'info', arrow: true, interactive : true, placement : 'top', trigger : 'click', 'maxWidth': '1000px'}"}],staticClass:"fas fa-info-circle settinginfo",attrs:{content:"Hide date time in the toolbar"}})]):t._e(),-1==t.ignoreSettings.indexOf("multiCount")?i("div",[i("input",{directives:[{name:"model",rawName:"v-model.lazy",value:t.settings["multiCount"],expression:"settings['multiCount']",modifiers:{lazy:!0}}],attrs:{type:"checkbox",id:"multiCount"},domProps:{checked:Array.isArray(t.settings["multiCount"])?t._i(t.settings["multiCount"],null)>-1:t.settings["multiCount"]},on:{change:function(e){var i=t.settings["multiCount"],n=e.target,s=!!n.checked;if(Array.isArray(i)){var a=null,o=t._i(i,a);n.checked?o<0&&t.$set(t.settings,"multiCount",i.concat([a])):o>-1&&t.$set(t.settings,"multiCount",i.slice(0,o).concat(i.slice(o+1)))}else t.$set(t.settings,"multiCount",s)}}}),i("label",{attrs:{for:"multiCount"}},[t._v("Show Multi Count")]),i("i",{directives:[{name:"tippy",rawName:"v-tippy",value:{theme:"info",arrow:!0,interactive:!0,placement:"top",trigger:"click",maxWidth:"1000px"},expression:"{ theme : 'info', arrow: true, interactive : true, placement : 'top', trigger : 'click', 'maxWidth': '1000px'}"}],staticClass:"fas fa-info-circle settinginfo",attrs:{content:"Will add an input box that allows you to add multiple counts. Please note that all counts will have the same timestamp. We recommended that this feature be used cautiously, as it is much easier to enter large amounts of data this way. Use at your own risk!"}})]):t._e(),-1==t.ignoreSettings.indexOf("lastCount")?i("div",[i("input",{directives:[{name:"model",rawName:"v-model.lazy",value:t.settings["lastCount"],expression:"settings['lastCount']",modifiers:{lazy:!0}}],attrs:{type:"checkbox",id:"lastCount"},domProps:{checked:Array.isArray(t.settings["lastCount"])?t._i(t.settings["lastCount"],null)>-1:t.settings["lastCount"]},on:{change:function(e){var i=t.settings["lastCount"],n=e.target,s=!!n.checked;if(Array.isArray(i)){var a=null,o=t._i(i,a);n.checked?o<0&&t.$set(t.settings,"lastCount",i.concat([a])):o>-1&&t.$set(t.settings,"lastCount",i.slice(0,o).concat(i.slice(o+1)))}else t.$set(t.settings,"lastCount",s)}}}),i("label",{attrs:{for:"lastCount"}},[t._v("Show Last Count")]),i("i",{directives:[{name:"tippy",rawName:"v-tippy",value:{theme:"info",arrow:!0,interactive:!0,placement:"top",trigger:"click",maxWidth:"1000px"},expression:"{ theme : 'info', arrow: true, interactive : true, placement : 'top', trigger : 'click', 'maxWidth': '1000px'}"}],staticClass:"fas fa-info-circle settinginfo",attrs:{content:"Shows the time of the last count for the selected location."}})]):t._e(),-1==t.ignoreSettings.indexOf("initiative")?i("div",[i("select",{directives:[{name:"model",rawName:"v-model",value:t.settings["initiative"],expression:"settings['initiative']"}],attrs:{"aria-label":"settings initiative dropdown",id:"settingsInitiativeDropdown"},on:{change:function(e){var i=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.$set(t.settings,"initiative",e.target.multiple?i:i[0])}}},[i("option",{attrs:{value:"undefined"}},[t._v("No Default Initiative")]),t._l(t.initresults,(function(e){return i("option",{key:e.initiativeId,domProps:{value:e.initiativeId,innerHTML:t._s(e.initiativeTitle)}})}))],2),i("i",{directives:[{name:"tippy",rawName:"v-tippy",value:{theme:"info",arrow:!0,interactive:!0,placement:"top",trigger:"click",maxWidth:"1000px"},expression:"{ theme : 'info', arrow: true, interactive : true, placement : 'top', trigger : 'click', 'maxWidth': '1000px'}"}],staticClass:"fas fa-info-circle settinginfo",attrs:{content:"Sets a default initiative so when counts are submitted or the page is refreshed the same initiative will stay selected."}})]):t._e()])]),i("transition",{attrs:{name:"sidebar"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:t.menuShown,expression:"menuShown"}],staticClass:"selectbuttons"},[i("div",{staticClass:"alldropdowns"},[i("select",{directives:[{name:"model",rawName:"v-model",value:t.currentinit,expression:"currentinit"}],attrs:{"aria-label":"initiative dropdown",id:"initiativeDropdown"},on:{change:[function(e){var i=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.currentinit=e.target.multiple?i:i[0]},function(e){return t.updateInit()}]}},[i("option",{attrs:{disabled:"",value:"undefined"}},[t._v("Select an initiative")]),t._l(t.initresults,(function(e){return i("option",{key:e.initiativeId,domProps:{value:e.initiativeId,innerHTML:t._s(e.initiativeTitle)}})}))],2),t.children.length>0?i("tree-menu",{key:t.currentinit,attrs:{parentdata:t.$data,nodes:t.children,depth:0},on:{clickLocation:t.clickLocation,addtocounts:function(e){return t.addToCount(0)}}}):t._e()],1)])]),i("div",{class:[t.menuShown?"sidebarcounts":"fullpagecounts"],attrs:{id:"countsform"}},[t.showcounts?i("div",[i("h3",{attrs:{id:"current_loc_label"}},[t.compCounts?i("button",{staticClass:"resetloccounts",on:{click:function(e){return t.resetInitCountsByLocation(t.location)}}},[i("span",{staticClass:"buttontext"},[t._v("Reset location counts")]),i("i",{staticClass:"fas fa-ban toolbar-icons"})]):t._e(),i("span",{domProps:{innerHTML:t._s(t.locationtitle)}}),t.locationDescription?i("i",{directives:[{name:"tippy",rawName:"v-tippy",value:{theme:"info",arrow:!0,interactive:!0,placement:"top",trigger:"click",maxWidth:"1000px"},expression:"{ theme : 'info', arrow: true, interactive : true, placement : 'top', trigger : 'click', 'maxWidth': '1000px'}"}],staticClass:"fas fa-info-circle",attrs:{content:t._f("unescapeFilter")(t.locationDescription)}}):t._e()]),t.settings.lastCount&&t.lastCount?i("div",[t._v("Last count for "),i("span",{domProps:{innerHTML:t._s(t.locationtitle)}}),t._v(" recorded at: "+t._s(t.lastCount))]):t._e(),i("form",{on:{submit:function(e){return e.preventDefault(),t.addToCount(t.countNumber)}}},[Object.keys(t.activityGroups).length>0?i("div",{staticClass:"activityGroups"},t._l(t.activityGroups,(function(e,n){return i("div",{key:n,staticClass:"activityGroup",class:{required:e.required}},[i("h3",{staticClass:"activityTitle"},[i("span",{domProps:{innerHTML:t._s(e.title)}}),e.required?i("span",{staticClass:"requiredicon"},[t._v("*")]):t._e(),e.allowMulti?i("span",{staticClass:"instructions"},[t._v(" (Choose one or more)")]):i("span",{staticClass:"instructions"},[t._v(" (Select one)")]),e.description?i("i",{directives:[{name:"tippy",rawName:"v-tippy",value:{theme:"info",arrow:!0,interactive:!0,placement:"top"},expression:"{ theme : 'info', arrow: true, interactive : true, placement : 'top' }"}],staticClass:"fas fa-info-circle",attrs:{content:t._f("unescapeFilter")(e.description)}}):t._e()]),t._l(e.activities,(function(s){return i("div",{key:s.id,attrs:{id:"activityButton"}},[i("label",[e.allowMulti?i("input",{directives:[{name:"model",rawName:"v-model",value:t.activityvaluesmulti,expression:"activityvaluesmulti"}],staticClass:"button",attrs:{type:"checkbox",name:e.id,id:s.id},domProps:{value:s.id,checked:Array.isArray(t.activityvaluesmulti)?t._i(t.activityvaluesmulti,s.id)>-1:t.activityvaluesmulti},on:{click:function(e){return t.requiredFieldsCheck()},change:function(e){var i=t.activityvaluesmulti,n=e.target,a=!!n.checked;if(Array.isArray(i)){var o=s.id,c=t._i(i,o);n.checked?c<0&&(t.activityvaluesmulti=i.concat([o])):c>-1&&(t.activityvaluesmulti=i.slice(0,c).concat(i.slice(c+1)))}else t.activityvaluesmulti=a}}}):e.allowMulti?t._e():i("input",{directives:[{name:"model",rawName:"v-model",value:t.activityvalues[n],expression:"activityvalues[key]"}],attrs:{type:"radio",name:e.id,id:s.id},domProps:{value:s.id,checked:t._q(t.activityvalues[n],s.id)},on:{click:function(e){return t.deselect(s.id,n)},change:function(e){return t.$set(t.activityvalues,n,s.id)}}}),i("span",{domProps:{innerHTML:t._s(s.title)}})])])}))],2)})),0):t._e(),t.settings.multiCount?i("input",{directives:[{name:"model",rawName:"v-model",value:t.countNumber,expression:"countNumber"}],attrs:{type:"number",id:"inputCount",value:"1",min:"0"},domProps:{value:t.countNumber},on:{input:function(e){e.target.composing||(t.countNumber=e.target.value)}}}):t._e(),i("button",{staticClass:"countButton",attrs:{type:"submit",disabled:!t.buttonClickable,enabled:t.buttonClickable}},[t._v("Count"+t._s(t.compCounts))])])]):i("div",{staticClass:"noloc"},[t._v(" No current location ")])])],1)},c=[],r=(i("a4d3"),i("e01a"),i("99af"),i("4de4"),i("a630"),i("c975"),i("d81d"),i("13d5"),i("b0c0"),i("b64b"),i("07ac"),i("ac1f"),i("3ca3"),i("466d"),i("bc3a")),u=i.n(r),l=i("a002"),d=i.n(l),h=i("096e"),p=i.n(h),v=i("3d20"),f=i.n(v),m=i("761a"),g=i.n(m),C=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("ul",{staticClass:"tree-menu",class:[{toplevel:0==t.depth},"level-"+t.depth],attrs:{"data-label":t.label}},[0==t.depth&&t.parentdata.cachedinitdata[t.parentdata.currentinit]?i("b",{staticStyle:{padding:"20px"}},[t._v(t._s(t.parentdata.cachedinitdata[t.parentdata.currentinit].locations.title))]):t._e(),i("li",[t.label?i("button",{class:[{selected:t.selected},{lowestlocation:!t.nodes},"menuelement"],attrs:{id:t.id},on:{click:t.toggleChildren}},[t.nodes?i("span",{staticClass:"toggle",class:[t.showChildren?"toggleup":"toggledown"]}):t._e(),i("span",{domProps:{innerHTML:t._s(t.label)}}),t.currentcount?i("span",[t._v(t._s(t.currentcount))]):t._e()]):t._e(),t._l(t.nodes,(function(e){return i("tree-menu",{directives:[{name:"show",rawName:"v-show",value:t.showChildren||0==t.depth,expression:"showChildren || depth == 0"}],key:e.title,attrs:{nodes:e.children,parents:{desc:t.parentDescription,title:t.parentTitle},parentdata:t.parentdata,label:e.title,id:e.id,description:e.description,depth:t.depth+1},on:{addtocounts:function(e){return t.addToCount(0)},clickLocation:t.clickLocation}})}))],2)])},y=[],b={getCounts:function(t,e){var i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],n="";if(t&&t["counts"]){var s=e?t["counts"].filter((function(t){return t.location==e})):t["counts"],a=s.reduce((function(t,e){return 0!=e.number?t["nonzerocounts"].push(e):t["zerocounts"].push(e),t}),{zerocounts:[],nonzerocounts:[]}),o=a["zerocounts"].length,c=a["nonzerocounts"];if(c.length>0){var r=c.reduce((function(t,e){return t+parseInt(e["number"])}),0);n=r}else o>0&&(e?n=0:e||(n=""!=n?n+o:o))}return i&&""!==n?" (".concat(n,") "):n}},w={props:["label","nodes","depth","id","parentdata","description","parents"],data:function(){return{showChildren:!1,currentcount:"",selected:!1,caretdirection:this.showChildren?"down":"up",parentDescription:"",parentTitle:""}},name:"tree-menu",watch:{"parentdata.counts":{handler:function(t){this.currentcount=b.getCounts(t,this.id)},deep:!0},"parentdata.location":{handler:function(t){this.nodes||(this.selected=this.id==t)},deep:!0}},created:function(){this.currentcount=b.getCounts(this.parentdata.counts,this.id),this.selected=this.id==this.parentdata.location},methods:{addToCount:function(){this.$emit("addtocounts",0)},clickLocation:function(t){this.$emit("clickLocation",t)},toggleChildren:function(){this.showChildren=!this.showChildren,this.parentTitle=this.parents.title?this.parents.title+" | "+this.label:this.label,this.parentDescription=this.description?this.description:this.parents.desc,this.$emit("clickLocation",{description:this.parentDescription,id:this.id,title:this.parentTitle,nodes:this.nodes,index:this.depth}),this.nodes||this.addToCount()}}},_=w,k=(i("ff5d"),i("2877")),x=Object(k["a"])(_,C,y,!1,null,null,null),T=x.exports,D=i("2ef0"),I={name:"SumaClient",components:{treeMenu:T},data:function(){return{initresults:"",currentinit:void 0,cachedinitdata:{},initurl:initiativeUrl,baseiniturl:baseInitUrl,syncurl:syncUrl,appVersion:"1.1.0",device:"",children:[],activityGroups:{},counts:{},location:"",activityvalues:{},activityvaluesmulti:[],showcounts:!1,locationtitle:"",buttonClickable:!1,menuShown:!0,settings:this.$route.query,ignoreSettings:Object.keys(this.$route.query),countNumber:1,datetime:"",locationDescription:"",queuedcounts:[]}},created:function(){this.getDeviceData(),this.loadLocalForageData(),this.loadInitInfo(),this.loadInitData()},destroyed:function(){clearInterval(this.interval)},watch:{cachedinitdata:function(t){d.a.setItem("cachedinitdata",t)},counts:{handler:function(){d.a.setItem("counts",this.counts)},deep:!0},settings:{handler:function(t){var e=this;this.settings.initiative&&"undefined"!=this.settings.initiative&&this.settings.initiative!=this.currentinit&&(this.currentinit=this.settings.initiative,this.updateInit()),this.settings.hideDateTime?clearInterval(this.interval):this.interval=setInterval((function(){e.datetime=e.getDateTime()}),1e3),d.a.setItem("settings",t)},deep:!0}},methods:{clickLocation:function(t){t.nodes||(this.location=t.id,this.locationDescription=t.description,this.locationtitle=t.title,this.showcounts=!0),this.singleLocation(t.nodes),this.resetActivityChecks()},getDeviceData:function(){var t=new p.a,e=navigator.userAgent,i=t.parse(e);this.device=i.os.name},requiredFieldsCheck:function(){var t=this;this.$nextTick((function(){var e=document.querySelectorAll("div.activityGroup.required"),i=Array.from(e).map((function(t){return t.querySelectorAll("input:checked").length}));t.buttonClickable=-1==i.indexOf(0)}))},loadLocalForageData:function(){for(var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["counts","settings"],i=function(){var i=e[n];d.a.getItem(i).then((function(e){return null!=e&&(t[i]=e,!0)})).then((function(e){e&&"counts"==i?t.submitCounts():"settings"==i&&(t.settings=Object.assign(t.settings,t.$route.query))})).catch((function(t){console.error("There was an error "+t)}))},n=0;n<e.length;n++)i()},loadInitData:function(){var t=this;d.a.getItem("cachedinitdata").then((function(e){null!=e&&(t.cachedinitdata=D.omitBy(e,(function(t){return Date.now()-t.retrieved>36e5})))}))},loadInitInfo:function(){var t=this;d.a.getItem("initcache").then((function(e){null===e||Date.now()-e.retrieved>36e5?u.a.get(t.baseiniturl).then((function(e){e.data&&(t.initresults=e.data,d.a.setItem("initcache",{retrieved:Date.now(),initresults:e.data}))})).catch((function(t){console.error("There was an error "+t)})):t.initresults=e.initresults}))},buildAllCounts:function(t){var e=D.isEmpty(this.counts)?[]:[this.counts],i=t?t.concat(e):e;return i},updateInit:function(){var t=this;this.children=[],this.hasNoCounts||d.a.getItem("queuedcounts").then((function(e){var i=t.buildAllCounts(e);d.a.setItem("queuedcounts",i),t.queuedcounts=i,t.counts={}})),Object.keys(this.cachedinitdata).indexOf(this.currentinit)>-1?this.populateInitData(this.cachedinitdata[this.currentinit]):u.a.get("".concat(this.initurl).concat(this.currentinit)).then((function(e){t.populateInitData(e.data),t.$set(t.cachedinitdata,t.currentinit,D.set(e.data,"retrieved",Date.now()))}))},populateInitData:function(t){var e=this;this.children=t.locations.children;var i=t.activityGroups,n=D.groupBy(t.activities,"groupId");for(var s in this.location="",this.showcounts=!1,this.activityGroups={},n){var a=i.filter((function(t){return t.id==s}))[0];a["activities"]=n[s],this.activityGroups[s]=a}this.buttonClickable=-1==Object.keys(this.activityGroups).map((function(t){return e.activityGroups[t].required})).indexOf(!0),this.singleLocation(this.children)},singleLocation:function(t){t&&1==t.length&&this.$nextTick((function(){document.getElementById(t[0].id).click()}))},resetActivityChecks:function(){this.activityvalues={},this.activityvaluesmulti=[],this.countNumber=1,document.getElementById("countsform").scrollTop=0,this.requiredFieldsCheck()},sendCounts:function(t,e){var i=this;u.a.post(this.syncurl,"json=".concat(t),{headers:{"content-type":"application/x-www-form-urlencoded"}}).then((function(n){if("Transaction Complete"!=n.data)i.syncError();else{var s=JSON.parse(t),a=s.sessions.length,o=D.uniq(D.flatten(e["locations"])).length,c=e["counts"];f.a.fire({title:"Counts submitted!",text:"".concat(c," ").concat(g()("counts",c),' (including "zero" counts) covering ').concat(o," ").concat(g()("locations",o)," in ").concat(a," ").concat(g()("sessions",a)," has been sent to the server"),icon:"success"}),i.clearCounts(!0)}})).catch((function(t){i.syncError(),console.log(t.response)}))},submitCounts:function(){var t=this;d.a.getItem("queuedcounts").then((function(e){var i=t.buildAllCounts(e);d.a.setItem("queuedcounts",i),t.queuedcounts=i;var n=i.reduce((function(t,e){return t["counts"]+=b.getCounts(e,!1,!1),t["locations"].push(e.counts.map((function(t){return t.location}))),t}),{counts:0,locations:[]});if(0!==i.length&&0!==n["counts"]){var s=t.syncCountDict(i);t.sendCounts(s,n)}})).then((function(){})).catch((function(t){console.error("There was an error "+t)})),this.resetActivityChecks()},syncError:function(){this.clearCounts(),f.a.fire("Sync error","Error sending data to server. This may be caused by issues including server outages and Wi-Fi             connectivity problems. The data will be retained by the browser. Please contact an administrator if             this doesn't resolve itself soon.","error")},clearCounts:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.counts={},this.location="",this.showcounts=!1,this.currentinit=this.settings.initiative,this.currentinit&&"undefined"!=this.currentinit?this.updateInit():this.children=[],t&&(d.a.setItem("queuedcounts",[]),this.queuedcounts=[])},resetCounts:function(){var t=this;f.a.fire({title:"Abandon Session",text:"Are you sure you want to delete the data you've just collected? All data you've collected will be deleted permanently.",confirmButtonText:"DELETE",cancelButtonText:"Keep Collecting",showCancelButton:!0}).then((function(e){1==e.value&&t.clearCounts()})).catch((function(t){console.log(t)}))},resetInitCountsByLocation:function(t){var e=this,i=parseInt(this.compCounts.match(/\d+/)[0]);f.a.fire({title:"Reset ".concat(i," ").concat(g()("counts",i)," for ").concat(this.locationtitle),text:"Are you sure you want to delete the data you've just collected? All data you've collected for ".concat(this.locationtitle," be deleted permanently."),confirmButtonText:"RESET",showCancelButton:!0}).then((function(i){1==i.value&&(e.counts["counts"]=e.counts["counts"].filter((function(e){return e.location!==t})))})).catch((function(t){console.log(t)}))},undoLastCount:function(){if(!this.hasNoCounts){var t=this.locationCounts(),e=t.pop();if(e&&(this.counts["counts"]=D.without(this.counts["counts"],e),0===t.length))switch(e.number){case 1:this.addToCount(0);break}}this.resetActivityChecks()},addToCount:function(t){var e=this,i=Math.round(Date.now()/1e3),n=this.activityvaluesmulti.concat(Object.values(this.activityvalues)),s=this.hasNoCounts?{counts:[],initiativeID:this.currentinit,startTime:i}:this.counts,a=this.location;D.remove(s["counts"],(function(t){return t.location==a&&0==t.number}));var o=0!=t||0==s["counts"].filter((function(t){return t.location==e.location})).length;o&&(s["counts"].push({timestamp:i,location:this.location,activities:n,number:parseInt(t)}),s["endTime"]=i,this.counts=s),this.resetActivityChecks()},deselect:function(t,e){t==this.activityvalues[e]&&(this.activityvalues[e]=""),this.requiredFieldsCheck()},syncCountDict:function(t){var e=JSON.stringify({version:this.appVersion,device:this.device,sessions:t});return e},getDateTime:function(){var t=Date.now(),e=new Date(t);return"".concat(e.toDateString(),"<br>").concat(e.toLocaleTimeString())},locationCounts:function(){var t=this,e="";return this.hasNoCounts||(e=this.counts["counts"].filter((function(e){return e.location==t.location}))),e}},computed:{compCounts:function(){return b.getCounts(this.counts,this.location)},hasNoCounts:function(){return!this.counts||!this.counts["counts"]||0==this.counts["counts"].length},hasNoStoredCounts:function(){return this.hasNoCounts&&0==this.queuedcounts.length},lastCount:function(){var t=this.locationCounts(),e="";if(t.length>0){var i=new Date(1e3*t.pop().timestamp);e=i.toLocaleTimeString()}return e}},filters:{unescapeFilter:function(t){return D.unescape(t)}}},S=I,A=(i("85f9"),Object(k["a"])(S,o,c,!1,null,null,null)),N=A.exports,L={name:"app",components:{SumaClient:N}},O=L,q=(i("034f"),Object(k["a"])(O,s,a,!1,null,null,null)),$=q.exports,P=i("6018"),j=i("8c4f"),M=i("1881"),E=i.n(M);n["a"].use(E.a),n["a"].use(j["a"]),n["a"].config.productionTip=!1,n["a"].use(P["a"]);var z=[{path:"/",component:N,name:"index"}],B=new j["a"]({mode:"history",routes:z});new n["a"]({render:function(t){return t($)},router:B}).$mount("#app")},"85ec":function(t,e,i){},"85f9":function(t,e,i){"use strict";i("558e")},bc6c:function(t,e,i){},ff5d:function(t,e,i){"use strict";i("bc6c")}});
//# sourceMappingURL=app.js.map