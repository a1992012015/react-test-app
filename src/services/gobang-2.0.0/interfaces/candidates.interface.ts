import { IPiece } from './piece.interface';
import { ERole } from './role.interface';

/**
 * 开始迭代查找候选者的参数
 */
export interface IDeepSearch {
  candidates: IPiece[]; // 生成可以的落子点
  role: ERole; // 落子的选手
  deep: number; // 循环的深度
  alpha: number; // 剪枝的值
  step: number; // 落子的步数
  beta: number; // 剪枝的值
  spread: number; // 单步延伸的次数
}

/**
 * 查找接下来的候选者的参数
 */
export interface ISearch {
  deep: number;
  beta: number;
  alpha: number;
  role: ERole;
  step: number;
  spread: number;
}

/**
 * search 的返回结果
 */
export interface ISResponse {
  evaluate: number; // 当前局势的分数
  steps: IPiece[]; // 下一步的所有可能
  step: number; // 这是第几步,
  whiteScore: number; // 电脑局势的分数
  blackScore: number; // 玩家局势的分数
}

/**
 * 缓存的对象
 */
export interface IGCache {
  isCache: boolean;
  pieces: IPiece[];
}

/**
 * 查找cache的参数
 */
export interface ISearchCache {
  evaluate: {
    [key: number]: number;
  };
  candidates: {
    [key: number]: IPiece[];
  };
}

/**
 * 打分函数的返回结果
 */
export interface IEvaluate {
  evaluate: number;
}
