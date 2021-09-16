/*
 * 思路：
 * 每次开始迭代前，先生成一组候选列表，然后在迭代加深的过程中不断更新这个列表中的分数
 * 这样迭代的深度越大，则分数越精确，并且，任何时候达到时间限制而中断迭代的时候，能保证这个列表中的分数都是可靠的
 */

// var SCORE = T
import cloneDeep from 'lodash-es/cloneDeep';

import { ERole } from '../interfaces/role.interface';
import { SCORE } from '../configs/score.config';
import { creatPiece } from './piece.service';
import { board } from './board.service';
import { AI } from '../configs/ai.config';
import { statistic } from './statistic.service';
import { commons } from './commons.service';
import { ICacheBoard, IPiece, IScore } from '../interfaces/piece.interface';
import { zobrist } from './zobrist.service';
import { IRMinMax, ISearch, ISMinMax } from '../interfaces/evaluate-point.interface';

interface ISearchs extends ISearch {
  steps: IPiece[];
}

/**
 * 极大极小值检索
 */
export class Negamax {
  deepCache: { [key: number]: ICacheBoard } = {};
  private readonly MAX = SCORE.FIVE * 10; // 黑棋
  private readonly MIN = this.MAX * -1; // 白棋

  private count = 0; // 每次思考的节点数
  private pvCut = 0;
  private abCut = 0; // AB剪枝次数
  private cacheCount = 0; // zobrist缓存节点数
  private cacheGet = 0; // zobrist缓存命中数量
  private start = 0; // 开始深入计算的开始时间

  deepAll = (role: ERole = ERole.white, deep = AI.searchDeep): IPiece => {
    const candidates = board.gen(role);

    console.log('candidates', candidates);

    const result = this.deepenSearch(candidates, role, deep);

    console.log('deepAll => result', result);

    console.log('%c======================================================', 'color: yellow');

    // return {} as IPiece;
    // return this.deepen(candidates, role, deep);
    return this.deepenSearch(candidates, role, deep);

    // const attackPoints = candidates.filter((p) => {
    //  return role === ERole.com ? (p.scoreCom >= T.TWO) : (p.scoreHum >= T.TWO)
    // })
    // const defendPoints = candidates.filter((p) => {
    //  return role === ERole.hum ? (p.scoreCom >= T.TWO) : (p.scoreHum >= T.TWO)
    // })
    // let attack, defend
    // if (attackPoints.length) {
    //  console.log('compute attack...')
    //  console.log(attackPoints)
    //  attack = deeping(attackPoints, role, deep)
    //  console.log(attack)
    // }
    // if (defendPoints.length) {
    //  console.log('compute defend...')
    //  console.log(defendPoints)
    //  defend = deeping(defendPoints, ERole.reverse(role), deep)
    //  console.log(attack)
    // }

    // let result
    /// /进攻优先，只要对面不能成活三，就不防守
    // if (!defend || defend.min < T.THREE) result = attack
    // else if (!attack) result = defend
    /// / 如果双方都有可以赢的点
    /// / 注意处理冲四和活四的关系，活四分比冲四高，但是注意他的优先级和活四是一样的
    // else {
    //  if (attack.min > T.BLOCKED_FOUR / 2 && attack.min < T.BLOCKED_FOUR *2) attack.min = T.FOUR
    //  if (defend.min > T.BLOCKED_FOUR / 2 && defend.min < T.BLOCKED_FOUR *2) defend.min = T.FOUR
    //  result = ((defend.min > attack.min*2) ? defend : attack)
    // }

    // console.log('############# 最终结果 ################')
    // console.log(result)
    // defend.score = 0 // 守住了，别返回一个很大的数
    // return result
  };

