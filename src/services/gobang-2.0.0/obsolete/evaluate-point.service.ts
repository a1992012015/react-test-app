/**
 * 启发式评价函数
 * 这个是专门给某一个位置打分的，不是给整个棋盘打分的
 * 并且是只给某一个角色打分
 */
import { SCORE } from '../configs/score.config';
import { ERole } from '../interfaces/role.interface';
import { IPiece } from '../interfaces/piece.interface';
import { commons } from '../services/commons.service';

/**
 * 打分函数
 */
export interface IScorePoint {
  x: number;
  y: number;
  role: ERole;
  dir?: number;
  pieces: IPiece[][];
  scoreCache: number[][][][];
}

export class EvaluatePoint {
  count = 1; // 我方棋子个数
  block = 0; // 对方棋子个数
  empty = -1; // 第几颗棋子的位置是空位
  secondCount = 0; // 另一个方向的我方棋子个数

  // this.scoreCache[role][dir][row][column]
  scoreCache = [
    [], // placeholder
    [
      // for role 1
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15)
    ],
    [
      // for role 2
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15),
      commons.createScores(15, 15)
    ]
  ];

  init = (): void => {
    this.count = 1;
    this.block = 0;
    this.empty = -1;
    this.secondCount = 0;
  };

  /**
   *
   * 表示在当前位置下一个棋子后的分数
   * 为了性能考虑，增加了一个dir参数，如果没有传入则默认计算所有四个方向，如果传入值，则只计算其中一个方向的值
   * @param data 计算需要的各种数据
   */
  scorePoint = (data: IScorePoint): number => {
    const { x: px, y: py, pieces, role, dir } = data;
    const len = pieces.length;
    let result = 0;

    console.log(`%c================= scorePoint start =================`, 'color: red;');
    console.log(`point: [${py}, ${px}] 方向 dir: ${dir} role: ${ERole[role]}`);

    // 计算竖向的
    if (dir === undefined || dir === 0) {
      this.init();
      // 计算当前点的右边
      for (let y = py + 1; y <= len; y++) {
        // 超出棋盘
        if (y >= len) {
          this.block++;
          break;
        }
        // 右边一个棋子
        const t = pieces[y][px];
        if (t.role === ERole.empty) {
          // 右边是空位
          if (this.empty === -1 && y < len - 1 && pieces[y + 1][px].role === role) {
            // 当前棋子没有在最边上，同时再右边的棋子是自己的
            this.empty = this.count;
          } else {
            // 找到第二个空位
            // 接下来一个是对方的棋子或空位
            // 或者已经靠边了
            break;
          }
        } else if (t.role === role) {
          // 右边是自己的棋子
          this.count++;
        } else {
          // 右边是对方的棋子
          this.block++;
          break;
        }
      }

      // 计算当前点的左边
      for (let y = py - 1; y >= -1; y--) {
        if (y < 0) {
          // 超出棋盘
          this.block++;
          break;
        }
        const t = pieces[y][px];
        if (t.role === ERole.empty) {
          // 左边是空位
          if (this.empty === -1 && y > 0 && pieces[y - 1][px].role === role) {
            // 当前棋子没有在最边上，同时再左边的棋子是自己的
            this.empty = 0; // 注意这里是0，因为是从右往左走的
          } else {
            // 找到第二个空位
            // 接下来一个是对方的棋子或空位
            // 或者已经靠边了
            break;
          }
        } else if (t.role === role) {
          // 左边是自己的棋子
          this.secondCount++;
          this.empty !== -1 && this.empty++; // 注意这里，如果左边又多了己方棋子，那么empty的位置就变大了
        } else {
          this.block++;
          break;
        }
      }

      this.count += this.secondCount;

      this.scoreCache[role][0][py][px] = this.countToScore();
    }

    result += this.scoreCache[role][0][py][px] || 0;

    // 计算横向的
    if (dir === undefined || dir === 1) {
      this.init();

      console.log(`%c===================== 上 =====================`, 'color: lime;');

      for (let i = px + 1; i <= len; i++) {
        if (i >= len) {
          this.block++;
          break;
        }
        const t = pieces[py][i];
        if (t.role === ERole.empty) {
          console.log(`%c第 [${t.y}, ${t.x}] step: ${t.step} 颗棋子`, 'color: blue;');
          console.log(this.empty === -1 && i < len - 1 && pieces[py][i + 1].role === role);
          if (this.empty === -1 && i < len - 1 && pieces[py][i + 1].role === role) {
            this.empty = this.count;
          } else {
            break;
          }
        } else if (t.role === role) {
          console.log(
            `%c第 [${t.y}, ${t.x}] step: ${t.step} 颗棋子 role === ${ERole[role]}`,
            'color: blue;'
          );
          this.count++;
        } else {
          console.log(
            `%c第 [${t.y}, ${t.x}] step: ${t.step} 颗棋子 role !== ${ERole[role]}`,
            'color: blue;'
          );
          this.block++;
          break;
        }
      }

      console.log(`%c===================== 下 =====================`, 'color: lime;');

      for (let i = px - 1; i >= -1; i--) {
        if (i < 0) {
          this.block++;
          break;
        }
        const t = pieces[py][i];
        if (t.role === ERole.empty) {
          console.log(`%c第 [${t.y}, ${t.x}] step: ${t.step} 颗棋子`, 'color: blue;');
          console.log(this.empty === -1 && i > 0 && pieces[py][i - 1].role === role);
          if (this.empty === -1 && i > 0 && pieces[py][i - 1].role === role) {
            this.empty = 0;
          } else {
            break;
          }
        } else if (t.role === role) {
          console.log(
            `%c第 [${t.y}, ${t.x}] step: ${t.step} 颗棋子 role === ${ERole[role]}`,
            'color: blue;'
          );
          this.secondCount++;
          this.empty !== -1 && this.empty++; // 注意这里，如果左边又多了己方棋子，那么empty的位置就变大了
        } else {
          console.log(
            `%c第 [${t.y}, ${t.x}] step: ${t.step} 颗棋子 role !== ${ERole[role]}`,
            'color: blue;'
          );
          this.block++;
          break;
        }
      }

      this.count += this.secondCount;

      this.scoreCache[role][1][py][px] = this.countToScore();

      console.log('this.scoreCache', this.scoreCache[role][1][py][px]);
    }

    result += this.scoreCache[role][1][py][px] || 0;

    // 更新右斜下方 左斜上方
    if (dir === undefined || dir === 2) {
      this.init();

      for (let i = 1; i <= len; i++) {
        const x = px + i;
        const y = py + i;
        if (x >= len || y >= len) {
          this.block++;
          break;
        }
        const t = pieces[y][x];
        if (t.role === ERole.empty) {
          if (
            this.empty === -1 &&
            x < len - 1 &&
            y < len - 1 &&
            pieces[y + 1][x + 1].role === role
          ) {
            this.empty = this.count;
          } else {
            break;
          }
        } else if (t.role === role) {
          this.count++;
        } else {
          this.block++;
          break;
        }
      }

      for (let i = 1; i <= len; i++) {
        const x = px - i;
        const y = py - i;
        if (x < 0 || y < 0) {
          this.block++;
          break;
        }
        const t = pieces[y][x];
        if (t.role === ERole.empty) {
          if (this.empty === -1 && x > 0 && y > 0 && pieces[y - 1][x - 1].role === role) {
            this.empty = 0;
          } else {
            break;
          }
        } else if (t.role === role) {
          this.secondCount++;
          this.empty !== -1 && this.empty++; // 注意这里，如果左边又多了己方棋子，那么empty的位置就变大了
        } else {
          this.block++;
          break;
        }
      }

      this.count += this.secondCount;

      this.scoreCache[role][2][py][px] = this.countToScore();
    }

    result += this.scoreCache[role][2][py][px] || 0;

    // 更新左斜下方 右斜上方
    if (dir === undefined || dir === 3) {
      this.init();

      for (let i = 1; i <= len; i++) {
        const x = px - i;
        const y = py + i;
        if (x < 0 || y < 0 || x >= len || y >= len) {
          this.block++;
          break;
        }
        const t = pieces[y][x];
        if (t.role === ERole.empty) {
          if (this.empty === -1 && x > 0 && y < len - 1 && pieces[y + 1][x - 1].role === role) {
            this.empty = this.count;
          } else {
            break;
          }
        } else if (t.role === role) {
          this.count++;
        } else {
          this.block++;
          break;
        }
      }

      for (let i = 1; i <= len; i++) {
        const x = px + i;
        const y = py - i;
        if (x < 0 || y < 0 || x >= len || y >= len) {
          this.block++;
          break;
        }
        const t = pieces[y][x];
        if (t.role === ERole.empty) {
          if (this.empty === -1 && x < len - 1 && y > 0 && pieces[y - 1][x + 1].role === role) {
            this.empty = 0;
          } else {
            break;
          }
        } else if (t.role === role) {
          this.secondCount++;
          this.empty !== -1 && this.empty++; // 注意这里，如果左边又多了己方棋子，那么empty的位置就变大了
        } else {
          this.block++;
          break;
        }
      }

      this.count += this.secondCount;

      this.scoreCache[role][3][py][px] = this.countToScore();
    }

    result += this.scoreCache[role][3][py][px] || 0;

    console.log(`%c================= scorePoint end =================`, 'color: red;');

    return result;
  };

  /**
   * 打分函数
   * 通过计算对方的棋子和自己的棋子组合来决定这条直线的棋子分数
   */
  countToScore = (): number => {
    console.log('%c=================== countToScore ===================', 'color: slateblue;');
    console.log('empty', this.empty);
    console.log('count', this.count);
    console.log('block', this.block);

    if (this.empty <= 0) {
      // 没有空位
      if (this.count >= 5) {
        // 自己的棋子有五个
        return SCORE.FIVE; // 连五
      }

      if (this.block === 0) {
        // 对方的棋子没有
        switch (this.count) {
          case 1:
            return SCORE.ONE;
          case 2:
            return SCORE.TWO;
          case 3:
            return SCORE.THREE;
          case 4:
            return SCORE.FOUR;
          default:
            return SCORE.ZERO;
        }
      }

      if (this.block === 1) {
        // 又一个对方的棋子
        switch (this.count) {
          case 1:
            return SCORE.BLOCKED_ONE;
          case 2:
            return SCORE.BLOCKED_TWO;
          case 3:
            return SCORE.BLOCKED_THREE;
          case 4:
            return SCORE.BLOCKED_FOUR;
          default:
            return SCORE.ZERO;
        }
      }
    } else if (this.empty === 1 || this.empty === this.count - 1) {
      // 第1个是空位
      if (this.count >= 6) {
        return SCORE.FIVE;
      }

      if (this.block === 0) {
        switch (this.count) {
          case 2:
            return SCORE.TWO / 2;
          case 3:
            return SCORE.THREE;
          case 4:
            return SCORE.BLOCKED_FOUR;
          case 5:
            return SCORE.FOUR;
          default:
            return SCORE.ZERO;
        }
      }

      if (this.block === 1) {
        switch (this.count) {
          case 2:
            return SCORE.BLOCKED_TWO;
          case 3:
            return SCORE.BLOCKED_THREE;
          case 4:
            return SCORE.BLOCKED_FOUR;
          case 5:
            return SCORE.BLOCKED_FOUR;
          default:
            return SCORE.ZERO;
        }
      }
    } else if (this.empty === 2 || this.empty === this.count - 2) {
      // 第二个是空位
      if (this.count >= 7) {
        return SCORE.FIVE;
      }

      if (this.block === 0) {
        switch (this.count) {
          case 3:
            return SCORE.THREE;
          case 4:
          case 5:
            return SCORE.BLOCKED_FOUR;
          case 6:
            return SCORE.FOUR;
          default:
            return SCORE.ZERO;
        }
      } else if (this.block === 1) {
        switch (this.count) {
          case 3:
            return SCORE.BLOCKED_THREE;
          case 4:
            return SCORE.BLOCKED_FOUR;
          case 5:
            return SCORE.BLOCKED_FOUR;
          case 6:
            return SCORE.FOUR;
          default:
            return SCORE.ZERO;
        }
      } else if (this.block === 2) {
        switch (this.count) {
          case 4:
          case 5:
          case 6:
            return SCORE.BLOCKED_FOUR;
          default:
            return SCORE.ZERO;
        }
      }
    } else if (this.empty === 3 || this.empty === this.count - 3) {
      if (this.count >= 8) {
        return SCORE.FIVE;
      }

      if (this.block === 0) {
        switch (this.count) {
          case 4:
          case 5:
            return SCORE.THREE;
          case 6:
            return SCORE.BLOCKED_FOUR;
          case 7:
            return SCORE.FOUR;
          default:
            return SCORE.ZERO;
        }
      }

      if (this.block === 1) {
        switch (this.count) {
          case 4:
          case 5:
          case 6:
            return SCORE.BLOCKED_FOUR;
          case 7:
            return SCORE.FOUR;
          default:
            return SCORE.ZERO;
        }
      }

      if (this.block === 2) {
        switch (this.count) {
          case 4:
          case 5:
          case 6:
          case 7:
            return SCORE.BLOCKED_FOUR;
          default:
            return SCORE.ZERO;
        }
      }
    } else if (this.empty === 4 || this.empty === this.count - 4) {
      if (this.count >= 9) {
        return SCORE.FIVE;
      }

      if (this.block === 0) {
        switch (this.count) {
          case 5:
          case 6:
          case 7:
          case 8:
            return SCORE.FOUR;
          default:
            return SCORE.ZERO;
        }
      }

      if (this.block === 1) {
        switch (this.count) {
          case 4:
          case 5:
          case 6:
          case 7:
            return SCORE.BLOCKED_FOUR;
          case 8:
            return SCORE.FOUR;
          default:
            return SCORE.ZERO;
        }
      }

      if (this.block === 2) {
        switch (this.count) {
          case 5:
          case 6:
          case 7:
          case 8:
            return SCORE.BLOCKED_FOUR;
          default:
            return SCORE.ZERO;
        }
      }
    } else if (this.empty === 5 || this.empty === this.count - 5) {
      return SCORE.FIVE;
    }

    return SCORE.ZERO;
  };
}

export const evaluatePoint = new EvaluatePoint();
