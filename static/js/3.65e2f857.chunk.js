(this["webpackJsonpreact-test-app"]=this["webpackJsonpreact-test-app"]||[]).push([[3],{247:function(e,a,t){"use strict";t.d(a,"a",(function(){return n}));var n=function(e){document.title=e}},248:function(e,a,t){"use strict";a.a=t.p+"static/media/logo.6ce24c58.svg"},252:function(e,a,t){e.exports={container:"_1wWQJYonfOe22PduF8hs1G"}},255:function(e,a,t){e.exports={container:"_22Gc0BaYoEe9USTQ4xGbmd",tips:"wxDQnLtsRddMduAGp_paC",loadingSvg:"_2GkV5Ds5aVowey6vKzzwTW",active:"_27E7d3lm9gn9ecAYbAkHCG","loading-rotate":"_36AfHpEtx1JBL41Cuk9h_U",path:"_1H8v9Lo5nqe6GRSVqXazh8","loading-dash":"_3vfzOQ3xVkM3lrt0flrb_c",actions:"_2VgDucT53FGHFYjbbWgbCR",btn:"_2gtparmyoMTbLQFj4o9qTn"}},256:function(e,a,t){"use strict";(function(e){t.d(a,"a",(function(){return m}));var n=t(43),s=t(51),c=t(53),o=t(52),i=t(34),r=t(64),l=t(38),p=t(31),h=t(79),u=t(22),g=t(66),d=function(a){Object(c.a)(i,a);var t=Object(o.a)(i);function i(){var e;Object(n.a)(this,i);for(var a=arguments.length,s=new Array(a),c=0;c<a;c++)s[c]=arguments[c];return(e=t.call.apply(t,[this].concat(s))).gameWorker=void 0,e}return Object(s.a)(i,[{key:"componentDidMount",value:function(){var a=this;this.gameWorker=new Worker(e,void 0),this.gameWorker.onmessage=function(e){var t=e.data;if(g.a.log&&console.log("%c========== ".concat(h.a[t.type]," =========="),"color: aqua;"),g.a.log&&console.log("get onmessage:",t),t.type===h.a.PUT){var n=t.payload,s={gameType:n.piece.role===u.a.white?l.a.DUEL_BLOCK:l.a.DUEL_WHITE,piece:n.piece};a.props.dispatch(Object(p.h)(s))}else if(t.type===h.a.BOARD){var c=t.payload,o={pieces:c.pieces,name:c.name,first:c.first,open:c.open};a.props.dispatch(Object(p.i)(o))}else if(t.type===h.a.BACKWARD){g.a.log&&console.log("\u6094\u68cb\u6210\u529f\u3002\u3002\u3002");var i=t.payload;a.props.dispatch(Object(p.d)(i))}else if(t.type===h.a.FORWARD){g.a.log&&console.log("\u524d\u8fdb\u6210\u529f\u3002\u3002\u3002");var r=t.payload;a.props.dispatch(Object(p.g)(r))}else t.type===h.a.CONFIG?(g.a.log&&console.log("\u8bbe\u7f6econfig\u6210\u529f\u3002\u3002\u3002"),a.props.dispatch(Object(p.f)())):(g.a.log&&console.log("worker => ".concat(h.a[t.type])),g.a.log&&console.log("\u9519\u8bef\u7684Type\u3002\u3002\u3002"))},this.gameWorker.onerror=function(e){g.a.log&&console.warn(e)}}},{key:"componentDidUpdate",value:function(e,a){var t=this.props.workerPost;t&&this.gameWorker&&this.gameWorker.postMessage(t)}},{key:"componentWillUnmount",value:function(){var e;null===(e=this.gameWorker)||void 0===e||e.terminate()}},{key:"render",value:function(){return null}}]),i}(r.a),m=Object(i.c)((function(e){return{workerPost:e.worker}}),(function(e){return{dispatch:e}}))(d)}).call(this,t(257))},257:function(e,a,t){e.exports=t.p+"static/js/1.f2d1e19b.chunk.worker.js"},258:function(e,a,t){e.exports={container:"_3Blj5zIaveqJXxMOwVEUUY",canvas:"_2PORtCNMuvjLNxW1oNNXng",piecesAnimation:"_1Y44oO1YsaCPR_-ORPuW6N",piecesLogo:"_2R8_SrxkonKK8LRmnJ3lb2","game-logo-spin":"_2HhNKLeoCM9QqlFvPu3AAS",piecesBox:"_3uTPOYuB1gCm_dsHiFDNFS",piecesRow:"_1V-N_O2ClDkQ0wxXMtyZRs",chessman:"_1Bdc0IK_A1fxUoVSsIUpdQ",chessmanWhite:"_1ZRW8YeBKlPSn5Uf--f_Hd",chessmanBlack:"_3dt9q6TJaJARnCYC2JTRgj",chessmanDisappear:"_2jAt-PHVv5kzHznAgO1BuA",chessmanAnim:"Ap7y_IFdFs2x_Kpr8l0uL",pulse:"_1Gu5qZXG0Dz0WoXkGq4yVs",chessmanMain:"_2fPto_z3iHvmmSAQ9yVpHF"}},276:function(e,a,t){"use strict";t.r(a);var n=t(78),s=t(43),c=t(51),o=t(53),i=t(52),r=t(0),l=t.n(r),p=t(34),h=t(250),u=t(252),g=t.n(u),d=(t(270),t(269)),m=(t(149),t(249)),b=t(93),f=t(255),j=t.n(f),v=t(38),O=t(64),y=t(22),w=t(66),k=t(13),x=function(e){Object(o.a)(t,e);var a=Object(i.a)(t);function t(e){var c;return Object(s.a)(this,t),(c=a.call(this,e)).gameStartWay=function(e){w.a.log&&console.log(e);var a=c.state,t=a.first,n=a.open;console.log("first",t),console.log("open",n),c.props.gameStart(t,n)},c.changeState=function(e){return function(a){c.setState(Object(n.a)(Object(n.a)({},c.state),{},Object(b.a)({},e,!!a)))}},c.changeOpen=function(e){c.setState({open:!!e})},c.getChessColor=function(){var e=c.props,a=e.piece,t=e.playChess,n=e.winning;return a.role===y.a.empty&&t===y.a.empty?"lime":a.role===y.a.empty&&t===y.a.white?"white":a.role===y.a.empty&&t===y.a.block||n===y.a.block?"black":n===y.a.white||a.role===y.a.block?"white":a.role===y.a.white?"black":"lime"},c.getActiveClass=function(){var e=c.props,a=e.piece,t=e.playChess,n=e.winning;return a.role===y.a.empty&&t===y.a.empty||n!==y.a.empty?"":j.a.active},c.renderMessage=function(){var e=c.props,a=e.gameStatus,t=e.winning,n=e.steps,s=e.piece,o=e.time;return a===v.a.DUEL_FINISH?"".concat(t===y.a.white?"\u5706\u73af\u4e4b\u7406":"\u60a8\u5c45\u7136","\u8d62\u5f97\u4e86\u80dc\u5229\uff01\uff01\uff01"):a===v.a.DUEL_READY?"\u70b9\u51fb\u5f00\u59cb\u6309\u94ae\u5f00\u59cb\u6e38\u620f":a===v.a.DUEL_BLOCK&&0===n?"\u60a8\u7684\u5148\u624b\uff0c\u8bf7\u843d\u5b50":a===v.a.DUEL_BLOCK?"Score: ".concat(s.score," Step: ").concat(n," Time: ").concat(o,"s"):"\u7535\u8111\u6b63\u5728\u601d\u8003\u4e2d\u3002\u3002\u3002"},c.renderActions=function(){var e=c.props.gameStatus,a=c.state,t=a.first,n=a.open;if(e===v.a.DUEL_READY)return Object(k.jsxs)(l.a.Fragment,{children:[Object(k.jsx)(m.a,{className:j.a.btn,type:"primary",size:"large",onClick:c.gameStartWay,children:"\u5f00\u59cb"}),Object(k.jsxs)(d.a,{className:j.a.btn,value:t?1:0,size:"large",onChange:c.changeState("first"),children:[Object(k.jsx)(d.a.Option,{value:1,children:"\u5148\u624b"}),Object(k.jsx)(d.a.Option,{value:0,children:"\u540e\u624b"})]}),Object(k.jsxs)(d.a,{className:j.a.btn,value:n?1:0,disabled:!0,size:"large",onChange:c.changeState("open"),children:[Object(k.jsx)(d.a.Option,{value:0,children:"\u81ea\u5b9a\u4e49\u5f00\u5c40"}),Object(k.jsx)(d.a.Option,{value:1,children:"\u968f\u673a\u5f00\u5c40"})]})]});var s=c.props,o=s.gameReset,i=s.gameForward,r=s.gameBackward;return Object(k.jsxs)(l.a.Fragment,{children:[Object(k.jsx)(m.a,{type:"primary",size:"large",disabled:!0,onClick:r,children:"\u6094\u68cb"}),Object(k.jsx)(m.a,{type:"primary",size:"large",onClick:o,children:"\u91cd\u7f6e\u6e38\u620f"}),Object(k.jsx)(m.a,{type:"primary",size:"large",disabled:!0,onClick:i,children:"\u653e\u5f03\u6094\u68cb"})]})},c.state={first:!0,open:!1},c}return Object(c.a)(t,[{key:"render",value:function(){var e=this.props.width;return Object(k.jsxs)("div",{className:j.a.container,style:{width:16*e},children:[Object(k.jsxs)("div",{className:j.a.tips,children:[Object(k.jsxs)("svg",{viewBox:"0 0 50 50",className:"".concat(j.a.loadingSvg," ").concat(this.getActiveClass()),children:[Object(k.jsx)("circle",{className:j.a.path,cx:"25",cy:"25",r:"20",fill:"none"}),Object(k.jsx)("circle",{cx:"25",cy:"25",r:"17",fill:this.getChessColor()})]}),this.renderMessage()]}),Object(k.jsx)("div",{className:j.a.actions,children:this.renderActions()})]})}}]),t}(O.a),C=t(256),_=t(259),R=t(258),A=t.n(R),S=t(248),D=t(92),N=function(e){Object(o.a)(t,e);var a=Object(i.a)(t);function t(){var e;Object(s.a)(this,t);for(var n=arguments.length,c=new Array(n),o=0;o<n;o++)c[o]=arguments[o];return(e=a.call.apply(a,[this].concat(c))).canvasRef=l.a.createRef(),e.gameGo=function(a,t){w.a.log&&console.log("[x: ".concat(a,", y: ").concat(t,"]")),e.props.gameStatus===v.a.DUEL_BLOCK?e.props.gameGo(Object(D.a)({x:a,y:t,role:y.a.block})):w.a.log&&console.log("\u8fd8\u4e0d\u80fd\u843d\u5b50\uff01\uff01")},e.draftsman=function(){var a,t,n=e.props.width,s=Object(_.a)(n,14),c=Object(_.a)(n,14),o=null===(a=e.canvasRef)||void 0===a||null===(t=a.current)||void 0===t?void 0:t.getContext("2d");if(o){o.moveTo(0,0),o.lineTo(s,0),o.lineTo(s,c),o.lineTo(0,c),o.lineTo(0,0),o.stroke();for(var i=1;i<=13;i++){var r=i*n;o.moveTo(r,0),o.lineTo(r,c),o.stroke(),o.moveTo(0,r),o.lineTo(s,r),o.stroke()}}},e.renderRowDiv=function(){return e.props.board.map((function(a,t){return Object(k.jsx)("li",{className:A.a.piecesRow,children:e.row(t,a)},t)}))},e.row=function(a,t){var n=e.props.width;return t.map((function(t,s){var c={width:"".concat(n,"px"),height:"".concat(n,"px")};return Object(k.jsx)("div",{tabIndex:0,role:"button",style:c,className:A.a.chessman,onKeyDown:function(){return null},onClick:function(){return e.gameGo(s,a)},children:Object(k.jsx)("button",{type:"button","aria-label":"piece",className:e.getPieceClassName(t,a,s),children:t.step})},s)}))},e}return Object(c.a)(t,[{key:"componentDidUpdate",value:function(e){this.props.width!==e.width&&this.draftsman()}},{key:"getPieceClassName",value:function(e,a,t){var n=this.props,s=n.steps,c=n.gameStatus,o=n.winMap,i=n.playChess,r="";return r=null!==e.step&&e.role!==y.a.empty?e.role!==i?"".concat(A.a.chessmanMain," ").concat(A.a.chessmanWhite):"".concat(A.a.chessmanMain," ").concat(A.a.chessmanBlack):A.a.chessmanDisappear,s===e.step&&(r="".concat(r," ").concat(A.a.chessmanAnim)),c===v.a.DUEL_FINISH&&o.forEach((function(e){e.x===t&&e.y===a&&(r="".concat(r," ").concat(A.a.chessmanAnim))})),r}},{key:"render",value:function(){var e=this.props.width,a=14*e,t=Object(h.a)(e,2);return e?Object(k.jsxs)("div",{className:A.a.container,style:{width:16*e,height:16*e},children:[Object(k.jsx)("div",{className:A.a.piecesAnimation,children:Object(k.jsx)("img",{src:S.a,className:A.a.piecesLogo,alt:"logo"})}),Object(k.jsx)("canvas",{className:A.a.canvas,ref:this.canvasRef,width:a,height:a,children:"\u4f60\u7684\u7535\u8111\u6d4f\u89c8\u5668\u4e0d\u652f\u6301canvas\uff0c\u6362\u7535\u8111\u5427~"}),Object(k.jsx)("ul",{className:A.a.piecesBox,style:{padding:"".concat(t,"px")},children:this.renderRowDiv()})]}):null}}]),t}(O.a),T=t(71),W=t(79),B=t(31),L=t(247),E=function(e){Object(o.a)(t,e);var a=Object(i.a)(t);function t(e){var n;return Object(s.a)(this,t),(n=a.call(this,e)).containerRef=l.a.createRef(),n.gameStart=function(e,a){var t={type:W.a.START,payload:{first:e,randomOpening:a}};n.props.dispatch(Object(T.a)(t))},n.gameConfig=function(e){w.a.log&&console.log("gameConfig");var a={type:W.a.CONFIG,payload:{config:e}};n.props.dispatch(Object(B.e)(a))},n.gameGo=function(e){if(w.a.log&&console.log("gameGo piece:",e),/Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent)){var a=n.state.clickPiece;if(a.x===e.x&&a.y===e.y){var t={gameType:v.a.DUEL_WHITE,piece:Object(D.a)(e)};n.props.dispatch(Object(B.h)(t))}else n.setState({clickPiece:e})}else{var s={gameType:v.a.DUEL_WHITE,piece:Object(D.a)(e)};n.props.dispatch(Object(B.h)(s))}},n.gameForward=function(){w.a.log&&console.log("gameForward");var e={type:W.a.FORWARD};n.props.dispatch(Object(B.e)(e))},n.gameBackward=function(){w.a.log&&console.log("gameBackward");var e={type:W.a.BACKWARD};n.props.dispatch(Object(B.e)(e))},n.gameReset=function(){w.a.log&&console.log("gameReset"),n.props.dispatch(Object(B.b)())},n.resizeCheckerboard=function(){var e;if(null===(e=n.containerRef)||void 0===e?void 0:e.current){var a=n.containerRef.current.getBoundingClientRect(),t=a.width,s=a.height-98,c=t>s?s:t,o=c>720?720:c,i=Math.floor(Object(h.a)(o,16));n.setState({width:i})}},n.state={width:0,clickPiece:Object(D.a)({x:0,y:0,role:y.a.empty})},n}return Object(c.a)(t,[{key:"componentDidMount",value:function(){Object(L.a)("\u4e94\u5b50\u68cb"),this.resizeCheckerboard(),window.addEventListener("resize",this.resizeCheckerboard)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.resizeCheckerboard)}},{key:"render",value:function(){var e={width:this.state.width,steps:this.props.steps,board:this.props.board,winMap:this.props.winMap,winning:this.props.winning,gameStatus:this.props.gameType,playChess:this.props.playChess,gameGo:this.gameGo},a={width:this.state.width,steps:this.props.steps,piece:this.props.piece,time:this.props.spendTime,winning:this.props.winning,playChess:this.props.playChess,gameStatus:this.props.gameType,gameReset:this.gameReset,gameStart:this.gameStart,gameForward:this.gameForward,gameBackward:this.gameBackward};return Object(k.jsxs)("div",{ref:this.containerRef,className:g.a.container,children:[Object(k.jsx)(C.a,{}),Object(k.jsx)(N,Object(n.a)({},e)),Object(k.jsx)(x,Object(n.a)({},a))]})}}]),t}(O.a);a.default=Object(p.c)((function(e){return Object(n.a)({},e.gobang)}),(function(e){return{dispatch:e}}))(E)}}]);
//# sourceMappingURL=3.65e2f857.chunk.js.map