(this["webpackJsonpreact-test-app"]=this["webpackJsonpreact-test-app"]||[]).push([[3],{242:function(e,a,t){"use strict";t.d(a,"a",(function(){return n}));var n=function(e){document.title=e}},243:function(e,a,t){"use strict";a.a=t.p+"static/media/logo.6ce24c58.svg"},247:function(e,a,t){e.exports={container:"_1wWQJYonfOe22PduF8hs1G"}},250:function(e,a,t){e.exports={container:"_22Gc0BaYoEe9USTQ4xGbmd",tips:"wxDQnLtsRddMduAGp_paC",loadingSvg:"_2GkV5Ds5aVowey6vKzzwTW",active:"_27E7d3lm9gn9ecAYbAkHCG","loading-rotate":"_36AfHpEtx1JBL41Cuk9h_U",path:"_1H8v9Lo5nqe6GRSVqXazh8","loading-dash":"_3vfzOQ3xVkM3lrt0flrb_c",actions:"_2VgDucT53FGHFYjbbWgbCR"}},251:function(e,a,t){"use strict";(function(e){t.d(a,"a",(function(){return m}));var n=t(43),o=t(51),s=t(53),c=t(52),i=t(34),r=t(64),l=t(38),p=t(31),h=t(77),u=t(22),g=t(54),d=function(a){Object(s.a)(i,a);var t=Object(c.a)(i);function i(){var e;Object(n.a)(this,i);for(var a=arguments.length,o=new Array(a),s=0;s<a;s++)o[s]=arguments[s];return(e=t.call.apply(t,[this].concat(o))).gameWorker=void 0,e}return Object(o.a)(i,[{key:"componentDidMount",value:function(){var a=this;this.gameWorker=new Worker(e,void 0),this.gameWorker.onmessage=function(e){var t=e.data;if(g.a.log&&console.log("%c========== ".concat(h.a[t.type]," =========="),"color: aqua;"),g.a.log&&console.log("get onmessage:",t),t.type===h.a.PUT){var n=t.payload,o={gameType:n.piece.role===u.a.white?l.a.DUEL_BLOCK:l.a.DUEL_WHITE,piece:n.piece};a.props.dispatch(Object(p.h)(o))}else if(t.type===h.a.BOARD){var s=t.payload,c={pieces:s.pieces,name:s.name,first:s.first,open:s.open};a.props.dispatch(Object(p.i)(c))}else if(t.type===h.a.BACKWARD){g.a.log&&console.log("\u6094\u68cb\u6210\u529f\u3002\u3002\u3002");var i=t.payload;a.props.dispatch(Object(p.d)(i))}else if(t.type===h.a.FORWARD){g.a.log&&console.log("\u524d\u8fdb\u6210\u529f\u3002\u3002\u3002");var r=t.payload;a.props.dispatch(Object(p.g)(r))}else t.type===h.a.CONFIG?(g.a.log&&console.log("\u8bbe\u7f6econfig\u6210\u529f\u3002\u3002\u3002"),a.props.dispatch(Object(p.f)())):(g.a.log&&console.log("worker => ".concat(h.a[t.type])),g.a.log&&console.log("\u9519\u8bef\u7684Type\u3002\u3002\u3002"))},this.gameWorker.onerror=function(e){g.a.log&&console.warn(e)}}},{key:"componentDidUpdate",value:function(e,a){var t=this.props.workerPost;t&&this.gameWorker&&this.gameWorker.postMessage(t)}},{key:"componentWillUnmount",value:function(){var e;null===(e=this.gameWorker)||void 0===e||e.terminate()}},{key:"render",value:function(){return null}}]),i}(r.a),m=Object(i.c)((function(e){return{workerPost:e.worker}}),(function(e){return{dispatch:e}}))(d)}).call(this,t(252))},252:function(e,a,t){e.exports=t.p+"static/js/1.f2d1e19b.chunk.worker.js"},253:function(e,a,t){e.exports={container:"_3Blj5zIaveqJXxMOwVEUUY",canvas:"_2PORtCNMuvjLNxW1oNNXng",piecesAnimation:"_1Y44oO1YsaCPR_-ORPuW6N",piecesLogo:"_2R8_SrxkonKK8LRmnJ3lb2","game-logo-spin":"_2HhNKLeoCM9QqlFvPu3AAS",piecesBox:"_3uTPOYuB1gCm_dsHiFDNFS",piecesRow:"_1V-N_O2ClDkQ0wxXMtyZRs",chessman:"_1Bdc0IK_A1fxUoVSsIUpdQ",chessmanWhite:"_1ZRW8YeBKlPSn5Uf--f_Hd",chessmanBlack:"_3dt9q6TJaJARnCYC2JTRgj",chessmanDisappear:"_2jAt-PHVv5kzHznAgO1BuA",chessmanAnim:"Ap7y_IFdFs2x_Kpr8l0uL",pulse:"_1Gu5qZXG0Dz0WoXkGq4yVs",chessmanMain:"_2fPto_z3iHvmmSAQ9yVpHF"}},270:function(e,a,t){"use strict";t.r(a);var n=t(78),o=t(43),s=t(51),c=t(53),i=t(52),r=t(0),l=t.n(r),p=t(34),h=t(245),u=t(247),g=t.n(u),d=(t(248),t(264)),m=(t(144),t(244)),f=t(250),v=t.n(f),b=t(38),j=t(64),O=t(22),y=t(54),w=t(13),k=function(e){Object(c.a)(t,e);var a=Object(i.a)(t);function t(e){var n;return Object(o.a)(this,t),(n=a.call(this,e)).gameStartWay=function(e){y.a.log&&console.log(e);var a=n.state.first;n.props.gameStart(a,!1)},n.changeFirst=function(e){console.log("event",e)},n.getChessColor=function(){var e=n.props,a=e.piece,t=e.playChess,o=e.winning;return a.role===O.a.empty&&t===O.a.empty?"lime":a.role===O.a.empty&&t===O.a.white?"white":a.role===O.a.empty&&t===O.a.block||o===O.a.block?"black":o===O.a.white||a.role===O.a.block?"white":a.role===O.a.white?"black":"lime"},n.getActiveClass=function(){var e=n.props,a=e.piece,t=e.playChess,o=e.winning;return a.role===O.a.empty&&t===O.a.empty||o!==O.a.empty?"":v.a.active},n.renderMessage=function(){var e=n.props,a=e.gameStatus,t=e.winning,o=e.steps,s=e.piece,c=e.time;return a===b.a.DUEL_FINISH?"".concat(t===O.a.white?"\u5706\u73af\u4e4b\u7406":"\u60a8\u5c45\u7136","\u8d62\u5f97\u4e86\u80dc\u5229\uff01\uff01\uff01"):a===b.a.DUEL_READY?"\u70b9\u51fb\u5f00\u59cb\u6309\u94ae\u5f00\u59cb\u6e38\u620f":a===b.a.DUEL_BLOCK&&0===o?"\u60a8\u7684\u5148\u624b\uff0c\u8bf7\u843d\u5b50":a===b.a.DUEL_BLOCK?"Score: ".concat(s.score," Step: ").concat(o," Time: ").concat(c,"s"):"\u7535\u8111\u6b63\u5728\u601d\u8003\u4e2d\u3002\u3002\u3002"},n.renderActions=function(){var e=n.props.gameStatus,a=n.state.first;if(e===b.a.DUEL_READY)return Object(w.jsxs)(l.a.Fragment,{children:[Object(w.jsx)(m.a,{type:"primary",size:"large",onClick:n.gameStartWay,children:"\u5f00\u59cb"}),Object(w.jsx)(d.a.Group,{options:[{label:"\u5148\u624b",value:!0},{label:"\u540e\u624b",value:!1}],onChange:n.changeFirst,value:a,optionType:"button",size:"large"})]});var t=n.props,o=t.gameReset,s=t.gameForward,c=t.gameBackward;return Object(w.jsxs)(l.a.Fragment,{children:[Object(w.jsx)(m.a,{type:"primary",size:"large",disabled:!0,onClick:c,children:"\u6094\u68cb"}),Object(w.jsx)(m.a,{type:"primary",size:"large",onClick:o,children:"\u91cd\u7f6e\u6e38\u620f"}),Object(w.jsx)(m.a,{type:"primary",size:"large",disabled:!0,onClick:s,children:"\u653e\u5f03\u6094\u68cb"})]})},n.state={first:!0},n}return Object(s.a)(t,[{key:"render",value:function(){var e=this.props.width;return Object(w.jsxs)("div",{className:v.a.container,style:{width:16*e},children:[Object(w.jsxs)("div",{className:v.a.tips,children:[Object(w.jsxs)("svg",{viewBox:"0 0 50 50",className:"".concat(v.a.loadingSvg," ").concat(this.getActiveClass()),children:[Object(w.jsx)("circle",{className:v.a.path,cx:"25",cy:"25",r:"20",fill:"none"}),Object(w.jsx)("circle",{cx:"25",cy:"25",r:"17",fill:this.getChessColor()})]}),this.renderMessage()]}),Object(w.jsx)("div",{className:v.a.actions,children:this.renderActions()})]})}}]),t}(j.a),x=t(251),C=t(254),_=t(253),R=t.n(_),A=t(243),D=t(91),S=function(e){Object(c.a)(t,e);var a=Object(i.a)(t);function t(){var e;Object(o.a)(this,t);for(var n=arguments.length,s=new Array(n),c=0;c<n;c++)s[c]=arguments[c];return(e=a.call.apply(a,[this].concat(s))).canvasRef=l.a.createRef(),e.gameGo=function(a,t){y.a.log&&console.log("[x: ".concat(a,", y: ").concat(t,"]")),e.props.gameStatus===b.a.DUEL_BLOCK?e.props.gameGo(Object(D.a)({x:a,y:t,role:O.a.block})):y.a.log&&console.log("\u8fd8\u4e0d\u80fd\u843d\u5b50\uff01\uff01")},e.draftsman=function(){var a,t,n=e.props.width,o=Object(C.a)(n,14),s=Object(C.a)(n,14),c=null===(a=e.canvasRef)||void 0===a||null===(t=a.current)||void 0===t?void 0:t.getContext("2d");if(c){c.moveTo(0,0),c.lineTo(o,0),c.lineTo(o,s),c.lineTo(0,s),c.lineTo(0,0),c.stroke();for(var i=1;i<=13;i++){var r=i*n;c.moveTo(r,0),c.lineTo(r,s),c.stroke(),c.moveTo(0,r),c.lineTo(o,r),c.stroke()}}},e.renderRowDiv=function(){return e.props.board.map((function(a,t){return Object(w.jsx)("li",{className:R.a.piecesRow,children:e.row(t,a)},t)}))},e.row=function(a,t){var n=e.props.width;return t.map((function(t,o){var s={width:"".concat(n,"px"),height:"".concat(n,"px")};return Object(w.jsx)("div",{tabIndex:0,role:"button",style:s,className:R.a.chessman,onKeyDown:function(){return null},onClick:function(){return e.gameGo(o,a)},children:Object(w.jsx)("button",{type:"button","aria-label":"piece",className:e.getPieceClassName(t,a,o),children:t.step})},o)}))},e}return Object(s.a)(t,[{key:"componentDidUpdate",value:function(e){this.props.width!==e.width&&this.draftsman()}},{key:"getPieceClassName",value:function(e,a,t){var n=this.props,o=n.steps,s=n.gameStatus,c=n.winMap,i=n.playChess,r="";return r=null!==e.step&&e.role!==O.a.empty?e.role!==i?"".concat(R.a.chessmanMain," ").concat(R.a.chessmanWhite):"".concat(R.a.chessmanMain," ").concat(R.a.chessmanBlack):R.a.chessmanDisappear,o===e.step&&(r="".concat(r," ").concat(R.a.chessmanAnim)),s===b.a.DUEL_FINISH&&c.forEach((function(e){e.x===t&&e.y===a&&(r="".concat(r," ").concat(R.a.chessmanAnim))})),r}},{key:"render",value:function(){var e=this.props.width,a=14*e,t=Object(h.a)(e,2);return e?Object(w.jsxs)("div",{className:R.a.container,style:{width:16*e,height:16*e},children:[Object(w.jsx)("div",{className:R.a.piecesAnimation,children:Object(w.jsx)("img",{src:A.a,className:R.a.piecesLogo,alt:"logo"})}),Object(w.jsx)("canvas",{className:R.a.canvas,ref:this.canvasRef,width:a,height:a,children:"\u4f60\u7684\u7535\u8111\u6d4f\u89c8\u5668\u4e0d\u652f\u6301canvas\uff0c\u6362\u7535\u8111\u5427~"}),Object(w.jsx)("ul",{className:R.a.piecesBox,style:{padding:"".concat(t,"px")},children:this.renderRowDiv()})]}):null}}]),t}(j.a),T=t(70),N=t(77),W=t(31),B=t(242),L=function(e){Object(c.a)(t,e);var a=Object(i.a)(t);function t(e){var n;return Object(o.a)(this,t),(n=a.call(this,e)).containerRef=l.a.createRef(),n.gameStart=function(e,a){var t={type:N.a.START,payload:{first:e,randomOpening:a}};n.props.dispatch(Object(T.a)(t))},n.gameConfig=function(e){y.a.log&&console.log("gameConfig");var a={type:N.a.CONFIG,payload:{config:e}};n.props.dispatch(Object(W.e)(a))},n.gameGo=function(e){if(y.a.log&&console.log("gameGo piece:",e),/Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent)){var a=n.state.clickPiece;if(a.x===e.x&&a.y===e.y){var t={gameType:b.a.DUEL_WHITE,piece:Object(D.a)(e)};n.props.dispatch(Object(W.h)(t))}else n.setState({clickPiece:e})}else{var o={gameType:b.a.DUEL_WHITE,piece:Object(D.a)(e)};n.props.dispatch(Object(W.h)(o))}},n.gameForward=function(){y.a.log&&console.log("gameForward");var e={type:N.a.FORWARD};n.props.dispatch(Object(W.e)(e))},n.gameBackward=function(){y.a.log&&console.log("gameBackward");var e={type:N.a.BACKWARD};n.props.dispatch(Object(W.e)(e))},n.gameReset=function(){y.a.log&&console.log("gameReset"),n.props.dispatch(Object(W.b)())},n.resizeCheckerboard=function(){var e;if(null===(e=n.containerRef)||void 0===e?void 0:e.current){var a=n.containerRef.current.getBoundingClientRect(),t=a.width,o=a.height-98,s=t>o?o:t,c=s>720?720:s,i=Math.floor(Object(h.a)(c,16));n.setState({width:i})}},n.state={width:0,clickPiece:Object(D.a)({x:0,y:0,role:O.a.empty})},n}return Object(s.a)(t,[{key:"componentDidMount",value:function(){Object(B.a)("\u4e94\u5b50\u68cb"),this.resizeCheckerboard(),window.addEventListener("resize",this.resizeCheckerboard)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.resizeCheckerboard)}},{key:"render",value:function(){var e={width:this.state.width,steps:this.props.steps,board:this.props.board,winMap:this.props.winMap,winning:this.props.winning,gameStatus:this.props.gameType,playChess:this.props.playChess,gameGo:this.gameGo},a={width:this.state.width,steps:this.props.steps,piece:this.props.piece,time:this.props.spendTime,winning:this.props.winning,playChess:this.props.playChess,gameStatus:this.props.gameType,gameReset:this.gameReset,gameStart:this.gameStart,gameForward:this.gameForward,gameBackward:this.gameBackward};return Object(w.jsxs)("div",{ref:this.containerRef,className:g.a.container,children:[Object(w.jsx)(x.a,{}),Object(w.jsx)(S,Object(n.a)({},e)),Object(w.jsx)(k,Object(n.a)({},a))]})}}]),t}(j.a);a.default=Object(p.c)((function(e){return Object(n.a)({},e.gobang)}),(function(e){return{dispatch:e}}))(L)}}]);
//# sourceMappingURL=3.f7caf7d1.chunk.js.map