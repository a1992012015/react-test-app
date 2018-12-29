/*
 * 一个简单的开局库，用花月+浦月必胜开局
 */
import math from './math.js';

/**
 * -2-
 * -1-
 * ---
 */
let huayue = function(board) {
  console.log('使用花月开局');
  let s = board.steps;
  if (math.pointEqual(s[1], [6, 7])) {
    if (s.length === 2) return [6, 8];
  }
  if (math.pointEqual(s[1], [7, 6])) {
    if (s.length === 2) return [6, 6];
  }
  if (math.pointEqual(s[1], [8, 7])) {
    if (s.length === 2) return [8, 6];
  }
  if (math.pointEqual(s[1], [7, 8])) {
    if (s.length === 2) return [8, 8];
  }
};

let puyue = function(board) {
  console.log('使用浦月开局');
  let s = board.steps;
  if (math.pointEqual(s[1], [6, 6])) {
    if (s.length === 2) return [6, 8];
  }
  if (math.pointEqual(s[1], [8, 6])) {
    if (s.length === 2) return [6, 6];
  }
  if (math.pointEqual(s[1], [8, 8])) {
    if (s.length === 2) return [8, 6];
  }
  if (math.pointEqual(s[1], [6, 8])) {
    if (s.length === 2) return [8, 8];
  }
};

let match = function(board) {
  let s = board.allSteps;
  if (board.board[s[0][0]][s[0][1]] !== 1) return false;
  if (s.length > 2) return false;
  if (math.containPoint([[6, 7], [7, 6], [8, 7], [7, 8]], s[1])) return huayue(board);
  else if (math.containPoint([[6, 6], [8, 8], [8, 6], [6, 8]], s[1])) return puyue(board);
  return false;
};

export default match;
