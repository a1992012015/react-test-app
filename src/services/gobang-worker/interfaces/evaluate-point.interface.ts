import { ERole } from './role.interface';
import { IPiece } from './piece.interface';

/**
 * 打分函数
 */
export interface IScorePoint {
  x: number;
  y: number;
  role: ERole;
  dir?: number;
  pieces: IPiece[][];
}

/**
 * 分数缓存
 */
export type IScoreCache = {
  [key in ERole]: [number, number, number, number];
};

/**
 * 收集棋盘数组的返回值
 */
export type TCResult = [boolean, number, boolean];
