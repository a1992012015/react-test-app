import { board } from './board.service';
import { opens, wuyue } from '../configs/opens.config';
import { ERole } from '../interfaces/role.interface';
import { creatPiece } from './piece.service';
import { dueling } from './dueling.service';
import { IStartOpen } from '../interfaces/opens.interface';
import { IPiece } from '../interfaces/piece.interface';
import { IBoard } from '../interfaces/board.interface';
import { commons } from './commons.service';

export class GoBangAI {
  /**
   * 初始化,开始游戏
   * @param first 是否电脑先手
   * @param randomOpening 是否随机开局库，不随机的话电脑会直接下中间
   */
  start = (first: boolean, randomOpening = false): IStartOpen => {
    if (randomOpening) {
      // TODO 暂时无法完成需要先去学习什么事花月蒲月开局
      const n = parseInt(String(Math.random() * 26), 10);
      return board.init(opens[n], first);
    } else if (first) {
      // 玩家先手开局
      return board.init(wuyue, first);
    } else {
      // 电脑先手开局
      const open = board.init(wuyue, first);
      const piece = this.begin();
      return { ...open, piece };
    }
  };

  /**
   * 电脑下棋
   */
  begin = (): IPiece => {
    const piece = dueling.match();
    piece.role = board.playChess;
    board.put(piece);
    return piece;
  };

  /**
   * 玩家下子并计算
   * @param x 落子的x坐标
   * @param y 落子的y坐标
   */
  turn = (x: number, y: number): IPiece => {
    this.set(x, y, commons.reverseRole(board.playChess));
    return this.begin();
  };

  /**
   * 只下子，不做计算
   * @param x 落子的x坐标
   * @param y 落子的y坐标
   * @param r 落子的是谁
   */
  set = (x: number, y: number, r: ERole): void => {
    board.put(creatPiece({ x, y, role: r }));
  };

  /**
   * 悔棋
   */
  backward = (): { board: IBoard; backward: boolean } => {
    return {
      backward: board.backward(),
      board: board.board
    };
  };

  /**
   * 返回悔棋的哪一步
   */
  forward = (): { board: IBoard; forward: boolean } => {
    return {
      forward: board.forward(),
      board: board.board
    };
  };
}

export const goBangAI = new GoBangAI();