  deepen = (candidates: IPiece[], role: ERole, deep: number): IPiece => {
    this.start = new Date().getTime();

    // 每次开始迭代的时候清空缓存
    // 因为迭代是逐渐加深，也就是2 3 6 8的顺序，每次重新计算
    // 在重新计算已经计算过的节点的时候可以加快检索的速度
    // 这里缓存的主要目的是在每一次的时候加快搜索，而不是长期存储
    // 事实证明这样的清空方式对搜索速度的影响非常小（小于10%)
    this.deepCache = {};
    let bestScore = 0;
    for (let i = 2; i <= deep; i += 2) {
      bestScore = this.negamax(candidates, role, i, this.MIN, this.MAX);
      /// 每次迭代剔除必败点，直到没有必败点或者只剩最后一个点
      /// 实际上，由于必败点几乎都会被AB剪枝剪掉，因此这段代码几乎不会生效
      // var newCandidates = candidates.filter(function (d) {
      //  return !d.abcut
      // })
      // candidates = newCandidates.length ? newCandidates : [candidates[0]] // 必败了，随便走走

      if (commons.greatOrEqualThan(bestScore, SCORE.FIVE)) {
        // 当有一步的分数大于或者等于活五，停止循环
        break;
      }
      // 下面这样做，会导致上一层的分数，在这一层导致自己被剪枝的bug，因为我们的判断条件是 >=。
      // 上次层搜到的分数，在更深一层搜索的时候，会因为满足 >= 的条件而把自己剪枝掉
      // if (littleThan(bestScore, T.THREE * 2)) {
      //   // 如果能找到双三以上的棋，则保留bestScore做剪枝，否则直接设置为最小值
      //   bestScore = this.MIN;
      // }
    }

    // 美化一下
    const candidate = candidates.map((d) => {
      const r = creatPiece({ x: d.x, y: d.y, role: d.role });
      r.score = d.data?.score || 0;
      r.step = d.data?.step || 0;
      r.steps = d.data?.steps || [];
      if (d.data?.vct) {
        r.vct = d.data.vct;
      }
      if (d.data?.vcf) {
        r.vcf = d.data.vcf;
      }
      return r;
    });

    console.log('candidate', cloneDeep(candidate));

    // 排序 升序
    // 经过测试，这个如果放在上面的for循环中（就是每次迭代都排序），反而由于迭代深度太浅，排序不好反而会降低搜索速度。
    candidate.sort((a, b) => {
      a.score = a.score || 0;
      b.score = b.score || 0;
      a.step = a.step || 0;
      b.step = b.step || 0;
      if (commons.equal(a.score, b.score)) {
        // 大于零是优势，尽快获胜，因此取步数短的
        // 小于0是劣势，尽量拖延，因此取步数长的
        if (a.score >= 0) {
          if (a.step !== b.step) {
            return a.step - b.step;
          } else {
            return b.score - a.score; // 否则 选取当前分最高的（直接评分)
          }
        } else if (a.step !== b.step) {
          return b.step - a.step;
        } else {
          return b.score - a.score; // 否则 选取当前分最高的（直接评分)
        }
      } else {
        return b.score - a.score;
      }
    });

    const result = candidate[0];

    console.log('result', cloneDeep(result));

    result.min = Math.min(...result.steps.map((d) => d.score));

    if (AI.log) {
      const time = (new Date().getTime() - this.start) / 1000;
      const position = `[${result.x}, ${result.y}]`;
      const score = result.score.toFixed(3);
      const hitRate = ((this.cacheGet / this.cacheCount) * 100).toFixed(3);
      const NPS = Math.floor(this.count / time);
      console.log(
        `选择节点: ${position}, 分数: ${score}, 步数: ${result.step}, 最小值：${result.min}`
      );
      console.log(
        `搜索节点数: ${this.count}, AB剪枝次数: ${this.abCut}, PV剪枝次数: ${this.pvCut}`
      );
      console.log(
        `搜索缓存: 总数 ${this.cacheCount}, 命中率 ${hitRate}%, ${this.cacheGet}/${this.cacheCount}`
      );
      // 注意，减掉的节点数实际远远不止 ABcut 个，因为减掉的节点的子节点都没算进去。实际 4W个节点的时候，剪掉了大概 16W个节点
      console.log(`当前统计: ${this.count}个节点, 耗时: ${time.toFixed(2)}s, NPS: ${NPS}N/S`);

      console.log('%c===============统计表===============', 'color: blue;');

      statistic.print(candidate);
    }

    board.log();
    return result;
  };

