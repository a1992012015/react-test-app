import m from "negamax";
import R from "role";
import zobrist from "zobrist";
import config from "config";
import board from "board";

/*var m = require("./negamax.js");
var R = require("./role.js");
var zobrist = require("./zobrist.js");
var config = require("./config.js");
var board = require("./board.js");*/

let AI = function() {
    this.steps = [];
};

AI.prototype.start = function(size) {//第一步
    board.init(size);
};

AI.prototype.set = function(x, y) {
    board.put([x, y], R.hum, true);
    let p = m(config.searchDeep);
    board.put(p, R.com, true);
    return p;
};

AI.prototype.back = function() {
    board.back();
};
//module.exports = AI;
export default AI;