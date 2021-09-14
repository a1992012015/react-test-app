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
  allSteps: IPiece[] = [];
  stepsTail: IPiece[] = [];
  count = 0; // 走了的步数
  comScore: number[][] = [];
  humScore: number[][] = [];
  scoreCache: number[][][][] = [];
  comMaxScore = 0;
  humMaxScore = 0;
  starCount = 0;
  total = 0;

  steps = [];

  init = (board: IBoard): void => {
    this.currentSteps = []; // 当前一次思考的步骤
    this.allSteps = [];
    this.stepsTail = [];
    this.count = 0; // chessman count

    if (board.pieces.length === 15 && board.pieces.every((b) => b.length === 15)) {
      this.board = board;
    } else {
      this.board = wuyue;
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
  };

  put = (piece: IPiece): void => {
    AI.debug && console.log(`put [${piece.role}] piece:`, piece);
    this.board.pieces[piece.x][piece.y] = piece;
    zobrist.go(piece);
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
    let i = 0;
    while (i < 2) {
      const s = this.allSteps[this.allSteps.length - 1];
      this.remove(s);
      this.stepsTail.push(s);
      i++;
    }
  };

  /**
   * 返回悔棋的哪一步
   */
  forward = (): void => {
    if (this.stepsTail.length < 2) {
      return;
    }
    let i = 0;
    while (i < 2) {
      const s = this.stepsTail.pop();
      if (s) {
        this.put(s);
      }
      i++;
    }
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
    const comfours: IPiece[] = [];
    const humfours: IPiece[] = [];
    const comblockedfours: IPiece[] = [];
    const humblockedfours: IPiece[] = [];
    const comtwothrees: IPiece[] = [];
    const humtwothrees: IPiece[] = [];
    const comthrees: IPiece[] = [];
    const humthrees: IPiece[] = [];
    const comtwos: IPiece[] = [];
    const humtwos: IPiece[] = [];
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

    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board.length; y++) {
        if (board[x][y].role === ERole.empty) {
          const scoreHum = this.humScore[x][y];
          const scoreCom = this.comScore[x][y];
          const maxScore = Math.max(scoreCom, scoreHum);
          if (
            this.allSteps.length >= 6 ||
            this.hasNeighbor(x, y, 1, 1) ||
            !onlyThrees ||
            maxScore >= SCORE.THREE
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
            // if (starSpread && AI.star) {
            //   // const roleScore = role === ERole.com ? p.scoreCom : p.scoreHum;
            //   // const deRoleScore = role === ERole.com ? p.scoreHum : p.scoreCom;
            //   const lastStep = this.currentSteps[this.currentSteps.length - 1];
            //
            //   if (maxScore >= SCORE.FOUR) {
            //     //
            //   } else if (maxScore >= SCORE.BLOCKED_FOUR && this.starTo(lastStep)) {
            //     // star 路径不是很准，所以考虑冲四防守对手最后一步的棋
            //   } else if (this.starTo(p, attackPoints) || this.starTo(p, defendPoints)) {
            //     //
            //   } else {
            //     this.starCount++;
            //     continue;
            //   }
            // }

            // 分数检测
            if (scoreCom >= SCORE.FIVE) {
              // 先看电脑能不能连连五
              fives.push(p);
            } else if (scoreHum >= SCORE.FIVE) {
              // 再看玩家能不能连成5
              // 别急着返回，因为遍历还没完成，说不定电脑自己能成五。
              fives.push(p);
            } else if (scoreCom >= SCORE.FOUR) {
              comfours.push(p);
            } else if (scoreHum >= SCORE.FOUR) {
              humfours.push(p);
            } else if (scoreCom >= SCORE.BLOCKED_FOUR) {
              comblockedfours.push(p);
            } else if (scoreHum >= SCORE.BLOCKED_FOUR) {
              humblockedfours.push(p);
            } else if (scoreCom >= 2 * SCORE.THREE) {
              // 能成双三也行
              comtwothrees.push(p);
            } else if (scoreHum >= 2 * SCORE.THREE) {
              humtwothrees.push(p);
            } else if (scoreCom >= SCORE.THREE) {
              comthrees.push(p);
            } else if (scoreHum >= SCORE.THREE) {
              humthrees.push(p);
            } else if (scoreCom >= SCORE.TWO) {
              comtwos.unshift(p);
            } else if (scoreHum >= SCORE.TWO) {
              humtwos.unshift(p);
            } else {
              neighbors.push(p);
            }
          }
          //
          // if (this.allSteps.length < 6 && !this.hasNeighbor(x, y, 1, 1)) {
          //   // 一共下了六步之前，周围一格没有落子，则不计算
          //   continue;
          // } else if (!this.hasNeighbor(x, y, 2, 2)) {
          //   // 周围两格一共不足两个棋子，则不计算
          //   continue;
          // }
          //
          // if (onlyThrees && maxScore < SCORE.THREE) {
          //   // 开启只有活三检测，分数小于活三不计算
          //   continue;
          // }
        }
      }
    }

    // 如果成五，是必杀棋，直接返回
    if (fives.length) {
      return fives;
    }

    // 电脑能活四，则直接活四，不考虑冲四
    if (role === ERole.com && comfours.length) {
      return comfours;
    }

    // 自己能活四，则直接活四，不考虑冲四
    if (role === ERole.hum && humfours.length) {
      return humfours;
    }

    // 电脑有活四冲四，自己冲四都没，则只考虑对面活四 （此时对面冲四就不用考虑了)
    if (role === ERole.com && humfours.length && !comblockedfours.length) {
      return humfours;
    }

    // 自己有活四冲四，自己冲四都没，则只考虑对面活四 （此时对面冲四就不用考虑了)
    if (role === ERole.hum && comfours.length && !humblockedfours.length) {
      return comfours;
    }

    // 对面有活四自己有冲四，则都考虑下
    const fours = role === ERole.com ? comfours.concat(humfours) : humfours.concat(comfours);
    const blockedfours =
      role === ERole.com
        ? comblockedfours.concat(humblockedfours)
        : humblockedfours.concat(comblockedfours);

    if (fours.length) {
      return fours.concat(blockedfours);
    }

    let result: IPiece[] = [];
    if (role === ERole.com) {
      result = comtwothrees
        .concat(humtwothrees)
        .concat(comblockedfours)
        .concat(humblockedfours)
        .concat(comthrees)
        .concat(humthrees);
    }
    if (role === ERole.hum) {
      result = humtwothrees
        .concat(comtwothrees)
        .concat(humblockedfours)
        .concat(comblockedfours)
        .concat(humthrees)
        .concat(comthrees);
    }

    // result.sort(function(a, b) { return b.score - a.score })

    // 双三很特殊，因为能形成双三的不一定比一个活三强
    if (comtwothrees.length || humtwothrees.length) {
      return result;
    }

    // 只返回大于等于活三的棋
    if (onlyThrees) {
      return result;
    }

    let twos: IPiece[];
    if (role === ERole.com) {
      twos = comtwos.concat(humtwos);
    } else {
      twos = humtwos.concat(comtwos);
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

    for (let x = 0; x < pieces.length; x++) {
      for (let y = 0; y < pieces[x].length; y++) {
        const data = {
          x,
          y,
          pieces: this.board.pieces,
          scoreCache: this.scoreCache
        };
        // 空位，对双方都打分
        if (pieces[x][y].role === ERole.empty) {
          if (this.hasNeighbor(x, y, 2, 2)) {
            // 必须是有邻居的才行
            const cs = evaluatePoint.scorePoint({ ...data, role: ERole.com });
            const hs = evaluatePoint.scorePoint({ ...data, role: ERole.hum });
            this.comScore[x][y] = cs;
            this.humScore[x][y] = hs;
          }
        } else if (pieces[x][y].role === ERole.com) {
          // 对电脑打分，玩家此位置分数为0
          this.comScore[x][y] = evaluatePoint.scorePoint({ ...data, role: ERole.com });
          this.humScore[x][y] = 0;
        } else if (pieces[x][y].role === ERole.hum) {
          // 对玩家打分，电脑位置分数为0
          this.humScore[x][y] = evaluatePoint.scorePoint({ ...data, role: ERole.hum });
          this.comScore[x][y] = 0;
        }
      }
    }
  };

  /**
   * 检测当前位置是否有邻居
   * @param x 坐标
   * @param y 坐标
   * @param distance 检索的距离
   * @param count 有几个邻居
   */
  hasNeighbor(x: number, y: number, distance: number, count: number): boolean {
    const { pieces } = this.board;
    const len = pieces.length;
    const startX = x - distance;
    const endX = x + distance;
    const startY = y - distance;
    const endY = y + distance;
    let nowCount = count;
    for (let i = startX; i <= endX; i++) {
      // x 坐标必须在棋盘之内
      if (i >= 0 && i < len) {
        for (let j = startY; j <= endY; j++) {
          // y 坐标必须在棋盘之内
          if (j >= 0 && j < len) {
            // 需要计算的点，所以不需要检测
            if (i !== x && j !== y) {
              // 有棋子的位置
              if (pieces[i][j].role !== ERole.empty) {
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
    }
    // 没有足够的邻居
    return false;
  }

  /**
   * 棋面估分
   * 这里只算当前分，而不是在空位下一步之后的分
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
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[x].length; y++) {
        if (board[x][y].role === ERole.com) {
          this.comMaxScore += this.fixScore(this.comScore[x][y]);
        } else if (board[x][y].role === ERole.hum) {
          this.humMaxScore += this.fixScore(this.humScore[x][y]);
        }
      }
    }
    // 有冲四延伸了，不需要专门处理冲四活三
    // 不过这里做了这一步，可以减少电脑胡乱冲四的毛病
    // this.comMaxScore = fixScore(this.comMaxScore)
    // this.humMaxScore = fixScore(this.humMaxScore)
    // if (aiConfig.cache) this.evaluateCache[this.zobrist.code] = result

    return (role === ERole.com ? 1 : -1) * (this.comMaxScore - this.humMaxScore);
  };

  checkRoleScore = (piece: IPiece, role: ERole): boolean => {
    const scoreCom = piece?.scoreCom || 0;
    const scoreHum = piece?.scoreHum || 0;
    const { THREE } = SCORE;
    return (role === ERole.com && scoreCom >= THREE) || (role === ERole.hum && scoreHum >= THREE);
  };

  // 移除棋子
  remove = (p: IPiece): void => {
    const r = this.board.pieces[p.x][p.y];
    AI.debug && console.log(`put [${r}] piece:`, p);
    zobrist.go(p);
    this.board.pieces[p.x][p.y].role = ERole.empty;
    this.updateScore(p);
    this.allSteps.pop();
    this.currentSteps.pop();
    this.count--;
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
    console.log(`steps: ${this.allSteps.map((d) => `[${d.x}, ${d.y}]`).join(';')}`);
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
    // 更新横向
    for (let i = -radius; i <= radius; i++) {
      const { x } = p;
      const y = p.y + i;
      if (y >= 0 && y < len) {
        this.update(x, y, 1);
      }
    }

    // 更新竖向
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
    const { role } = this.board.pieces[x][y];
    const data = {
      x,
      y,
      dir,
      pieces: this.board.pieces,
      scoreCache: this.scoreCache
    };
    this.mergeScore({ ...data, role: ERole.com }, role, this.comScore);
    this.mergeScore({ ...data, role: ERole.hum }, role, this.humScore);
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
      scores[data.x][data.y] = score;
      statistic.table[data.x][data.y] += score;
    } else {
      scores[data.x][data.y] = 0;
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
      }
      if (score >= SCORE.BLOCKED_FOUR + SCORE.THREE && score < SCORE.BLOCKED_FOUR * 2) {
        // 冲四活三，比双三分高，相当于自己形成活四
        return SCORE.FOUR;
      }
      // 双冲四 比活四分数也高
      return SCORE.FOUR * 2;
    }
    return score;
  };

  toString = (): string => {
    return this.board.pieces.map((d) => d.map((p) => `[${p.x}, ${p.y}]`).join(';')).join('\n');
  };
}

export const board = new Board();