  /**
   * max min search
   * white is max, black is min
   * @param candidates 生成可以的落子点
   * @param role 落子的选手
   * @param deep 循环的深度
   * @param alpha 剪枝的值
   * @param beta 剪枝的值
   */
  negamax = (
    candidates: IPiece[],
    role: ERole,
    deep: number,
    alpha: number,
    beta: number
  ): number => {
    this.count = 0;
    this.abCut = 0;
    this.pvCut = 0;
    board.currentSteps = [];

    let nowAlpha = alpha;
    for (let i = 0; i < candidates.length; i++) {
      const p = candidates[i];
      console.log(`%c================ negamax start deep: ${deep} ================`, 'color: red;');
      console.log(`%c======= [${p.y}, ${p.x}] =======`, 'color: red;');
      board.put({ ...p, role });
      const searchData = {
        deep: deep - 1,
        beta: -nowAlpha,
        alpha: -beta,
        role: commons.reverseRole(role),
        step: 1,
        steps: cloneDeep([p]),
        spread: 0
      };
      const v = this.search(searchData);
      v.score *= -1;

      console.log('negamax => v: ', v);
      console.log('negamax nowAlpha', nowAlpha);
      console.log('negamax v.score', v.score);

      // 在所有步数里面找到分数最大的
      nowAlpha = Math.max(nowAlpha, v.score);
      console.log('negamax nowAlpha', nowAlpha);
      board.remove(p);
      p.data = v;

      // 超时判定
      if (new Date().getTime() - this.start > AI.timeLimit * 1000) {
        console.log('timeout...');
        break; // 超时，退出循环
      }
    }

    if (AI.log) {
      console.log(`迭代完成,deep=${deep}`);
      const candidatesScores = candidates.map((d) => {
        const position = `[${d.x},${d.y}]`;
        const score = `score:${d.data?.score}`;
        const steps = `step:${d.data?.step}, steps:${d.data?.steps?.join(';')}`;
        const c = d.data?.c ? `c:${[d.data?.c?.score.steps || []].join(';')}` : '';
        return `${position}, ${score}, ${steps}, ${c};`;
      });
      console.log(candidatesScores);
    }

    return nowAlpha;
  };

