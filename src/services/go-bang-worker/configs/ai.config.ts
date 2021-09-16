import { IAI } from '../interfaces/ai.interface';

/**
 * AI 的基本配置选项
 */
export const AI: IAI = {
  opening: true,
  searchDeep: 4,
  countLimit: 20,
  timeLimit: 100,
  vcxDeep: 5,
  random: false,
  log: false,
  spreadLimit: 1,
  star: true,
  cache: true,
  window: false,
  debug: false
};
