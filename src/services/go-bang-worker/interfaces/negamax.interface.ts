import { ERole } from './role.interface';
import { IPiece } from './piece.interface';

export interface ISearch {
  deep: number;
  beta: number;
  alpha: number;
  role: ERole;
  step: number;
  spread: number;
}

export interface ISMinMax {
  candidates: IPiece[]; // 生成可以的落子点
  role: ERole; // 落子的选手
  deep: number; // 循环的深度
  alpha: number; // 剪枝的值
  step: number; // 落子的步数
  beta: number; // 剪枝的值
  spread: number; // 单步延伸的次数
}

export interface IRMinMax {
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
