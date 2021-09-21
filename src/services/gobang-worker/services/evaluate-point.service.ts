import { TCResult, IScoreCache, IScorePoint } from '../interfaces/evaluate-point.interface';
import { ERole } from '../interfaces/role.interface';
import { IPiece } from '../interfaces/piece.interface';
import { commons } from './commons.service';
import { SCORE } from '../configs/score.config';

/**
 * 启发式评价函数
 * 这个是专门给某一个位置打分的，不是给整个棋盘打分的
 * 并且是只给某一个角色打分
 */
export class EvaluatePoint {
  private possible = 1; // 可以成为自己棋子的空位和自己的棋子
  private middleCount = 1; // 落子位置相邻的棋子数量
  private leftCount = 0; // 左边没有相邻的棋子数量
  private rightCount = 0; // 右边没有相邻的棋子数量
  private leftEmpty = false; // 左边是否有空位
  private rightEmpty = false; // 右边是否有空位
  private leftBlock = false; // 左边的最后是否有对方的棋子
  private rightBlock = false; // 右边的最后是否有对方的棋子
  private scoreCache: IScoreCache = {
    // 棋子四个方向的分数的缓存
    [ERole.empty]: [0, 0, 0, 0],
    [ERole.black]: [0, 0, 0, 0],
    [ERole.white]: [0, 0, 0, 0]
  };

  private role: ERole = ERole.empty;

