import { board } from './board.service';
import { opens, wuyue } from '../configs/opens.config';
import { commons } from './commons.service';
import { ERole } from '../interfaces/role.interface';
import { creatPiece } from './piece.service';
import { opening } from './opening.service';
import { IOpen } from '../interfaces/opens.interface';
import { IPiece } from '../interfaces/piece.interface';

export class GoBangAI {
  /**
   * 初始化,开始游戏
   * @param first 是否电脑先手
   * @param randomOpening 是否随机开局库，不随机的话电脑会直接下中间
   */
  start = (first: boolean, randomOpening = false): IOpen => {
    if (first) {
      if (randomOpening) {
        const n = parseInt(String(Math.random() * 26), 10);
        const open = opens[n];
        board.init(open);
        return open;
      }
      const open = { pieces: commons.getOpenBoard([[7, 7]]), name: '血月' };
      board.init(open);
      return open;
    }
    board.init(wuyue);
    return wuyue;
  };

  /**
   * 电脑下棋
   */
  begin = (): IPiece => {
    const piece = opening.match(board);
    console.log(piece);
    piece.role = ERole.white;
    board.put(piece);
    return piece;
  };

  /**
   * 下子并计算
   * @param x 落子的x坐标
   * @param y 落子的y坐标
   */
  turn = (x: number, y: number): IPiece => {
    this.set(x, y, ERole.block);
    // return {} as IPiece;
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
  backward = (): void => {
    board.backward();
  };

  /**
   * 返回悔棋的哪一步
   */
  forward = (): void => {
    board.forward();
  };
}

export const goBangAI = new GoBangAI();
