import { cloneDeep } from 'lodash-es';
import { ISearchCache, IDeepSearch, ISearch, ISResponse } from '../interfaces/negamax.interface';
import { SCORE } from '../configs/score.config';
import { ERole } from '../interfaces/role.interface';
import { AI } from '../configs/ai.config';
import { IPiece } from '../interfaces/piece.interface';
import { board } from './board.service';
import { creatPiece } from './piece.service';
import { commons } from './commons.service';

/**
 * 思路：
 * 每次开始迭代前，先生成一组候选列表，然后在迭代加深的过程中不断更新这个列表中的分数
 * 这样迭代的深度越大，则分数越精确，并且，任何时候达到时间限制而中断迭代的时候，能保证这个列表中的分数都是可靠的
 */
export class FilterCandidates {
  private readonly MAX = SCORE.FIVE * 10; // 黑棋
  private readonly MIN = this.MAX * -1; // 白棋

  private searchCache: { [key: number]: ISearchCache } = {};
  private start = 0; // 开始深入计算的开始时间

  deepFilter = (role: ERole, deep = AI.searchDeep): IPiece => {
    // 获取落子的候选者列表
    const candidates = board.gen(role);

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

    // TODO 需要做迭代加深和迭代缓存，不然性能开销很大
    // 暂时没有做这里
    let searchPiece: IPiece[] = [];
    // TODO 初始值直接拉到最大，这里的初始值应该是2开始
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

      const bestScore = searchPiece.reduce((s, c) => Math.max(s, c.score), 0);

      if (commons.greatOrEqualThan(bestScore, SCORE.FIVE)) {
        // 当有一步的分数大于或者等于活五，停止循环
        break;
      }
    }

    // 排序 升序
    searchPiece = searchPiece.sort((f, s) => {
      if (commons.equal(f.score, s.score)) {
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

    console.log('searchPiece', cloneDeep(searchPiece));

    const randomPiece = searchPiece.reduce((random: IPiece[], c) => {
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

    console.log('randomPiece', cloneDeep(randomPiece));

    const result = randomPiece[commons.getRandom(0, randomPiece.length)];

    console.log('result', result);

    board.log();

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

    console.log(`%c============= deepSearch start deep: ${deep} =============`, 'color: red;');
    console.log('candidates', candidates);

    for (let i = 0; i < candidates.length; i++) {
      const p = candidates[i];
      // 因为是冲过 gen 函数得到的可以的落子点，这里确定一下这一步的落子的选手
      board.put({ ...p, role });
      console.log(`%c========== start deep: ${deep} [${p.y}, ${p.x}] ==========`, 'color: gold;');

      // 因为一直用的是alpha参数作为计算，所以每进入下一层就交换参数位置
      // 这样能保证在MIN层使用的alpha，MAX层使用的beta
      const searchData: ISearch = {
        deep: deep - 1,
        beta: -alphaCut,
        alpha: -beta,
        role: commons.reverseRole(role),
        step: step + 1,
        spread
      };

      if (spread < AI.spreadLimit) {
        // TODO 这个地方需要做迭代加深，在发现冲四或者双三的时候增加当前的迭代深度以达到更好的防御或者进攻的准备
      }

      // 查找这一步的后续可能走法和分数
      const { evaluate, step: currentStep, steps } = this.search(searchData);

      console.log('evaluate', evaluate);

      // 因为在保留剪枝的对比值的时候会一直选取最大的那个保留
      // 在查询极小值的时候就把对比值和计算得到的值都取相反数
      // 再保留最大的就可以了
      // 在查询极大值的时候因为本身就是正数所以直接取最大
      // 所以alpha和beta在往下传的时候都会取相反数
      p.score = evaluate * -1;
      p.step = currentStep;
      p.steps = steps;

      board.remove(p);
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
      if (commons.greaterThan(p.score, beta)) {
        p.score = this.MAX - 1; // 被剪枝的，直接用一个极大值来记录，但是注意必须比MAX小
        p.abCut = true;
        console.log(`%c========== end deep: ${deep} [${p.y}, ${p.x}] ==========`, 'color: gold;');
        return deepCandidates;
      }

      // 超时判定
      if (new Date().getTime() - this.start > AI.timeLimit * 1000) {
        console.log(`%c========== end deep: ${deep} [${p.y}, ${p.x}] ==========`, 'color: gold;');
        // 超时，退出循环
        return deepCandidates;
      }
      console.log(`%c========== end deep: ${deep} [${p.y}, ${p.x}] ==========`, 'color: gold;');
    }

    console.log(`%c============= deepSearch start end: ${deep} =============`, 'color: red;');

    return deepCandidates;
  };

  /**
   * 继续查找候选者并继续深入迭代
   * 或者在迭代的最深处给结果打分
   * @param data 查询迭代的参数
   */
  private search = (data: ISearch): ISResponse => {
    const { deep, alpha, beta, role, step, spread } = data;
    // 给当前的棋盘打分
    const evaluate = board.evaluate(role, deep);
    // 当前的分数有大于连五的分数
    // deep为 0 迭代到了最后需要结束的位置
    if (
      deep <= 0 ||
      commons.greatOrEqualThan(evaluate, SCORE.FIVE) ||
      commons.equalOrLessThan(evaluate, -SCORE.FIVE)
    ) {
      return { evaluate, steps: [], step };
    }
    // 双方个下两个子之后，开启star spread 模式
    // 生成下一步的候选者
    const points = board.gen(role, board.count > 10 ? step > 1 : step > 3, step > 1);

    if (!points.length) {
      // 没有可以用的候选者 返回
      return { evaluate, steps: [], step };
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
      const reduceData: ISResponse = { evaluate: this.MIN, steps: [], step };
      // 通过计算自己的子节点找出最大或者最小的分数作为当前分数
      return values.reduce((s, c) => {
        const maxV = Math.max(s.evaluate, c.score);
        // TODO 这里需要判断step选择分数最大的，分数一样选择步数最小的
        return {
          evaluate: maxV,
          step: maxV === c.score ? c.step : s.step,
          steps: values
        };
      }, reduceData);
    }
  };

  /**
   * 保存当前深度，当前父级一致的迭代结果，下次迭代到同样位置的时候直接调取结果不需要计算
   */
  private saveCache = (): void => {
    // TODO 这里缓存迭代结果
    console.log('searchCache', this.searchCache);
  };

  /**
   * 获取当前深度，当前父级一样的结果直接进入更深的迭代
   */
  private getCache = (): void => {
    // TODO 这里获取迭代结果
    console.log('searchCache', this.searchCache);
  };
}

export const filterCandidates = new FilterCandidates();
