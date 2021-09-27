import { IBoard, IEvaluate, IOpenBoard, IScoreElement } from '../interfaces/board.interface';
import { IScorePoint } from '../interfaces/evaluate-point.interface';
import { FilterCandidates } from './filter-candidates.service';
import { EvaluatePoint } from './evaluate-point.service';
import { IPiece } from '../interfaces/piece.interface';
import { IOpen } from '../interfaces/opens.interface';
import { ERole } from '../interfaces/role.interface';
import { wuyue } from '../configs/opens.config';
import { SCORE } from '../configs/score.config';
import { Statistic } from './statistic.service';
import { creatPiece } from './piece.service';
import { Zobrist } from './zobrist.service';
import { Commons } from './commons.service';
import { AI } from '../configs/ai.config';

/**
 * 棋盘
 */
export class Board implements IBoard {
  private name = ''; // 棋局的名称
  private board: IPiece[][] = []; // 棋盘的局势
  private allSteps: IPiece[] = []; // 每一步的棋子
  private playChess: ERole = ERole.empty; // 执棋的棋子
  private stepsTail: IPiece[] = []; // 缓存悔棋的棋子 在落子后清除
  private currentSteps: IPiece[] = []; // TODO 当前一次思考的步骤 感觉不到作用
  private scoreBlack: number[][] = []; // 储存玩家所有分数缓存
  private scoreWhite: number[][] = []; // 储存电脑所有分数缓存

  commons = new Commons(); // 工具函数
  zobrist = new Zobrist(); // 初始化id
  statistic = new Statistic(); // 打印函数
  evaluatePoint = new EvaluatePoint(); // 打分的工具
  filterCandidates = new FilterCandidates(this); // 查找电脑可以落子的位置

  constructor(open?: IOpen, first?: boolean) {
    this.init(open, first);
  }

  /**
   * 获取当前棋盘的信息
   */
  getBoard = (): IOpenBoard => {
    return { name: this.name, board: this.board };
  };

  /**
   * 获取当前全部的步骤
   */
  getSteps = (): IPiece[] => {
    return this.allSteps;
  };

  /**
   * 获取当前AI的执棋
   */
  getPlay = (): ERole => {
    return this.playChess;
  };

  getReverseRole = (): ERole => {
    return this.commons.reverseRole(this.playChess);
  };

  /**
   * AI开始计算下一步棋
   */
  beginMatch = (): IPiece => {
    return this.filterCandidates.match();
  };

  /**
   * 在棋盘下一颗棋子
   * @param piece 需要下的棋子
   */
  put = (piece: IPiece): void => {
    piece.step = this.allSteps.length + 1;
    this.board[piece.y][piece.x] = piece;
    // 每走一步都让生成的id不一样
    // const code = zobrist.go(piece);
    // 更新分数
    this.updateScore(piece);
    this.allSteps.push(piece);
    this.currentSteps.push(piece);
    this.stepsTail = [];
  };

  /**
   * 悔棋 返回成功还是失败
   */
  backward = (): boolean => {
    // 如果相互没有落子就不能悔棋
    if (this.allSteps.length < 2) {
      return false;
    } else {
      // 从棋盘删除两步棋
      for (let i = 2; i > 0; i--) {
        const s = this.allSteps[this.allSteps.length - 1];
        this.remove(s);
        this.stepsTail.push(s);
      }
      return true;
    }
  };

