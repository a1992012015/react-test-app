import { cloneDeep } from 'lodash-es';

import {
  ISearchCache,
  IDeepSearch,
  ISearch,
  ISResponse
} from '../interfaces/filter-candidates.interface';
import { IEvaluate, IOpenBoard } from '../interfaces/board.interface';
import { IPiece } from '../interfaces/piece.interface';
import { ERole } from '../interfaces/role.interface';
import { SCORE } from '../configs/score.config';
import { Statistic } from './statistic.service';
import { creatPiece } from './piece.service';
import { Commons } from './commons.service';
import { Zobrist } from './zobrist.service';
import { AI } from '../configs/ai.config';

/**
 * 思路：
 * 每次开始迭代前，先生成一组候选列表，然后在迭代加深的过程中不断更新这个列表中的分数
 * 这样迭代的深度越大，则分数越精确，并且，任何时候达到时间限制而中断迭代的时候，能保证这个列表中的分数都是可靠的
 */
export abstract class FilterCandidates {
  private readonly MAX = SCORE.FIVE * 10; // 黑棋
  private readonly MIN = this.MAX * -1; // 白棋

  private searchCache: ISearchCache = {
    evaluate: {},
    candidates: {}
  };
  private start = 0; // 开始深入计算的开始时间

  protected zobrist = new Zobrist(); // 初始化id
  protected commons = new Commons(); // 工具函数
  protected statistic = new Statistic(); // 打印函数

  protected match = (): IPiece => {
    const play = this.getPlay();
    AI.log && console.log('match => play', ERole[play]);
    return this.deepFilter(play, AI.searchDeep);
  };

  private deepFilter = (role: ERole, deep = AI.searchDeep): IPiece => {
    // 获取落子的候选者列表
    const candidates = this.gen(role);

    if (candidates.length > 1) {
      // 候选者大于一个的时候才开始迭代
      return this.loopDeep(candidates, role, deep);
    } else if (candidates.length === 1) {
      // 只有一个候选者直接返回这个候选者
      return candidates[0];
    } else {
      // 一个候选者都没有的情况下随便返回一个空的棋子
      // TODO 后续代码需要对此做检查判定
      return creatPiece({ x: 0, y: 0, role: ERole.empty });
    }
  };

  /**
   * 不断增加迭代深度查询落子结果
   * 找到五连的分数就停止加深，否则加深到配置的深度
   * @param candidates
   * @param role
   * @param deep
   */
  private loopDeep = (candidates: IPiece[], role: ERole, deep: number): IPiece => {
    this.start = new Date().getTime();

    console.log('searchPiece => init', cloneDeep(candidates));

    // 在每次开始迭代的时候清除缓存
    // TODO 感觉不用清除，留待测试
    this.searchCache = {
      evaluate: {},
      candidates: {}
    };
    // 迭代加深和迭代缓存
    let searchPiece: IPiece[] = [];
    for (let i = deep; i <= deep; i += 2) {
      const minMaxData: IDeepSearch = {
        candidates,
        role,
        deep: i,
        step: 0,
        alpha: this.MIN,
        beta: this.MAX,
        spread: 0
      };
      // 生成现在可能落子的所有后续结果和分数
      searchPiece = this.deepSearch(minMaxData);
      // filter当前deep下面的最高分数
      const bestScore = searchPiece.reduce((s, c) => Math.max(s, c.score), 0);
      // 检查当前deep能不能赢
      if (this.commons.greatOrEqualThan(bestScore, SCORE.FIVE)) {
        // 当有一步的分数大于或者等于活五，停止循环
        console.log('%c出现五连', 'color: red;font-size: 20px;');
        break;
      }
    }

    console.log('searchPiece => deep', cloneDeep(searchPiece));

    // 排序 升序
    searchPiece = searchPiece.sort((f, s) => {
      if (this.commons.equal(f.score, s.score)) {
        // 分数相等
        if (f.score >= 0) {
          // 大于零是优势，尽快获胜，因此取步数短的
          if (f.step !== s.step) {
            return f.step - s.step;
          } else {
            // 否则 选取当前分最高的（直接评分)
            return s.score - f.score;
          }
        } else {
          // 小于0是劣势，尽量拖延，因此取步数长的
          if (f.step !== s.step) {
            return s.step - f.step;
          } else {
            // 否则 选取当前分最高的（直接评分)
            return s.score - f.score;
          }
        }
      } else {
        // 分数不相等 返回分数更大的
        return s.score - f.score;
      }
    });

    console.log('searchPiece => store', cloneDeep(searchPiece));

    searchPiece = searchPiece.reduce((random: IPiece[], c) => {
      if (random.length) {
        if (random.every((r) => r.score === c.score && r.step === c.step)) {
          return [...random, c];
        } else {
          return random;
        }
      } else {
        return [c];
      }
    }, []);

    console.log('searchPiece => random', cloneDeep(searchPiece));

    const result = searchPiece[this.commons.getRandom(0, searchPiece.length)];

    console.log('result', result);

    return result;
  };

