/*
 * 棋型表示
 * 用一个6位数表示棋型，从高位到低位分别表示
 * 连五，活四，眠四，活三，活二/眠三，活一/眠二, 眠一
 */

// 给单个棋型打分

export const SCORE = {
  ONE: 10, // 活一
  TWO: 100, // 活二
  THREE: 1000, // 活三
  FOUR: 100000, // 活四
  FIVE: 10000000, // 连五
  BLOCKED_ONE: 1, // 死一
  BLOCKED_TWO: 10, // 死二
  BLOCKED_THREE: 100, // 死三
  BLOCKED_FOUR: 10000 // 死四
};