  /**
   * 返回悔棋的哪一步 返回是否成功回退
   */
  forward = (): boolean => {
    if (this.stepsTail.length < 2) {
      // 加入没有储存有悔棋的步数则会失败, 但是还是返回的当前棋盘
      return false;
    } else {
      // 将缓存的两步重新添加回去
      for (let i = 2; i > 0; i--) {
        const s = this.stepsTail.pop();
        if (s) {
          this.put(s);
        }
      }

      return true;
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
    if (this.allSteps.length <= 0) {
      return [creatPiece({ x: 7, y: 7, role })];
    }
    // 所有棋形的分组
    const scores: IScoreElement = {
      attackPoints: [], // 进攻点
      defendPoints: [], // 防守点
      fives: [], // 五连
      firstFours: [], // 当前role的活四
      backFours: [], // 另一role的活四
      firstBlockedFours: [], // 当前role的眠四
      backBlockedFours: [], // 另一role的眠四
      firstTwoThrees: [], // 当前role的双三
      backTwoThrees: [], // 另一role的双三
      firstThrees: [], // 当前role的活三
      backThrees: [], // 另一role的活三
      firstTwos: [], // 当前role的活二
      backTwos: [], // 另一role的活二
      neighbors: [] // 相邻的棋子
    };
    this.checkStarSpread(role, scores, starSpread); // 防守点 进攻点
    // 查找所有的棋形
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board.length; x++) {
        if (this.board[y][x].role === ERole.empty) {
          // 生产当前棋子的棋子对象
          const p = creatPiece({ x, y, role });
          const scoreBlack = this.scoreBlack[y][x];
          const scoreWhite = this.scoreWhite[y][x];
          const maxScore = Math.max(scoreBlack, scoreWhite);

          if (this.allSteps.length < 6) {
            if (this.hasNeighbor(y, x, 1, 1)) {
              this.checkChessShape(p, scores, starSpread);
            }
          } else if (this.hasNeighbor(y, x, 2, 2)) {
            if (onlyThrees) {
              if (maxScore >= SCORE.THREE) {
                this.checkChessShape(p, scores, starSpread);
              }
            } else {
              this.checkChessShape(p, scores, starSpread);
            }
          }
        }
      }
    }
    console.log('scores', scores);