  /**
   * 计算当前棋子的分数，给单个的棋子打分
   * 为了性能考虑，增加了一个dir参数
   * 如果没有传入则默认计算所有四个方向，如果传入值，则只计算其中一个方向的值
   */
  scorePoint = (data: IScorePoint): number => {
    const { x, y, pieces, role, dir } = data;
    this.role = role;
    this.scoreCache = {
      [ERole.empty]: [0, 0, 0, 0],
      [ERole.black]: [0, 0, 0, 0],
      [ERole.white]: [0, 0, 0, 0]
    };
    const radius = 4;

    if (dir === undefined || dir === 0) {
      // 计算竖向
      this.reset();
      // 计算当前棋子的上面的棋子 left
      for (let i = 1; i <= radius; i++) {
        const py = y - i;
        const p = pieces?.[py]?.[x];
        const np = pieces?.[py - 1]?.[x];

        [this.leftEmpty, this.leftCount, this.leftBlock] = this.calculatePoint(
          p,
          np,
          this.leftEmpty,
          this.leftCount,
          this.leftBlock
        );
      }
      // 计算当前棋子下面的棋子 right
      for (let i = 1; i <= radius; i++) {
        const py = y + i;
        const p = pieces?.[py]?.[x];
        const np = pieces?.[py + 1]?.[x];

        [this.rightEmpty, this.rightCount, this.rightBlock] = this.calculatePoint(
          p,
          np,
          this.rightEmpty,
          this.rightCount,
          this.rightBlock
        );
      }

      const leftScore = this.countToScore(
        this.middleCount + this.leftCount,
        this.leftEmpty,
        this.leftBlock,
        this.rightEmpty,
        this.rightBlock
      );

      const rightScore = this.countToScore(
        this.middleCount + this.rightCount,
        this.rightEmpty,
        this.rightBlock,
        this.leftEmpty,
        this.leftBlock
      );

      this.scoreCache[role][dir || 0] = leftScore + rightScore;
    }

    if (dir === undefined || dir === 1) {
      // 计算横向
      this.reset();
      // 计算当前棋子的左边的棋子 left
      for (let i = 1; i <= radius; i++) {
        const px = x - i;
        const p = pieces?.[y]?.[px];
        const np = pieces?.[y]?.[px - 1];

        [this.leftEmpty, this.leftCount, this.leftBlock] = this.calculatePoint(
          p,
          np,
          this.leftEmpty,
          this.leftCount,
          this.leftBlock
        );
      }

      // 计算当前棋子右边的棋子 right
      for (let i = 1; i <= radius; i++) {
        const px = x + i;
        const p = pieces?.[y]?.[px];
        const np = pieces?.[y]?.[px + 1];

        [this.rightEmpty, this.rightCount, this.rightBlock] = this.calculatePoint(
          p,
          np,
          this.rightEmpty,
          this.rightCount,
          this.rightBlock
        );
      }

      const leftScore = this.countToScore(
        this.middleCount + this.leftCount,
        this.leftEmpty,
        this.leftBlock,
        this.rightEmpty,
        this.rightBlock
      );

      const rightScore = this.countToScore(
        this.middleCount + this.rightCount,
        this.rightEmpty,
        this.rightBlock,
        this.leftEmpty,
        this.leftBlock
      );

      this.scoreCache[role][dir || 1] = leftScore + rightScore;
    }

    if (dir === undefined || dir === 2) {
      // 计算左上和右下
      this.reset();
      // 计算当前棋子的左上的棋子 left
      for (let i = 1; i <= radius; i++) {
        const py = y - i;
        const px = x - i;
        const p = pieces?.[py]?.[px];
        const np = pieces?.[py - 1]?.[px - 1];

        [this.leftEmpty, this.leftCount, this.leftBlock] = this.calculatePoint(
          p,
          np,
          this.leftEmpty,
          this.leftCount,
          this.leftBlock
        );
      }
      // 计算当前棋子右下的棋子 right
      for (let i = 1; i <= radius; i++) {
        const py = y + i;
        const px = x + i;
        const p = pieces?.[py]?.[px];
        const np = pieces?.[py + 1]?.[px + 1];

        [this.rightEmpty, this.rightCount, this.rightBlock] = this.calculatePoint(
          p,
          np,
          this.rightEmpty,
          this.rightCount,
          this.rightBlock
        );
      }

      const leftScore = this.countToScore(
        this.middleCount + this.leftCount,
        this.leftEmpty,
        this.leftBlock,
        this.rightEmpty,
        this.rightBlock
      );

      const rightScore = this.countToScore(
        this.middleCount + this.rightCount,
        this.rightEmpty,
        this.rightBlock,
        this.leftEmpty,
        this.leftBlock
      );

      this.scoreCache[role][dir || 2] = leftScore + rightScore;
    }

    if (dir === undefined || dir === 3) {
      // 计算左下和右上
      this.reset();
      // 计算当前棋子的左下的棋子 left
      for (let i = 1; i <= radius; i++) {
        const py = y + i;
        const px = x - i;
        const p = pieces?.[py]?.[px];
        const np = pieces?.[py + 1]?.[px - 1];

        [this.leftEmpty, this.leftCount, this.leftBlock] = this.calculatePoint(
          p,
          np,
          this.leftEmpty,
          this.leftCount,
          this.leftBlock
        );
      }
      // 计算当前棋子右上的棋子 right
      for (let i = 1; i <= radius; i++) {
        const py = y - i;
        const px = x + i;
        const p = pieces?.[py]?.[px];
        const np = pieces?.[py - 1]?.[px + 1];

        [this.rightEmpty, this.rightCount, this.rightBlock] = this.calculatePoint(
          p,
          np,
          this.rightEmpty,
          this.rightCount,
          this.rightBlock
        );
      }

      const leftScore = this.countToScore(
        this.middleCount + this.leftCount,
        this.leftEmpty,
        this.leftBlock,
        this.rightEmpty,
        this.rightBlock
      );

      const rightScore = this.countToScore(
        this.middleCount + this.rightCount,
        this.rightEmpty,
        this.rightBlock,
        this.leftEmpty,
        this.leftBlock
      );

      this.scoreCache[role][dir || 3] = leftScore + rightScore;
    }

    return this.scoreCache[role].reduce((score, current) => score + current, 0);
  };