  /**
   * MAX MIN 检索算法，找到这一步后续的谁有可能，并计算一个分数
   * @param data 查询需要的数据
   */
  search = (data: ISearchs): IScore => {
    const { deep, alpha, beta, role, step, steps, spread } = data;
    AI.debug && board.logSteps();

    if (AI.cache) {
      const c = this.deepCache[zobrist.code || 0];
      if (c) {
        if (c.deep >= deep) {
          // 如果缓存中的结果搜索深度不比当前小，则结果完全可用
          this.cacheGet++;
          // 记得clone，因为这个分数会在搜索过程中被修改，会使缓存中的值不正确
          return {
            score: c.score.score,
            steps,
            step: step + c.score.step,
            c,
            vct: 0,
            vcf: 0,
            abCut: 0
          };
        }
        // 如果缓存的结果中搜索深度比当前小，那么任何一方出现双三及以上结果的情况下可用
        // TODO: 只有这一个缓存策略是会导致开启缓存后会和以前的结果有一点点区别的，其他几种都是透明的缓存策略
        // TODO: 存疑这个位置的写法有待验证
        if (
          commons.greatOrEqualThan(c.score.score, SCORE.FOUR) ||
          commons.equalOrLessThan(c.score.score, -SCORE.FOUR)
        ) {
          this.cacheGet++;
          return c.score;
        }
      }
    }
    // 评估分数
    const evaluate = board.evaluate(role);
    console.log('=======================search=======================');

    console.log(`search evaluate: ${evaluate}`);
    console.log('deep', deep);

    const leaf: IScore = {
      score: evaluate,
      step,
      steps
    };

    this.count++;
    const { FIVE } = SCORE;
    // 搜索到底 或者已经胜利
    // 注意这里是小于0，而不是1，因为本次直接返回结果并没有下一步棋
    // deep为0循环结束，或者当前的分数有大于连五的分数
    if (
      deep <= 0 ||
      commons.greatOrEqualThan(evaluate, FIVE) ||
      commons.equalOrLessThan(evaluate, -FIVE)
    ) {
      /// / 经过测试，把算杀放在对子节点的搜索之后，比放在前面速度更快一些。
      /// / vcf
      /// / 自己没有形成活四，对面也没有形成活四，那么先尝试VCF
      // if(littleThan(_e, SCORE.FOUR) && greatThan(_e, SCORE.FOUR * -1)) {
      //  mate = vcx.vcf(role, vcxDeep)
      //  if(mate) {
      //    AI.debug && console.log('vcf success')
      //    v = {
      //      score: mate.score,
      //      step: step + mate.length,
      //      steps: steps,
      //      vcf: mate // 一个标记为，表示这个值是由vcx算出的
      //    }
      //    return v
      //  }
      // } // vct
      /// / 自己没有形成活三，对面也没有高于活三的棋型，那么尝试VCT
      // if(littleThan(_e, SCORE.THREE*2) && greatThan(_e, SCORE.THREE * -2)) {
      //  var mate = vcx.vct(role, vcxDeep)
      //  if(mate) {
      //    AI.debug && console.log('vct success')
      //    v = {
      //      score: mate.score,
      //      step: step + mate.length,
      //      steps: steps,
      //      vct: mate // 一个标记为，表示这个值是由vcx算出的
      //    }
      //  return v
      //  }
      // }
      return leaf;
    }

    // 双方个下两个子之后，开启star spread 模式
    // 生成可以落子的点
    const points = board.gen(role, board.count > 10 ? step > 1 : step > 3, step > 1);

    if (!points.length) {
      return leaf;
    }

    console.log('this.MIN', this.MIN);
    let best: IScore = {
      score: this.MIN,
      step,
      steps
    };

    AI.debug && console.log(`points: ${points.map((d) => `[${d.x}, ${d.y}]`).join(';')}`);
    AI.debug && console.log(`A~B: ${alpha}~${beta}`);

    let nowAlpha = alpha;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      console.log(`%c======= [${p.y}, ${p.x}] =======`, 'color: red;');
      board.put({ ...p, role });

      const searchData = {
        deep: deep - 1,
        beta: -nowAlpha,
        alpha: -beta,
        role: commons.reverseRole(role),
        step: step + 1,
        steps: [...cloneDeep(steps), cloneDeep(p)],
        spread
      };

      if (searchData.spread < AI.spreadLimit) {
        // 冲四延伸
        const { scoreCom, scoreHum } = p;
        if (
          (role === ERole.white && scoreHum >= FIVE) ||
          (role === ERole.block && scoreCom >= FIVE)
        ) {
          // _deep = deep+1
          searchData.deep += 2;
          searchData.spread++;
        }
        // 单步延伸策略：双三延伸
        // if (
        //   (role === ERole.com && p.scoreCom >= SCORE.THREE * 2) ||
        //   (role === ERole.hum && p.scoreHum >= SCORE.THREE * 2)
        // ) {
        //   nowDeep = deep;
        //   nowSpread++;
        // }
      }

      const v = this.search(searchData);
      console.log('search role', searchData.role);
      console.log('search v.score', v.score);
      v.score *= -1;

      console.log('search => v: ', v);
      console.log('search nowAlpha', nowAlpha);
      console.log('search v.score', v.score);
      console.log('search best.score', best.score);
      console.log('search beta', beta);
      console.log(v.score > best.score);

      board.remove(p);

      // 注意，这里决定了剪枝时使用的值必须比MAX小
      if (v.score > best.score) {
        best = v;
      }
      nowAlpha = Math.max(best.score, nowAlpha);
      console.log('search nowAlpha', nowAlpha);
      console.log(commons.greatOrEqualThan(v.score, beta));
      // AB 剪枝
      // 这里不要直接返回原来的值，因为这样上一层会以为就是这个分，实际上这个节点直接剪掉就好了，根本不用考虑，也就是直接给一个很大的值让他被减掉
      // 这样会导致一些差不多的节点都被剪掉，但是没关系，不影响棋力
      // 一定要注意，这里必须是 greaterThan 即 明显大于，而不是 greatOrEqualThan 不然会出现很多差不多的有用分支被剪掉，会出现致命错误
      if (commons.greatOrEqualThan(v.score, beta)) {
        console.log(`AB Cut [${p.x}, ${p.y}]${v.score} >= ${beta}`);
        this.abCut++;
        v.score = this.MAX - 1; // 被剪枝的，直接用一个极大值来记录，但是注意必须比MAX小
        v.abCut = 1; // 剪枝标记
        // cache(deep, v) // 别缓存被剪枝的，而且，这个返回到上层之后，也注意都不要缓存
        return v;
      }
    }

    this.cache(deep, best);

