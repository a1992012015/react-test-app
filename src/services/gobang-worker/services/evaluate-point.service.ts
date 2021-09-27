import {
  IScoreCache,
  IScorePoint,
  TCalculate,
  TCResult
} from '../interfaces/evaluate-point.interface';
import { ERole } from '../interfaces/role.interface';
import { SCORE } from '../configs/score.config';
import { Statistic } from './statistic.service';
import { Commons } from './commons.service';

/**
 * 启发式评价函数
 * 这个是专门给某一个位置打分的，不是给整个棋盘打分的
 * 并且是只给某一个角色打分
 */
export class EvaluatePoint {
  private scoreCache: IScoreCache = {
    // 三种棋子四个方向的分数的缓存
    [ERole.empty]: [],
    [ERole.black]: [],
    [ERole.white]: []
  };
  private statistic = new Statistic();
  private commons = new Commons();

  private readonly testName: string = '';
  private testDir = 0;

  constructor(name?: string) {
    this.init();
    this.testName = name || '';
  }

  init = (): void => {
    this.scoreCache = {
      [ERole.empty]: [],
      [ERole.black]: [
        this.commons.createScores(15, 15),
        this.commons.createScores(15, 15),
        this.commons.createScores(15, 15),
        this.commons.createScores(15, 15)
      ],
      [ERole.white]: [
        this.commons.createScores(15, 15),
        this.commons.createScores(15, 15),
        this.commons.createScores(15, 15),
        this.commons.createScores(15, 15)
      ]
    };
  };