  /**
   * 统计计算的方向的count和空位还有对方是否有对方的棋子
   * @param p 需要统计的位置
   * @param np 统计位置的下一个棋子
   * @param e 当前这个方向是否找到了空位
   * @param c 当前这个方向自己的棋子数量
   * @param b 当前这个但方是否有对方的棋子
   */
  private calculatePoint = (p: IPiece, np: IPiece, e: boolean, c: number, b: boolean): TCResult => {
    let empty = e;
    let count = c;
    const block = b;

    if (!p || p.role === commons.reverseRole(this.role)) {
      // 到边界外面了
      // 或者这颗棋子是对方的
      return [empty, count, true];
    } else if (p.role === ERole.empty) {
      // 这颗棋子是空位

      if (!block) {
        this.possible++;
      }

      if (!empty && np?.role === this.role) {
        empty = true;
      } else {
        return [empty, count, block];
      }
    } else {
      // 这颗棋子是自己的
      this.possible++;

      if (!empty) {
        this.middleCount++;
      } else {
        count++;
      }
    }

    return [empty, count, block];
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
   * @param count 需要计算方向的棋子总数
   * @param checkEmpty 需要计算方向是否有空位
   * @param backEmpty 需要计算方向的反方向是否有空位
   * @param checkBlock 需要计算方向的最后是否是对方的棋子
   * @param backBlock 需要计算方向的反方向的最后是否是对方的棋子
   */
  private countToScore = (
    count: number,
    checkEmpty: boolean,
    backEmpty: boolean,
    checkBlock: boolean,
    backBlock: boolean
  ): number => {
    if (this.possible >= 5) {
      // 有可能走出五连才开始计算
      // 现在的棋子加上空位没有对方棋子的情况下大于等于5才算是有效的
      // 否则这一排的棋子全都没有分数
      if (this.middleCount < 5) {
        // 落子相邻的棋子没有达到五连的
        if (!checkEmpty && !backEmpty) {
          // 两边都没空位所有棋子都完全相邻排列
          if (!checkBlock && !backBlock) {
            // 两边最后也没有对方的棋子
            switch (count) {
              case 1:
                return SCORE.ONE;
              case 2:
                return SCORE.TWO;
              case 3:
                return SCORE.THREE;
              case 4:
                return SCORE.FOUR;
              default:
                // 默认值永远不会走这一步
                return SCORE.ZERO;
            }
          } else {
            // 剩余的三种情况
            // check的方向最后是对方的棋子 反方向不是
            // 反方向的最后是对方的棋子 check的不是
            // check方向和反方向两边都是对方的棋子
            // 但是因为可能性的棋子是大于五颗所有都是 BLOCKED 的分数
            switch (count) {
              case 1:
                return SCORE.BLOCKED_ONE;
              case 2:
                return SCORE.BLOCKED_TWO;
              case 3:
                return SCORE.BLOCKED_THREE;
              case 4:
                return SCORE.BLOCKED_FOUR;
              default:
                // 默认值永远不会走这一步
                return SCORE.ZERO;
            }
          }
        } else if (!checkEmpty && backEmpty) {
          // check的方向没有空位 反方向有空位
          if ((!checkBlock && !backBlock) || (!checkBlock && backBlock)) {
            // 两边最后也没有对方的棋子
            // check的方向最后没有对方的棋子 反方最后向有
            switch (count) {
              case 1:
                return SCORE.ONE;
              case 2:
                return SCORE.TWO;
              case 3:
                return SCORE.THREE;
              case 4:
              default:
                // 这个位置最多只有四颗五颗就是连五
                return SCORE.FOUR;
            }
          } else {
            // check的方向最后有对方的棋子 反方向最后没有
            // 两边最后都是对方的棋子
            switch (count) {
              case 1:
                return SCORE.BLOCKED_ONE;
              case 2:
                return SCORE.BLOCKED_TWO;
              case 3:
                return SCORE.BLOCKED_THREE;
              case 4:
              default:
                // 这个位置最多只有四颗五颗就是连五
                return SCORE.BLOCKED_FOUR;
            }
          }
        } else {
          // check方向和反方向两边都有空位
          // check方向有空位 反方向没有

          // check方向和反方向的最后都没有对方的棋子
          // check方向的最后有对方棋子 反方向的最后没有
          // check方向的最后没有对方的棋子 反方向最后最后右
          // 两边的最后都有对方的棋子

          // check的方向最后是对方的棋子 反方向没有对方的棋子
          // check的方向最后没有对方的棋子 反方向最后是对方的棋子
          // check方向最后是对方的棋子 反方向最后也是对方的棋子
          // 因为可能性是大于5的所以这里的棋子分数都是
          switch (count) {
            case 2: // 落子加上空位意味着下一颗棋子也是自己的所以最小的count也是2
              return SCORE.BLOCKED_TWO;
            case 3:
              return SCORE.BLOCKED_THREE;
            case 4:
            default:
              // 这个位置最多只有四颗五颗就是连五
              return SCORE.BLOCKED_FOUR;
          }
        }
      } else {
        // 落子相邻的棋子大于等于五颗直接就是五连
        return SCORE.FIVE;
      }
    } else {
      return SCORE.ZERO;
    }
  };

  /**
   * 初始化所有的记录
   */
  private reset = (): void => {
    this.possible = 1;
    this.middleCount = 1;
    this.leftEmpty = false;
    this.leftBlock = false;
    this.leftCount = 0;
    this.rightEmpty = false;
    this.rightBlock = false;
    this.rightCount = 0;
  };
}

export const evaluatePoint = new EvaluatePoint();
