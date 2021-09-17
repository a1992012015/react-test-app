import { cloneDeep } from 'lodash-es';
import { IBoard } from '../interfaces/board.interface';
import { IPiece } from '../interfaces/piece.interface';
import { wuyue } from '../configs/opens.config';
import { ERole } from '../interfaces/role.interface';
import { zobrist } from './zobrist.service';
import { commons } from './commons.service';
import { statistic } from './statistic.service';
import { evaluatePoint } from './evaluate-point.service';
import { creatPiece } from './piece.service';
import { AI } from '../configs/ai.config';
import { SCORE } from '../configs/score.config';
import { IScorePoint } from '../interfaces/evaluate-point.interface';

/**
 * 棋盘
 */
export class Board {
  board: IBoard = { name: '', pieces: [] };
  currentSteps: IPiece[] = []; // 当前一次思考的步骤
  allSteps: IPiece[] = []; // 每一步的棋子
  stepsTail: IPiece[] = []; // 悔棋的步数储存
  count = 0; // 走了的步数
  comScore: number[][] = [];
  humScore: number[][] = [];
  scoreCache: number[][][][] = [];
  comMaxScore = 0;
  humMaxScore = 0;
  starCount = 0;
  total = 0;

  steps = [];

  init = (board: IBoard): IBoard => {
    this.currentSteps = []; // 当前一次思考的步骤
    this.allSteps = [];
    this.stepsTail = [];
    this.count = 0; // chessman count

    if (board.pieces.length === 15 && board.pieces.every((b) => b.length === 15)) {
      this.board = cloneDeep(board);
    } else {
      this.board = cloneDeep(wuyue);
    }

    // 初始化走了的步数
    for (let i = 0; i < this.board.pieces.length; i++) {
      this.count += this.board.pieces[i].filter((d) => d.role > ERole.empty).length;
    }

    const size = this.board.pieces.length;

    statistic.init(size);
    zobrist.init(); // 注意重新初始化

    // 存储双方得分
    this.comScore = commons.createScores(size, size);
    this.humScore = commons.createScores(size, size);

    // scoreCache[role][dir][row][column]
    this.scoreCache = [
      [], // placeholder
      [
        // for role 1
        commons.createScores(size, size),
        commons.createScores(size, size),
        commons.createScores(size, size),
        commons.createScores(size, size)
      ],
      [
        // for role 2
        commons.createScores(size, size),
        commons.createScores(size, size),
        commons.createScores(size, size),
        commons.createScores(size, size)
      ]
    ];

    this.initScore();
    return this.board;
  };

  put = (piece: IPiece): void => {
    AI.debug && console.log(`put [${ERole[piece.role]}] piece:`, piece);
    this.board.pieces[piece.y][piece.x] = piece;
    const code = zobrist.go(piece);
    console.log(`put => zobrist => code: ${code}`);
    this.updateScore(piece);
    this.allSteps.push(piece);
    this.currentSteps.push(piece);
    this.stepsTail = [];
    this.count++;
  };

  /**
   * 悔棋
   */
  backward = (): void => {
    if (this.allSteps.length < 2) {
      return;
    }

    for (let i = 2; i > 0; i--) {
      const s = this.allSteps[this.allSteps.length - 1];
      this.remove(s);
      this.stepsTail.push(s);
    }
  };

  /**
   * 返回悔棋的哪一步
   */
  forward = (): void => {
    if (this.stepsTail.length < 2) {
      // 加入没有储存有悔棋的步数则会失败
      return;
    }

    // 将缓存的两步重新添加回去
    for (let i = 2; i > 0; i--) {
      const s = this.stepsTail.pop();
      if (s) {
        this.put(s);
      }
    }
  };

  /**
   * 移除棋盘上的棋子
   * @param p 需要移除的棋子
   */
  remove = (p: IPiece): void => {
    const r = this.board.pieces[p.y][p.x];
    AI.debug && console.log(`put [${r}] piece:`, p);
    zobrist.go(p);
    this.board.pieces[p.y][p.x].role = ERole.empty;
    // 移除之后也需要更新周围的分数
    this.updateScore(p);
    this.allSteps.pop();
    this.currentSteps.pop();
    this.count--;
  };

