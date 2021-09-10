/**
 * 棋型表示
 * 用一个6位数表示棋型，从高位到低位分别表示
 * 连五，活四，眠四，活三，活二/眠三，活一/眠二, 眠一
 */
export const SCORE = {
  ONE: 10, // 活一
  TWO: 100, // 活二
  THREE: 1000, // 活三
  FOUR: 100000, // 活四
  FIVE: 10000000, // 连五 成五 五连
  BLOCKED_ONE: 1, // 眠一
  BLOCKED_TWO: 10, // 眠二
  BLOCKED_THREE: 100, // 眠三
  BLOCKED_FOUR: 10000 // 眠四 冲四
};