    return this.sortChessShape(scores, onlyThrees);
  };

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
  evaluate = (role: ERole): IEvaluate => {
    // 这里加了缓存，但是并没有提升速度
    // if (AI.cache && evaluateCache[this.zobrist.code]) {
    //   return evaluateCache[this.zobrist.code];
    // }
    // 这里都是用正整数初始化的，所以初始值是0
    let whiteMaxScore = 0;
    let blackMaxScore = 0;

    // 遍历出最高分，开销不大
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        if (this.board[y][x].role === ERole.white) {
          whiteMaxScore += this.fixScore(this.scoreWhite[y][x]);
        } else if (this.board[y][x].role === ERole.black) {
          blackMaxScore += this.fixScore(this.scoreBlack[y][x]);
        }
      }
    }
    // 有冲四延伸了，不需要专门处理冲四活三
    // 不过这里做了这一步，可以减少电脑胡乱冲四的毛病
    // this.comMaxScore = fixScore(this.comMaxScore)
    // this.humMaxScore = fixScore(this.humMaxScore)
    // if (aiConfig.cache) this.evaluateCache[this.zobrist.code] = result
    const evaluate = (role === this.playChess ? 1 : -1) * (whiteMaxScore - blackMaxScore);
    return { evaluate, whiteScore: whiteMaxScore, blackScore: blackMaxScore };
  };

  /**
   * 移除棋盘上的棋子
   * @param p 需要移除的棋子
   */
  remove = (p: IPiece): void => {
    // 修改id到当前棋子的位置
    this.zobrist.go(p);
    this.board[p.y][p.x].role = ERole.empty;
    // 移除之后也需要更新周围的分数
    this.updateScore(p);
    this.allSteps.pop();
    this.currentSteps.pop();
  };

  /**
   * 初始化整个棋盘
   * @param open 初始化棋盘的棋局和名字
   * @param first 是否是先手
   */
  private init = (open?: IOpen, first?: boolean): void => {
    this.playChess = first ? ERole.white : ERole.black;

    // 检测船舰的棋盘是否合法
    if (open?.board) {
      this.board = this.commons.getOpenBoard(open.board);
      this.name = open.name;
    } else {
      this.board = this.commons.getOpenBoard(wuyue.board);
      this.name = wuyue.name;
    }
    // 其实可以写死
    const size = this.board.length;
    // 存储双方得分
    this.scoreBlack = this.commons.createScores(size, size);
    this.scoreWhite = this.commons.createScores(size, size);
  };

  /**
   * 冲四的分其实肯定比活三高，但是如果这样的话容易形成盲目冲四的问题，所以如果发现电脑有无意义的冲四，则将分数降低到和活三一样
   * 而对于冲四活三这种杀棋，则将分数提高。
   * @param score - 分数
   */
  private fixScore = (score: number): number => {
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

  /**
   * 检查所有的棋形并判断需要检测那些位置
   * @param scores 现在所有的棋形
   * @param onlyThrees 是否开启只看大于等于活三的棋形
   */
  private sortChessShape = (scores: IScoreElement, onlyThrees?: boolean): IPiece[] => {
    // 如果成五，是必杀棋，直接返回
    if (scores.fives.length) {
      return scores.fives;
    }
    // 当前role能活四 则不考虑直接活四
    if (scores.firstFours.length) {
      return scores.firstFours;
    }
    // 对方能活四 当前role没有眠四 则只考虑对方的活四 （此时对方的冲四不考虑）
    if (scores.backFours.length && !scores.firstBlockedFours.length) {
      return scores.backFours;
    }
    // 对面有活四自己有冲四，则都考虑下
    const candidates = [...scores.backFours, ...scores.firstFours];
    // 当有活四的棋形则把活四和眠四一起考虑
    if (candidates.length) {
      return candidates.concat(scores.backBlockedFours).concat(scores.firstBlockedFours);
    }
    // 合并所有大于活三的棋形
    const result = [
      ...scores.firstTwoThrees,
      ...scores.backTwoThrees,
      ...scores.firstBlockedFours,
      ...scores.backBlockedFours,
      ...scores.firstThrees,
      ...scores.backThrees
    ];
    // result.sort(function(a, b) { return b.score - a.score })
    // 双三很特殊，因为能形成双三的不一定比一个活三强
    if (scores.firstTwoThrees.length || scores.backTwoThrees.length) {
      return result;
    }
    // 只返回大于等于活三的棋
    if (onlyThrees) {
      return result;
    }
    // 计算所有活二
    const twos = [...scores.firstTwos, ...scores.backTwos];
    twos.sort((a, b) => b.score - a.score);
    // 所有剩下的棋形全部合并在一起
    const combine = result.concat(twos.length ? twos : scores.neighbors);
    // 这种分数低的，就不用全部计算了
    return combine.slice(0, AI.countLimit);
  };

  /**
   * 收起现在棋盘上面所有的棋形
   * @param p 需要判定的空位棋子
   * @param scores 现在的所有棋形
   * @param star 是否开启双星延伸
   */
  private checkChessShape = (p: IPiece, scores: IScoreElement, star?: boolean): void => {
    // 双星延伸
    this.doubleStarExtension(p, scores, star);
    // 分数来自落子的时候更新的周围的分数
    const scoreBlack = this.scoreBlack[p.y][p.x];
    const scoreWhite = this.scoreWhite[p.y][p.x];
    const firstScore = this.playChess === ERole.black ? scoreBlack : scoreWhite;
    const backScore = this.playChess === ERole.white ? scoreBlack : scoreWhite;
    // 分数检测 相同的分数先放进自己的分组里面
    if (firstScore >= SCORE.FIVE) {
      // 先看role能不能连连五
      // 作为当前执棋的人如果查询到这颗棋子落下就是五连就直接返回
      // 因为就算对方的下一颗棋子也是五连，但是你快一步
      scores.fives.push(p);
    } else if (backScore >= SCORE.FIVE) {
      // 再看reverse能不能连成5
      // 此处不用急着返回，还可以看看电脑自己是否可以连五
      scores.fives.push(p);
    } else if (firstScore >= SCORE.FOUR) {
      // 查看role的活四
      scores.firstFours.push(p);
    } else if (backScore >= SCORE.FOUR) {
      // 再看reverse的活四
      scores.backFours.push(p);
    } else if (firstScore >= SCORE.BLOCKED_FOUR) {
      // 查看role的眠四
      scores.firstBlockedFours.push(p);
    } else if (backScore >= SCORE.BLOCKED_FOUR) {
      // 再看reverse的眠四
      scores.backBlockedFours.push(p);
    } else if (firstScore >= 2 * SCORE.THREE) {
      // 查看role双三也行
      scores.firstTwoThrees.push(p);
    } else if (backScore >= 2 * SCORE.THREE) {
      // 再看reverse的双三
      scores.backTwoThrees.push(p);
    } else if (firstScore >= SCORE.THREE) {
      // 查看role的活三
      scores.firstThrees.push(p);
    } else if (backScore >= SCORE.THREE) {
      // 再看reverse的活三
      scores.backThrees.push(p);
    } else if (firstScore >= SCORE.TWO) {
      // 查看role的活二
      scores.firstTwos.unshift(p);
    } else if (backScore >= SCORE.TWO) {
      // 再看reverse的活二
      scores.backTwos.unshift(p);
    } else {
      scores.neighbors.push(p);
    }
  };

  /**
   * 双星延伸，以提升性能
   * 思路：每次下的子，只可能是自己进攻，或者防守对面（也就是对面进攻点）
   * 我们假定任何时候，绝大多数情况下进攻的路线都可以按次序连城一条折线
   * 那么每次每一个子，一定都是在上一个己方棋子的八个方向之一。
   * 因为既可能自己进攻，也可能防守对面，所以是最后两个子的米子方向上
   * 那么极少数情况，进攻路线无法连成一条折线呢?
   * 很简单，我们对前双方两步不作star限制就好，这样可以 兼容一条折线中间伸出一段的情况
   * @param p 当前需要检查的空位棋子
   * @param scores 现在棋盘三的所有棋形
   * @param star 是否开启双星延伸
   */
  private doubleStarExtension = (p: IPiece, scores: IScoreElement, star?: boolean): void => {
    // TODO 未完成作为性能优化以后完成
    if (star && AI.star) {
      const { y, x } = p;
      const scoreBlack = this.scoreBlack[y][x];
      const scoreWhite = this.scoreWhite[y][x];
      const maxScore = Math.max(scoreBlack, scoreWhite);
      // const roleScore = role === aiRole.com ? p.scoreCom : p.scoreHum;
      // const deRoleScore = role === aiRole.com ? p.scoreHum : p.scoreCom;
      if (maxScore >= SCORE.FOUR) {
        // 当最大的分数大于活四
      } else if (maxScore >= SCORE.BLOCKED_FOUR) {
        // star 路径不是很准，所以考虑冲四防守对手最后一步的棋
      } else if (this.starTo(p, scores.attackPoints) || this.starTo(p, scores.defendPoints)) {
        // 棋子在进攻点或者防守点上面
      }
    }
  };

  /**
   * 检查当前位置是否在进攻点或者防守点上面
   * @param p 需要检查的棋子
   * @param points 进攻点或者防守点的数组 理论来说进攻点和防守点只会有一颗棋子
   */
  private starTo = (p: IPiece, points?: IPiece[]): boolean => {
    if (!points || !points.length) {
      // 没有检查列表返回
      return false;
    }
    // 检查棋子位置的合法性
    return points.every(({ x, y }) => {
      // 两颗棋子的距离必须是在五步以内
      const distance = Math.abs(p.x - x) <= 4 && Math.abs(p.y - y) <= 4;
      // 两颗棋子必须是在米字形的方向上面
      const direction = p.x === x || p.y === y || Math.abs(p.x - x) === Math.abs(p.y - y);
      return distance && direction;
    });
  };

  /**
   * 检测当前位置是否有邻居
   * @param y 坐标
   * @param x 坐标
   * @param distance 检索的距离
   * @param count 有几个邻居
   */
  private hasNeighbor(y: number, x: number, distance: number, count: number): boolean {
    const len = this.board.length;
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
            if ((py !== y || px !== x) && this.board[py][px].role !== ERole.empty) {
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
   * 默认情况下 我们遍历整个棋盘。但是在开启star模式下，我们遍历的范围就会小很多
   * 只需要遍历以两个点为中心正方形。
   * 注意除非专门处理重叠区域，否则不要把两个正方形分开算
   * 因为一般情况下这两个正方形会有相当大的重叠面积,别重复计算了
   * @param role 当前的选手
   * @param scores 当前棋盘的分数组合
   * @param star 是否开启双星延伸
   */
  private checkStarSpread = (role: ERole, scores: IScoreElement, star?: boolean): void => {
    if (star && AI.star) {
      const len = this.currentSteps.length;
      const reverseRole = this.commons.reverseRole(role);
      // 查询防守点
      for (let i = len - 1; i >= 0; i -= 2) {
        // 查询对方的棋子是否有活三
        const p = this.currentSteps[i];
        if (this.checkRoleScore(p, reverseRole)) {
          scores.defendPoints.push(p);
          break;
        }
      }
      // 如果没有找到活三就把第一课棋子作为防守点
      if (!scores.defendPoints.length) {
        const isPush = this.playChess === ERole.white;
        scores.defendPoints.push(isPush ? this.currentSteps[0] : this.currentSteps[1]);
      }
      // 查询进攻点
      for (let i = this.currentSteps.length - 2; i >= 0; i -= 2) {
        const p = this.currentSteps[i];
        // 查询我方的棋子是否有活三
        if (this.checkRoleScore(p, role)) {
          scores.attackPoints.push(p);
          break;
        }
      }
      // 如果没有进攻点则把第一颗棋子作为进攻点
      if (!scores.attackPoints.length) {
        const isPush = this.playChess === ERole.black;
        scores.attackPoints.push(isPush ? this.currentSteps[0] : this.currentSteps[1]);
      }
    }
  };

  /**
   * 检查棋子的分数是否大于活三
   * @param piece 需要检查的棋子
   * @param role 需要检查的角色
   */
  private checkRoleScore = (piece: IPiece, role: ERole): boolean => {
    const { scoreCom, scoreHum } = piece;
    if (role === ERole.white) {
      return scoreCom >= SCORE.THREE;
    } else if (role === ERole.black) {
      return scoreHum >= SCORE.THREE;
    } else {
      return false;
    }
  };

  /**
   * 更新当前点周围的分数
   * 更新的时候限制了范围
   * 参见 evaluate point 中的代码，为了优化性能，在更新分数的时候可以指定只更新某一个方向的分数
   * @param p 棋子
   */
  private updateScore = (p: IPiece): void => {
    const radius = 4;
    const { x, y } = p;
    // 更新竖向
    for (let i = -radius; i <= radius; i++) {
      this.update(x, y + i, 0);
    }
    // 更新横向
    for (let i = -radius; i <= radius; i++) {
      this.update(x + i, y, 1);
    }
    // 更新右斜下方 左斜上方
    for (let i = -radius; i <= radius; i++) {
      this.update(x + i, y + i, 2);
    }
    // 更新左斜下方 右斜上方
    for (let i = -radius; i <= radius; i++) {
      this.update(x + i, y - i, 3);
    }
  };

  /**
   * 更新当前棋子的分数
   * @param x 坐标
   * @param y 坐标
   * @param dir 更新的方向
   */
  private update = (x: number, y: number, dir: number): void => {
    const current = this.board?.[y]?.[x]?.role;
    // 如果不是在棋盘之内就不用执行了
    if (current) {
      const data = { x, y, dir, board: this.board };
      this.mergeScore({ ...data, role: ERole.white }, current, this.scoreWhite);
      this.mergeScore({ ...data, role: ERole.black }, current, this.scoreBlack);
    }
  };

  /**
   * 把分数储存在分数数组里面
   * @param data 计算的数据
   * @param role 选手
   * @param scores 需要更新的分数数组
   */
  private mergeScore = (data: IScorePoint, role: ERole, scores: number[][]): void => {
    if (role !== this.commons.reverseRole(role)) {
      // 空位和自己的棋子才更新分数
      // 更新空位是为了 gen 函数查询候选人的时候使用
      scores[data.y][data.x] = this.evaluatePoint.scorePoint(data);
    } else {
      // 对方的棋子都是 0 分
      scores[data.y][data.x] = 0;
    }
  };
}