  /**
   * 计算当前棋子的分数，给单个的棋子打分
   * 为了性能考虑，增加了一个dir参数
   * 如果没有传入则默认计算所有四个方向，如果传入值，则只计算其中一个方向的值
   */
  scorePoint = (data: IScorePoint): number => {
    const { x, y, board, role, dir } = data;
    const radius = 4;
    let result = 0;

    if (dir === undefined || dir === 0) {
      this.testDir = 0;
      this.log() &&
        console.log(
          `%c==== ${this.testName} scorePoint start [${y}, ${x}] ====`,
          'color: fuchsia;'
        );
      // 计算竖向
      const leftRoles: TCalculate = [ERole.empty, ERole.empty, ERole.empty, ERole.empty];
      const rightRoles: TCalculate = [ERole.empty, ERole.empty, ERole.empty, ERole.empty];

      // 计算当前棋子的上面的棋子 left
      for (let i = 1; i <= radius; i++) {
        leftRoles[i - 1] = board?.[y - i]?.[x]?.role;
      }

      // 计算当前棋子下面的棋子 right
      for (let i = 1; i <= radius; i++) {
        rightRoles[i - 1] = board?.[y + i]?.[x]?.role;
      }

      const score = this.calculateScore(leftRoles, rightRoles, role);

      this.log() && console.log('score', score);

      this.scoreCache[role][dir || 0][y][x] = score;
      this.log() && this.statistic.printClone(board, 'scoreCache pieces');
      this.log() && this.statistic.printClone(this.scoreCache, 'scoreCache');
      this.log() &&
        console.log(
          `%c===== ${this.testName} scorePoint end [${y}, ${x}] =====`,
          'color: fuchsia;'
        );
    }

    result += this.scoreCache[role][0][y][x];

    if (dir === undefined || dir === 1) {
      this.testDir = 1;
      this.log() &&
        console.log(
          `%c==== ${this.testName} scorePoint start [${y}, ${x}] ====`,
          'color: fuchsia;'
        );
      // 计算横向
      const leftRoles: TCalculate = [ERole.empty, ERole.empty, ERole.empty, ERole.empty];
      const rightRoles: TCalculate = [ERole.empty, ERole.empty, ERole.empty, ERole.empty];

      // 计算当前棋子的左边的棋子 left
      for (let i = 1; i <= radius; i++) {
        leftRoles[i - 1] = board?.[y]?.[x - i]?.role;
      }

      // 计算当前棋子右边的棋子 right
      for (let i = 1; i <= radius; i++) {
        rightRoles[i - 1] = board?.[y]?.[x + i]?.role;
      }

      const score = this.calculateScore(leftRoles, rightRoles, role);

      this.log() && console.log('score', score);

      this.scoreCache[role][dir || 1][y][x] = score;
      this.log() && this.statistic.printClone(board, 'scoreCache pieces');
      this.log() && this.statistic.printClone(this.scoreCache, 'scoreCache');
      this.log() &&
        console.log(
          `%c===== ${this.testName} scorePoint end [${y}, ${x}] =====`,
          'color: fuchsia;'
        );
    }

    result += this.scoreCache[role][1][y][x];

    if (dir === undefined || dir === 2) {
      this.testDir = 2;
      this.log() &&
        console.log(
          `%c==== ${this.testName} scorePoint start [${y}, ${x}] ====`,
          'color: fuchsia;'
        );
      // 计算左上和右下
      const leftRoles: TCalculate = [ERole.empty, ERole.empty, ERole.empty, ERole.empty];
      const rightRoles: TCalculate = [ERole.empty, ERole.empty, ERole.empty, ERole.empty];

      // 计算当前棋子的左上的棋子 left
      for (let i = 1; i <= radius; i++) {
        leftRoles[i - 1] = board?.[y - i]?.[x - i]?.role;
      }

      // 计算当前棋子右下的棋子 right
      for (let i = 1; i <= radius; i++) {
        rightRoles[i - 1] = board?.[y + i]?.[x + i]?.role;
      }

      const score = this.calculateScore(leftRoles, rightRoles, role);

      this.log() && console.log('score', score);

      this.scoreCache[role][dir || 2][y][x] = score;
      this.log() && this.statistic.printClone(board, 'scoreCache pieces');
      this.log() && this.statistic.printClone(this.scoreCache, 'scoreCache');
      this.log() &&
        console.log(
          `%c===== ${this.testName} scorePoint end [${y}, ${x}] =====`,
          'color: fuchsia;'
        );
    }

    result += this.scoreCache[role][2][y][x];

    if (dir === undefined || dir === 3) {
      this.testDir = 3;
      this.log() &&
        console.log(
          `%c==== ${this.testName} scorePoint start [${y}, ${x}] ====`,
          'color: fuchsia;'
        );
      // 计算左下和右上
      const leftRoles: TCalculate = [ERole.empty, ERole.empty, ERole.empty, ERole.empty];
      const rightRoles: TCalculate = [ERole.empty, ERole.empty, ERole.empty, ERole.empty];

      // 计算当前棋子的左下的棋子 left
      for (let i = 1; i <= radius; i++) {
        leftRoles[i - 1] = board?.[y + i]?.[x - i]?.role;
      }

      // 计算当前棋子右上的棋子 right
      for (let i = 1; i <= radius; i++) {
        rightRoles[i - 1] = board?.[y - i]?.[x + i]?.role;
      }

      const score = this.calculateScore(leftRoles, rightRoles, role);

      this.log() && console.log('score', score);

      this.scoreCache[role][dir || 3][y][x] = score;
      this.log() && this.statistic.printClone(board, 'scoreCache pieces');
      this.log() && this.statistic.printClone(this.scoreCache, 'scoreCache');
      this.log() &&
        console.log(
          `%c===== ${this.testName} scorePoint end [${y}, ${x}] =====`,
          'color: fuchsia;'
        );
    }

    result += this.scoreCache[role][3][y][x];

    return result;
  };

