(this["webpackJsonpqh-charts"]=this["webpackJsonpqh-charts"]||[]).push([[0],{203:function(e,n,t){},338:function(e,n){},340:function(e,n){},389:function(e,n,t){"use strict";t.r(n);var a=t(0),i=t.n(a),r=t(44),c=t.n(r),o=(t(203),t(13)),s=t.n(o),l=t(22),d=t(9),u=t(6),b=t(5),j=t(181);function p(e,n,t){var a=i.a.useState(t),r=Object(d.a)(a,2),c=r[0],o=r[1],s=i.a.useCallback(e,n);return i.a.useEffect((function(){var e=s();if(void 0!==e){var n=e.subscribe({error:function(e){return console.error(e)},next:o});return function(){return n.unsubscribe()}}}),[s]),[c]}var f=t(80),h=t(185),v=t(27),x=t.n(v),m=t(394),O=t(186),g=i.a.createContext(void 0),y=function(){function e(){Object(f.a)(this,e),this.files$$=new m.a([]),this.files$=this.files$$.asObservable()}return Object(h.a)(e,[{key:"filesByType$",value:function(e){return this.files$.pipe(Object(O.a)((function(n){return n.filter((function(n){return n.type===e}))})))}},{key:"preProcessFiles",value:function(){var e=Object(l.a)(s.a.mark((function e(n){var t,a,i,r,c=this;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=[],a=[],i=s.a.mark((function e(i){var r,o;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null===(r=n.item(i))){e.next=6;break}return e.next=4,c.preProcessFileData(r.name,r.type,(function(){return r.arrayBuffer()}));case 4:void 0!==(o=e.sent)?t.push(o):a.push(r.name);case 6:case"end":return e.stop()}}),e)})),r=0;case 4:if(!(r<n.length)){e.next=9;break}return e.delegateYield(i(r),"t0",6);case 6:r++,e.next=4;break;case 9:return e.abrupt("return",{files:t,unsupported:a});case 10:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()},{key:"preProcessUrl",value:function(){var e=Object(l.a)(s.a.mark((function e(n){var t,a,i,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(n);case 2:return t=e.sent,a=t.headers.get("content-type"),i=n.split("?")[0].split("/").slice(-1)[0],e.next=7,this.preProcessFileData(i,null===a?"application/octet-stream":a,(function(){return t.arrayBuffer()}));case 7:if(void 0===(r=e.sent)){e.next=12;break}return e.abrupt("return",{files:[r],unsupported:[]});case 12:return e.abrupt("return",{files:[],unsupported:[n]});case 13:case"end":return e.stop()}}),e,this)})));return function(n){return e.apply(this,arguments)}}()},{key:"acceptFiles",value:function(){var e=Object(l.a)(s.a.mark((function e(n){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.files$$.next(x.a.chain(this.files$$.value).concat(n).uniqBy("data").value());case 1:case"end":return e.stop()}}),e,this)})));return function(n){return e.apply(this,arguments)}}()},{key:"preProcessFileData",value:function(){var e=Object(l.a)(s.a.mark((function e(n,t,a){var i,r,c,o;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0===(i=w(n,t))){e.next=10;break}return e.next=4,a();case 4:return r=e.sent,c=btoa(new Uint8Array(r).reduce((function(e,n){return e+String.fromCharCode(n)}),"")),o=r.byteLength,e.abrupt("return",{contentType:t,data:c,name:n,size:o,type:i});case 10:return e.abrupt("return",void 0);case 11:case"end":return e.stop()}}),e)})));return function(n,t,a){return e.apply(this,arguments)}}()}]),e}();function w(e,n){return n.startsWith("text/csv")?"csv":n.startsWith("image/")?"image":n.startsWith("text/")&&e.endsWith("csv")?"csv":void 0}var k,S=t(1),D=b.c.div(k||(k=Object(u.a)(["\n  min-height: 100%;\n  min-width: 100%;\n  position: relative;\n"]))),M=function(e){var n=e.children,t=i.a.useContext(g),a=p((function(){return t.files$}),[t],[]),r=Object(d.a)(a,1)[0],c=i.a.useState(),o=Object(d.a)(c,2),u=o[0],b=o[1],j=i.a.useCallback(function(){var e=Object(l.a)(s.a.mark((function e(n){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.preProcessFiles(n);case 2:return a=e.sent,e.next=5,t.acceptFiles(a.files);case 5:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),[t]);return Object(S.jsxs)(D,{onClick:function(){return 0===r.length&&void 0!==u?u.click():void 0},onDragOver:function(e){e.preventDefault(),e.stopPropagation()},onDrop:function(e){e.preventDefault(),e.stopPropagation(),j(e.dataTransfer.files)},style:{cursor:0===r.length?"pointer":void 0},children:[Object(S.jsx)("input",{multiple:!0,onChange:function(e){var n=e.target.files;null!==n&&n.length>0&&j(n)},ref:function(e){return null!==e?b(e):void 0},style:{display:"none"},type:"file"}),n]})},C=t(20),z=t(36),T=t.n(z),F=t(46),P=t(4),B=t(56),L=t(37),A=t.n(L),I=t(17),E=t.n(I),R=t(195),Y=t(191),$=t(192),U=t.n($),N=t(395),G=t(391),H=t(393),V=i.a.createContext(void 0),X=function e(n){Object(f.a)(this,e),this.fileStore=n,this.customerDataTimeZone$$=new m.a("America/Toronto"),this.bloodGlucose$=Object(N.a)([this.fileStore.filesByType$("csv"),this.customerDataTimeZone$$]).pipe(Object(H.a)((function(e){var n=Object(d.a)(e,2),t=n[0],a=n[1];return Object(G.a)((function(){return Promise.resolve(void 0)}),Object(l.a)(s.a.mark((function e(){var n,i,r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.map((function(e){for(var n=atob(e.data),t=new Uint8Array(n.length),a=0;a<n.length;a++)t[a]=n.charCodeAt(a);return new TextDecoder("utf-8").decode(t).replaceAll("\r\n","\n")})),e.next=3,Promise.all(n.map(q));case 3:return i=e.sent,r=i.reduce((function(e,n){return Object(P.a)(Object(P.a)({},e),n)}),{}),e.abrupt("return",Object.keys(r).map((function(e){var n,t,i=r[e];return{time:(n=e,t=a,E.a.tz(n,"DD-MM-YYYY HH:mm",t).valueOf()),value:i}})).sort((function(e,n){return e.time-n.time})));case 6:case"end":return e.stop()}}),e)}))))}))).pipe(Object(H.a)((function(e){return e()})))};function q(e){return new Promise((function(n,t){U()(e.split("\n").slice(1).join("\n"),{columns:!0},(function(e,a){if(void 0!==e)return t(e);var i,r={},c=Object(B.a)(a);try{for(c.s();!(i=c.n()).done;){var o=i.value,s=W(o);void 0!==s&&(r[o["Device Timestamp"]]=s)}}catch(e){c.e(e)}finally{c.f()}n(r)}))}))}function W(e){var n="0"===e["Record Type"]?parseFloat(e["Historic Glucose mmol/L"]):parseFloat(e["Scan Glucose mmol/L"]);return isNaN(n)?void 0:n}X.metricValuesToHighchartsPairs=function(e){return void 0!==e?e.map((function(e){return[e.time,e.value]})):void 0};var J=function(e){var n=e.id,t=e.markers,a=void 0===t?[]:t,r=e.onChangeRange,c=void 0===r?function(){}:r,o=e.onSelectTime,s=void 0===o?function(){}:o,l=e.timezone,u=i.a.useContext(V),b=p((function(){return u.bloodGlucose$.pipe(Object(O.a)(X.metricValuesToHighchartsPairs))}),[u]),j=Object(d.a)(b,1)[0],f=i.a.useMemo((function(){return void 0!==j?function(e,n,t){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:function(){},r=void 0;return{chart:{animation:!1,events:{click:function(e){i(this.xAxis[0].toValue(e.chartX))}},height:350,margin:[15,0,60,40],style:{fontFamily:"Poppins"},type:"spline"},colors:["rgba(255, 102, 102, 1)"],credits:{enabled:!1},legend:{enabled:!1},plotOptions:{series:{events:{click:function(e){return i(e.point.x)}},gapSize:18e5,gapUnit:"value",marker:{enabled:!1}}},series:[{data:n,name:"mmol/L",type:"spline"}],time:{moment:E.a,timezone:e},title:{text:""},xAxis:{dateTimeLabelFormats:{day:"%e. %b '%y",week:"%e. %b '%y"},events:{setExtremes:function(e){void 0!==a&&(void 0!==r&&clearTimeout(r),r=setTimeout((function(){return a(e.min,e.max)}),500))}},labels:{rotation:-45},ordinal:!1,plotLines:t.map((function(e){return Object(P.a)({width:2},e)})),type:"datetime"},yAxis:{plotBands:[{color:"rgba(87, 220, 140, 0.2)",from:4.1,to:6}],tickInterval:.5,title:{text:""}}}}(l,j,a,c,s):void 0}),[a,c,s,j,l]);return Object(S.jsx)(S.Fragment,{children:void 0!==f?Object(S.jsx)(A.a,{id:n,constructorType:"stockChart",highcharts:Y,options:f}):void 0})};var Z,_,K,Q,ee,ne,te,ae,ie,re,ce,oe,se,le,de,ue,be,je,pe,fe,he,ve,xe,me,Oe,ge,ye=t(19),we=b.c.button(Z||(Z=Object(u.a)(["\n  background: none;\n  border: solid 1px rgba(255, 255, 255, 0);\n  border-radius: 5px;\n  cursor: pointer;\n  display: inline-block;\n  height: 50px;\n  width: 50px;\n\n  &:hover,\n  &:focus {\n    border: solid 1px #eee;\n  }\n"]))),ke=function(e){var n=e.path,t=Object(ye.a)(e,["path"]);return Object(S.jsx)(we,Object(P.a)(Object(P.a)({},t),{},{children:Object(S.jsx)(T.a,{path:n})}))},Se=t(392),De=b.c.div(_||(_=Object(u.a)(["\n  display: none;\n  transition: opacity 250ms ease-in;\n\n  &.enter,\n  &.enter-done,\n  &.exit {\n    display: block;\n  }\n\n  &.enter {\n    opacity: 0;\n  }\n  &.enter.enter-active {\n    opacity: 1;\n  }\n\n  &.exit {\n    opacity: 1;\n  }\n  &.exit.exit-active {\n    opacity: 0;\n  }\n"]))),Me=b.c.div(K||(K=Object(u.a)(["\n  transform: translateX(100%);\n  transition: transform 250ms ease-in;\n\n  &.enter {\n    transform: translateX(100%);\n  }\n\n  &.enter.enter-active,\n  &.enter-done {\n    transform: translateX(0);\n  }\n\n  &.exit {\n    transform: translateX(0);\n  }\n\n  &.exit.exit-active {\n    transform: translateX(100%);\n  }\n"]))),Ce=Object(b.c)((function(e){var n=e.active,t=e.children,a=Object(ye.a)(e,["active","children"]),r=i.a.useRef(null);return Object(S.jsx)(Se.a,{addEndListener:function(){},in:n,nodeRef:r,timeout:250,children:Object(S.jsx)(De,Object(P.a)(Object(P.a)({},a),{},{ref:r,children:t}))})}))(Q||(Q=Object(u.a)(["\n  background-color: rgba(0, 0, 0, 0.4);\n  bottom: 0;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 1000;\n"]))),ze=Object(b.c)((function(e){var n=e.active,t=e.children,a=Object(ye.a)(e,["active","children"]),r=i.a.useRef(null);return Object(S.jsx)(Se.a,{addEndListener:function(){},in:n,nodeRef:r,timeout:250,children:Object(S.jsx)(Me,Object(P.a)(Object(P.a)({},a),{},{ref:r,children:t}))})}))(ee||(ee=Object(u.a)(["\n  background-color: #fff;\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n  overflow-x: hidden;\n  position: fixed;\n  right: 0;\n  top: 0;\n  width: auto;\n  z-index: 1000;\n\n  &.enter,\n  &.enter-done,\n  &.exit {\n    box-shadow: -3px 0px 10px 1px rgba(0, 0, 0, 0.5);\n  }\n"]))),Te=b.c.div(ne||(ne=Object(u.a)(["\n  padding: 20px;\n"]))),Fe=Object(b.c)(Te)(te||(te=Object(u.a)(["\n  align-items: center;\n  display: flex;\n  flex-direction: row;\n  z-index: 1;\n\n  &.scrolling {\n    box-shadow: 0px 3px 10px 1px rgba(0, 0, 0, 0.5);\n  }\n"]))),Pe=b.c.h1(ae||(ae=Object(u.a)(["\n  flex: 1;\n  font-size: 24px;\n  font-weight: 400;\n  white-space: nowrap;\n"]))),Be=Object(b.c)(Te)(ie||(ie=Object(u.a)(["\n  flex: 1;\n  overflow-y: auto;\n"]))),Le=function(e){var n=e.active,t=e.children,a=e.onClose,r=e.title,c=Object(ye.a)(e,["active","children","onClose","title"]),o=i.a.useState(!1),s=Object(d.a)(o,2),l=s[0],u=s[1];return Object(S.jsxs)(S.Fragment,{children:[Object(S.jsx)(Ce,{active:n,onClick:a}),Object(S.jsxs)(ze,{active:n,children:[void 0!==r||void 0!==a?Object(S.jsxs)(Fe,{className:l?"scrolling":void 0,children:[Object(S.jsx)(Pe,{children:r}),void 0!==a?Object(S.jsx)(ke,{path:C.d,onClick:a}):void 0]}):void 0,Object(S.jsx)(Be,Object(P.a)(Object(P.a)({},c),{},{onScroll:function(e){e.currentTarget.scrollTop>0?u(!0):u(!1)},children:t}))]})]})},Ae=b.c.input(re||(re=Object(u.a)(["\n  & {\n    border: solid 1px #ddd;\n    border-radius: 5px;\n    font-size: 16px;\n    margin-right: 10px;\n    padding: 10px;\n  }\n\n  &:focus {\n    border-color: #888;\n  }\n"]))),Ie="#ccc",Ee="#888",Re=b.c.button(ce||(ce=Object(u.a)(["\n  background-color: #fff;\n  border: solid 1px ",";\n  border-radius: ","px;\n  color: ",";\n  cursor: pointer;\n  display: block;\n  height: ","px;\n  margin: 25px;\n  padding: 0;\n  transition: border-color 250ms ease-in, color 250ms ease-in;\n  width: ","px;\n\n  &:hover,\n  &:focus {\n    border-color: ",";\n    color: ",";\n  }\n"])),Ie,37.5,Ie,75,75,Ee,Ee),Ye=b.c.div(oe||(oe=Object(u.a)(["\n  left: 0;\n  position: fixed;\n  top: 0;\n  z-index: 999;\n\n  @media print {\n    display: none;\n  }\n"]))),$e=function(e){var n=e.path,t=Object(ye.a)(e,["path"]);return Object(S.jsx)(Re,Object(P.a)(Object(P.a)({},t),{},{children:Object(S.jsx)(T.a,{path:n})}))},Ue=Object(b.c)(Le)(se||(se=Object(u.a)(["\n  min-width: 50vw;\n"]))),Ne=b.c.div(le||(le=Object(u.a)(["\n  padding: 25px;\n"]))),Ge=b.c.h2(de||(de=Object(u.a)(["\n  font-size: 18px;\n  font-weight: 500;\n  margin-bottom: 25px;\n"]))),He=b.c.ul(ue||(ue=Object(u.a)([""]))),Ve=b.c.li(be||(be=Object(u.a)(["\n  align-items: center;\n  border-radius: 5px;\n  display: flex;\n  flex-direction: row;\n  font-size: 16px;\n  margin-bottom: 15px;\n  padding: 5px;\n\n  :hover {\n    background-color: #eee;\n  }\n\n  & > div {\n    align-items: center;\n    display: flex;\n    margin-right: 15px;\n  }\n\n  & > div:nth-child(1) {\n    width: 225px;\n  }\n\n  & > div:nth-child(3) {\n    flex: 1;\n    justify-content: flex-end;\n  }\n"]))),Xe=Object(b.c)(Ve)(je||(je=Object(u.a)(["\n  font-size: 18px;\n  font-weight: 500;\n\n  :hover {\n    background: none;\n  }\n"]))),qe=b.c.button(pe||(pe=Object(u.a)(["\n  border: solid 1px #eee;\n  border-radius: 5px;\n  cursor: pointer;\n  display: block;\n  height: 3em;\n  overflow: visible;\n  position: relative;\n  width: 3em;\n"]))),We=b.c.div(fe||(fe=Object(u.a)(["\n  background: none;\n  bottom: 0;\n  left: 4em;\n  position: absolute;\n"]))),Je=b.c.div(he||(he=Object(u.a)(["\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n"]))),Ze=b.c.h1(ve||(ve=Object(u.a)(["\n  font-size: 2em;\n  padding: 25px;\n  @media print {\n    display: none;\n  }\n"]))),_e=b.c.div(xe||(xe=Object(u.a)(["\n  break-after: always;\n  break-inside: avoid;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  width: 11in;\n\n  @media print {\n    height: 8.3in;\n    margin-bottom: 0.2in;\n  }\n"]))),Ke=b.c.div(me||(me=Object(u.a)(["\n  display: flex;\n  flex-direction: column;\n  margin: 0 20px;\n\n  &.hidden {\n    display: none;\n  }\n\n  @media print {\n    &.hidden {\n      display: flex;\n      visibility: hidden;\n    }\n  }\n"]))),Qe=b.c.h2(Oe||(Oe=Object(u.a)(["\n  font-weight: 600;\n  margin: 5px 0 0 0;\n  text-align: center;\n  text-transform: uppercase;\n"]))),en=b.c.div(ge||(ge=Object(u.a)(["\n  flex: 1;\n"]))),nn=function(e){var n=e.onBack,t=e.timezone,a=i.a.useContext(V),r=p((function(){return a.bloodGlucose$.pipe(Object(O.a)(X.metricValuesToHighchartsPairs))}),[a]),c=Object(d.a)(r,1)[0],o=i.a.useState(!1),s=Object(d.a)(o,2),l=s[0],u=s[1],b=i.a.useState(4),j=Object(d.a)(b,2),f=j[0],h=j[1],v=i.a.useState([]),m=Object(d.a)(v,2),g=m[0],y=m[1],w=i.a.useState([]),k=Object(d.a)(w,2),D=k[0],M=k[1],z=i.a.useState(),T=Object(d.a)(z,2),F=T[0],L=T[1],I=i.a.createRef();return i.a.useEffect((function(){var e=I.current;if(null!==e){var n=function(n){null!==n.target&&e.contains(n.target)||L(void 0)};return document.addEventListener("click",n),function(){return document.removeEventListener("click",n)}}}),[I]),i.a.useEffect((function(){if(0===g.length&&u(!0),void 0!==c){var e,n=60*f*60*1e3,t={},a=g.map((function(e){return e.value})).sort(),i=Object(B.a)(a);try{for(i.s();!(e=i.n()).done;){var r=e.value;t[r]=[]}}catch(h){i.e(h)}finally{i.f()}var o,s=Object(B.a)(c);try{for(s.s();!(o=s.n()).done;)for(var l=Object(d.a)(o.value,2),b=l[0],j=l[1],p=0;p<a.length&&a[p]<=b;p++)b<a[p]+n&&t[a[p]].push([b-a[p],j])}catch(h){s.e(h)}finally{s.f()}M(g.map((function(e){return{id:e.value,options:tn(e.color,t[e.value],{max:n,min:0},{max:12,min:3}),title:new Date(e.value).toLocaleString()}})))}}),[f,g,c,t]),Object(S.jsxs)(S.Fragment,{children:[Object(S.jsxs)(Ye,{children:[Object(S.jsx)($e,{path:C.b,onClick:n}),Object(S.jsx)($e,{path:C.e,onClick:function(){return u(!0)}})]}),D.length>0?Object(S.jsxs)(Je,{children:[Object(S.jsx)(Ze,{children:"Case Studies"}),D.map((function(e){var n=e.id,t=e.options,a=e.title;return Object(S.jsx)(_e,{children:Object(S.jsxs)(Ke,{children:[Object(S.jsx)(Qe,{children:a}),Object(S.jsx)(en,{children:Object(S.jsx)(A.a,{id:"chart-".concat(n),options:t})})]})},n)}))]}):void 0,Object(S.jsxs)(Ue,{active:l,onClose:function(){return u(!1)},title:"Case Studies",children:[Object(S.jsxs)(Ne,{children:[Object(S.jsx)(Ge,{children:"Click to create case studies:"}),Object(S.jsx)(J,{markers:g,onSelectTime:function(e){return y((function(n){return x.a.chain(n).concat({color:"red",value:e}).uniqBy((function(e){return e.value})).sortBy((function(e){return e.value})).value()}))},timezone:t})]}),Object(S.jsxs)(Ne,{children:[Object(S.jsx)(Ge,{children:"How many hours after:"}),Object(S.jsx)("input",{max:"23",min:"1",placeholder:f.toString(),type:"number",onBlur:function(e){var n=parseFloat(e.target.value.trim());isNaN(n)||h(n)}})]}),Object(S.jsxs)(Ne,{children:[Object(S.jsx)(Ge,{children:"Update their appearance:"}),Object(S.jsxs)(He,{children:[Object(S.jsxs)(Xe,{children:[Object(S.jsx)("div",{children:"Date & Time"}),Object(S.jsx)("div",{children:"Color"})]}),g.map((function(e,n){return Object(S.jsxs)(Ve,{children:[Object(S.jsx)("div",{children:new Date(e.value).toLocaleString()}),Object(S.jsxs)("div",{children:[Object(S.jsx)(Ae,{onBlur:function(e){var t=e.target.value.trim();""!==t&&y((function(e){return e.map((function(e,a){return n===a?Object(P.a)(Object(P.a)({},e),{},{color:t}):e}))})),e.target.value=""},placeholder:e.color}),Object(S.jsx)(qe,{onClick:function(){return L(n)},style:{backgroundColor:e.color},children:F===n?Object(S.jsx)(We,{ref:I,children:Object(S.jsx)(R.a,{color:e.color,disableAlpha:!0,onChangeComplete:function(e){return y((function(t){return t.map((function(t,a){return n===a?Object(P.a)(Object(P.a)({},t),{},{color:e.hex}):t}))}))}})}):" "})]}),Object(S.jsx)("div",{children:Object(S.jsx)(ke,{onClick:function(){return y((function(e){return e.filter((function(e,t){return t!==n}))}))},path:C.f})})]},e.value)}))]})]})]})]})};function tn(e,n,t,a){var i=n.map((function(e){return e[1]})),r=Math.max.apply(Math,Object(F.a)(i));return{chart:{height:225,margin:[15,0,30,40],style:{fontFamily:"Poppins"},type:"spline"},colors:[e],credits:{enabled:!1},legend:{enabled:!1},plotOptions:{series:{gapSize:18e5,gapUnit:"value",marker:{enabled:!0,radius:2}}},series:[{data:n,name:"mmol/L",type:"spline"}],time:{moment:E.a,timezone:"UTC"},title:{text:""},xAxis:Object(P.a)(Object(P.a)({},t),{},{dateTimeLabelFormats:{day:"%H:%M"},type:"datetime"}),yAxis:Object(P.a)(Object(P.a)({},a),{},{plotBands:[{color:"rgba(87, 220, 140, 0.2)",from:4.1,to:6}],plotLines:x.a.compact([void 0!==r?{color:"#aaa",dashStyle:"Dot",value:r,width:2,zIndex:2}:void 0,{color:"rgba(65, 165, 105, 1)",dashStyle:"Dash",value:5,width:4,zIndex:2}]),tickInterval:.5,title:{text:""}})}}var an,rn,cn,on,sn,ln,dn,un,bn,jn,pn,fn,hn,vn,xn=t(34),mn=t(193),On=Object(b.c)(Le)(an||(an=Object(u.a)(["\n  min-width: 50vw;\n"]))),gn=b.c.div(rn||(rn=Object(u.a)(["\n  padding: 25px;\n"]))),yn=b.c.h2(cn||(cn=Object(u.a)(["\n  font-size: 18px;\n  font-weight: 500;\n  margin-bottom: 25px;\n"]))),wn=b.c.h3(on||(on=Object(u.a)(["\n  font-size: 16px;\n  font-weight: 400;\n  margin-bottom: 15px;\n"]))),kn=b.c.div(sn||(sn=Object(u.a)(["\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n"]))),Sn=b.c.h1(ln||(ln=Object(u.a)(["\n  font-size: 2em;\n  padding: 25px;\n  @media print {\n    display: none;\n  }\n"]))),Dn=b.c.div(dn||(dn=Object(u.a)(["\n  padding: 25px;\n  @media print {\n    display: none;\n  }\n"]))),Mn=b.c.div(un||(un=Object(u.a)(["\n  break-after: always;\n  break-inside: avoid;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  width: 11in;\n\n  @media print {\n    height: 8.3in;\n    margin-bottom: 0.2in;\n  }\n"]))),Cn=b.c.div(bn||(bn=Object(u.a)(["\n  display: flex;\n  flex-direction: column;\n  margin: 0 20px;\n\n  &.hidden {\n    display: none;\n  }\n\n  @media print {\n    &.hidden {\n      display: flex;\n      visibility: hidden;\n    }\n  }\n"]))),zn=b.c.h2(jn||(jn=Object(u.a)(["\n  font-weight: 600;\n  margin: 5px 0 0 0;\n  text-align: center;\n  text-transform: uppercase;\n"]))),Tn=b.c.div(pn||(pn=Object(u.a)(["\n  flex: 1;\n"]))),Fn=function(e){var n=e.onBack,t=e.timezone,a=Object(ye.a)(e,["onBack","timezone"]),r=i.a.useContext(V),c=i.a.useState(),o=Object(d.a)(c,2),s=o[0],l=o[1],u=i.a.useState(!1),b=Object(d.a)(u,2),j=b[0],f=b[1],h=i.a.useState(),v=Object(d.a)(h,2),m=v[0],g=v[1],y=i.a.useState(),w=Object(d.a)(y,2),k=w[0],D=w[1],M=p((function(){return r.bloodGlucose$.pipe(Object(O.a)(X.metricValuesToHighchartsPairs))}),[r]),z=Object(d.a)(M,1)[0],T=i.a.useState(),B=Object(d.a)(T,2),L=B[0],I=B[1],R=i.a.useMemo((function(){return void 0!==z?function(e,n,t,a){var i=void 0;return{chart:{animation:!1,height:225,margin:[15,0,60,40],style:{fontFamily:"Poppins"},type:"spline"},colors:["rgba(255, 102, 102, 1)"],credits:{enabled:!1},legend:{enabled:!1},plotOptions:{series:{gapSize:18e5,gapUnit:"value",marker:{enabled:!1}}},series:[{data:n,name:"mmol/L",type:"spline"}],time:{moment:E.a,timezone:e},title:{text:""},xAxis:Object(P.a)(Object(P.a)({},t),{},{dateTimeLabelFormats:{day:"%e. %b '%y",week:"%e. %b '%y"},events:{setExtremes:function(e){void 0!==a&&(void 0!==i&&clearTimeout(i),i=setTimeout((function(){return a(e.min,e.max)}),500))}},labels:{rotation:-45},ordinal:!1,type:"datetime"}),yAxis:{plotBands:[{color:"rgba(87, 220, 140, 0.2)",from:4.1,to:6}],tickInterval:.5,title:{text:""}}}}(t,z,void 0!==L?{max:L[1],min:L[0]}:void 0):void 0}),[z,L,t]),Y=i.a.useMemo((function(){return void 0!==z?x.a.chain(z).groupBy((function(e){var n=Object(d.a)(e,1)[0];return E()(n).tz(t).format("YYYY-MM-DD")})).toPairs().map((function(e){var n=Object(d.a)(e,2),t=n[0];return{data:n[1],day:t}})).sortBy("day").value():void 0}),[z,t]),$=i.a.useMemo((function(){if(void 0!==Y){var e=Y.length;return e>0?[E()(Y[0].day,"YYYY-MM-DD").tz(t),E()(Y[e-1].day,"YYYY-MM-DD").tz(t)]:void 0}}),[Y,t]),U=i.a.useMemo((function(){if(void 0!==Y){return x.a.chunk(Y.filter((function(e){var n=e.day;if(void 0!==s&&void 0!==s.startDate&&void 0!==s.endDate){var a=E()(n,"YYYY-M-DD").tz(t);return a.isSameOrAfter(s.startDate)&&a.isSameOrBefore(s.endDate)}return!0})).map((function(e){var n=e.data,a=e.day,i=E.a.tz(a,t),r={max:i.endOf("day").toDate().getTime(),min:i.startOf("day").toDate().getTime()},c=void 0===m?Math.ceil(2*Math.min(Math.max.apply(Math,[8].concat(Object(F.a)(n.map((function(e){return e[1]}))))),12))/2:m,o={max:Math.ceil(2*c)/2,min:void 0===k?3:k};return{hidden:!1,options:Pn(t,n,r,o),title:i.format("dddd, MMMM Do YYYY")}})),3)}}),[Y,s,m,k,t]);return Object(S.jsxs)(S.Fragment,{children:[Object(S.jsxs)(Ye,{children:[Object(S.jsx)($e,{path:C.b,onClick:n}),Object(S.jsx)($e,{path:C.e,onClick:function(){return f(!0)}})]}),Object(S.jsxs)(kn,Object(P.a)(Object(P.a)({},a),{},{children:[Object(S.jsx)(Sn,{children:"Overall"}),void 0!==R?Object(S.jsx)(Mn,{children:Object(S.jsx)(Cn,{children:Object(S.jsx)(Tn,{children:Object(S.jsx)(A.a,{highcharts:xn,options:Object(P.a)({},R)})})})},"page-group-overall"):void 0,Object(S.jsx)(Sn,{children:"Daily"}),void 0!==U?U.map((function(e){return Object(S.jsx)(Mn,{children:e.concat(new Array(3-e.length).fill(Object(P.a)(Object(P.a)({},e[0]),{},{hidden:!0,options:Object(P.a)(Object(P.a)({},e[0].options),{},{chart:Object(P.a)(Object(P.a)({},e[0].options.chart),{},{events:{}})})}))).map((function(e,n){var t=e.hidden,a=void 0!==t&&t,i=e.title,r=e.options;return Object(S.jsxs)(Cn,{className:a?"hidden":"visible",children:[Object(S.jsx)(zn,{children:i}),Object(S.jsx)(Tn,{children:Object(S.jsx)(A.a,{highcharts:xn,options:r},"chart-".concat(i))})]},n)}))},"page-group-".concat(e[0].title))})):void 0]})),Object(S.jsxs)(On,{active:j,onClose:function(){return f(!1)},title:"Settings",children:[Object(S.jsxs)(gn,{children:[Object(S.jsx)(yn,{children:"Overall Chart Settings"}),Object(S.jsx)(J,{id:"overall-range-filter",onChangeRange:function(e,n){return I([e,n])},timezone:t})]}),Object(S.jsxs)(gn,{children:[Object(S.jsx)(yn,{children:"Daily Charts Settings"}),void 0!==$?function(){var e=$.map((function(e){return e.toDate()})),n=Object(d.a)(e,2),t=n[0],a=n[1];return Object(S.jsxs)(S.Fragment,{children:[Object(S.jsx)(wn,{children:"Selected Date Range:"}),Object(S.jsx)(Dn,{children:Object(S.jsx)(mn.DateRangePicker,{maxDate:a,minDate:t,moveRangeOnFirstSelection:!1,onChange:function(e){"selection"in e&&l(e.selection)},ranges:[void 0===s?{endDate:a,key:"selection",startDate:t}:s],showSelectionPreview:!0})})]})}():void 0,Object(S.jsx)(wn,{children:"Selected Glucose Range:"}),Object(S.jsx)("div",{children:Object(S.jsxs)("label",{children:["Min:"," ",Object(S.jsx)(Ae,{placeholder:void 0!==k?k.toString():"Enter a minimum",onBlur:function(e){var n=parseFloat(e.target.value.trim());D(isNaN(n)?void 0:n)}})]})}),Object(S.jsx)("div",{children:Object(S.jsxs)("label",{children:["Max:"," ",Object(S.jsx)(Ae,{placeholder:void 0!==m?m.toString():"Enter a maximum",onBlur:function(e){var n=parseFloat(e.target.value.trim());g(isNaN(n)?void 0:n)}})]})})]})]})]})};function Pn(e,n,t,a){var i=n.map((function(e){return e[1]})),r=Math.max.apply(Math,Object(F.a)(i)),c=i.length>0?Math.round(10*i.reduce((function(e,n){return e+n}),0)/i.length)/10:void 0,o=Math.min.apply(Math,Object(F.a)(i)),s=Bn(n,{lower:7.2}).timeInRange,l=Bn(n,{upper:5}),d=l.effectiveDuration,u=l.timeInRange,b=d>0?u/d:1,j=[];return{chart:{events:{render:function(){j.forEach((function(e){return e.destroy()})),j.length=0;var e=28.5,n=177,t={fill:"#999",zIndex:1};if(void 0!==c&&void 0!==r){this.renderer.text("TIME IN RANGE (< ".concat(5,"):"),0).add().attr(Object(P.a)(Object(P.a)({},t),{},{x:45,y:e})),this.renderer.text("<b>".concat(Math.floor(100*b),"%</b> (").concat(E.a.duration(u,"milliseconds").format((function(){return u>36e5?"h[h] m[m]":"m[m]"})),")"),0).add().attr(Object(P.a)(Object(P.a)({},t),{},{x:n,y:e}));var a=this.renderer.text("MAXIMUM GLUCOSE:",0).add();a.attr(Object(P.a)(Object(P.a)({},t),{},{x:45,y:47}));var i=this.renderer.text("<b>".concat(r.toString(),"</b>"),0).add();i.attr(Object(P.a)(Object(P.a)({},t),{},{x:n,y:47}));var o=this.renderer.text("AVERAGE GLUCOSE:",0).add();o.attr(Object(P.a)(Object(P.a)({},t),{},{x:45,y:65.5}));var l=this.renderer.text("<b>".concat(c.toString(),"</b>"),0).add();l.attr(Object(P.a)(Object(P.a)({},t),{},{x:n,y:65.5}));var d=this.renderer.text("TIME EXPOSED (> ".concat(7.2,"):"),0).add();d.attr(Object(P.a)(Object(P.a)({},t),{},{x:45,y:84}));var p=this.renderer.text("<b>".concat(E.a.duration(s,"milliseconds").format((function(){return s>36e5?"h[h] m[m]":"m[m]"})),"</b>"),0).add();p.attr(Object(P.a)(Object(P.a)({},t),{},{x:n,y:84})),j.push(a,i,o,l,d,p)}}},height:225,margin:[15,0,30,40],style:{fontFamily:"Poppins"},type:"spline"},colors:["rgba(255, 102, 102, 1)"],credits:{enabled:!1},legend:{enabled:!1},plotOptions:{series:{gapSize:18e5,gapUnit:"value",marker:{enabled:!0,radius:2}}},series:[{data:n,name:"mmol/L",type:"spline"}],time:{moment:E.a,timezone:e},title:{text:""},xAxis:Object(P.a)(Object(P.a)({},t),{},{dateTimeLabelFormats:{day:"%H:%M"},type:"datetime"}),yAxis:Object(P.a)(Object(P.a)({},a),{},{plotBands:[{color:"rgba(87, 220, 140, 0.2)",from:4.1,to:6}],plotLines:x.a.compact([void 0!==r?{color:"#aaa",dashStyle:"Dot",value:r,width:2,zIndex:2}:void 0,{color:"rgba(65, 165, 105, 1)",dashStyle:"Dash",value:5,width:4,zIndex:2},void 0!==o?{color:"#aaa",dashStyle:"Dot",value:o,width:2,zIndex:2}:void 0]),tickInterval:.5,title:{text:""}})}}function Bn(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=n.lower,a=void 0===t?Number.MIN_VALUE:t,i=n.upper,r=void 0===i?Number.MAX_VALUE:i;return e.reduce((function(n,t,i){var c=n.effectiveDuration,o=n.timeInRange,s=Object(d.a)(t,2),l=s[0],u=s[1];if(i>0){var b=Object(d.a)(e[i-1],2),j=b[0],p=b[1],f=l-j;if(f<18e5){var h=Math.min(Math.max(u,a),r),v=Math.min(Math.max(p,a),r),x=(l-j)*Math.abs(u-p),m=(l-j)*Math.abs(h-v);return 0===x&&h!==u?{effectiveDuration:c+f,timeInRange:o}:0===x?{effectiveDuration:c+f,timeInRange:o+f}:{effectiveDuration:c+f,timeInRange:o+m/x*f}}return{effectiveDuration:c,timeInRange:o}}return{effectiveDuration:c,timeInRange:o}}),{effectiveDuration:0,timeInRange:0})}var Ln,An,In=b.c.div(fn||(fn=Object(u.a)(["\n  align-items: stretch;\n  display: flex;\n  height: 100vh;\n  justify-content: stretch;\n  width: 100vw;\n"]))),En=b.c.button(hn||(hn=Object(u.a)(["\n  align-items: center;\n  background: none;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  padding: 18vh 18vw;\n\n  &:hover {\n    background-color: #eee;\n  }\n"]))),Rn=b.c.h1(vn||(vn=Object(u.a)(["\n  font-size: 32px;\n  font-weight: 500;\n  text-align: center;\n"]))),Yn=function(){var e=i.a.useState("none"),n=Object(d.a)(e,2),t=n[0],a=n[1];return function(){switch(t){case"none":return Object(S.jsxs)(In,{children:[Object(S.jsxs)(En,{onClick:function(){return a("daily")},children:[Object(S.jsx)(T.a,{path:C.a}),Object(S.jsx)(Rn,{children:"Daily"})]}),Object(S.jsxs)(En,{onClick:function(){return a("caseStudies")},children:[Object(S.jsx)(T.a,{path:C.c}),Object(S.jsx)(Rn,{children:"Case Studies"})]})]});case"daily":return Object(S.jsx)(Fn,{timezone:"America/Toronto",onBack:function(){return a("none")}});case"caseStudies":return Object(S.jsx)(nn,{timezone:"America/Toronto",onBack:function(){return a("none")}})}}()},$n=Object(b.a)(Ln||(Ln=Object(u.a)(["\n  /* Global reset to remove all browser styling. */\n  ","\n\n  @page {\n    margin: 0;\n    size: landscape;\n  }\n\n  html,\n  body,\n  #root {\n    height: 100%;\n    width: 100%;\n  }\n\n  body {\n    font-family: 'Poppins', 'Roboto', 'Helvetica Neue', sans-serif;\n  }\n\n  #charts-for-print {\n    display: none;\n  }\n\n  @media print {\n    #charts-for-print {\n      display: block;\n    }\n\n    #charts-without-print {\n      display: none;\n    }\n\n    button.print {\n      display: none;\n    }\n  }\n"])),j.a),Un=b.c.div(An||(An=Object(u.a)(["\n  align-items: center;\n  display: flex;\n  justify-content: center;\n  min-height: 100%;\n  position: absolute;\n  min-width: 100%;\n"]))),Nn=function(e){var n=e.dataUrl,t=i.a.useState((function(){return new y})),a=Object(d.a)(t,1)[0],r=i.a.useState((function(){return new X(a)})),c=Object(d.a)(r,1)[0],o=p((function(){return a.filesByType$("csv")}),[a],[]),u=Object(d.a)(o,1)[0];return i.a.useEffect((function(){void 0!==n&&Object(l.a)(s.a.mark((function e(){var t,i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,a.preProcessUrl(n);case 2:return t=e.sent,i=t.files,e.next=6,a.acceptFiles(i);case 6:case"end":return e.stop()}}),e)})))()}),[n,a]),Object(S.jsxs)(S.Fragment,{children:[Object(S.jsx)($n,{}),Object(S.jsx)(g.Provider,{value:a,children:Object(S.jsx)(V.Provider,{value:c,children:Object(S.jsx)(M,{children:u.length>0?Object(S.jsx)(Yn,{}):void 0===n?Object(S.jsx)(Un,{children:Object(S.jsx)("span",{children:"Drag and drop a Blood Glucose CSV file to view charts."})}):Object(S.jsx)(Un,{children:Object(S.jsx)("span",{children:"Downloading data..."})})})})})]})},Gn=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,396)).then((function(n){var t=n.getCLS,a=n.getFID,i=n.getFCP,r=n.getLCP,c=n.getTTFB;t(e),a(e),i(e),r(e),c(e)}))},Hn=t(194),Vn=t.n(Hn);t(386),t(387),t(388);Vn()(xn);var Xn=new URLSearchParams(window.location.search).get("dataUrl");c.a.render(Object(S.jsx)(i.a.StrictMode,{children:Object(S.jsx)(Nn,{dataUrl:"string"===typeof Xn?Xn:void 0})}),document.getElementById("root")),Gn()}},[[389,1,2]]]);
//# sourceMappingURL=main.3dd44f8d.chunk.js.map