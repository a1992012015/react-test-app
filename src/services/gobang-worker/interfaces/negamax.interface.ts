import { ERole } from './role.interface';
import { IPiece } from './piece.interface';

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

export interface ISResponse {
  evaluate: number; // 当前局势的分数
  steps: IPiece[]; // 下一步的所有可能
  step: number; // 这是第几步
}

export interface IGCache {
  isCache: boolean;
  pieces: IPiece[];
}

export interface ISearchCache {
  deep: number;
  piece: IPiece[];
}
