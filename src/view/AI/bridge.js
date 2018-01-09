(function e(t, n, r) {
	function s(o, u) {
		if(!n[o]) {
			if(!t[o]) {
				var a = typeof require == "function" && require;
				if(!u && a) return a(o, !0);
				if(i) return i(o, !0);
				var f = new Error("Cannot find module '" + o + "'");
				throw f.code = "MODULE_NOT_FOUND", f
			}
			var l = n[o] = {
				exports: {}
			};
			t[o][0].call(l.exports, function(e) {
				var n = t[o][1][e];
				return s(n ? n : e)
			}, l, l.exports, e, t, n, r)
		}
		return n[o].exports
	}
	var i = typeof require == "function" && require;
	for(var o = 0; o < r.length; o++) s(r[o]);
	return s
})({
	1: [function(require, module, exports) {


	}, {}],
	2: [function(require, module, exports) {
		//TODO 计算

	}, {
		"./board.js": 3,
		"./config.js": 7,
		"./negamax.js": 12,
		"./role.js": 14,
		"./zobrist.js": 18
	}],
	3: [function(require, module, exports) {
		//TODO 第二

	}, {
		"./config.js": 7,
		"./evaluate-point.js": 10,
		"./neighbor.js": 13,
		"./role.js": 14,
		"./score.js": 15,
		"./zobrist.js": 18
	}],
	4: [function(require, module, exports) {

	}, {
		"./ai.js": 2
	}],
	5: [function(require, module, exports) {

	}, {
		"./SCORE.js": 1,
		"./config.js": 7,
		"./debug.js": 9,
		"./evaluate-point.js": 10,
		"./neighbor.js": 13,
		"./role.js": 14,
		"./win.js": 17,
		"./zobrist.js": 18
	}],
	6: [function(require, module, exports) {

	}, {
		"./SCORE.js": 1,
		"./board.js": 3,
		"./config.js": 7,
		"./debug.js": 9,
		"./evaluate-point.js": 10,
		"./neighbor.js": 13,
		"./role.js": 14,
		"./win.js": 17,
		"./zobrist.js": 18
	}],
	7: [function(require, module, exports) {


	}, {}],
	8: [function(require, module, exports) {

	}, {
		"./score.js": 15
	}],
	9: [function(require, module, exports) {


	}, {}],
	10: [function(require, module, exports) {

	}, {
		"./count-to-type.js": 8,
		"./role.js": 14,
		"./type-to-score.js": 16
	}],
	11: [function(require, module, exports) {


	}, {}],
	12: [function(require, module, exports) {

	}, {
		"./board.js": 3,
		"./checkmate-fast.js": 5,
		"./checkmate.js": 6,
		"./config.js": 7,
		"./debug.js": 9,
		"./math.js": 11,
		"./role": 14,
		"./score.js": 15
	}],
	13: [function(require, module, exports) {

	}, {
		"./role": 14
	}],
	14: [function(require, module, exports) {

	}, {}],
	15: [function(require, module, exports) {
		arguments[4][1][0].apply(exports, arguments)
	}, {
		"dup": 1
	}],
	16: [function(require, module, exports) {

	}, {
		"./score.js": 15
	}],
	17: [function(require, module, exports) {

	}, {
		"./role.js": 14
	}],
	18: [function(require, module, exports) {


	}, {
		"./role.js": 14
	}]
}, {}, [4]);