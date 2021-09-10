import { IPiece } from './piece.interface';

/**
 * 棋盘的所有棋子
 * 必须是 15 * 15 的二维数组
 */
export interface IBoard {
  name: string;
  pieces: IPiece[][];
}
