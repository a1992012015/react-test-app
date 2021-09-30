/* eslint-disable */
import { scorePoint } from './evaluate-point';
import zobrist, { Zobrist } from './zobrist';
import { aiRole } from '../configs/ai-role';
import { SCORE } from '../configs/score';
import { aiConfig } from '../configs/ai-config';
import { ArrayFun } from './arrary';
import statistic from './statistic';
import { Piece, Role } from '../interfaces/open-pants.interface';
import { ERole } from '../../gobang-2.0.0/interfaces/role.interface';
import { IScorePoint } from '../../gobang-2.0.0/interfaces/evaluate-point.interface';
import { EvaluatePoint } from '../../gobang-2.0.0/services/evaluate-point.service';

let count = 0;
let total = 0;

const evaluatePoint = new EvaluatePoint();

/**
 * 冲四的分其实肯定比活三高，但是如果这样的话容易形成盲目冲四的问题，所以如果发现电脑有无意义的冲四，则将分数降低到和活三一样
 * 而对于冲四活三这种杀棋，则将分数提高。
 * @param {number} score - 分数
 */
const fixScore = (score: number) => {
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
  }
  return score;
};

const starTo = (point: Piece, points?: Piece[]) => {
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

export class Board {
  zobrist?: Zobrist;
  currentSteps: Piece[] = [];
  count = 0;
  allSteps: Piece[] = [];
  stepsTail: Piece[] = [];
  steps: Piece[] = [];
  board: Piece[][] = [];
  comScore: Piece[][] = [];
  humScore: Piece[][] = [];
  evaluateCache = {};
  scoreCache: Piece[][][][] = [];
  comMaxScore = 0;
  humMaxScore = 0;

  _last: boolean[] = [];

  init = (sizeOrBoard: Piece[][]) => {
    console.log('init board', sizeOrBoard);
    this.evaluateCache = {};
    this.currentSteps = []; // 当前一次思考的步骤
    this.allSteps = [];
    this.stepsTail = [];
    this.zobrist = zobrist;
    zobrist.init(); // 注意重新初始化
    this._last = [false, false]; // 记录最后一步
    this.count = 0; // chessman count
    // let size: number;

    this.board = sizeOrBoard;
    const size = this.board.length;
    for (let i = 0; i < this.board.length; i++) {
      this.count += this.board[i].filter((d) => d.role > aiRole.empty).length;
    }

    // if (sizeOrBoard instanceof Array) {
    // } else {
    //   size = sizeOrBoard;
    //   this.board = ArrayFun.create(size, size);
    // }

    statistic.init(size);

    // 存储双方得分
    this.comScore = ArrayFun.create(size, size);
    this.humScore = ArrayFun.create(size, size);

    // scoreCache[role][dir][row][column]
    this.scoreCache = [
      [], // placeholder
      [
        // for role 1
        ArrayFun.create(size, size),
        ArrayFun.create(size, size),
        ArrayFun.create(size, size),
        ArrayFun.create(size, size)
      ],
      [
        // for role 2
        ArrayFun.create(size, size),
        ArrayFun.create(size, size),
        ArrayFun.create(size, size),
        ArrayFun.create(size, size)
      ]
    ];

    this.initScore();
  };

  initScore = () => {
    const { board } = this;

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        // 空位，对双方都打分
        if (board[i][j].role === aiRole.empty) {
          if (this.hasNeighbor(i, j, 2, 2)) {
            // 必须是有邻居的才行
            const cs = scorePoint(this, i, j, aiRole.com);
            const hs = scorePoint(this, i, j, aiRole.hum);
            this.comScore[i][j].score = cs;
            this.humScore[i][j].score = hs;
          }
        } else if (board[i][j].role === aiRole.com) {
          // 对电脑打分，玩家此位置分数为0
          this.comScore[i][j].score = scorePoint(this, i, j, aiRole.com);
          this.humScore[i][j].score = 0;
        } else if (board[i][j].role === aiRole.hum) {
          // 对玩家打分，电脑位置分数为0
          this.humScore[i][j].score = scorePoint(this, i, j, aiRole.hum);
          this.comScore[i][j].score = 0;
        }
      }
    }
  };

  // 只更新一个点附近的分数
  // 参见 evaluate point 中的代码，为了优化性能，在更新分数的时候可以指定只更新某一个方向的分数
  updateScore = (p: Piece) => {
    const radius = 4;
    const len = this.board.length;

    // 无论是不是空位 都需要更新
    // -
    for (let i = -radius; i <= radius; i++) {
      const { x } = p;
      const y = p.y + i;
      if (y < 0) {
        // 当前Y点最小超出棋盘，增加看看
        continue;
      }
      if (y >= len) {
        // 因为是增加，所有后面的Y点都超出棋盘，循环解释
        break;
      }
      this.update(x, y, 0);
    }

    // |
    for (let i = -radius; i <= radius; i++) {
      const x = p.x + i;
      const { y } = p;
      if (x < 0) {
        continue;
      }
      if (x >= len) {
        break;
      }
      this.update(x, y, 1);
    }

    // \
    for (let i = -radius; i <= radius; i++) {
      const x = p.x + i;
      const y = p.y + i;
      if (x < 0 || y < 0) {
        continue;
      }
      if (x >= len || y >= len) {
        break;
      }
      this.update(x, y, 2);
    }

    // /
    for (let i = -radius; i <= radius; i++) {
      const x = p.x + i;
      const y = p.y - i;
      if (x < 0 || y < 0) {
        continue;
      }
      if (x >= len || y >= len) {
        continue;
      }
      this.update(x, y, 3);
    }
  };

  // 下子
  put(p: Piece, role?: Role) {
    if (role !== undefined) {
      p.role = role;
    }

    aiConfig.debug && console.log(`put [${role}] piece:`, p);
    this.board[p.x][p.y] = p;
    this.zobrist?.go(p);
    this.updateScore(p);

    // console.log('comScore', this.comScore);
    // console.log('statistic', statistic.table);

    this.allSteps.push(p);
    this.currentSteps.push(p);
    this.stepsTail = [];
    this.count++;
  }

  // 移除棋子
  remove(p: Piece) {
    const r = this.board[p.x][p.y];
    aiConfig.debug && console.log(`put [${r}] piece:`, p);
    this.zobrist?.go(p);
    this.board[p.x][p.y].role = aiRole.empty;
    this.updateScore(p);
    this.allSteps.pop();
    this.currentSteps.pop();
    this.count--;
  }

  // 悔棋
  backward() {
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
  }

  // 前进
  forward() {
    if (this.stepsTail.length < 2) {
      return;
    }
    let i = 0;
    while (i < 2) {
      const s = this.stepsTail.pop();
      if (s) {
        this.put(s, s.role);
      }
      i++;
    }
  }

  logSteps() {
    console.log(`steps:${this.allSteps.map((d) => `[${d.x},${d.y}]`).join(',')}`);
  }

  // 棋面估分
  // 这里只算当前分，而不是在空位下一步之后的分
  evaluate(role: Role): number {
    // 这里加了缓存，但是并没有提升速度
    // if(aiConfig.cache && this.evaluateCache[this.zobrist.code]) return this.evaluateCache[this.zobrist.code]

    // 这里都是用正整数初始化的，所以初始值是0
    this.comMaxScore = 0;
    this.humMaxScore = 0;

    const { board } = this;

    // 遍历出最高分，开销不大
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[x].length; y++) {
        if (board[x][y].role === aiRole.com) {
          this.comMaxScore += fixScore(this.comScore[x][y].score || 0);
        } else if (board[x][y].role === aiRole.hum) {
          this.humMaxScore += fixScore(this.humScore[x][y].score || 0);
        }
      }
    }
    // 有冲四延伸了，不需要专门处理冲四活三
    // 不过这里做了这一步，可以减少电脑胡乱冲四的毛病
    // this.comMaxScore = fixScore(this.comMaxScore)
    // this.humMaxScore = fixScore(this.humMaxScore)
    // if (aiConfig.cache) this.evaluateCache[this.zobrist.code] = result

    return (role === aiRole.com ? 1 : -1) * (this.comMaxScore - this.humMaxScore);
  }

  // 启发函数
  /*
   * 变量starBread的用途是用来进行米子计算
   * 所谓米子计算，只是，如果第一步尝试了一个位置A，那么接下来尝试的位置有两种情况：
   * 1: 大于等于活三的位置
   * 2: 在A的米子位置上
   * 注意只有对小于活三的棋才进行starSpread优化
   */

  log() {
    aiConfig.log && console.log(`star: ${((count / total) * 100).toFixed(2)}%, ${count}/${total}`);
  }

  /**
   * gen 函数的排序是非常重要的，因为好的排序能极大提升AB剪枝的效率。
   * 而对结果的排序，是要根据role来的
   * @param role 选手
   * @param onlyThrees 只看活三
   * @param starSpread 开启
   */
  gen(role: Role, onlyThrees?: boolean, starSpread?: boolean): Piece[] {
    if (this.count <= 0) {
      return [{ x: 7, y: 7, role }];
    }
    const fives = [];
    const comfours = [];
    const humfours = [];
    const comblockedfours = [];
    const humblockedfours = [];
    const comtwothrees = [];
    const humtwothrees = [];
    const comthrees = [];
    const humthrees = [];
    const comtwos: Piece[] = [];
    const humtwos: Piece[] = [];
    const neighbors = [];

    const { board } = this;
    const reverseRole = aiRole.reverse(role);
    // 找到双方的最后进攻点
    const attackPoints = []; // 进攻点
    const defendPoints = []; // 防守点

    // 默认情况下 我们遍历整个棋盘。但是在开启star模式下，我们遍历的范围就会小很多
    // 只需要遍历以两个点为中心正方形。
    // 注意除非专门处理重叠区域，否则不要把两个正方形分开算，因为一般情况下这两个正方形会有相当大的重叠面积，别重复计算了
    if (starSpread && aiConfig.star) {
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

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        if (board[i][j].role === aiRole.empty) {
          if (this.allSteps.length < 6) {
            if (!this.hasNeighbor(i, j, 1, 1)) {
              continue;
            }
          } else if (!this.hasNeighbor(i, j, 2, 2)) {
            continue;
          }

          const scoreHum = this.humScore[i][j].score || 0;
          const scoreCom = this.comScore[i][j].score || 0;
          const maxScore = Math.max(scoreCom, scoreHum);

          if (onlyThrees && maxScore < SCORE.THREE) {
            continue;
          }

          const p: Piece = {
            x: i,
            y: j,
            role,
            score: maxScore,
            scoreHum,
            scoreCom
          };

          total++;
          /*
           * 双星延伸，以提升性能
           * 思路：每次下的子，只可能是自己进攻，或者防守对面（也就是对面进攻点）
           * 我们假定任何时候，绝大多数情况下进攻的路线都可以按次序连城一条折线，那么每次每一个子，一定都是在上一个己方棋子的八个方向之一。
           * 因为既可能自己进攻，也可能防守对面，所以是最后两个子的米子方向上
           * 那么极少数情况，进攻路线无法连成一条折线呢?很简单，我们对前双方两步不作star限制就好，这样可以 兼容一条折线中间伸出一段的情况
           */
          if (starSpread && aiConfig.star) {
            // const roleScore = role === aiRole.com ? p.scoreCom : p.scoreHum;
            // const deRoleScore = role === aiRole.com ? p.scoreHum : p.scoreCom;
            if (maxScore >= SCORE.FOUR) {
            } else if (
              maxScore >= SCORE.BLOCKED_FOUR &&
              starTo(this.currentSteps[this.currentSteps.length - 1])
            ) {
              // star 路径不是很准，所以考虑冲四防守对手最后一步的棋
            } else if (starTo(p, attackPoints) || starTo(p, defendPoints)) {
            } else {
              count++;
              continue;
            }
          }

          if (scoreCom >= SCORE.FIVE) {
            // 先看电脑能不能连成5
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
          } else neighbors.push(p);
        }
      }
    }

    // 如果成五，是必杀棋，直接返回
    if (fives.length) {
      return fives;
    }

    // 电脑能活四，则直接活四，不考虑冲四
    if (role === aiRole.com && comfours.length) {
      return comfours;
    }

    // 自己能活四，则直接活四，不考虑冲四
    if (role === aiRole.hum && humfours.length) {
      return humfours;
    }

    // 对面有活四冲四，自己冲四都没，则只考虑对面活四 （此时对面冲四就不用考虑了)

    if (role === aiRole.com && humfours.length && !comblockedfours.length) {
      return humfours;
    }
    if (role === aiRole.hum && comfours.length && !humblockedfours.length) {
      return comfours;
    }

    // 对面有活四自己有冲四，则都考虑下
    const fours = role === aiRole.com ? comfours.concat(humfours) : humfours.concat(comfours);
    const blockedfours =
      role === aiRole.com
        ? comblockedfours.concat(humblockedfours)
        : humblockedfours.concat(comblockedfours);

    if (fours.length) {
      return fours.concat(blockedfours);
    }

    let result: Piece[] = [];
    if (role === aiRole.com) {
      result = comtwothrees
        .concat(humtwothrees)
        .concat(comblockedfours)
        .concat(humblockedfours)
        .concat(comthrees)
        .concat(humthrees);
    }
    if (role === aiRole.hum) {
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

    let twos;
    if (role === aiRole.com) {
      twos = comtwos.concat(humtwos);
    } else {
      twos = humtwos.concat(comtwos);
    }

    twos.sort((a, b) => {
      const bScore = b.score || 0;
      const aScore = a.score || 0;
      return bScore - aScore;
    });
    result = result.concat(twos.length ? twos : neighbors);

    // 这种分数低的，就不用全部计算了
    if (result.length > aiConfig.countLimit) {
      return result.slice(0, aiConfig.countLimit);
    }

    return result;
  }

  /**
   * 检测当前位置是否有邻居
   * @param x 坐标
   * @param y 坐标
   * @param distance 检索的距离
   * @param count 有几个邻居
   */
  hasNeighbor(x: number, y: number, distance: number, count: number) {
    const { board } = this;
    const len = board.length;
    const startX = x - distance;
    const endX = x + distance;
    const startY = y - distance;
    const endY = y + distance;

    for (let i = startX; i <= endX; i++) {
      // x 坐标超出棋盘
      if (i < 0 || i >= len) {
        continue;
      }

      for (let j = startY; j <= endY; j++) {
        // y 坐标超出棋盘
        if (j < 0 || j >= len) {
          continue;
        }
        // 需要计算的点，所以不需要检测
        if (i === x && j === y) {
          continue;
        }
        // 有棋子的位置
        if (board[i][j].role !== aiRole.empty) {
          count--;

          if (count <= 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  toString() {
    return this.board.map((d) => d.join(',')).join('\n');
  }

  /**
   * 更新当前棋子的分数
   */
  private update = (x: number, y: number, dir: number): void => {
    const { role } = this.board[x][y];
    // 如果不是在棋盘之内就不用执行了
    if (role !== undefined) {
      this.mergeScore(x, y, dir, role, Role.com, this.comScore);
      this.mergeScore(x, y, dir, role, Role.hum, this.humScore);
    }
  };

  /**
   * 把分数储存在分数数组里面
   */
  private mergeScore = (x: number, y: number, dir: number, role: Role, back: Role, scores: Piece[][]): void => {
    if (role !== aiRole.reverse(back)) {
      // 空位和自己的棋子才更新分数
      // 更新空位是为了 gen 函数查询候选人的时候使用
      scores[y][x].score = scorePoint(this, x, y, back, dir);
    } else {
      // 对方的棋子都是 0 分
      scores[y][x].score = 0;
    }
  };

  checkRoleScore = (piece: Piece, role: Role) => {
    const scoreCom = piece?.scoreCom || 0;
    const scoreHum = piece?.scoreHum || 0;
    const { THREE } = SCORE;
    return (role === aiRole.com && scoreCom >= THREE) || (role === aiRole.hum && scoreHum >= THREE);
  };
}

const board = new Board();

export default board;