  /**
   * 生成可以落子的点
   * gen 函数的排序是非常重要的，因为好的排序能极大提升AB剪枝的效率。
   * 而对结果的排序，是要根据role来的
   * @param role 选手
   * @param onlyThrees 只看活三
   * @param starSpread 开启双星延伸
   */
  gen = (role: ERole, onlyThrees?: boolean, starSpread?: boolean): IPiece[] => {
    if (this.count <= 0) {
      return [creatPiece({ x: 7, y: 7, role })];
    }

    // 各种棋形的储存数组
    const fives: IPiece[] = [];
    const comFours: IPiece[] = [];
    const humFours: IPiece[] = [];
    const comBlockedFours: IPiece[] = [];
    const humBlockedFours: IPiece[] = [];
    const comTwoThrees: IPiece[] = [];
    const humTwoThrees: IPiece[] = [];
    const comThrees: IPiece[] = [];
    const humThrees: IPiece[] = [];
    const comTwos: IPiece[] = [];
    const humTwos: IPiece[] = [];
    const neighbors: IPiece[] = [];

    const board = this.board.pieces;
    const reverseRole = commons.reverseRole(role);
    // 找到双方的最后进攻点
    const attackPoints: IPiece[] = []; // 进攻点
    const defendPoints: IPiece[] = []; // 防守点

    // 默认情况下 我们遍历整个棋盘。但是在开启star模式下，我们遍历的范围就会小很多
    // 只需要遍历以两个点为中心正方形。
    // 注意除非专门处理重叠区域，否则不要把两个正方形分开算，因为一般情况下这两个正方形会有相当大的重叠面积，别重复计算了
    if (starSpread && AI.star) {
      for (let i = this.currentSteps.length - 1; i >= 0; i -= 2) {
        const p = this.currentSteps[i];
        if (this.checkRoleScore(p, reverseRole)) {
          defendPoints.push(p);
          break;
        }
      }

      if (!defendPoints.length) {
        defendPoints.push(
          this.currentSteps[0].role === reverseRole ? this.currentSteps[0] : this.currentSteps[1]
        );
      }

      for (let i = this.currentSteps.length - 2; i >= 0; i -= 2) {
        const p = this.currentSteps[i];
        if (this.checkRoleScore(p, role)) {
          attackPoints.push(p);
          break;
        }
      }

      if (!attackPoints.length) {
        attackPoints.push(
          this.currentSteps[0].role === role ? this.currentSteps[0] : this.currentSteps[1]
        );
      }
    }

    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board.length; x++) {
        if (board[y][x].role === ERole.empty) {
          const scoreHum = this.humScore[y][x];
          const scoreCom = this.comScore[y][x];
          const maxScore = Math.max(scoreCom, scoreHum);

          const find1 = this.hasNeighbor(y, x, 1, 1);
          const find2 = this.hasNeighbor(y, x, 2, 2);

          if (
            (this.allSteps.length < 6 && find1) ||
            (this.allSteps.length >= 6 && find2) ||
            (this.allSteps.length >= 6 && find2 && onlyThrees && maxScore >= SCORE.THREE) ||
            (this.allSteps.length >= 6 && find2 && !onlyThrees)
          ) {
            // 生成当前位置的棋子对象
            const p = creatPiece({ x, y, role });
            p.score = maxScore;
            p.scoreHum = scoreHum;
            p.scoreCom = scoreCom;

            this.total++;
            // TODO 性能优化点，留待以后继续优化
            /* 双星延伸，以提升性能
             * 思路：每次下的子，只可能是自己进攻，或者防守对面（也就是对面进攻点）
             * 我们假定任何时候，绝大多数情况下进攻的路线都可以按次序连城一条折线，那么每次每一个子，一定都是在上一个己方棋子的八个方向之一。
             * 因为既可能自己进攻，也可能防守对面，所以是最后两个子的米子方向上
             * 那么极少数情况，进攻路线无法连成一条折线呢?
             * 很简单，我们对前双方两步不作star限制就好，这样可以 兼容一条折线中间伸出一段的情况
             */
            if (starSpread && AI.star) {
              // const roleScore = role === ERole.com ? p.scoreCom : p.scoreHum;
              // const deRoleScore = role === ERole.com ? p.scoreHum : p.scoreCom;
              const lastStep = this.currentSteps[this.currentSteps.length - 1];

              if (maxScore >= SCORE.FOUR) {
                //
              } else if (maxScore >= SCORE.BLOCKED_FOUR && this.starTo(lastStep)) {
                // star 路径不是很准，所以考虑冲四防守对手最后一步的棋
              } else if (this.starTo(p, attackPoints) || this.starTo(p, defendPoints)) {
                //
              } else {
                this.starCount++;
                // eslint-disable-next-line no-continue
                continue;
              }
            }

            // 分数检测
            if (scoreCom >= SCORE.FIVE) {
              // 先看电脑能不能连连五
              fives.push(p);
            } else if (scoreHum >= SCORE.FIVE) {
              // 再看玩家能不能连成5
              // 别急着返回，因为遍历还没完成，说不定电脑自己能成五。
              fives.push(p);
            } else if (scoreCom >= SCORE.FOUR) {
              comFours.push(p);
            } else if (scoreHum >= SCORE.FOUR) {
              humFours.push(p);
            } else if (scoreCom >= SCORE.BLOCKED_FOUR) {
              comBlockedFours.push(p);
            } else if (scoreHum >= SCORE.BLOCKED_FOUR) {
              humBlockedFours.push(p);
            } else if (scoreCom >= 2 * SCORE.THREE) {
              // 能成双三也行
              comTwoThrees.push(p);
            } else if (scoreHum >= 2 * SCORE.THREE) {
              humTwoThrees.push(p);
            } else if (scoreCom >= SCORE.THREE) {
              comThrees.push(p);
            } else if (scoreHum >= SCORE.THREE) {
              humThrees.push(p);
            } else if (scoreCom >= SCORE.TWO) {
              comTwos.unshift(p);
            } else if (scoreHum >= SCORE.TWO) {
              humTwos.unshift(p);
            } else {
              neighbors.push(p);
            }
          }

          // if (this.allSteps.length < 6) {
          //   // 一共下了六步以内
          //   if (!this.hasNeighbor(x, y, 1, 1)) {
          //     // 周围一格内没有一颗棋子
          //     continue;
          //   } else {
          //
          //   }
          // } else if (!this.hasNeighbor(x, y, 2, 2)) {
          //   // 周围两格内没有两颗棋子
          //   continue;
          // } else if (onlyThrees && maxScore < SCORE.THREE) {
          //   // 只看活三的情况下，最大分数没有超过活三分数
          //   continue;
          // } else {
          //
          // }
        }
      }
    }

    // 如果成五，是必杀棋，直接返回
    if (fives.length) {
      return fives;
    }

    // 电脑能活四，则直接活四，不考虑冲四
    if (role === ERole.white && comFours.length) {
      return comFours;
    }

    // 自己能活四，则直接活四，不考虑冲四
    if (role === ERole.block && humFours.length) {
      return humFours;
    }

    // 电脑有活四冲四，自己冲四都没，则只考虑对面活四 （此时对面冲四就不用考虑了)
    if (role === ERole.white && humFours.length && !comBlockedFours.length) {
      return humFours;
    }

    // 自己有活四冲四，自己冲四都没，则只考虑对面活四 （此时对面冲四就不用考虑了)
    if (role === ERole.block && comFours.length && !humBlockedFours.length) {
      return comFours;
    }

    // 对面有活四自己有冲四，则都考虑下
    const fours = role === ERole.white ? comFours.concat(humFours) : humFours.concat(comFours);
    const blockedfours =
      role === ERole.white
        ? comBlockedFours.concat(humBlockedFours)
        : humBlockedFours.concat(comBlockedFours);

    if (fours.length) {
      return fours.concat(blockedfours);
    }

    let result: IPiece[] = [];
    if (role === ERole.white) {
      result = comTwoThrees
        .concat(humTwoThrees)
        .concat(comBlockedFours)
        .concat(humBlockedFours)
        .concat(comThrees)
        .concat(humThrees);
    }
    if (role === ERole.block) {
      result = humTwoThrees
        .concat(comTwoThrees)
        .concat(humBlockedFours)
        .concat(comBlockedFours)
        .concat(humThrees)
        .concat(comThrees);
    }

    // result.sort(function(a, b) { return b.score - a.score })

    // 双三很特殊，因为能形成双三的不一定比一个活三强
    if (comTwoThrees.length || humTwoThrees.length) {
      return result;
    }

    // 只返回大于等于活三的棋
    if (onlyThrees) {
      return result;
    }

    let twos: IPiece[];
    if (role === ERole.white) {
      twos = comTwos.concat(humTwos);
    } else {
      twos = humTwos.concat(comTwos);
    }

    twos.sort((a, b) => b.score - a.score);
    result = result.concat(twos.length ? twos : neighbors);

    // 这种分数低的，就不用全部计算了
    if (result.length > AI.countLimit) {
      return result.slice(0, AI.countLimit);
    }

    return result;
  };

  initScore = (): void => {
    const { pieces } = this.board;

    for (let y = 0; y < pieces.length; y++) {
      for (let x = 0; x < pieces[y].length; x++) {
        const data = {
          x,
          y,
          pieces: this.board.pieces,
          scoreCache: this.scoreCache
        };
        // 空位，对双方都打分
        if (pieces[y][x].role === ERole.empty) {
          if (this.hasNeighbor(y, x, 2, 2)) {
            // 必须是有邻居的才行
            const cs = evaluatePoint.scorePoint({ ...data, role: ERole.white });
            const hs = evaluatePoint.scorePoint({ ...data, role: ERole.block });
            this.comScore[y][x] = cs;
            this.humScore[y][x] = hs;
          }
        } else if (pieces[y][x].role === ERole.white) {
          // 对电脑打分，玩家此位置分数为0
          this.comScore[y][x] = evaluatePoint.scorePoint({ ...data, role: ERole.white });
          this.humScore[y][x] = 0;
        } else if (pieces[y][x].role === ERole.block) {
          // 对玩家打分，电脑位置分数为0
          this.humScore[y][x] = evaluatePoint.scorePoint({ ...data, role: ERole.block });
          this.comScore[y][x] = 0;
        }
      }
    }
  };

  /**
   * 检测当前位置是否有邻居
   * @param y 坐标
   * @param x 坐标
   * @param distance 检索的距离
   * @param count 有几个邻居
   */
  hasNeighbor(y: number, x: number, distance: number, count: number): boolean {
    const { pieces } = this.board;
    const len = pieces.length;
    const startY = y - distance;
    const endY = y + distance;
    const startX = x - distance;
    const endX = x + distance;
    let nowCount = count;
    for (let py = startY; py <= endY; py++) {
      // x 坐标必须在棋盘之内
      if (py >= 0 && py < len) {
        for (let px = startX; px <= endX; px++) {
          // y 坐标必须在棋盘之内
          if (px >= 0 && px < len) {
            // 需要计算的点，所以不需要检测
            if ((py !== y || px !== x) && pieces[py][px].role !== ERole.empty) {
              // 不是自身棋子，有其他棋子的位置
              nowCount--;
              // 检测到足够的邻居返回
              if (nowCount <= 0) {
                return true;
              }
            }
          }
        }
      }
    }
    // 没有足够的邻居
    return false;
  }

  /**
   * 棋面估分，评估分数都是越大越好
   * 这里只算当前分，而不是在空位下一步之后的分
   * 电脑分数高 评估电脑选手的分数
   * 1 * 1000 = 1000
   * 电脑分数高 评估玩家选手的分数
   * -1 * 1000 = -1000
   * 玩家分数高 评估玩家选手的分数
   * -1 * -1000 = 1000
   * 玩家分数高 评估电脑选手的分数
   * 1 * -1000 = -1000
   * @param role 当前的选手
   */
  evaluate = (role: ERole): number => {
    // 这里加了缓存，但是并没有提升速度
    // if (AI.cache && evaluateCache[zobrist.code]) {
    //   return evaluateCache[zobrist.code];
    // }
    // 这里都是用正整数初始化的，所以初始值是0
    this.comMaxScore = 0;
    this.humMaxScore = 0;

    const board = this.board.pieces;

    // 遍历出最高分，开销不大
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x].role === ERole.white) {
          this.comMaxScore += this.fixScore(this.comScore[y][x]);
        } else if (board[y][x].role === ERole.block) {
          this.humMaxScore += this.fixScore(this.humScore[y][x]);
        }
      }
    }
    // 有冲四延伸了，不需要专门处理冲四活三
    // 不过这里做了这一步，可以减少电脑胡乱冲四的毛病
    // this.comMaxScore = fixScore(this.comMaxScore)
    // this.humMaxScore = fixScore(this.humMaxScore)
    // if (aiConfig.cache) this.evaluateCache[this.zobrist.code] = result
    return (role === ERole.white ? 1 : -1) * (this.comMaxScore - this.humMaxScore);
  };

  checkRoleScore = (piece: IPiece, role: ERole): boolean => {
    const scoreCom = piece?.scoreCom || 0;
    const scoreHum = piece?.scoreHum || 0;
    const { THREE } = SCORE;
    return (
      (role === ERole.white && scoreCom >= THREE) || (role === ERole.block && scoreHum >= THREE)
    );
  };

  log = (): void => {
    AI.log &&
      console.log(
        `star: ${((this.starCount / this.total) * 100).toFixed(2)}%, ${this.starCount}/${
          this.total
        }`
      );
  };

  logSteps = (): void => {
    console.log(`steps: ${this.allSteps.map((d) => `[${d.y}, ${d.x}]`).join(';')}`);
  };

  starTo = (point: IPiece, points?: IPiece[]): boolean => {
    if (!points || !points.length) {
      return false;
    }
    const a = point;
    for (let i = 0; i < points.length; i++) {
      // 距离必须在5步以内
      const b = points[i];
      if (Math.abs(a.x - b.x) > 4 || Math.abs(a.y - b.y) > 4) {
        return false;
      }

      // 必须在米子方向上
      if (!(a.x === b.x || a.y === b.y || Math.abs(a.x - b.x) === Math.abs(a.y - b.y))) {
        return false;
      }
    }
    return true;
  };

  /**
   * 更新当前点周围的分数
   * 参见 evaluate point 中的代码，为了优化性能，在更新分数的时候可以指定只更新某一个方向的分数
   * @param p 棋子
   */
  updateScore = (p: IPiece): void => {
    const radius = 4;
    const len = this.board.pieces.length;

    // 无论是不是空位 都需要更新
    // 更新竖向
    for (let i = -radius; i <= radius; i++) {
      const { x } = p;
      const y = p.y + i;
      if (y >= 0 && y < len) {
        this.update(x, y, 0);
      }
    }

    // 更新横向
    for (let i = -radius; i <= radius; i++) {
      const x = p.x + i;
      const { y } = p;
      if (x >= 0 && x < len) {
        this.update(x, y, 1);
      }
    }

    // 更新右斜下方 左斜上方
    for (let i = -radius; i <= radius; i++) {
      const x = p.x + i;
      const y = p.y + i;
      if (x >= 0 && x < len && y >= 0 && y < len) {
        this.update(x, y, 2);
      }
    }

    // 更新左斜下方 右斜上方
    for (let i = -radius; i <= radius; i++) {
      const x = p.x + i;
      const y = p.y - i;
      if (x >= 0 && x < len && y >= 0 && y < len) {
        this.update(x, y, 3);
      }
    }
  };

  /**
   * 更新当前棋子的分数
   * @param x 坐标
   * @param y 坐标
   * @param dir 更新的方向
   */
  update = (x: number, y: number, dir: number): void => {
    const { role } = this.board.pieces[y][x];
    const data = {
      x,
      y,
      dir,
      pieces: this.board.pieces,
      scoreCache: this.scoreCache
    };
    this.mergeScore({ ...data, role: ERole.white }, role, this.comScore);
    this.mergeScore({ ...data, role: ERole.block }, role, this.humScore);
  };

  /**
   * 把分数储存在分数数组里面
   * @param data 计算的数据
   * @param role 选手
   * @param scores 需要更新的分数数组
   */
  mergeScore = (data: IScorePoint, role: ERole, scores: number[][]): void => {
    if (role !== commons.reverseRole(data.role)) {
      const score = evaluatePoint.scorePoint(data);
      scores[data.y][data.x] = score;
      statistic.table[data.y][data.x] += score;
    } else {
      scores[data.y][data.x] = 0;
    }
  };

  /**
   * 冲四的分其实肯定比活三高，但是如果这样的话容易形成盲目冲四的问题，所以如果发现电脑有无意义的冲四，则将分数降低到和活三一样
   * 而对于冲四活三这种杀棋，则将分数提高。
   * @param score - 分数
   */
  fixScore = (score: number): number => {
    if (score < SCORE.FOUR && score >= SCORE.BLOCKED_FOUR) {
      if (score >= SCORE.BLOCKED_FOUR && score < SCORE.BLOCKED_FOUR + SCORE.THREE) {
        // 单独冲四，意义不大
        return SCORE.THREE;
      } else if (score >= SCORE.BLOCKED_FOUR + SCORE.THREE && score < SCORE.BLOCKED_FOUR * 2) {
        // 冲四活三，比双三分高，相当于自己形成活四
        return SCORE.FOUR;
      } else {
        // 双冲四 比活四分数也高
        return SCORE.FOUR * 2;
      }
    } else {
      return score;
    }
  };

  toString = (): string => {
    return this.board.pieces.map((d) => d.map((p) => `[${p.y}, ${p.x}]`).join(';')).join('\n');
  };
}

export const board = new Board();