  /**
   * 生成找到的可能落子的所有后续可以的走法
   * 通过结果计算分数并剪枝
   * 函数是在每一个落子点下完深度需要的步数开始给棋盘打分
   * 然后在下一个落子点对比刚才分支的分数，决定这条分支是否要继续计算下去，不需要则会被剪掉
   * white is max, black is min
   * 第一层是电脑计算一个alpha后续同级的分数除非高于它否则不用计算
   * @param data 检索需要参数
   */
  private deepSearch = (data: IDeepSearch): IPiece[] => {
    const { candidates, role, deep, alpha, beta, step, spread } = data;
    const deepCandidates: IPiece[] = [];
    let alphaCut = alpha;

    for (let i = 0; i < candidates.length; i++) {
      const p = candidates[i];
      // 因为是冲过 gen 函数得到的可以的落子点，这里确定一下这一步的落子的选手
      this.put({ ...p, role });
      // 因为一直用的是alpha参数作为计算，所以每进入下一层就交换参数位置
      // 这样能保证在MIN层使用的alpha，MAX层使用的beta
      const searchData: ISearch = {
        deep: deep - 1,
        beta: -alphaCut,
        alpha: -beta,
        role: this.commons.reverseRole(role),
        step: step + 1,
        spread
      };

      if (spread < AI.spreadLimit) {
        // TODO 这个地方需要做迭代加深，在发现冲四或者双三的时候增加当前的迭代深度以达到更好的防御或者进攻的准备
      }

      // 查找这一步的后续可能走法和分数
      const {
        evaluate,
        whiteScore,
        blackScore,
        step: currentStep,
        steps
      } = this.search(searchData);

      // 因为在保留剪枝的对比值的时候会一直选取最大的那个保留
      // 在查询极小值的时候就把对比值和计算得到的值都取相反数
      // 再保留最大的就可以了
      // 在查询极大值的时候因为本身就是正数所以直接取最大
      // 所以alpha和beta在往下传的时候都会取相反数
      p.score = evaluate * -1;
      p.step = currentStep;
      p.steps = steps;
      p.endgame = this.statistic.printBoard(this.getBoard().board);

      this.remove(p);
      p.scoreCom = whiteScore;
      p.scoreHum = blackScore;
      deepCandidates.push(p);
      alphaCut = Math.max(alphaCut, p.score);

      // AB 剪枝
      // 这里注意在玩家先手的情况下，电脑的第一层就是MAX层，第二层就是MIN层，以此类推
      // 因为deep永远必须是双数，而最后一层的分数是打分得到不是通过计算自己的子级得到，所以我们从倒数第二层的MAX开始说起
      // 在MAX层我们永远找子级里面最大的数字比如说在MAX层的第一个节点我们得到分数A=100
      // 在MIN层我们永远找子级里面最小的，因此在MAX层的第二个节点计算第一个子节点的时候得到B=200
      // 如果这个B是自己兄弟里面最大的，那么最终它会成为自己父级的分数，但这个节点在MIN层不会被选择，因为它比A大
      // 因此第二个节点的后续子级几点不需要计算
      // 如果这个B不是自己兄弟节点里面最大的，那么他就不会成为自己父级的分数，而一个更大的分数也不会在MIN层被选择，因为它更大了
      // 因此第二个节点的后续子级节点也不需要计算了
      // 只有在MIN层的第一个节点以后的兄弟节点的子级节点计算时每个都比A小才需要计算下去，一旦出现一个大的后续则不需要计算
      // 一次类推相反的情况亦然
      // 一定要注意，这里必须是 greaterThan 即 明显大于
      // 而不是 greatOrEqualThan 不然会出现很多差不多的有用分支被剪掉，会出现致命错误
      // TODO 原代码就是greatOrEqualThan 具体使用那个方法以后留待测试
      if (this.commons.greatOrEqualThan(p.score, beta)) {
        p.score = this.MAX - 1; // 被剪枝的，直接用一个极大值来记录，但是注意必须比MAX小
        p.abCut = true;
        return deepCandidates;
      }

      // 超时判定
      if (new Date().getTime() - this.start > AI.timeLimit * 1000) {
        // 超时，退出循环
        return deepCandidates;
      }
    }

    return deepCandidates;
  };