  /**
   * 计算这条直线的分数
   * @param leftRole 当前落子左边的棋子分布
   * @param rightRole 当前棋子右边的棋子分布
   * @param role 当前棋子
   */
  calculateScore = (leftRole: TCalculate, rightRole: TCalculate, role: ERole): number => {
    this.log() && console.log(`%c===== calculateScore start role: ${role} =====`, 'color: navy;');
    this.log() && console.log('testDir', this.testDir);
    // 查看 TCResult 这个定义了解变量含义
    const [leftEmpty, leftMiddle, leftBlock, leftCount, leftPossible] = this.calculatePoint(
      role,
      leftRole
    );
    // 查看 TCResult 这个定义了解变量含义
    const [rightEmpty, rightMiddle, rightBlock, rightCount, rightPossible] = this.calculatePoint(
      role,
      rightRole
    );
    // 可以成为自己棋子的空位和自己棋子的总数，计算的是在找到黑棋和边界之前的
    // 注意这里必须加上当前棋子所以默认值 1
    const possibleCount = 1 + leftPossible + rightPossible;
    // 和当前棋子完全相邻的棋子
    // 注意这里必须加上当前棋子所以默认值 1
    const middleCount = 1 + leftMiddle + rightMiddle;

    this.log() && console.log('possibleCount', possibleCount);
    this.log() && console.log('middleCount', middleCount);

    this.log() && console.log('leftCount', leftCount);
    this.log() && console.log('rightCount', rightCount);
    this.log() && console.log('leftEmpty', leftEmpty);
    this.log() && console.log('rightEmpty', rightEmpty);
    this.log() && console.log('leftBlock', leftBlock);
    this.log() && console.log('rightBlock', rightBlock);

    // 计算左边的分数
    const leftScore = this.countToScore(
      possibleCount,
      middleCount,
      leftCount,
      leftEmpty,
      rightEmpty,
      leftBlock,
      rightBlock,
      0
    );

    this.log() && console.log('leftScore', leftScore);

    // 计算右边的分数并且比较最后返回需要的分数
    return this.countToScore(
      possibleCount,
      middleCount,
      rightCount,
      rightEmpty,
      leftEmpty,
      rightBlock,
      leftBlock,
      leftScore
    );
  };

  /**
   * 统计计算的方向的count和空位还有对方是否有对方的棋子
   * @param role 需要计算的棋子
   * @param roles 这个方向的四颗棋子
   */
  private calculatePoint = (role: ERole, roles: TCalculate): TCResult => {
    const rv = roles.map((r) => ERole[r]).join(', ');
    this.log() && console.log(`%c===== calculatePoint start roles: ${rv} =====`, 'color: aqua;');
    // 计算当前棋子相邻的有几颗棋子
    const [count] = roles.reduce(
      ([c, add], current) => {
        if (add) {
          // 棋子和自己相同就增加 和自己不一样就停止计算
          return [c + (current === role ? 1 : 0), current === role];
        } else {
          return [c, add];
        }
      },
      [0, true]
    );
    // 检查是否有间隔的棋子空位
    const empty = roles[count] === ERole.empty && roles[count + 1] === role;
    // 计算 empty 后面有几颗棋子
    const [emptyCount] = roles.reduce(
      ([c, add], current, index) => {
        if (empty && add && index > count) {
          return [c + (current === role ? 1 : 0), current === role];
        } else {
          return [c, add];
        }
      },
      [0, true]
    );
    // 计算以当前棋子为起点的这个方向可以算作自己棋子的位置是多少，发现第一颗黑棋停止计算
    const [possible] = roles.reduce(
      ([c, add], current) => {
        if (add) {
          // 棋子和对方的棋子不一样就增加 当发现对方的棋子就停止
          const check = [role, ERole.empty];
          return [c + (check.includes(current) ? 1 : 0), check.includes(current)];
        } else {
          return [c, add];
        }
      },
      [0, true]
    );
    this.log() && console.log('possible', possible);

    // 检查是否有黑棋堵住最后
    const blockRole = [role, ERole.empty];
    if (empty) {
      const blockIndex = count + 1 + emptyCount;
      const block = blockIndex >= roles.length ? false : !blockRole.includes(roles[blockIndex]);
      return [empty, count, block, emptyCount, possible];
    } else {
      const block = count >= roles.length ? false : !blockRole.includes(roles[count]);
      return [empty, count, block, emptyCount, possible];
    }
  };

