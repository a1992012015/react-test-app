import { ISearchCache } from '../interfaces/candidates.interface';
import { IEvaluate } from '../interfaces/board.interface';
import { IPiece } from '../interfaces/piece.interface';
import { ERole } from '../interfaces/role.interface';
import { SCORE } from '../configs/score.config';
import { Statistic } from './statistic.service';
import { Commons } from './commons.service';
import { Zobrist } from './zobrist.service';
import { AI } from '../configs/ai.config';
import { creatPiece } from './piece.service';

/**
 * 思路：
 * 每次开始迭代前，先生成一组候选列表，然后在迭代加深的过程中不断更新这个列表中的分数
 * 这样迭代的深度越大，则分数越精确，并且，任何时候达到时间限制而中断迭代的时候，能保证这个列表中的分数都是可靠的
 */
export abstract class Candidates {
  private readonly MAX = SCORE.FIVE * 10; // 黑棋
  private readonly MIN = this.MAX * -1; // 白棋

  private searchCache: ISearchCache = {
    evaluate: {},
    candidates: {}
  };
  private start = 0; // 开始深入计算的开始时间

  protected board: IPiece[][] = []; // 棋盘的局势
  protected allSteps: IPiece[] = []; // 每一步的棋子
  protected playChess: ERole = ERole.empty; // 执棋的棋子
  protected zobrist = new Zobrist(); // 初始化id
  protected commons = new Commons(); // 工具函数
  protected statistic = new Statistic(); // 打印函数
  // 测试用
  private count = 0;
  private scoreCount = 0;
  private scoreGet = 0;
  private candidatesCount = 0;
  private candidatesGet = 0;

  protected filter = (): IPiece => {
    const role = this.playChess;

    this.start = new Date().getTime();

    const candidates = this.deepCandidates(role);

    const end = new Date();
    const p = ((this.scoreGet / this.scoreCount) * 100).toFixed(3);
    console.log(
      `%c搜索缓存: 总数 ${this.scoreCount} 命中率 ${p}% ${this.scoreGet}/${this.scoreCount}`,
      'color: blue;'
    );
    console.log(
      `%c搜索缓存: 总数 ${this.candidatesCount} 命中率 ${p}% ${this.candidatesGet}/${this.candidatesCount}`,
      'color: blue;'
    );
    const t = (end.getTime() - this.start) / 1000;
    console.log(
      `%c当前统计：${this.count}个节点, 耗时: ${t}s, NPS: ${Math.floor(this.count / t)}N/S`,
      'color: blue;'
    );
    console.log('candidates', candidates);

    return creatPiece({ x: 0, y: 0, role: ERole.empty });
  };

  private deepCandidates = (
    role: ERole,
    deep = AI.searchDeep,
    step = 0,
    alpha = this.MIN,
    beta = this.MAX,
    spread = 0
  ): IPiece[] => {
    if (deep <= 0) {
      return [];
    } else {
      const candidates = this.getCacheCandidates(role, step);
      // if (deep === AI.searchDeep) {
      //   candidates = [candidates[0], candidates[1]];
      // }

      let currentAlpha = alpha;
      for (let i = 0; i < candidates.length; i++) {
        const p = candidates[i];
        this.put(p);

        p.steps = this.deepCandidates(
          this.commons.reverseRole(role),
          deep - 1,
          step + 1,
          -beta,
          -currentAlpha,
          spread
        );

        let evaluate: number;

        if (p.steps.length) {
          evaluate = Math.max(...p.steps.map((s) => s.score));
        } else {
          this.count++;
          evaluate = this.getCacheEvaluate(role);
        }

        p.score = evaluate * -1;

        currentAlpha = Math.max(currentAlpha, p.score);

        this.remove(p);

        if (p.score > beta) {
          p.score = this.MAX - 1;
          break;
        }

        // 超时判定
        if (new Date().getTime() - this.start > AI.timeLimit * 1000) {
          // 超时，退出循环
          break;
        }
      }
      return candidates;
    }
  };

  /**
   * 保存当前局势的分数
   * 这里的cache是为了在相同的deep层，用不同顺序走到相同局面的cache
   */
  private setCacheEvaluate = (role: ERole): number => {
    if (AI.cache) {
      this.scoreCount++;
      this.searchCache.evaluate[this.zobrist.getCode()] = this.evaluate(role);
      return this.searchCache.evaluate[this.zobrist.getCode()];
    }
    return this.evaluate(role);
  };

  /**
   * 获取当前棋盘局势一样cache的分数
   * @param role 当前的选手
   */
  private getCacheEvaluate = (role: ERole): number => {
    if (AI.cache) {
      const evaluate = this.searchCache.evaluate[this.zobrist.getCode()];
      if (evaluate !== undefined) {
        this.scoreGet++;
        return evaluate;
      }
    }
    // cache里面没找到相同局势的分数结果，就为当前局势打一个分数
    // 立刻cache这个局势的分数，方便下一次查询
    return this.setCacheEvaluate(role);
  };

  /**
   * 保存当前局势的候选棋子
   * 这里的cache是为了缓存，用不同顺序走到了相同局势下面的候选人结果
   */
  private setCacheCandidates = (role: ERole, step: number): IPiece[] => {
    const count = this.allSteps.length;
    if (AI.cache) {
      this.candidatesCount++;
      // 从cache里面拿到相同局势的分数
      this.searchCache.candidates[this.zobrist.getCode()] = this.gen(
        role,
        count > 10 ? step > 1 : step > 3,
        step > 1
      );
      return this.searchCache.candidates[this.zobrist.getCode()];
    }
    return this.gen(role, count > 10 ? step > 1 : step > 3, step > 1);
  };

  /**
   * 获取缓存的当前局势的候选棋子 没有的话就创建
   * @param role 当前的选手
   * @param step 当前的步数
   */
  private getCacheCandidates = (role: ERole, step: number): IPiece[] => {
    if (AI.cache) {
      // 从cache里面拿到相同局势下面的候选棋子
      const candidates = this.searchCache.candidates[this.zobrist.getCode()];
      if (candidates !== undefined) {
        this.candidatesGet++;
        return candidates;
      }
    }
    // 在缓存里面没找到当前局势的候选棋子，就重新查找候选棋子
    // 只有在一共落子大于十颗才开始只考虑眠三以上的分数
    // 这里立刻cache候选棋子，方便下次有相同局势的时候可以直接使用
    return this.setCacheCandidates(role, step);
  };

  protected abstract put(piece: IPiece): void;

  protected abstract gen(role: ERole, onlyThrees?: boolean, starSpread?: boolean): IPiece[];

  protected abstract remove(p: IPiece): void;

  protected abstract evaluate(role: ERole): number;
}
