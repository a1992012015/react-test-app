(this["webpackJsonpreact-test-app"]=this["webpackJsonpreact-test-app"]||[]).push([[3],{247:function(e,a,t){"use strict";t.d(a,"a",(function(){return n}));var n=function(e){document.title=e}},248:function(e,a,t){"use strict";a.a=t.p+"static/media/logo.6ce24c58.svg"},252:function(e,a,t){e.exports={container:"_1wWQJYonfOe22PduF8hs1G"}},255:function(e,a,t){e.exports={container:"_22Gc0BaYoEe9USTQ4xGbmd",tips:"wxDQnLtsRddMduAGp_paC",loadingSvg:"_2GkV5Ds5aVowey6vKzzwTW",active:"_27E7d3lm9gn9ecAYbAkHCG","loading-rotate":"_36AfHpEtx1JBL41Cuk9h_U",path:"_1H8v9Lo5nqe6GRSVqXazh8","loading-dash":"_3vfzOQ3xVkM3lrt0flrb_c",actions:"_2VgDucT53FGHFYjbbWgbCR",btn:"_2gtparmyoMTbLQFj4o9qTn"}},256:function(e,a,t){"use strict";(function(e){t.d(a,"a",(function(){return m}));var n=t(43),c=t(51),s=t(53),o=t(52),i=t(34),r=t(64),l=t(37),p=t(30),h=t(92),u=t(21),d=t(66),g=function(a){Object(s.a)(i,a);var t=Object(o.a)(i);function i(){var e;Object(n.a)(this,i);for(var a=arguments.length,c=new Array(a),s=0;s<a;s++)c[s]=arguments[s];return(e=t.call.apply(t,[this].concat(c))).gameWorker=void 0,e}return Object(c.a)(i,[{key:"componentDidMount",value:function(){var a=this;this.gameWorker=new Worker(e,void 0),this.gameWorker.onmessage=function(e){var t=e.data;if(d.a.log&&console.log("%c========== ".concat(h.a[t.type]," =========="),"color: aqua;"),d.a.log&&console.log("get onmessage:",t),t.type===h.a.PUT){var n=t.payload,c={gameType:n.piece.role===u.a.white?l.a.DUEL_BLOCK:l.a.DUEL_WHITE,piece:n.piece};a.props.dispatch(Object(p.h)(c))}else if(t.type===h.a.BOARD){var s=t.payload,o={pieces:s.pieces,piece:s.piece,name:s.name,first:s.first,open:s.open};a.props.dispatch(Object(p.i)(o))}else if(t.type===h.a.BACKWARD){d.a.log&&console.log("\u6094\u68cb\u6210\u529f\u3002\u3002\u3002");var i=t.payload;a.props.dispatch(Object(p.d)(i))}else if(t.type===h.a.FORWARD){d.a.log&&console.log("\u524d\u8fdb\u6210\u529f\u3002\u3002\u3002");var r=t.payload;a.props.dispatch(Object(p.g)(r))}else t.type===h.a.CONFIG?(d.a.log&&console.log("\u8bbe\u7f6econfig\u6210\u529f\u3002\u3002\u3002"),a.props.dispatch(Object(p.f)())):(d.a.log&&console.log("worker => ".concat(h.a[t.type])),d.a.log&&console.log("\u9519\u8bef\u7684Type\u3002\u3002\u3002"))},this.gameWorker.onerror=function(e){d.a.log&&console.warn(e)}}},{key:"componentDidUpdate",value:function(e,a){var t=this.props.workerPost;t&&this.gameWorker&&this.gameWorker.postMessage(t)}},{key:"componentWillUnmount",value:function(){var e;null===(e=this.gameWorker)||void 0===e||e.terminate()}},{key:"render",value:function(){return null}}]),i}(r.a),m=Object(i.c)((function(e){return{workerPost:e.worker}}),(function(e){return{dispatch:e}}))(g)}).call(this,t(257))},257:function(e,a,t){e.exports=t.p+"static/js/1.80aaacfb.chunk.worker.js"},258:function(e,a,t){e.exports={container:"_3Blj5zIaveqJXxMOwVEUUY",canvas:"_2PORtCNMuvjLNxW1oNNXng",piecesAnimation:"_1Y44oO1YsaCPR_-ORPuW6N",piecesLogo:"_2R8_SrxkonKK8LRmnJ3lb2","game-logo-spin":"_2HhNKLeoCM9QqlFvPu3AAS",piecesBox:"_3uTPOYuB1gCm_dsHiFDNFS",piecesRow:"_1V-N_O2ClDkQ0wxXMtyZRs",chessman:"_1Bdc0IK_A1fxUoVSsIUpdQ",chessmanWhite:"_1ZRW8YeBKlPSn5Uf--f_Hd",chessmanBlack:"_3dt9q6TJaJARnCYC2JTRgj",chessmanDisappear:"_2jAt-PHVv5kzHznAgO1BuA",chessmanAnim:"Ap7y_IFdFs2x_Kpr8l0uL",pulse:"_1Gu5qZXG0Dz0WoXkGq4yVs",chessmanMain:"_2fPto_z3iHvmmSAQ9yVpHF"}},276:function(e,a,t){"use strict";t.r(a);var n=t(77),c=t(43),s=t(51),o=t(53),i=t(52),r=t(0),l=t.n(r),p=t(34),h=t(250),u=t(252),d=t.n(u),g=(t(270),t(269)),m=(t(149),t(249)),b=t(93),j=t(255),f=t.n(j),v=t(37),O=t(64),y=t(21),w=t(66),k=t(13),x=function(e){Object(o.a)(t,e);var a=Object(i.a)(t);function t(e){var s;return Object(c.a)(this,t),(s=a.call(this,e)).gameStartWay=function(e){w.a.log&&console.log(e);var a=s.state,t=a.first,n=a.open;s.props.gameStart(t,n)},s.changeState=function(e){return function(a){s.setState(Object(n.a)(Object(n.a)({},s.state),{},Object(b.a)({},e,!!a)))}},s.changeOpen=function(e){s.setState({open:!!e})},s.getChessColor=function(){var e=s.props,a=e.piece,t=e.playChess,n=e.winning;return a.role===y.a.empty&&t===y.a.empty?"lime":a.role===y.a.empty&&t===y.a.white?"white":a.role===y.a.empty&&t===y.a.block||n===y.a.block?"black":n===y.a.white||a.role===y.a.block?"white":a.role===y.a.white?"black":"lime"},s.getActiveClass=function(){var e=s.props,a=e.piece,t=e.playChess,n=e.winning;return a.role===y.a.empty&&t===y.a.empty||n!==y.a.empty?"":f.a.active},s.renderMessage=function(){var e=s.props,a=e.gameStatus,t=e.winning,n=e.steps,c=e.piece,o=e.time,i=e.playChess;return a===v.a.DUEL_FINISH?"".concat(t===y.a.white?"\u5706\u73af\u4e4b\u7406":"\u60a8\u5c45\u7136","\u8d62\u5f97\u4e86\u80dc\u5229\uff01\uff01\uff01"):a===v.a.DUEL_READY?"\u70b9\u51fb\u5f00\u59cb\u6309\u94ae\u5f00\u59cb\u6e38\u620f":a===v.a.DUEL_BLOCK&&0===n?"\u60a8\u7684\u5148\u624b\uff0c\u8bf7\u843d\u5b50":a===v.a.DUEL_WHITE&&0===n?"\u60a8\u7684\u540e\u624b\uff0c\u8bf7\u843d\u5b50":a===v.a.DUEL_BLOCK&&i===y.a.white||a===v.a.DUEL_WHITE&&i===y.a.block?"\u7535\u8111\u6b63\u5728\u601d\u8003\u4e2d\u3002\u3002\u3002":"Score: ".concat(c.score," Step: ").concat(n," Time: ").concat(o,"s")},s.renderActions=function(){var e=s.props.gameStatus,a=s.state,t=a.first,n=a.open;if(e===v.a.DUEL_READY)return Object(k.jsxs)(l.a.Fragment,{children:[Object(k.jsx)(m.a,{className:f.a.btn,type:"primary",size:"large",onClick:s.gameStartWay,children:"\u5f00\u59cb"}),Object(k.jsxs)(g.a,{className:f.a.btn,value:t?1:0,size:"large",onChange:s.changeState("first"),children:[Object(k.jsx)(g.a.Option,{value:1,children:"\u5148\u624b"}),Object(k.jsx)(g.a.Option,{value:0,children:"\u540e\u624b"})]}),Object(k.jsxs)(g.a,{className:f.a.btn,value:n?1:0,disabled:!0,size:"large",onChange:s.changeState("open"),children:[Object(k.jsx)(g.a.Option,{value:0,children:"\u81ea\u5b9a\u4e49\u5f00\u5c40"}),Object(k.jsx)(g.a.Option,{value:1,children:"\u968f\u673a\u5f00\u5c40"})]})]});var c=s.props,o=c.gameReset,i=c.gameForward,r=c.gameBackward;return Object(k.jsxs)(l.a.Fragment,{children:[Object(k.jsx)(m.a,{type:"primary",size:"large",disabled:!0,onClick:r,children:"\u6094\u68cb"}),Object(k.jsx)(m.a,{type:"primary",size:"large",onClick:o,children:"\u91cd\u7f6e\u6e38\u620f"}),Object(k.jsx)(m.a,{type:"primary",size:"large",disabled:!0,onClick:i,children:"\u653e\u5f03\u6094\u68cb"})]})},s.state={first:!1,open:!1},s}return Object(s.a)(t,[{key:"render",value:function(){var e=this.props.width;return Object(k.jsxs)("div",{className:f.a.container,style:{width:16*e},children:[Object(k.jsxs)("div",{className:f.a.tips,children:[Object(k.jsxs)("svg",{viewBox:"0 0 50 50",className:"".concat(f.a.loadingSvg," ").concat(this.getActiveClass()),children:[Object(k.jsx)("circle",{className:f.a.path,cx:"25",cy:"25",r:"20",fill:"none"}),Object(k.jsx)("circle",{cx:"25",cy:"25",r:"17",fill:this.getChessColor()})]}),this.renderMessage()]}),Object(k.jsx)("div",{className:f.a.actions,children:this.renderActions()})]})}}]),t}(O.a),C=t(256),_=t(259),R=t(258),D=t.n(R),A=t(248),S=t(91),L=function(e){Object(o.a)(t,e);var a=Object(i.a)(t);function t(){var e;Object(c.a)(this,t);for(var n=arguments.length,s=new Array(n),o=0;o<n;o++)s[o]=arguments[o];return(e=a.call.apply(a,[this].concat(s))).canvasRef=l.a.createRef(),e.gameGo=function(a,t){w.a.log&&console.log("[x: ".concat(a,", y: ").concat(t,"]"));var n=e.props,c=n.gameStatus,s=n.playChess;c===v.a.DUEL_BLOCK&&s===y.a.block||c===v.a.DUEL_WHITE&&s===y.a.white?e.props.gameGo(Object(S.a)({x:a,y:t,role:s})):w.a.log&&console.log("\u8fd8\u4e0d\u80fd\u843d\u5b50\uff01\uff01")},e.draftsman=function(){var a,t,n=e.props.width,c=Object(_.a)(n,14),s=Object(_.a)(n,14),o=null===(a=e.canvasRef)||void 0===a||null===(t=a.current)||void 0===t?void 0:t.getContext("2d");if(o){o.moveTo(0,0),o.lineTo(c,0),o.lineTo(c,s),o.lineTo(0,s),o.lineTo(0,0),o.stroke();for(var i=1;i<=13;i++){var r=i*n;o.moveTo(r,0),o.lineTo(r,s),o.stroke(),o.moveTo(0,r),o.lineTo(c,r),o.stroke()}}},e.renderRowDiv=function(){return e.props.board.map((function(a,t){return Object(k.jsx)("li",{className:D.a.piecesRow,children:e.row(t,a)},t)}))},e.row=function(a,t){var n=e.props.width;return t.map((function(t,c){var s={width:"".concat(n,"px"),height:"".concat(n,"px")};return Object(k.jsx)("div",{tabIndex:0,role:"button",style:s,className:D.a.chessman,onKeyDown:function(){return null},onClick:function(){return e.gameGo(c,a)},children:Object(k.jsx)("button",{type:"button","aria-label":"piece",className:e.getPieceClassName(t,a,c),children:t.step})},c)}))},e}return Object(s.a)(t,[{key:"componentDidUpdate",value:function(e){this.props.width!==e.width&&this.draftsman()}},{key:"getPieceClassName",value:function(e,a,t){var n=this.props,c=n.steps,s=n.gameStatus,o=n.winMap,i="";return i=e.role!==y.a.empty?e.role===y.a.white?"".concat(D.a.chessmanMain," ").concat(D.a.chessmanWhite):"".concat(D.a.chessmanMain," ").concat(D.a.chessmanBlack):D.a.chessmanDisappear,s===v.a.DUEL_FINISH?o.forEach((function(e){e.x===t&&e.y===a&&(i="".concat(i," ").concat(D.a.chessmanAnim))})):c===e.step&&(i="".concat(i," ").concat(D.a.chessmanAnim)),i}},{key:"render",value:function(){var e=this.props.width,a=14*e,t=Object(h.a)(e,2);return e?Object(k.jsxs)("div",{className:D.a.container,style:{width:16*e,height:16*e},children:[Object(k.jsx)("div",{className:D.a.piecesAnimation,children:Object(k.jsx)("img",{src:A.a,className:D.a.piecesLogo,alt:"logo"})}),Object(k.jsx)("canvas",{className:D.a.canvas,ref:this.canvasRef,width:a,height:a,children:"\u4f60\u7684\u7535\u8111\u6d4f\u89c8\u5668\u4e0d\u652f\u6301canvas\uff0c\u6362\u7535\u8111\u5427~"}),Object(k.jsx)("ul",{className:D.a.piecesBox,style:{padding:"".concat(t,"px")},children:this.renderRowDiv()})]}):null}}]),t}(O.a),T=t(79),E=t(92),N=t(30),W=t(247),B=function(e){Object(o.a)(t,e);var a=Object(i.a)(t);function t(e){var n;return Object(c.a)(this,t),(n=a.call(this,e)).containerRef=l.a.createRef(),n.gameStart=function(e,a){var t={type:E.a.START,payload:{first:e,randomOpening:a}};n.props.dispatch(Object(T.a)(t))},n.gameConfig=function(e){w.a.log&&console.log("gameConfig");var a={type:E.a.CONFIG,payload:{config:e}};n.props.dispatch(Object(N.e)(a))},n.gameGo=function(e){w.a.log&&console.log("gameGo piece:",e);var a=n.props.playChess;if(/Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent)){var t=n.state.clickPiece;if(t.x===e.x&&t.y===e.y){var c={gameType:a===y.a.block?v.a.DUEL_WHITE:v.a.DUEL_BLOCK,piece:Object(S.a)(e)};n.props.dispatch(Object(N.h)(c))}else n.setState({clickPiece:e})}else{var s={gameType:a===y.a.block?v.a.DUEL_WHITE:v.a.DUEL_BLOCK,piece:Object(S.a)(e)};n.props.dispatch(Object(N.h)(s))}},n.gameForward=function(){w.a.log&&console.log("gameForward");var e={type:E.a.FORWARD};n.props.dispatch(Object(N.e)(e))},n.gameBackward=function(){w.a.log&&console.log("gameBackward");var e={type:E.a.BACKWARD};n.props.dispatch(Object(N.e)(e))},n.gameReset=function(){w.a.log&&console.log("gameReset"),n.props.dispatch(Object(N.b)())},n.resizeCheckerboard=function(){var e;if(null===(e=n.containerRef)||void 0===e?void 0:e.current){var a=n.containerRef.current.getBoundingClientRect(),t=a.width,c=a.height-98,s=t>c?c:t,o=s>720?720:s,i=Math.floor(Object(h.a)(o,16));n.setState({width:i})}},n.state={width:0,clickPiece:Object(S.a)({x:0,y:0,role:y.a.empty})},n}return Object(s.a)(t,[{key:"componentDidMount",value:function(){Object(W.a)("\u4e94\u5b50\u68cb"),this.resizeCheckerboard(),window.addEventListener("resize",this.resizeCheckerboard)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.resizeCheckerboard)}},{key:"render",value:function(){var e={width:this.state.width,steps:this.props.steps,board:this.props.board,winMap:this.props.winMap,winning:this.props.winning,gameStatus:this.props.gameType,playChess:this.props.playChess,gameGo:this.gameGo},a={width:this.state.width,steps:this.props.steps,piece:this.props.piece,time:this.props.spendTime,winning:this.props.winning,playChess:this.props.playChess,gameStatus:this.props.gameType,gameReset:this.gameReset,gameStart:this.gameStart,gameForward:this.gameForward,gameBackward:this.gameBackward};return Object(k.jsxs)("div",{ref:this.containerRef,className:d.a.container,children:[Object(k.jsx)(C.a,{}),Object(k.jsx)(L,Object(n.a)({},e)),Object(k.jsx)(x,Object(n.a)({},a))]})}}]),t}(O.a);a.default=Object(p.c)((function(e){return Object(n.a)({},e.gobang)}),(function(e){return{dispatch:e}}))(B)}}]);
//# sourceMappingURL=3.4fa65a0a.chunk.js.map