  /**
   * 检查不同方向的分数
   * 第一个例子
   * 横向的时候自己的棋子的排列从左到右是三颗连在一起然后是一颗空位又是两颗连在一起再是一颗空位最后又有一颗的排列
   * 落子是落在中间两颗的其中一颗的时候
   * 往左边算是一个 BLOCKED_FOUR 也就是10000分
   * 往右边算是一个 BLOCKED_THREE 也就是1000分
   * 第二个例子
   * 横向的时候棋子的排列从左到右是一颗对方的棋子然后四颗自己的连在一起然后是一颗空位又是一颗自己的棋子
   * 落子落在四颗棋子的其中一颗
   * 往左边算因为最后四对方的棋子总数只有四颗无法形成任意的连子算是一个 ZERO 也就是0分
   * 往右边算因为空位加自己最后也没有对方的棋子形成一个 BLOCKED_FOUR 也就是10000分
   * 也就是说计算的时候另一个方向只有block和empty参与计算是否形成 BLOCKED 并不实际参与分数的计算
   * 所以落子的分数要算左右两边的分数只和
   * 所以第一个例子的分数最终四11000分
   * 所以第二个例子的分数最终四10000分
   * 此函数是计算一个方向的分数
   * @param possibleCount 这条线上可以作为自己的棋子和自己棋子的数量
   * @param middleCount 相邻棋子的总数
   * @param checkCount 间隔的棋子总数
   * @param checkEmpty 需要计算方向是否有空位
   * @param backEmpty 需要计算方向的反方向是否有空位
   * @param checkBlock 需要计算方向的最后是否是对方的棋子
   * @param backBlock 需要计算方向的反方向的最后是否是对方的棋子
   * @param score 这条直线现在的分数
   */
  private countToScore = (
    possibleCount: number,
    middleCount: number,
    checkCount: number,
    checkEmpty: boolean,
    backEmpty: boolean,
    checkBlock: boolean,
    backBlock: boolean,
    score: number
  ): number => {
    const count = middleCount + checkCount;
    if (possibleCount < 5) {
      return SCORE.ZERO;
    } else if (middleCount >= 5) {
      return SCORE.FIVE;
    } else {
      // 落子相邻的棋子没有达到五连的
      if (!checkEmpty && !backEmpty) {
        // 两边都没空位所有棋子都完全相邻排列
        // 这种情况无论怎么数两边的分数都是一样的
        if (!score && !checkBlock && !backBlock) {
          // 两边最后也没有对方的棋子
          switch (count) {
            case 1:
              return SCORE.ONE;
            case 2:
              return SCORE.TWO;
            case 3:
              return SCORE.THREE;
            case 4:
            default:
              // 五颗会直接走到五连就结束了，所以最大就是活四
              return SCORE.FOUR;
          }
        } else if (!score) {
          // 剩余的三种情况
          // check的方向最后是对方的棋子 反方向最后不是
          // check的方向最后不是对方的棋子 反方向最后是
          // check方向和反方向最后都是对方的棋子这种可能性不存在
          // 注意因为两边都有对方的棋子，也没有空位 possible 必定小于5 小于五就直接走到 0 分了
          // 而相邻的棋子有五颗直接会成为活五也不会到这里
          // 但是因为可能性的棋子是大于五颗所有都是 BLOCKED 的分数
          switch (count) {
            case 1:
              return SCORE.BLOCKED_ONE;
            case 2:
              return SCORE.BLOCKED_TWO;
            case 3:
              return SCORE.BLOCKED_THREE;
            case 4:
            default:
              // 在这里count最大就是 4
              return SCORE.BLOCKED_FOUR;
          }
        } else {
          return score;
        }
      } else if (!checkEmpty && backEmpty) {
        // check的方向没有空位 反方向有空位
        if ((!checkBlock && !backBlock) || (!checkBlock && backBlock)) {
          // chek的方向和反方向的最后都没有对方的棋子
          // check的方向最后没有对方的棋子 反方最后向有
          switch (count) {
            case 1: // 活一
              return this.fixMaxScore(SCORE.ONE, score);
            case 2: // 活二
              return this.fixMaxScore(SCORE.TWO, score);
            case 3: // 活三
              return this.fixMaxScore(SCORE.THREE, score);
            case 4: // 活四
            default:
              // 最多四颗 大于四颗就是连五了
              return this.fixMaxScore(SCORE.FOUR, score);
          }
        } else {
          // check的方向最后有对方的棋子 反方向最后没有
          // 两边最后都是对方的棋子的情况count只能是四
          switch (count) {
            case 1: // 眠一
              return this.fixMaxScore(SCORE.BLOCKED_ONE, score);
            case 2: // 眠二
              return this.fixMaxScore(SCORE.BLOCKED_TWO, score);
            case 3: // 眠三
              return this.fixMaxScore(SCORE.BLOCKED_THREE, score);
            case 4: // 眠四
            default:
              // 大于四颗就是五连了
              return this.fixMaxScore(SCORE.BLOCKED_FOUR, score);
          }
        }
      } else if (checkEmpty && !backEmpty) {
        // check方向有空位 反方向没有
        if ((!checkBlock && !backBlock) || (checkBlock && !backBlock)) {
          // chek的方向和反方向的最后都没有对方的棋子
          // check的方向最后有对方的棋子 反方向最后没有
          switch (count) {
            case 2: // 因为有空位最小也都是二 活一 眠二 分数都一样
              return this.fixMaxScore(SCORE.BLOCKED_TWO, score);
            case 3: // 活一 活二 眠三 返回眠三
              return this.fixMaxScore(SCORE.BLOCKED_THREE, score);
            case 4: // 活一 活二 活三 眠四 但是眠四分数最高返回眠四
              return this.fixMaxScore(SCORE.BLOCKED_FOUR, score);
            case 5: // 从第五颗开始就需要看中间有几颗了
            default: {
              // 因为此处middle count 不可能大于等于五
              if (middleCount === 4) {
                // 如果中间有四颗那么就是活四
                return this.fixMaxScore(SCORE.FOUR, score);
              } else {
                // 其他的无论怎么排列最大的都是眠4
                return this.fixMaxScore(SCORE.BLOCKED_FOUR, score);
              }
            }
          }
        } else {
          // check的方向最后没有对方的棋子 反方向最后有
          // 两边最后都是对方的棋子的情况count只能是四
          // 而这种情况下无论怎么排列组合最大的都是眠四
          switch (count) {
            case 2: // 因为有空位最小也都是二 眠一 眠二 眠二最大
              return this.fixMaxScore(SCORE.BLOCKED_TWO, score);
            case 3: // 眠一 眠二 眠三 眠三最大
              return this.fixMaxScore(SCORE.BLOCKED_THREE, score);
            case 4: // 眠一 眠二 眠三 眠四 眠四最大
            default:
              // 就算大于四颗因为有一颗是对方的无论怎么算都是眠四
              return this.fixMaxScore(SCORE.BLOCKED_FOUR, score);
          }
        }
      } else {
        // check方向和反方向两边都有empty
        if (!checkBlock && !backBlock) {
          // check方向和反方向的最后都没有block
          // 因为两边都有empty。而且两边都没有block
          // 所以分数根据方向不一样会成为两个分数和组成两种棋形
          // 对方需要下两颗棋子才能断掉这颗棋子的全部生路
          // 所以这里的分数是两个方向的分数只和
          switch (count) {
            case 2: // 因为有空位最小也都是二 活一 眠二 返回眠二加另一方向的
              return SCORE.BLOCKED_TWO + score;
            case 3: // 活一 活二 眠三 返回眠三加上另一方向的分数
              return SCORE.BLOCKED_THREE + score;
            case 4: {
              // 活一 活二 活三 眠四 返回眠四
              if (score === SCORE.BLOCKED_FOUR) {
                // 当另一边形成是眠四 因为当前方向又是眠四 在这种情况下就算又一边是对方的棋子
                // 两种棋形生效会产生绝杀 等同于一个活四
                return this.fixMaxScore(SCORE.FOUR, score);
              } else {
                // 另一边不是眠四那就正常相加
                return SCORE.BLOCKED_FOUR + score;
              }
            }
            case 5:
            default: {
              // 因为此处middle count 不可能大于等于五
              if (middleCount === 4) {
                // 如果中间有四颗那么就是活四
                return this.fixMaxScore(SCORE.FOUR, score);
              } else if (score === SCORE.BLOCKED_FOUR) {
                // 两个方向都有empty 都没有block 另一方向也是眠四 这是绝杀棋等同于活四
                return this.fixMaxScore(SCORE.FOUR, score);
              } else {
                // 其他的无论怎么排列最大的都是眠4 正常相加
                return SCORE.BLOCKED_FOUR + score;
              }
            }
          }
        } else if (checkBlock && !backBlock) {
          // check方向有block 反方向没有block
          switch (count) {
            case 2:
              // 因为有空位最小也都是二 活一 眠二 返回眠二
              // 因为这一边有block，分数大部分时间都是无效的，所以取另一边更大的
              return this.fixMaxScore(SCORE.BLOCKED_TWO, score);
            case 3: // 活一 活二 眠三 返回眠三
              // 因为这一边有block，分数大部分时间都是无效的，所以取另一边更大的
              return this.fixMaxScore(SCORE.BLOCKED_THREE, score);
            case 4: {
              // 活一 活二 活三 眠四 返回眠四
              if (score === SCORE.BLOCKED_FOUR) {
                // 当另一边形成是眠四 因为当前方向又是眠四 在这种情况下就算又一边是对方的棋子
                // 两种棋形也都是生效的所以分数相加
                return this.fixMaxScore(SCORE.FOUR, score);
              } else {
                // 当前方向有block但是是眠四这个分数是有效分数，加上另一边的有效分数
                return SCORE.BLOCKED_FOUR + score;
              }
            }
            case 5:
            default: {
              // 因为此处middle count 不可能大于等于五
              if (middleCount === 4) {
                // 如果中间有四颗那么就是活四
                return this.fixMaxScore(SCORE.FOUR, score);
              } else {
                // 活一 活二 活三 眠四 返回眠四
                if (score === SCORE.BLOCKED_FOUR) {
                  // 当另一边形成是眠四 因为当前方向又是眠四 在这种情况下就算又一边是对方的棋子
                  // 两种棋形也都是生效的所以分数相加
                  return this.fixMaxScore(SCORE.FOUR, score);
                } else {
                  // check方向有block，但是check方向能形成眠四那么就加上另一方向的分数
                  return SCORE.BLOCKED_FOUR + score;
                }
              }
            }
          }
        } else {
          // check方向没有block 反方向有block
          // check方向和反方向都有block
          switch (count) {
            case 2: // 因为有空位最小也都是二 活一 眠二 返回眠二
              return this.fixMaxScore(SCORE.BLOCKED_TWO, score);
            case 3: // 活一 活二 眠三 返回眠三
              return this.fixMaxScore(SCORE.BLOCKED_THREE, score);
            case 4: {
              // 活一 活二 活三 眠四 返回眠四
              if (score === SCORE.BLOCKED_FOUR) {
                // 当另一边形成是眠四 因为当前方向又是眠四 在这种情况下就算又一边是对方的棋子
                // 两种棋形也都是生效的所以分数相加
                return this.fixMaxScore(SCORE.FOUR, score);
              } else {
                return this.fixMaxScore(SCORE.BLOCKED_FOUR, score);
              }
            }
            case 5:
            default: {
              // 因为此处middle count 不可能大于等于五
              if (middleCount === 4) {
                // 如果中间有四颗那么就是活四
                return this.fixMaxScore(SCORE.FOUR, score);
              } else {
                // 活一 活二 活三 眠四 返回眠四
                if (score === SCORE.BLOCKED_FOUR) {
                  // 当另一边形成是眠四 因为当前方向又是眠四 在这种情况下就算又一边是对方的棋子
                  // 两种棋形也都是生效的所以分数相加
                  return this.fixMaxScore(SCORE.FOUR, score);
                } else {
                  // 因为check方向可以形成眠四，另一边都比眠四小又有block所以取最大值
                  return this.fixMaxScore(SCORE.BLOCKED_FOUR, score);
                }
              }
            }
          }
        }
      }
    }
  };

  /**
   * 计算两个方向的分数找到最大的那个分数
   * @param curren 当前获得的分数
   * @param score 上一个计算或者默认的分数
   */
  private fixMaxScore = (curren: number, score: number): number => {
    return Math.max(curren, score);
  };

  /**
   * 测试函数 决定什么时候打印log
   */
  private log = (): boolean => {
    return ([] as number[]).includes(this.testDir);
  };
}
