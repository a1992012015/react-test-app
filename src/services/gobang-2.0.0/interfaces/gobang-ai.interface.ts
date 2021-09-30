import { IOpenBoard } from './board.interface';
import { IPiece } from './piece.interface';

/**
 * 开启游戏的返回值
 */
export interface IStartOpen extends IOpenBoard {
  piece?: IPiece;
}

/**
 * 悔棋的返回值
 */
export interface IBackward {
  board: IOpenBoard;
  backward: boolean;
}

/**
 * 回退到悔棋的哪一步的返回值
 */
export interface IForward {
  board: IOpenBoard;
  forward: boolean;
}
