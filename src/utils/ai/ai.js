import m from './negamax';
import R from './role';
import zobrist from './zobrist';
import config from './config';
import board from './board';

const AI = function() {
  this.steps = [];
};

AI.prototype.start = function(size) {//第一步
  console.log('我们开始吧！');
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

export default AI;
