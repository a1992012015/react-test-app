import { ERole } from '../interfaces/role.interface';
import { IPiece } from '../interfaces/piece.interface';
import { Piece } from './piece.service';
import { SCORE } from '../configs/score.config';

export class Commons {
  private readonly THRESHOLD = 1.15;

  /**
   * 生成 number 的二维数组
   * @param w 数组长度
   * @param h 数组深度
   */
  createScores = (w: number, h: number): number[][] => {
    const board: number[][] = [];
    for (let x = 0; x < w; x++) {
      const row: number[] = [];
      for (let y = 0; y < h; y++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
  };

  /**
   * 生成初始的棋局
   * @param points 已有的棋子，按照黑棋白棋的顺序填入
   */
  getOpenBoard = (points: number[][] = []): IPiece[][] => {
    const boards: IPiece[][] = [];

    for (let y = 0; y < 15; y++) {
      const row: IPiece[] = [];
      for (let x = 0; x < 15; x++) {
        row.push(new Piece(x, y, ERole.empty));
      }
      boards.push(row);
    }

    points.forEach(([x, y], index) => {
      boards.forEach((board) => {
        board.forEach((piece) => {
          if (piece.x === x && piece.y === y) {
            piece.role = index % 2 === 0 ? ERole.com : ERole.hum;
          }
        });
      });
    });

    return boards;
  };

  /**
   * 获取另外一个玩家
   * @param r 现在的玩家
   */
  reverseRole = (r: ERole): ERole => {
    return r === ERole.com ? ERole.hum : ERole.com;
  };

  /**
   * 等于或大于
   * @param a 当前棋子的分数
   * @param b 对比的目标分数
   */
  greatOrEqualThan = (a: number, b: number): boolean => {
    return this.equal(a, b) || this.greaterThan(a, b);
  };

  /**
   * 等于或小于
   * @param a 当前棋子的分数
   * @param b 对比的目标分数
   */
  equalOrLessThan = (a: number, b: number): boolean => {
    return this.equal(a, b) || this.lessThan(a, b);
  };

  /**
   * 小于
   * @param a 当前棋子的分数
   * @param b 对比的目标分数
   */
  lessThan = (a: number, b: number): boolean => {
    if (b >= 0) {
      return a <= (b - 0.1) / this.THRESHOLD;
    }
    return a <= (b - 0.1) * this.THRESHOLD;
  };

  /**
   * 等于
   * @param a 当前棋子的分数
   * @param b 对比的目标分数
   */
  equal = (a: number, b = 0.01): boolean => {
    if (b >= 0) {
      return a >= b / this.THRESHOLD && a <= b * this.THRESHOLD;
    }
    return a >= b * this.THRESHOLD && a <= b / this.THRESHOLD;
  };

  /**
   * 大于
   * @param a 当前棋子的分数
   * @param b 对比的目标分数
   */
  greaterThan = (a: number, b: number): boolean => {
    if (b >= 0) {
      return a >= (b + 0.1) * this.THRESHOLD;
    }
    return a >= (b + 0.1) / this.THRESHOLD;
    // 注意处理b为0的情况，通过加一个0.1 做简单的处理
  };

  containPoint = (arrays: number[][], p: Piece): boolean => {
    return arrays.some((a) => {
      return a[0] === p.x && a[1] === p.y;
    });
  };

  pointEqual = (a: Piece, [x, y]: number[]): boolean => {
    return a.x === x && a.y === y;
  };

  round = (score: number): number => {
    const neg = score < 0 ? -1 : 1;
    const abs = Math.abs(score);
    if (abs <= SCORE.ONE / 2) {
      return 0;
    }
    if (abs <= SCORE.TWO / 2 && abs > SCORE.ONE / 2) {
      return neg * SCORE.ONE;
    }
    if (abs <= SCORE.THREE / 2 && abs > SCORE.TWO / 2) {
      return neg * SCORE.TWO;
    }
    if (abs <= SCORE.THREE * 1.5 && abs > SCORE.THREE / 2) {
      return neg * SCORE.THREE;
    }
    if (abs <= SCORE.FOUR / 2 && abs > SCORE.THREE * 1.5) {
      return neg * SCORE.THREE * 2;
    }
    if (abs <= SCORE.FIVE / 2 && abs > SCORE.FOUR / 2) {
      return neg * SCORE.FOUR;
    }
    return neg * SCORE.FIVE;
  };
}

export const commons = new Commons();
