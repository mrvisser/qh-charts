(this["webpackJsonpqh-charts"]=this["webpackJsonpqh-charts"]||[]).push([[0],{103:function(e,t){},105:function(e,t){},115:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(61),o=n.n(i),c=(n(77),n(9)),s=n(11),u=n(7),l=n(62),f=n(13),d=n(30),p=n(16),v=n(66),h=n.n(v),b=n(28),m=n.n(b),j=n(17),O=n.n(j),x=n(69);function y(e,t,n){var a=r.a.useState(n),i=Object(c.a)(a,2),o=i[0],s=i[1],u=r.a.useCallback(e,t);return r.a.useEffect((function(){var e=u();if(void 0!==e){var t=e.subscribe({error:function(e){return console.error(e)},next:s});return function(){return t.unsubscribe()}}}),[u]),[o]}var g=n(67),w=n(8),M=n.n(w),T=n(18),k=n(33),D=n(68),S=n.n(D),$=n(118),P=n(116),B=r.a.createContext(void 0),C=function e(t){Object(k.a)(this,e),this.fileStore=t,this.bloodGlucose$=this.fileStore.filesByType$("csv").pipe(Object(P.a)((function(e){return Object($.a)((function(){return Promise.resolve(void 0)}),Object(T.a)(M.a.mark((function t(){var n,a,r;return M.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.map((function(e){for(var t=atob(e.data),n=new Uint8Array(t.length),a=0;a<t.length;a++)n[a]=t.charCodeAt(a);return new TextDecoder("utf-8").decode(n)})),t.next=3,Promise.all(n.map(F));case 3:return a=t.sent,r=a.reduce((function(e,t){return Object(f.a)(Object(f.a)({},e),t)}),{}),t.abrupt("return",Object.keys(r).map((function(e){var t,n=r[e];return{time:(t=e,O.a.tz(t,"DD-MM-YYYY HH:mm","America/Toronto").toDate()),value:n}})).sort((function(e,t){return e.time.getTime()-t.time.getTime()})));case 6:case"end":return t.stop()}}),t)}))))}))).pipe(Object(P.a)((function(e){return e()})))};function F(e){return new Promise((function(t,n){S()(e.split("\n").slice(1).join("\n"),{columns:!0},(function(e,a){if(void 0!==e)return n(e);var r,i={},o=Object(g.a)(a);try{for(o.s();!(r=o.n()).done;){var c=r.value,s=A(c);void 0!==s&&(i[c["Device Timestamp"]]=s)}}catch(e){o.e(e)}finally{o.f()}t(i)}))}))}function A(e){var t="0"===e["Record Type"]?parseFloat(e["Historic Glucose mmol/L"]):parseFloat(e["Scan Glucose mmol/L"]);return isNaN(t)?void 0:t}var L,Y,z,G,H=n(1),q=u.c.div(L||(L=Object(s.a)([""]))),E=u.c.div(Y||(Y=Object(s.a)(["\n  display: flex;\n  flex-direction: column;\n  margin: 0 20px;\n"]))),I=u.c.h2(z||(z=Object(s.a)(["\n  font-weight: 600;\n  margin: 5px 0 0 0;\n  text-align: center;\n  text-transform: uppercase;\n"]))),N=u.c.div(G||(G=Object(s.a)(["\n  flex: 1;\n"]))),U=function(){var e=r.a.useContext(B),t=y((function(){return e.bloodGlucose$.pipe(Object(x.a)((function(e){return void 0!==e?e.map((function(e){var t=e.time,n=e.value;return[t.getTime(),n]})):void 0}))).pipe(Object(x.a)((function(e){return void 0!==e?m.a.chain(e).groupBy((function(e){var t=Object(c.a)(e,1)[0];return O()(t).format("YYYY-MM-DD")})).toPairs().map((function(e){var t=Object(c.a)(e,2),n=t[0];return{data:t[1],day:n}})).sortBy("day").value():void 0})))}),[e]),n=Object(c.a)(t,1)[0],a=r.a.useState(),i=Object(c.a)(a,2),o=i[0],s=i[1];return r.a.useEffect((function(){if(void 0!==n){var e=n.flatMap((function(e){return e.data.map((function(e){return e[1]}))})),t=Math.floor(Math.min.apply(Math,[4].concat(Object(d.a)(e)))),a={max:Math.ceil(Math.max.apply(Math,[7].concat(Object(d.a)(e)))),min:t};s(n.map((function(e){var t=e.data,n=e.day,r=O.a.tz(n,"America/Toronto");return{options:J(t,{max:r.endOf("day").toDate().getTime(),min:r.startOf("day").toDate().getTime()},a),title:r.format("dddd, MMMM Do")}})))}else s(void 0)}),[n]),Object(H.jsx)(q,{children:void 0!==o?o.map((function(e){var t=e.title,n=e.options;return Object(H.jsxs)(E,{children:[Object(H.jsx)(I,{children:t}),Object(H.jsx)(N,{children:Object(H.jsx)(h.a,{highcharts:p,options:n})})]},t)})):void 0})};function J(e,t,n){var a=e.map((function(e){return e[1]})),r=Math.max.apply(Math,Object(d.a)(a)),i=Math.min.apply(Math,Object(d.a)(a)),o=void 0;return{chart:{events:{render:function(){void 0!==o&&(o.destroy(),o=void 0),void 0!==r&&(o=this.renderer.label(r.toString(),-100).add()).attr({x:this.plotWidth+this.plotLeft,y:this.yAxis[0].toPixels(r,!1)-o.getBBox().height/2})}},height:225,margin:[10,50,50,50],type:"spline"},colors:["rgba(255, 102, 102, 1)"],legend:{enabled:!1},plotOptions:{series:{gapSize:18e5,gapUnit:"value",marker:{enabled:!0,radius:3}}},series:[{data:e,name:"mmol/L",type:"spline"}],title:{text:""},xAxis:Object(f.a)(Object(f.a)({},t),{},{dateTimeLabelFormats:{day:"%H:%M"},type:"datetime"}),yAxis:Object(f.a)(Object(f.a)({},n),{},{plotBands:[{color:"rgba(87, 220, 140, 0.2)",from:4.1,to:6}],plotLines:m.a.compact([void 0!==r?{color:"#aaa",dashStyle:"Dot",value:r,width:2}:void 0,void 0!==i?{color:"#aaa",dashStyle:"Dot",value:i,width:2}:void 0]),tickInterval:.5,title:{text:""}})}}var R,W=n(70),V=n(117),K=r.a.createContext(void 0),Q=function(){function e(){Object(k.a)(this,e),this.files$$=new V.a([]),this.files$=this.files$$.asObservable()}return Object(W.a)(e,[{key:"filesByType$",value:function(e){return this.files$.pipe(Object(x.a)((function(t){return t.filter((function(t){return t.type===e}))})))}},{key:"preProcessFiles",value:function(){var e=Object(T.a)(M.a.mark((function e(t){var n,a,r,i,o,c,s,u,l,f;return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=[],a=[],r=0;case 3:if(!(r<t.length)){e.next=22;break}if(null===(i=t.item(r))){e.next=19;break}if(o=i.type,void 0===(c=o.startsWith("image/")?"image":"text/csv"===o?"csv":void 0)){e.next=18;break}return e.next=11,i.arrayBuffer();case 11:s=e.sent,u=btoa(new Uint8Array(s).reduce((function(e,t){return e+String.fromCharCode(t)}),"")),l=i.name,f=s.byteLength,n.push({contentType:o,data:u,name:l,size:f,type:c}),e.next=19;break;case 18:a.push(i);case 19:r++,e.next=3;break;case 22:return e.abrupt("return",{files:n,unsupported:a});case 23:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"acceptFiles",value:function(){var e=Object(T.a)(M.a.mark((function e(t){return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.files$$.next(m.a.chain(this.files$$.value).concat(t).uniqBy("data").value());case 1:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),e}();var X,Z,_=u.c.div(R||(R=Object(s.a)(["\n  min-height: 100%;\n  min-width: 100%;\n  position: relative;\n"]))),ee=function(e){var t=e.children,n=r.a.useContext(K);return Object(H.jsx)(_,{onDragOver:function(e){e.preventDefault(),e.stopPropagation()},onDrop:function(){var e=Object(T.a)(M.a.mark((function e(t){var a;return M.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),t.stopPropagation(),e.next=4,n.preProcessFiles(t.dataTransfer.files);case 4:return a=e.sent,e.next=7,n.acceptFiles(a.files);case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),children:t})},te=Object(u.a)(X||(X=Object(s.a)(["\n  /* Global reset to remove all browser styling. */\n  ","\n\n  @page {\n    margin: 0;\n  }\n\n  html,\n  body,\n  #root {\n    height: 100%;\n    width: 100%;\n  }\n\n  body {\n    font-family: 'Poppins', 'Roboto', 'Helvetica Neue', sans-serif;\n  }\n"])),l.a),ne=u.c.div(Z||(Z=Object(s.a)(["\n  align-items: center;\n  display: flex;\n  justify-content: center;\n  height: 100%;\n  position: absolute;\n  width: 100%;\n"]))),ae=function(){var e=r.a.useState((function(){return new Q})),t=Object(c.a)(e,1)[0],n=r.a.useState((function(){return new C(t)})),a=Object(c.a)(n,1)[0],i=y((function(){return t.filesByType$("csv")}),[t],[]),o=Object(c.a)(i,1)[0];return Object(H.jsxs)(H.Fragment,{children:[Object(H.jsx)(te,{}),Object(H.jsx)(K.Provider,{value:t,children:Object(H.jsx)(B.Provider,{value:a,children:Object(H.jsx)(ee,{children:o.length>0?Object(H.jsx)(U,{}):Object(H.jsx)(ne,{children:Object(H.jsx)("span",{children:"Drag and drop a CSV file to graph it. Add as many as you like."})})})})})]})},re=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,119)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,i=t.getLCP,o=t.getTTFB;n(e),a(e),r(e),i(e),o(e)}))},ie=n(71);n.n(ie)()(p),p.setOptions({time:{timezoneOffset:O.a.tz("America/Toronto").toDate().getTimezoneOffset()}}),o.a.render(Object(H.jsx)(r.a.StrictMode,{children:Object(H.jsx)(ae,{})}),document.getElementById("root")),re()},77:function(e,t,n){}},[[115,1,2]]]);
//# sourceMappingURL=main.f2456441.chunk.js.map