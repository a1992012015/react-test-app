import { IBackward, IForward, IStartOpen } from '../interfaces/gobang-ai.interface';
import { IPiece } from '../interfaces/piece.interface';
import { opens, wuyue } from '../configs/opens.config';
import { ERole } from '../interfaces/role.interface';
import { creatPiece } from './piece.service';
import { Board } from './board.service';

export class GobangAI {
  board?: Board;

  /**
   * 初始化,开始游戏
   * @param first 是否电脑先手
   * @param randomOpening 是否随机开局库，不随机的话电脑会直接下中间
   */
  start = (first: boolean, randomOpening = false): IStartOpen => {
    if (randomOpening) {
      // TODO 暂时无法完成需要先去学习什么事花月蒲月开局
      const n = parseInt(String(Math.random() * 26), 10);
      this.board = new Board(opens[n], first);
    } else if (first) {
      // 玩家先手开局
      this.board = new Board(wuyue, first);
    } else {
      // 电脑先手开局
      this.board = new Board(wuyue, first);
      const piece = this.begin();
      return { ...this.board.getBoard(), piece };
    }
    return this.board.getBoard();
  };

  /**
   * 电脑下棋
   */
  begin = (): IPiece => {
    if (!this.board) {
      return creatPiece({ x: 0, y: 0, role: ERole.empty });
    } else {
      const piece = this.board.beginMatch();
      piece.role = this.board.getPlay();
      this.board.put(piece);
      return piece;
    }
  };

  /**
   * 玩家下子并计算
   * @param x 落子的x坐标
   * @param y 落子的y坐标
   */
  turn = (x: number, y: number): IPiece => {
    if (!this.board) {
      return creatPiece({ x: 0, y: 0, role: ERole.empty });
    } else {
      this.set(x, y, this.board.getReverseRole());
      return this.begin();
    }
  };

  /**
   * 只下子，不做计算
   * @param x 落子的x坐标
   * @param y 落子的y坐标
   * @param r 落子的是谁
   */
  set = (x: number, y: number, r: ERole): void => {
    if (this.board) {
      this.board.put(creatPiece({ x, y, role: r }));
    }
  };

  /**
   * 悔棋
   */
  backward = (): IBackward => {
    if (!this.board) {
      return { backward: false, board: { board: [], name: '' } };
    } else {
      return {
        backward: this.board.backward(),
        board: this.board.getBoard()
      };
    }
  };

  /**
   * 返回悔棋的哪一步
   */
  forward = (): IForward => {
    if (!this.board) {
      return { forward: false, board: { board: [], name: '' } };
    } else {
      return {
        forward: this.board.forward(),
        board: this.board.getBoard()
      };
    }
  };
}
