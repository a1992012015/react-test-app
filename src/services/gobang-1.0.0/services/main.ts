import board from './board';
import { match } from './opening';
import { aiRole } from '../configs/ai-role';
import { Piece, Role } from '../interfaces/open-pants.interface';
import { getBoard, open26 } from '../configs/open-pants-26';

export class GoBangAI {
  /**
   * 初始化,开始游戏
   * @param first 是否电脑先手
   * @param randomOpening 是否随机开局库，不随机的话电脑会直接下中间
   */
  start = (first: boolean, randomOpening = false): { name?: string; board: Piece[][] } => {
    if (first) {
      if (randomOpening) {
        const n = parseInt(String(Math.random() * 26), 10);
        const o = open26[n];
        board.init(o.checkerboard);
        return {
          board: o.checkerboard,
          name: o.name
        };
      } else {
        const open = getBoard([[7, 7]]);
        board.init(open);
        return {
          board: open
        };
      }
    } else {
      const open = getBoard();
      board.init(open);
      return {
        board: open
      };
    }
  };

  /**
   * 电脑下棋
   */
  begin = (): Piece => {
    const piece = match(board);
    console.log(piece);
    piece.role = aiRole.com;
    board.put(piece);
    console.log('board', board.board);
    return piece;
  };

  /**
   * 下子并计算
   * @param x 落子的x坐标
   * @param y 落子的y坐标
   */
  turn = (x: number, y: number): Piece => {
    this.set(x, y, aiRole.hum);
    return this.begin();
  };

  /**
   * 只下子，不做计算
   * @param x 落子的x坐标
   * @param y 落子的y坐标
   * @param r 落子的是谁
   */
  set = (x: number, y: number, r: Role): void => {
    board.put({ x, y, role: r });
  };

  /**
   * 悔棋
   */
  backward = (): void => {
    board.backward();
  };

  /**
   * 悔棋
   */
  forward = (): void => {
    board.forward();
  };
}

const AI = new GoBangAI();

export default AI;
