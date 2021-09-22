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
  [key in ERole]: number[][][];
};

/**
 * 收集棋盘数组的返回值
 * 按照顺序依次为：
 * empty 是否有间隔的棋子
 * count 相邻棋子的个数
 * block 是否堵住最后
 * emptyCount 有相邻棋子的话相邻棋子有几颗
 * possible 可能落子的位置有多少
 */
export type TCResult = [boolean, number, boolean, number, number];

/**
 * 统计的当前棋子一个方向上的全部棋子
 */
export type TCalculate = [ERole, ERole, ERole, ERole];
