import { IAI } from '../interfaces/ai.interface';

/**
 * AI 的基本配置选项
 */
export const AI: IAI = {
  opening: true,
  searchDeep: 6,
  countLimit: 20,
  timeLimit: 100,
  vcxDeep: 5,
  random: false,
  log: process.env.REACT_APP_LOG === 'true',
  spreadLimit: 1,
  star: true,
  cache: false,
  window: false,
  debug: process.env.REACT_APP_LOG === 'true'
};