  /**
   * 继续查找候选者并继续深入迭代
   * 或者在迭代的最深处给结果打分
   * @param data 查询迭代的参数
   */
  private search = (data: ISearch): ISResponse => {
    const { deep, alpha, beta, role, step, spread } = data;
    // 从cache里面取出相同的棋形的分数
    // 给当前的棋盘打分
    const { evaluate, whiteScore, blackScore } = this.getCacheEvaluate(role, deep);
    // 当前的分数有大于连五的分数
    // deep为 0 迭代到了最后需要结束的位置
    if (
      deep <= 0 ||
      this.commons.greatOrEqualThan(evaluate, SCORE.FIVE) ||
      this.commons.equalOrLessThan(evaluate, -SCORE.FIVE)
    ) {
      return { evaluate, whiteScore, blackScore, steps: [], step };
    }
    // 双方个下两个子之后，开启star spread 模式
    // 生成下一步的候选者
    console.log(`%c======== getCacheCandidates start deep: ${deep} ========`, 'color: blueviolet;');
    const points = this.getCacheCandidates(role, step);
    console.log('getCacheCandidates => candidates => 0', points);
    console.log(`%c======== getCacheCandidates end deep: ${deep} ========`, 'color: blueviolet;');

    if (!points.length) {
      // 没有可以用的候选者 返回
      return { evaluate, whiteScore, blackScore, steps: [], step };
    } else {
      // 有候选者则继续迭代加深
      const values = this.deepSearch({
        candidates: points,
        role,
        deep,
        step,
        beta,
        alpha,
        spread
      });
      // 生成当前局势的分数
      const reduceData: ISResponse = {
        evaluate: this.MIN,
        whiteScore: 0,
        blackScore: 0,
        steps: [],
        step
      };
      // 通过计算自己的子节点找出最大或者最小的分数作为当前分数
      return values.reduce((s, c) => {
        const maxV = Math.max(s.evaluate, c.score);
        // TODO 这里需要判断step选择分数最大的，分数一样选择步数最小的
        return {
          ...s,
          evaluate: maxV,
          step: maxV === c.score ? c.step : s.step,
          steps: values
        };
      }, reduceData);
    }
  };

  /**
   * 保存当前局势的分数
   * 这里的cache是为了在相同的deep层，用不同顺序走到相同局面的cache
   * @param evaluate 需要cache的分数
   * @param deep 需要cache分数的深度
   */
  private setCacheEvaluate = (evaluate: IEvaluate, deep: number): void => {
    if (AI.cache) {
      this.searchCache.evaluate[this.zobrist.getCode()] = { evaluate, deep };
    }
  };

  /**
   * 获取当前棋盘局势一样cache的分数
   * @param role 当前的选手
   * @param currentDeep 当前的deep层数
   */
  private getCacheEvaluate = (role: ERole, currentDeep: number): IEvaluate => {
    if (AI.cache) {
      const evaluateData = this.searchCache.evaluate[this.zobrist.getCode()];
      if (evaluateData?.deep >= currentDeep) {
        return evaluateData.evaluate;
      } else {
        // 如果缓存的结果中搜索深度比当前小，那么任何一方出现双三及以上结果的情况下可用
        // TODO: 只有这一个缓存策略是会导致开启缓存后会和以前的结果有一点点区别的，其他几种都是透明的缓存策略
        if (
          this.commons.greatOrEqualThan(evaluateData?.evaluate?.evaluate, SCORE.FOUR) ||
          this.commons.equalOrLessThan(evaluateData?.evaluate?.evaluate, -SCORE.FOUR)
        ) {
          return evaluateData.evaluate;
        }
      }
    }
    // cache里面没找到相同局势的分数结果，就为当前局势打一个分数
    const evaluate = this.evaluate(role);
    // 立刻cache这个局势的分数，方便下一次查询
    this.setCacheEvaluate(evaluate, currentDeep);
    return evaluate;
  };

  /**
   * 保存当前局势的候选棋子
   * 这里的cache是为了缓存，用不同顺序走到了相同局势下面的候选人结果
   * @param candidates 需要缓存的候选人
   */
  private setCacheCandidates = (candidates: IPiece[]): void => {
    if (AI.cache) {
      // 从cache里面拿到相同局势的分数
      this.searchCache.candidates[this.zobrist.getCode()] = cloneDeep(candidates);
    }
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
      if (candidates?.length) {
        return cloneDeep(candidates);
      }
    }
    // 在缓存里面没找到当前局势的候选棋子，就重新查找候选棋子
    const count = this.getSteps().length;
    // 只有在一共落子大于十颗才开始只考虑眠三以上的分数
    const candidates = this.gen(role, count > 10 ? step > 1 : step > 3, step > 1);
    // 这里立刻cache候选棋子，方便下次有相同局势的时候可以直接使用
    this.setCacheCandidates(candidates);
    return candidates;
  };

  protected abstract put(piece: IPiece): void;

  protected abstract gen(role: ERole, onlyThrees?: boolean, starSpread?: boolean): IPiece[];

  protected abstract remove(p: IPiece): void;

  protected abstract evaluate(role: ERole): IEvaluate;

  protected abstract getPlay(): ERole;

  protected abstract getBoard(): IOpenBoard;

  protected abstract getSteps(): IPiece[];
}
