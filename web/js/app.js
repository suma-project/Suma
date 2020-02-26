(function(t){function n(n){for(var i,a,c=n[0],r=n[1],u=n[2],d=0,h=[];d<c.length;d++)a=c[d],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&h.push(o[a][0]),o[a]=0;for(i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i]);l&&l(n);while(h.length)h.shift()();return s.push.apply(s,u||[]),e()}function e(){for(var t,n=0;n<s.length;n++){for(var e=s[n],i=!0,c=1;c<e.length;c++){var r=e[c];0!==o[r]&&(i=!1)}i&&(s.splice(n--,1),t=a(a.s=e[0]))}return t}var i={},o={app:0},s=[];function a(n){if(i[n])return i[n].exports;var e=i[n]={i:n,l:!1,exports:{}};return t[n].call(e.exports,e,e.exports,a),e.l=!0,e.exports}a.m=t,a.c=i,a.d=function(t,n,e){a.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:e})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,n){if(1&n&&(t=a(t)),8&n)return t;if(4&n&&"object"===typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(a.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var i in t)a.d(e,i,function(n){return t[n]}.bind(null,i));return e},a.n=function(t){var n=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(n,"a",n),n},a.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},a.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],r=c.push.bind(c);c.push=n,c=c.slice();for(var u=0;u<c.length;u++)n(c[u]);var l=r;s.push([0,"chunk-vendors"]),e()})({0:function(t,n,e){t.exports=e("56d7")},"034f":function(t,n,e){"use strict";var i=e("85ec"),o=e.n(i);o.a},"558e":function(t,n,e){},"56d7":function(t,n,e){"use strict";e.r(n);e("e260"),e("e6cf"),e("cca6"),e("a79d");var i=e("2b0e"),o=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{attrs:{id:"app"}},[e("SumaClient")],1)},s=[],a=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",[e("div",{staticClass:"header_content"},[e("button",{staticClass:"headerbuttons leftalign menubutton",attrs:{"aria-label":"toggle menu"},on:{click:function(n){t.menuShown=!t.menuShown}}},[t.menuShown?e("i",{staticClass:"fas fa-times"}):e("i",{staticClass:"fas fa-bars"})]),e("button",{staticClass:"headerbuttons leftalign",attrs:{"aria-label":"Abandon all counts",disabled:t.hasNoCounts},on:{click:function(n){return t.resetCounts()}}},[e("span",{staticClass:"buttontext"},[t._v("Abandon All Counts")]),e("i",{staticClass:"fas fa-trash-alt toolbar-icons"})]),e("button",{staticClass:"headerbuttons leftalign",attrs:{"aria-label":"Undo last count",disabled:""===t.compCounts},on:{click:function(n){return t.undoLastCount()}}},[e("span",{staticClass:"buttontext"},[t._v("Undo Last Count")]),e("i",{staticClass:"fas fa-undo toolbar-icons"})]),e("button",{staticClass:"headerbuttons rightalign",attrs:{"aria-label":"finish collecting",disabled:t.hasNoCounts},on:{click:function(n){return t.submitCounts()}}},[e("span",{staticClass:"buttontext"},[t._v("Finish collecting")]),e("i",{staticClass:"fas fa-check-circle toolbar-icons"})])]),e("transition",{attrs:{name:"sidebar"}},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.menuShown,expression:"menuShown"}],staticClass:"selectbuttons"},[e("div",{staticClass:"alldropdowns"},[e("select",{directives:[{name:"model",rawName:"v-model",value:t.currentinit,expression:"currentinit"}],attrs:{"aria-label":"initiative dropdown",id:"initiativeDropdown"},on:{change:[function(n){var e=Array.prototype.filter.call(n.target.options,(function(t){return t.selected})).map((function(t){var n="_value"in t?t._value:t.value;return n}));t.currentinit=n.target.multiple?e:e[0]},function(n){return t.updateInit()}]}},[e("option",{attrs:{disabled:"",value:""}},[t._v("Select an initiative")]),t._l(t.initresults,(function(n){return e("option",{key:n.initiativeId,domProps:{value:n.initiativeId,innerHTML:t._s(n.initiativeTitle)}})}))],2),t.children.length>0?e("tree-menu",{key:t.currentinit,attrs:{parentdata:t.$data,nodes:t.children,depth:0},on:{clickLocation:t.clickLocation,addtocounts:function(n){return t.addToCount(0)}}}):t._e()],1)])]),e("div",{class:[t.menuShown?"sidebarcounts":"fullpagecounts"],attrs:{id:"countsform"}},[t.showcounts?e("div",[t.compCounts?e("button",{on:{click:function(n){return t.resetInitCountsByLocation(t.location)}}},[t._v("reset location counts")]):t._e(),e("h3",{attrs:{id:"current_loc_label"},domProps:{innerHTML:t._s(this.locationtitle)}}),e("form",{on:{submit:function(n){return n.preventDefault(),t.addToCount(t.countNumber)}}},[Object.keys(t.activities).length>0?e("div",{staticClass:"activities"},t._l(t.activities,(function(n,i){return e("div",{key:i,staticClass:"activityGroup",class:{required:n.required}},[e("h3",{staticClass:"activityTitle"},[e("span",{domProps:{innerHTML:t._s(n.title)}}),n.required?e("span",{staticClass:"requiredicon"},[t._v("*")]):t._e(),n.allowMulti?e("span",{staticClass:"instructions"},[t._v(" (Choose one or more)")]):e("span",{staticClass:"instructions"},[t._v(" (Select one)")])]),t._l(n.options,(function(o){return e("div",{key:o.id,attrs:{id:"activityButton"}},[e("label",[n.allowMulti?e("input",{directives:[{name:"model",rawName:"v-model",value:t.activityvaluesmulti,expression:"activityvaluesmulti"}],staticClass:"button",attrs:{type:"checkbox",name:n.id,id:o.id},domProps:{value:o.id,checked:Array.isArray(t.activityvaluesmulti)?t._i(t.activityvaluesmulti,o.id)>-1:t.activityvaluesmulti},on:{click:function(n){return t.requiredFieldsCheck()},change:function(n){var e=t.activityvaluesmulti,i=n.target,s=!!i.checked;if(Array.isArray(e)){var a=o.id,c=t._i(e,a);i.checked?c<0&&(t.activityvaluesmulti=e.concat([a])):c>-1&&(t.activityvaluesmulti=e.slice(0,c).concat(e.slice(c+1)))}else t.activityvaluesmulti=s}}}):n.allowMulti?t._e():e("input",{directives:[{name:"model",rawName:"v-model",value:t.activityvalues[i],expression:"activityvalues[key]"}],attrs:{type:"radio",name:n.id,id:o.id},domProps:{value:o.id,checked:t._q(t.activityvalues[i],o.id)},on:{click:function(n){return t.deselect(o.id,i)},change:function(n){return t.$set(t.activityvalues,i,o.id)}}}),e("span",{domProps:{innerHTML:t._s(o.title)}})])])}))],2)})),0):t._e(),t.settings.multiCount?e("input",{directives:[{name:"model",rawName:"v-model",value:t.countNumber,expression:"countNumber"}],attrs:{type:"number",id:"inputCount",value:"1",min:"0"},domProps:{value:t.countNumber},on:{input:function(n){n.target.composing||(t.countNumber=n.target.value)}}}):t._e(),e("button",{staticClass:"countButton",attrs:{type:"submit",disabled:!t.buttonClickable,enabled:t.buttonClickable}},[t._v("Count"+t._s(t.compCounts))])])]):e("div",{staticClass:"noloc"},[t._v(" No current location ")])])],1)},c=[],r=(e("99af"),e("4de4"),e("a630"),e("c975"),e("a15b"),e("baa5"),e("d81d"),e("13d5"),e("b0c0"),e("b64b"),e("07ac"),e("ac1f"),e("3ca3"),e("5319"),e("498a"),e("bc3a")),u=e.n(r),l=e("a002"),d=e.n(l),h=e("096e"),v=e.n(h),f=e("1940"),p=e.n(f),m=e("761a"),b=e.n(m),y=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("ul",{staticClass:"tree-menu",class:[{toplevel:0==t.depth},"level-"+t.depth],attrs:{"data-label":t.label}},[t.label?e("li",{class:[{selected:t.selected},{lowestlocation:!t.nodes}],attrs:{id:t.id},on:{click:t.toggleChildren}},[t.nodes?e("span",{staticClass:"toggle",class:[t.showChildren?"toggleup":"toggledown"]}):t._e(),e("span",{domProps:{innerHTML:t._s(t.label)}}),t.currentcount?e("span",[t._v(t._s(t.currentcount))]):t._e()]):t._e(),t._l(t.nodes,(function(n){return e("tree-menu",{directives:[{name:"show",rawName:"v-show",value:t.showChildren||0==t.depth,expression:"showChildren || depth == 0"}],key:n.title,attrs:{nodes:n.children,parentdata:t.parentdata,label:n.title,id:n.id,depth:t.depth+1},on:{addtocounts:function(n){return t.addToCount(0)},clickLocation:t.clickLocation}})}))],2)},C=[],g={getCounts:function(t,n){var e=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],i="";if(t){var o=n?t["counts"].filter((function(t){return t.location==n})):t["counts"],s=o.reduce((function(t,n){return 0!=n.number?t["nonzerocounts"].push(n):t["zerocounts"].push(n),t}),{zerocounts:[],nonzerocounts:[]}),a=s["zerocounts"].length,c=s["nonzerocounts"];if(c.length>0){var r=c.reduce((function(t,n){return t+parseInt(n["number"])}),0);i=r}else a>0&&(n?i=0:n||(i=""!=i?i+a:a))}return e&&""!==i?" (".concat(i,") "):i}},w={props:["label","nodes","depth","id","parentdata"],data:function(){return{showChildren:!1,currentcount:"",selected:!1,caretdirection:this.showChildren?"down":"up"}},name:"tree-menu",watch:{"parentdata.counts":{handler:function(t){this.currentcount=g.getCounts(t[this.parentdata.currentinit],this.id)},deep:!0},"parentdata.location":{handler:function(t){this.nodes||(this.selected=this.id==t)},deep:!0}},created:function(){this.currentcount=g.getCounts(this.parentdata.counts[this.parentdata.currentinit],this.id),this.selected=this.id==this.parentdata.location},methods:{addToCount:function(){this.$emit("addtocounts",0)},clickLocation:function(t){this.$emit("clickLocation",t)},toggleChildren:function(){this.showChildren=!this.showChildren,this.$emit("clickLocation",{id:this.id,title:this.label,nodes:this.nodes,index:this.depth}),this.nodes||this.addToCount()}}},k=w,_=(e("ff5d"),e("2877")),I=Object(_["a"])(k,y,C,!1,null,null,null),T=I.exports,x=e("2ef0"),O={name:"SumaClient",components:{treeMenu:T},data:function(){return{initresults:"",currentinit:"",initdata:"",cachedinitdata:{},initurl:initiativeUrl,baseiniturl:baseInitUrl,syncurl:syncUrl,appVersion:"1.1.0",device:"",children:{},activities:{},counts:{},location:"",activityvalues:{},activityvaluesmulti:[],showcounts:!1,locationtitle:"",buttonClickable:!1,menuShown:!0,settings:this.$route.query,countNumber:1}},created:function(){this.getDeviceData(),this.loadCounts(),this.loadInitInfo(),this.loadInitData()},updated:function(){},watch:{cachedinitdata:function(t){d.a.setItem("cachedinitdata",t)},counts:{handler:function(){d.a.setItem("counts",this.counts)},deep:!0}},methods:{clickLocation:function(t){t.nodes||(this.location=t.id,this.showcounts=!0),this.singleLocation(t.nodes),this.resetActivityChecks(),this.createLocationTitle()},getDeviceData:function(){var t=new v.a,n=navigator.userAgent,e=t.parse(n);this.device=e.os.name},requiredFieldsCheck:function(){var t=this;this.$nextTick((function(){var n=document.querySelectorAll("div.activityGroup.required"),e=Array.from(n).map((function(t){return t.querySelectorAll("input:checked").length}));t.buttonClickable=-1==e.indexOf(0)}))},loadCounts:function(){var t=this;d.a.getItem("counts").then((function(n){return null!=n&&(t.counts=n,!0)})).then((function(n){n&&t.submitCounts()})).catch((function(t){console.error("There was an error "+t)}))},loadInitData:function(){var t=this;d.a.getItem("cachedinitdata").then((function(n){null!=n&&(t.cachedinitdata=x.omitBy(n,(function(t){return Date.now()-t.retrieved>36e5})))}))},loadInitInfo:function(){var t=this;d.a.getItem("initcache").then((function(n){null===n||Date.now()-n.retrieved>36e5?u.a.get(t.baseiniturl).then((function(n){n.data&&(t.initresults=n.data,d.a.setItem("initcache",{retrieved:Date.now(),initresults:n.data}))})).catch((function(t){console.error("There was an error "+t)})):t.initresults=n.initresults}))},updateInit:function(){var t=this;this.children={},Object.keys(this.cachedinitdata).indexOf(this.currentinit)>-1?this.populateInitData(this.cachedinitdata[this.currentinit]):u.a.get("".concat(this.initurl).concat(this.currentinit)).then((function(n){t.populateInitData(n.data),t.$set(t.cachedinitdata,t.currentinit,x.set(n.data,"retrieved",Date.now()))}))},populateInitData:function(t){var n=this;this.initdata=t,this.children=this.initdata.locations.children;var e=this.initdata.activityGroups,i=x.groupBy(this.initdata.activities,"groupId");for(var o in this.location="",this.showcounts=!1,this.activities={},i){var s=e.filter((function(t){return t.id==o}))[0];s["options"]=i[o],this.activities[o]=s}this.buttonClickable=-1==Object.keys(this.activities).map((function(t){return n.activities[t].required})).indexOf(!0),this.singleLocation(this.children)},singleLocation:function(t){t&&1==t.length&&this.$nextTick((function(){document.getElementById(t[0].id).click()}))},createLocationTitle:function(){var t=this;this.$nextTick((function(){var n=document.querySelector("ul > .selected"),e={};if(n){var i=parseInt(n.closest("ul").className.replace("tree-menu","").replace("level-","").trim());while(i>0){var o=n.closest("ul.level-".concat(i)).getAttribute("data-label");e[i]=o,i-=1}}t.locationtitle=Object.values(e).join(" | ")}))},resetActivityChecks:function(){this.activityvalues={},this.activityvaluesmulti=[],this.countNumber=1,document.body.scrollTop=0,document.documentElement.scrollTop=0,this.requiredFieldsCheck()},sendCounts:function(t,n){var e=this;u()({method:"POST",url:this.syncurl,headers:{"content-type":"application/x-www-form-urlencoded"},data:"json=".concat(t)}).then((function(i){if("Transaction Complete"!=i.data)e.syncError();else{var o=JSON.parse(t),s=o.sessions.length,a=x.uniq(x.flatten(n["locations"])).length,c=n["counts"];p()({title:"Counts submitted!",text:"".concat(c," ").concat(b()("counts",c),' (including "zero" counts) covering ').concat(a," ").concat(b()("locations",a)," in ").concat(s," ").concat(b()("initiatives",s)," has been sent to the server"),icon:"success"}),e.clearCounts(!0)}})).catch((function(t){e.syncError(),console.log(t.response)}))},submitCounts:function(){var t=this;d.a.getItem("queuedcounts").then((function(n){var e=Object.values(t.counts),i=n?n.concat(e):e;d.a.setItem("queuedcounts",i);var o=i.reduce((function(t,n){return t["counts"]+=g.getCounts(n,!1,!1),t["locations"].push(n.counts.map((function(t){return t.location}))),t}),{counts:0,locations:[]});if(0!==i.length&&0!==o["counts"]){var s=t.syncCountDict(i);t.sendCounts(s,o)}})).then((function(){})).catch((function(t){console.error("There was an error "+t)}))},syncError:function(){this.clearCounts(),p()("Sync error","Error sending data to server. This may be caused by issues including server outages and Wi-Fi             connectivity problems. The data will be retained by the browser. Please contact an administrator if             this doesn't resolve itself soon.","error")},clearCounts:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],n=this.initresults,e=this.cachedinitdata;Object.assign(this.$data,this.$options.data.call(this)),this.initresults=n,this.cachedinitdata=e,t&&d.a.setItem("queuedcounts",[])},resetCounts:function(){var t=this;p()({title:"Abandon Session",text:"Are you sure you want to delete the data you've just collected? All data you've collected will be deleted permanently.",buttons:{delete:{text:"DELETE",value:"delete"},cancel:"Keep Collecting"}}).then((function(n){"delete"==n&&t.clearCounts()})).catch((function(t){console.log(t)}))},cleanEmptyInitCounts:function(){this.counts=x.omitBy(this.counts,(function(t){return 0===t["counts"].length}))},resetInitCountsByLocation:function(t){x.remove(this.counts[this.currentinit]["counts"],(function(n){return n.location===t})),this.cleanEmptyInitCounts()},undoLastCount:function(){var t=this;if(this.counts[this.currentinit]&&this.counts[this.currentinit]["counts"].length>0){var n=this.counts[this.currentinit]["counts"].filter((function(n){return n.location==t.location})),e=n.pop();if(e){var i=this.counts[this.currentinit]["counts"].lastIndexOf(e);console.log(e.number),console.log(this.counts[this.currentinit]["counts"]),0==e.number?this.counts[this.currentinit]["counts"]=x.without(this.counts[this.currentinit]["counts"],e):(e.number-=1,this.counts[this.currentinit]["counts"][i]=e),this.cleanEmptyInitCounts()}}this.resetActivityChecks()},addToCount:function(t){var n=this,e=Math.round(Date.now()/1e3),i=this.activityvaluesmulti.concat(Object.values(this.activityvalues)),o=this.counts[this.currentinit]?this.counts[this.currentinit]:{counts:[],initiativeID:this.currentinit,startTime:e},s=this.location;x.remove(o["counts"],(function(t){return t.location==s&&0==t.number}));var a=0!=t||0==o["counts"].filter((function(t){return t.location==n.location})).length;a&&(o["counts"].push({timestamp:e,location:this.location,activities:i,number:parseInt(t)}),o["endTime"]=e,this.$set(this.counts,this.currentinit,o)),this.resetActivityChecks()},deselect:function(t,n){t==this.activityvalues[n]&&(this.activityvalues[n]=""),this.requiredFieldsCheck()},syncCountDict:function(t){var n=JSON.stringify({version:this.appVersion,device:this.device,sessions:t});return n}},computed:{compCounts:function(){return g.getCounts(this.counts[this.currentinit],this.location)},hasNoCounts:function(){return 0===Object.keys(this.counts).length&&this.counts.constructor===Object}}},S=O,j=(e("85f9"),Object(_["a"])(S,a,c,!1,null,null,null)),L=j.exports,A={name:"app",components:{SumaClient:L}},D=A,N=(e("034f"),Object(_["a"])(D,o,s,!1,null,null,null)),q=N.exports,P=e("8c4f");i["a"].use(P["a"]),i["a"].config.productionTip=!1;var $=[{path:"/",component:L,name:"index"}],E=new P["a"]({mode:"history",routes:$});new i["a"]({render:function(t){return t(q)},router:E}).$mount("#app")},"85ec":function(t,n,e){},"85f9":function(t,n,e){"use strict";var i=e("558e"),o=e.n(i);o.a},bc6c:function(t,n,e){},ff5d:function(t,n,e){"use strict";var i=e("bc6c"),o=e.n(i);o.a}});
//# sourceMappingURL=app.js.map