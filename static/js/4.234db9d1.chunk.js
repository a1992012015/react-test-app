(this["webpackJsonpreact-test-app"]=this["webpackJsonpreact-test-app"]||[]).push([[4],{216:function(e,t,a){"use strict";a.d(t,"a",(function(){return n}));var n=function(e){document.title=e}},217:function(e,t,a){"use strict";t.a=a.p+"static/media/logo.6ce24c58.svg"},220:function(e,t,a){e.exports={container:"_1wWQJYonfOe22PduF8hs1G"}},222:function(e,t,a){e.exports={container:"_22Gc0BaYoEe9USTQ4xGbmd",tips:"wxDQnLtsRddMduAGp_paC",loadingSvg:"_2GkV5Ds5aVowey6vKzzwTW",active:"_27E7d3lm9gn9ecAYbAkHCG","loading-rotate":"_36AfHpEtx1JBL41Cuk9h_U",path:"_1H8v9Lo5nqe6GRSVqXazh8","loading-dash":"_3vfzOQ3xVkM3lrt0flrb_c",actions:"_2VgDucT53FGHFYjbbWgbCR"}},223:function(e,t,a){"use strict";(function(e){a.d(t,"a",(function(){return f}));var n=a(35),r=a(45),o=a(47),i=a(46),c=a(29),s=a(52),l=a(43),p=a(19),u=a(75),d=a(14),g=a(37),h=function(t){Object(o.a)(c,t);var a=Object(i.a)(c);function c(){var e;Object(n.a)(this,c);for(var t=arguments.length,r=new Array(t),o=0;o<t;o++)r[o]=arguments[o];return(e=a.call.apply(a,[this].concat(r))).gameWorker=void 0,e}return Object(r.a)(c,[{key:"componentDidMount",value:function(){var t=this;this.gameWorker=new Worker(e,void 0),this.gameWorker.onmessage=function(e){var a=e.data;if(g.a.log&&console.log("%c========== ".concat(u.a[a.type]," =========="),"color: aqua;"),g.a.log&&console.log("get onmessage:",a),a.type===u.a.PUT){var n=a.payload,r={gameType:n.piece.role===d.a.white?l.a.DUEL_HUM:l.a.DUEL_COM,piece:n.piece};t.props.dispatch(Object(p.i)(r))}else if(a.type===u.a.BOARD){var o=a.payload,i={gameType:o.first?l.a.DUEL_HUM:l.a.DUEL_COM,first:o.first?d.a.block:d.a.white,board:o.pieces,name:o.name};t.props.dispatch(Object(p.a)(i))}else if(a.type===u.a.BACKWARD){g.a.log&&console.log("\u6094\u68cb\u6210\u529f\u3002\u3002\u3002");var c=a.payload;t.props.dispatch(Object(p.d)(c))}else if(a.type===u.a.FORWARD){g.a.log&&console.log("\u524d\u8fdb\u6210\u529f\u3002\u3002\u3002");var s=a.payload;t.props.dispatch(Object(p.g)(s))}else a.type===u.a.CONFIG?(g.a.log&&console.log("\u8bbe\u7f6econfig\u6210\u529f\u3002\u3002\u3002"),t.props.dispatch(Object(p.f)())):(g.a.log&&console.log("worker => ".concat(u.a[a.type])),g.a.log&&console.log("\u9519\u8bef\u7684Type\u3002\u3002\u3002"))},this.gameWorker.onerror=function(e){g.a.log&&console.warn(e)}}},{key:"componentDidUpdate",value:function(e,t){var a=this.props.workerPost;a&&this.gameWorker&&this.gameWorker.postMessage(a)}},{key:"componentWillUnmount",value:function(){var e;null===(e=this.gameWorker)||void 0===e||e.terminate()}},{key:"render",value:function(){return null}}]),c}(s.a),f=Object(c.c)((function(e){return{workerPost:e.worker}}),(function(e){return{dispatch:e}}))(h)}).call(this,a(224))},224:function(e,t,a){e.exports=a.p+"static/js/1.e9717660.chunk.worker.js"},225:function(e,t,a){e.exports={container:"_3Blj5zIaveqJXxMOwVEUUY",canvas:"_2PORtCNMuvjLNxW1oNNXng",piecesAnimation:"_1Y44oO1YsaCPR_-ORPuW6N",piecesLogo:"_2R8_SrxkonKK8LRmnJ3lb2","game-logo-spin":"_2HhNKLeoCM9QqlFvPu3AAS",piecesBox:"_3uTPOYuB1gCm_dsHiFDNFS",piecesRow:"_1V-N_O2ClDkQ0wxXMtyZRs",chessman:"_1Bdc0IK_A1fxUoVSsIUpdQ",chessmanWhite:"_1ZRW8YeBKlPSn5Uf--f_Hd",chessmanBlack:"_3dt9q6TJaJARnCYC2JTRgj",chessmanDisappear:"_2jAt-PHVv5kzHznAgO1BuA",chessmanAnim:"Ap7y_IFdFs2x_Kpr8l0uL",pulse:"_1Gu5qZXG0Dz0WoXkGq4yVs",chessmanMain:"_2fPto_z3iHvmmSAQ9yVpHF"}},226:function(e,t,a){"use strict";(function(e){var a="object"==typeof e&&e&&e.Object===Object&&e;t.a=a}).call(this,a(67))},240:function(e,t,a){"use strict";a.r(t);var n=a(60),r=a(35),o=a(45),i=a(47),c=a(46),s=a(0),l=a.n(s),p=a(29),u=a(226),d="object"==typeof self&&self&&self.Object===Object&&self,g=(u.a||d||Function("return this")()).Symbol,h=Object.prototype,f=h.hasOwnProperty,m=h.toString,v=g?g.toStringTag:void 0;var b=function(e){var t=f.call(e,v),a=e[v];try{e[v]=void 0;var n=!0}catch(o){}var r=m.call(e);return n&&(t?e[v]=a:delete e[v]),r},j=Object.prototype.toString;var y=function(e){return j.call(e)},O=g?g.toStringTag:void 0;var w=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":O&&O in Object(e)?b(e):y(e)};var k=function(e){return null!=e&&"object"==typeof e};var x=function(e){return"symbol"==typeof e||k(e)&&"[object Symbol]"==w(e)};var _=function(e){return"number"==typeof e?e:x(e)?NaN:+e};var C=function(e,t){for(var a=-1,n=null==e?0:e.length,r=Array(n);++a<n;)r[a]=t(e[a],a,e);return r},R=Array.isArray,S=g?g.prototype:void 0,A=S?S.toString:void 0;var D=function e(t){if("string"==typeof t)return t;if(R(t))return C(t,e)+"";if(x(t))return A?A.call(t):"";var a=t+"";return"0"==a&&1/t==-Infinity?"-0":a};var N=function(e,t){return function(a,n){var r;if(void 0===a&&void 0===n)return t;if(void 0!==a&&(r=a),void 0!==n){if(void 0===r)return n;"string"==typeof a||"string"==typeof n?(a=D(a),n=D(n)):(a=_(a),n=_(n)),r=e(a,n)}return r}},U=N((function(e,t){return e/t}),1),T=a(220),W=a.n(T),M=(a(218),a(219)),F=a(222),L=a.n(F),z=a(43),B=a(52),E=a(14),G=a(37),H=a(9),P=function(e){Object(i.a)(a,e);var t=Object(c.a)(a);function a(){var e;Object(r.a)(this,a);for(var n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];return(e=t.call.apply(t,[this].concat(o))).gameStartWay=function(t){return function(a){G.a.log&&console.log(a),1===t?e.props.gameStart(!1,!1):2===t?e.props.gameStart(!0,!0):e.props.gameStart(!0,!1)}},e.getChessColor=function(){var t=e.props,a=t.piece,n=t.first,r=t.winning;return a.role===E.a.empty&&n===E.a.empty?"lime":a.role===E.a.empty&&n===E.a.white?"white":a.role===E.a.empty&&n===E.a.block||r===E.a.block?"black":r===E.a.white||a.role===E.a.block?"white":a.role===E.a.white?"black":"lime"},e.getActiveClass=function(){var t=e.props,a=t.piece,n=t.first,r=t.winning;return a.role===E.a.empty&&n===E.a.empty||r!==E.a.empty?"":L.a.active},e.renderMessage=function(){var t=e.props,a=t.gameStatus,n=t.winning,r=t.steps,o=t.piece,i=t.time;return a===z.a.DUEL_FINISH?"".concat(n===E.a.white?"\u5706\u73af\u4e4b\u7406":"\u60a8\u5c45\u7136","\u8d62\u5f97\u4e86\u80dc\u5229\uff01\uff01\uff01"):a===z.a.DUEL_READY?"\u70b9\u51fb\u5f00\u59cb\u6309\u94ae\u5f00\u59cb\u6e38\u620f":a===z.a.DUEL_HUM&&0===r?"\u60a8\u7684\u5148\u624b\uff0c\u8bf7\u843d\u5b50":a===z.a.DUEL_HUM?"Score: ".concat(o.score," Step: ").concat(r," Time: ").concat(i,"s"):"\u7535\u8111\u6b63\u5728\u601d\u8003\u4e2d\u3002\u3002\u3002"},e.renderActions=function(){if(e.props.gameStatus===z.a.DUEL_READY)return Object(H.jsxs)(l.a.Fragment,{children:[Object(H.jsx)(M.a,{type:"primary",size:"large",onClick:e.gameStartWay(1),children:"\u5148\u624b\u5f00\u59cb"}),Object(H.jsx)(M.a,{type:"primary",size:"large",disabled:!0,onClick:e.gameStartWay(2),children:"\u968f\u673a\u5f00\u59cb"}),Object(H.jsx)(M.a,{type:"primary",size:"large",disabled:!0,onClick:e.gameStartWay(3),children:"\u540e\u624b\u5f00\u59cb"})]});var t=e.props,a=t.gameReset,n=t.gameForward,r=t.gameBackward;return Object(H.jsxs)(l.a.Fragment,{children:[Object(H.jsx)(M.a,{type:"primary",size:"large",disabled:!0,onClick:r,children:"\u6094\u68cb"}),Object(H.jsx)(M.a,{type:"primary",size:"large",onClick:a,children:"\u91cd\u7f6e\u6e38\u620f"}),Object(H.jsx)(M.a,{type:"primary",size:"large",disabled:!0,onClick:n,children:"\u653e\u5f03\u6094\u68cb"})]})},e}return Object(o.a)(a,[{key:"render",value:function(){var e=this.props.width;return Object(H.jsxs)("div",{className:L.a.container,style:{width:16*e},children:[Object(H.jsxs)("div",{className:L.a.tips,children:[Object(H.jsxs)("svg",{viewBox:"0 0 50 50",className:"".concat(L.a.loadingSvg," ").concat(this.getActiveClass()),children:[Object(H.jsx)("circle",{className:L.a.path,cx:"25",cy:"25",r:"20",fill:"none"}),Object(H.jsx)("circle",{cx:"25",cy:"25",r:"17",fill:this.getChessColor()})]}),this.renderMessage()]}),Object(H.jsx)("div",{className:L.a.actions,children:this.renderActions()})]})}}]),a}(B.a),I=a(223),Y=N((function(e,t){return e*t}),1),V=a(225),K=a.n(V),J=a(217),q=a(74),Q=function(e){Object(i.a)(a,e);var t=Object(c.a)(a);function a(){var e;Object(r.a)(this,a);for(var n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];return(e=t.call.apply(t,[this].concat(o))).canvasRef=l.a.createRef(),e.gameGo=function(t,a){G.a.log&&console.log("[x: ".concat(t,", y: ").concat(a,"]")),e.props.gameStatus===z.a.DUEL_HUM?e.props.gameGo(Object(q.a)({x:t,y:a,role:E.a.block})):G.a.log&&console.log("\u8fd8\u4e0d\u80fd\u843d\u5b50\uff01\uff01")},e.draftsman=function(){var t,a,n=e.props.width,r=Y(n,14),o=Y(n,14),i=null===(t=e.canvasRef)||void 0===t||null===(a=t.current)||void 0===a?void 0:a.getContext("2d");if(i){i.moveTo(0,0),i.lineTo(r,0),i.lineTo(r,o),i.lineTo(0,o),i.lineTo(0,0),i.stroke();for(var c=1;c<=13;c++){var s=c*n;i.moveTo(s,0),i.lineTo(s,o),i.stroke(),i.moveTo(0,s),i.lineTo(r,s),i.stroke()}}},e.renderRowDiv=function(){return e.props.board.map((function(t,a){return Object(H.jsx)("li",{className:K.a.piecesRow,children:e.row(a,t)},a)}))},e.row=function(t,a){var n=e.props.width;return a.map((function(a,r){var o={width:"".concat(n,"px"),height:"".concat(n,"px")};return Object(H.jsx)("div",{tabIndex:0,role:"button",style:o,className:K.a.chessman,onKeyDown:function(){return null},onClick:function(){return e.gameGo(r,t)},children:Object(H.jsx)("button",{type:"button","aria-label":"piece",className:e.getPieceClassName(a,t,r),children:a.step})},r)}))},e}return Object(o.a)(a,[{key:"componentDidUpdate",value:function(e){this.props.width!==e.width&&this.draftsman()}},{key:"getPieceClassName",value:function(e,t,a){var n=this.props,r=n.steps,o=n.gameStatus,i=n.winMap,c=n.first,s="";return s=null!==e.step&&e.role!==E.a.empty?e.role!==c?"".concat(K.a.chessmanMain," ").concat(K.a.chessmanWhite):"".concat(K.a.chessmanMain," ").concat(K.a.chessmanBlack):K.a.chessmanDisappear,r===e.step&&(s="".concat(s," ").concat(K.a.chessmanAnim)),o===z.a.DUEL_FINISH&&i.forEach((function(e){e.x===a&&e.y===t&&(s="".concat(s," ").concat(K.a.chessmanAnim))})),s}},{key:"render",value:function(){var e=this.props.width,t=14*e,a=U(e,2);return e?Object(H.jsxs)("div",{className:K.a.container,style:{width:16*e,height:16*e},children:[Object(H.jsx)("div",{className:K.a.piecesAnimation,children:Object(H.jsx)("img",{src:J.a,className:K.a.piecesLogo,alt:"logo"})}),Object(H.jsx)("canvas",{className:K.a.canvas,ref:this.canvasRef,width:t,height:t,children:"\u4f60\u7684\u7535\u8111\u6d4f\u89c8\u5668\u4e0d\u652f\u6301canvas\uff0c\u6362\u7535\u8111\u5427~"}),Object(H.jsx)("ul",{className:K.a.piecesBox,style:{padding:"".concat(a,"px")},children:this.renderRowDiv()})]}):null}}]),a}(B.a),X=a(62),Z=a(75),$=a(19),ee=a(216),te=function(e){Object(i.a)(a,e);var t=Object(c.a)(a);function a(e){var n;return Object(r.a)(this,a),(n=t.call(this,e)).containerRef=l.a.createRef(),n.gameStart=function(e,t){var a={type:Z.a.START,payload:{first:e,randomOpening:t}};n.props.dispatch(Object(X.a)(a))},n.gameConfig=function(e){G.a.log&&console.log("gameConfig");var t={type:Z.a.CONFIG,payload:{config:e}};n.props.dispatch(Object($.e)(t))},n.gameGo=function(e){G.a.log&&console.log("gameGo piece:",e);var t={gameType:z.a.DUEL_COM,piece:Object(q.a)(e)};n.props.dispatch(Object($.i)(t))},n.gameForward=function(){G.a.log&&console.log("gameForward");var e={type:Z.a.FORWARD};n.props.dispatch(Object($.e)(e))},n.gameBackward=function(){G.a.log&&console.log("gameBackward");var e={type:Z.a.BACKWARD};n.props.dispatch(Object($.e)(e))},n.gameReset=function(){G.a.log&&console.log("gameReset"),n.props.dispatch(Object($.h)())},n.resizeCheckerboard=function(){var e;if(null===(e=n.containerRef)||void 0===e?void 0:e.current){var t=n.containerRef.current.getBoundingClientRect(),a=t.width,r=t.height-98,o=a>r?r:a,i=o>720?720:o,c=Math.floor(U(i,16));n.setState({width:c})}},n.state={width:0},n}return Object(o.a)(a,[{key:"componentDidMount",value:function(){Object(ee.a)("\u4e94\u5b50\u68cb"),this.resizeCheckerboard(),window.addEventListener("resize",this.resizeCheckerboard)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.resizeCheckerboard)}},{key:"render",value:function(){var e={width:this.state.width,first:this.props.first,steps:this.props.steps,board:this.props.board,winMap:this.props.winMap,winning:this.props.winning,gameStatus:this.props.gameType,gameGo:this.gameGo},t={time:this.props.spendTime,width:this.state.width,steps:this.props.steps,first:this.props.first,piece:this.props.piece,winning:this.props.winning,gameStatus:this.props.gameType,gameReset:this.gameReset,gameStart:this.gameStart,gameForward:this.gameForward,gameBackward:this.gameBackward};return Object(H.jsxs)("div",{ref:this.containerRef,className:W.a.container,children:[Object(H.jsx)(I.a,{}),Object(H.jsx)(Q,Object(n.a)({},e)),Object(H.jsx)(P,Object(n.a)({},t))]})}}]),a}(B.a);t.default=Object(p.c)((function(e){return Object(n.a)({},e.gobang)}),(function(e){return{dispatch:e}}))(te)}}]);
//# sourceMappingURL=4.234db9d1.chunk.js.map