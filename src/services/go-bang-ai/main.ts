import { aiRole } from './configs/ai-role';
import board from './services/board';
import { match } from './services/opening';
import { Role } from './interfaces/open-pants.interface';
import { open1, open26 } from './configs/open-pants-26';

export class GoBangAI {

  /**
   * 初始化,开始游戏
   * @param first 是否电脑先手
   * @param randomOpening 是否随机开局库，不随机的话电脑会直接下中间
   */
  start(first: boolean, randomOpening: boolean) {
    if (first) {
      if (randomOpening) {
        const n = parseInt(String(Math.random() * 26));
        const o = open26[n];
        board.init(o.checkerboard);
        return {
          board: o.checkerboard,
          name: o.name
        };
      } else {
        board.init(open1);
        return {
          board: open1
        };
      }
    } else {
      board.init(15);
      return {
        board: undefined
      };
    }
  }

  /**
   * 电脑下棋
   */
  begin() {
    const piece = match(board);
    piece.role = aiRole.com
    board.put(piece);
    return piece;
  }

  /**
   * 下子并计算
   * @param x 落子的x坐标
   * @param y 落子的y坐标
   */
  turn(x: number, y: number) {
    this.set(x, y, aiRole.hum);
    return this.begin();
  }

  /**
   * 只下子，不做计算
   * @param x 落子的x坐标
   * @param y 落子的y坐标
   * @param r 落子的是谁
   */
  set(x: number, y: number, r: Role) {
    board.put({x, y, role: r});
  }

  /**
   * 悔棋
   */
  backward() {
    board.backward();
  }

  /**
   * 悔棋
   */
  forward() {
    board.forward();
  }
}

const AI = new GoBangAI();

export default AI;