    // console.log('end: role:' + role + ', deep:' + deep + ', best: ' + best)
    return best;
  };

  deepenSearch = (candidates: IPiece[], role: ERole, deep: number): IPiece => {
    this.start = new Date().getTime();

    // 每次开始迭代的时候清空缓存
    // 因为迭代是逐渐加深，也就是2 3 6 8的顺序，每次重新计算
    // 在重新计算已经计算过的节点的时候可以加快检索的速度
    // 这里缓存的主要目的是在每一次的时候加快搜索，而不是长期存储
    // 事实证明这样的清空方式对搜索速度的影响非常小（小于10%)
    this.deepCache = {};
    let searchPiece: IPiece[] = [];
    for (let i = 2; i <= deep; i += 2) {
      this.count = 0;
      this.abCut = 0;
      this.pvCut = 0;
      board.currentSteps = [];

      const minMaxData: ISMinMax = {
        candidates,
        role,
        deep: i,
        step: 0,
        alpha: this.MIN,
        beta: this.MAX
      };
      // 生成现在可能落子的所有后续结果和分数
      searchPiece = this.minMaxSearch(minMaxData);

      console.log('deepenSearchFun => for => searchPiece:', cloneDeep(searchPiece));
      /// 每次迭代剔除必败点，直到没有必败点或者只剩最后一个点
      /// 实际上，由于必败点几乎都会被AB剪枝剪掉，因此这段代码几乎不会生效
      // var newCandidates = candidates.filter(function (d) {
      //  return !d.abcut
      // })
      // candidates = newCandidates.length ? newCandidates : [candidates[0]] // 必败了，随便走走

      const bestScore = searchPiece.reduce((s, c) => Math.max(s, c.score), 0);

      console.log('bestScore', bestScore);

      if (commons.greatOrEqualThan(bestScore, SCORE.FIVE)) {
        // 当有一步的分数大于或者等于活五，停止循环
        break;
      }

      // 下面这样做，会导致上一层的分数，在这一层导致自己被剪枝的bug，因为我们的判断条件是 >=。
      // 上次层搜到的分数，在更深一层搜索的时候，会因为满足 >= 的条件而把自己剪枝掉
      // if (littleThan(bestScore, T.THREE * 2)) {
      //   // 如果能找到双三以上的棋，则保留bestScore做剪枝，否则直接设置为最小值
      //   bestScore = this.MIN;
      // }
    }

    console.log('deepenSearchFun => searchPiece:', cloneDeep(searchPiece));

    // 排序 升序
    // 经过测试，这个如果放在上面的for循环中（就是每次迭代都排序），反而由于迭代深度太浅，排序不好反而会降低搜索速度。
    searchPiece.sort((a, b) => {
      if (commons.equal(a.score, b.score)) {
        // 大于零是优势，尽快获胜，因此取步数短的
        // 小于0是劣势，尽量拖延，因此取步数长的
        if (a.score >= 0) {
          if (a.step !== b.step) {
            return a.step - b.step;
          } else {
            return b.score - a.score; // 否则 选取当前分最高的（直接评分)
          }
        } else if (a.step !== b.step) {
          return b.step - a.step;
        } else {
          return b.score - a.score; // 否则 选取当前分最高的（直接评分)
        }
      } else {
        return b.score - a.score;
      }
    });

    const result = searchPiece[0];

    console.log('result', cloneDeep(result));

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
  minMaxSearch = (data: ISMinMax): IPiece[] => {
    const { candidates, role, deep, alpha, beta, step } = data;
    const deepCandidates: IPiece[] = [];
    let alphaCut = alpha;

    for (let i = 0; i < candidates.length; i++) {
      const p = candidates[i];
      console.log(`%c======= minMaxSearch start deep: ${deep} index: ${i} =======`, 'color: red;');
      console.log(`%c======= [${p.y}, ${p.x}] =======`, 'color: red;');
      console.log('minMaxSearch role:', ERole[role]);
      console.log(`A~B: ${alpha}~${beta}`);

      // 因为是冲过 gen 函数得到的可以的落子点，这里确定一下这一步的落子的选手
      board.put({ ...p, role });

      // 因为一直用的是alpha参数作为计算，所以每进入下一层就交换参数位置
      // 这样能保证在MIN层使用的alpha，MAX层使用的beta
      const searchData: ISearch = {
        deep: deep - 1,
        beta: -alphaCut,
        alpha: -beta,
        role: commons.reverseRole(role),
        step: step + 1,
        spread: 0
      };
      // 查找这一步的后续可能走法和分数
      const { evaluate, step: nowStep, steps } = this.deepMinMaxSearch(searchData);

      console.log('minMaxSearch reverse role:', ERole[searchData.role]);
      console.log(`minMaxSearch evaluate: ${evaluate}`);

      // 因为在保留剪枝的对比值的时候会一直选取最大的那个保留
      // 在查询极小值的时候就把对比值和计算得到的值都取相反数
      // 再保留最大的就可以了
      // 在查询极大值的时候因为本身就是正数所以直接取最大
      // 所以alpha和beta在往下传的时候都会取相反数
      p.score = evaluate * -1;
      p.step = nowStep;
      p.steps = steps;

      console.log(`minMaxSearch p.score: ${p.score}`);
      console.log('minMaxSearch alphaCut', alphaCut);
      console.log('minMaxSearch beta', beta);

      board.remove(p);
      deepCandidates.push(p);
      alphaCut = Math.max(alphaCut, p.score);
      console.log('minMaxSearch now alphaCut', alphaCut);
      console.log('剪枝', commons.greatOrEqualThan(p.score, beta));

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
      if (commons.greatOrEqualThan(p.score, beta)) {
        console.log(`AB cut [${p.x}, ${p.y}], ${p.score} >= ${beta}`);
        console.log(`%c======= minMaxSearch end deep: ${deep} index: ${i} =======`, 'color: aqua;');
        this.abCut++;
        p.score = this.MAX - 1; // 被剪枝的，直接用一个极大值来记录，但是注意必须比MAX小
        // cache(deep, v) // 别缓存被剪枝的，而且，这个返回到上层之后，也注意都不要缓存
        return deepCandidates;
      }

      // 超时判定
      if (new Date().getTime() - this.start > AI.timeLimit * 1000) {
        console.log('timeout...');
        // 超时，退出循环
        console.log(`%c======= minMaxSearch end deep: ${deep} index: ${i} =======`, 'color: aqua;');
        return deepCandidates;
      }
      console.log(`%c======= minMaxSearch end deep: ${deep} index: ${i} =======`, 'color: aqua;');
    }

    return deepCandidates;
  };

  /**
   * 通过上一步的数据生成下一层的落子点，并继续递归上层函数计算
   * @param data 查询需要的数据
   */
  deepMinMaxSearch = (data: ISearch): IRMinMax => {
    const { deep, alpha, beta, role, step, spread } = data;

    // 给当前的棋盘打分
    const evaluate = board.evaluate(role);

    const { FIVE } = SCORE;
    // 当前的分数有大于连五的分数
    if (commons.greatOrEqualThan(evaluate, FIVE) || commons.equalOrLessThan(evaluate, -FIVE)) {
      return { evaluate, steps: [], step };
    }

    // 注意这里是小于0，而不是1，因为本次直接返回结果并没有下一步棋
    // 搜索到底 或者已经胜利
    // deep为0循环结束
    if (deep <= 0) {
      return { evaluate, steps: [], step };
    }

    // 双方个下两个子之后，开启star spread 模式
    // 生成可以落子的点
    const points = board.gen(role, board.count > 10 ? step > 1 : step > 3, step > 1);

    if (!points.length) {
      // 没有可以的落子 返回
      return { evaluate, steps: [], step };
    } else {
      const values = this.minMaxSearch({
        candidates: points,
        role,
        deep,
        step,
        beta,
        alpha
      });

      // 生成当前局势的分数
      const reduceData: IRMinMax = { evaluate: this.MIN, steps: [], step };

      return values.reduce((s, c) => {
        console.log(`reduceData reduce c: ${c.score} s: ${s.evaluate}`);
        return {
          evaluate: Math.max(s.evaluate, c.score),
          step: Math.min(s.step, c.step),
          steps: values
        };
      }, reduceData);
    }
  };

  cache = (deep: number, score: IScore): boolean => {
    if (!AI.cache) {
      return false;
    }
    if (score.abCut) {
      return false; // 被剪枝的不要缓存哦，因为分数是一个极值
    }
    // 记得clone，因为score在搜索的时候可能会被改的，这里要clone一个新的
    const cache = {
      deep,
      score: {
        score: score.score,
        steps: score.steps,
        step: score.step
      },
      board: board.toString()
    };
    this.deepCache[zobrist.code || 0] = cloneDeep(cache);
    console.log('deepCache', cloneDeep(this.deepCache));
    // AI.debug && console.log('add cache[' + board.zobrist.code + ']', obj)
    this.cacheCount++;
    return true;
  };
}

export const negamax = new Negamax();
