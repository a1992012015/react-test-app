/*
 * 思路：
 * 每次开始迭代前，先生成一组候选列表，然后在迭代加深的过程中不断更新这个列表中的分数
 * 这样迭代的深度越大，则分数越精确，并且，任何时候达到时间限制而中断迭代的时候，能保证这个列表中的分数都是可靠的
 */

// var SCORE = T
import cloneDeep from 'lodash-es/cloneDeep';

import { ERole } from '../interfaces/role.interface';
import { SCORE } from '../configs/score.config';
import { Piece } from './piece.service';
import { board } from './board.service';
import { AI } from '../configs/ai.config';
import { statistic } from './statistic.service';
import { commons } from './commons.service';
import { ICacheBoard, IScore } from '../interfaces/piece.interface';
import { zobrist } from './zobrist.service';
import { ISearch } from '../interfaces/evaluate-point.interface';

/**
 * 极大极小值检索
 */
export class Negamax {
  deepCache: { [key: number]: ICacheBoard } = {};
  private readonly MAX = SCORE.FIVE * 10; // 黑棋
  private readonly MIN = this.MAX * -1; // 白棋

  private count = 0;  //每次思考的节点数
  private pVcut: number = 0;
  private aBcut: number = 0;  //AB剪枝次数
  private cacheCount = 0; //zobrist缓存节点数
  private cacheGet = 0; //zobrist缓存命中数量
  private start = 0; // 开始深入计算的开始时间

  deepAll = (role: ERole = ERole.com, deep = AI.searchDeep): Piece => {
    const candidates = board.gen(role);

    console.log('candidates', candidates);

    return this.deepen(candidates, role, deep);

    //const attackPoints = candidates.filter((p) => {
    //  return role === ERole.com ? (p.scoreCom >= T.TWO) : (p.scoreHum >= T.TWO)
    //})
    //const defendPoints = candidates.filter((p) => {
    //  return role === ERole.hum ? (p.scoreCom >= T.TWO) : (p.scoreHum >= T.TWO)
    //})
    //let attack, defend
    //if (attackPoints.length) {
    //  console.log('compute attack...')
    //  console.log(attackPoints)
    //  attack = deeping(attackPoints, role, deep)
    //  console.log(attack)
    //}
    //if (defendPoints.length) {
    //  console.log('compute defend...')
    //  console.log(defendPoints)
    //  defend = deeping(defendPoints, ERole.reverse(role), deep)
    //  console.log(attack)
    //}

    //let result
    ////进攻优先，只要对面不能成活三，就不防守
    //if (!defend || defend.min < T.THREE) result = attack
    //else if (!attack) result = defend
    //// 如果双方都有可以赢的点
    //// 注意处理冲四和活四的关系，活四分比冲四高，但是注意他的优先级和活四是一样的
    //else {
    //  if (attack.min > T.BLOCKED_FOUR / 2 && attack.min < T.BLOCKED_FOUR *2) attack.min = T.FOUR
    //  if (defend.min > T.BLOCKED_FOUR / 2 && defend.min < T.BLOCKED_FOUR *2) defend.min = T.FOUR
    //  result = ((defend.min > attack.min*2) ? defend : attack)
    //}

    //console.log('############# 最终结果 ################')
    //console.log(result)
    //defend.score = 0 // 守住了，别返回一个很大的数
    //return result
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
  negamax = (candidates: Piece[], role: ERole, deep: number, alpha: number, beta: number) => {
    this.count = 0;
    this.aBcut = 0;
    this.pVcut = 0;
    board.currentSteps = [];

    for (let i = 0; i < candidates.length; i++) {
      const p = candidates[i];
      p.role = role;
      board.put(p);
      const searchData = {
        deep: deep - 1,
        beta: -beta,
        alpha: -alpha,
        role: commons.reverseRole(role),
        step: 1,
        steps: cloneDeep([p]),
        spread: 0
      };
      const v = this.search(searchData);
      v.score *= -1;
      alpha = Math.max(alpha, v.score);
      board.remove(p);
      p.data = v;

      // 超时判定
      if (new Date().getTime() - this.start > AI.timeLimit * 1000) {
        console.log('timeout...');
        break; // 超时，退出循环
      }
    }

    AI.log && console.log('迭代完成,deep=' + deep);
    AI.log && console.log(candidates.map((d) => {
      return '[' + d.x + ',' + d.y + ']'
        + ',score:' + d.data?.score
        + ',step:' + d.data?.step
        + ',steps:' + d.data?.steps?.join(';')
        + (d.data?.c ? ',c:' + [d.data?.c?.score.steps || []].join(';') : '');
      // + (d.v?.vct ? (',vct:' + d.v.vct.join(';')) : '')
      // + (d.v?.vcf ? (',vcf:' + d.v.vcf.join(';')) : '');
    }));

    return alpha;
  };

  deepen = (candidates: Piece[], role: ERole, deep: number) => {
    this.start = new Date().getTime();

    // 每次开始迭代的时候清空缓存。这里缓存的主要目的是在每一次的时候加快搜索，而不是长期存储。事实证明这样的清空方式对搜索速度的影响非常小（小于10%)
    this.deepCache = {};

    let bestScore: number;
    for (let i = 2; i <= deep; i += 2) {
      bestScore = this.negamax(candidates, role, i, this.MIN, this.MAX);
      //// 每次迭代剔除必败点，直到没有必败点或者只剩最后一个点
      //// 实际上，由于必败点几乎都会被AB剪枝剪掉，因此这段代码几乎不会生效
      //var newCandidates = candidates.filter(function (d) {
      //  return !d.abcut
      //})
      //candidates = newCandidates.length ? newCandidates : [candidates[0]] // 必败了，随便走走

      if (commons.greatOrEqualThan(bestScore, SCORE.FIVE)) {
        break; // 能赢了
      }
      // 下面这样做，会导致上一层的分数，在这一层导致自己被剪枝的bug，因为我们的判断条件是 >=， 上次层搜到的分数，在更深一层搜索的时候，会因为满足 >= 的条件而把自己剪枝掉
      // if (littleThan(bestScore, T.THREE * 2)) bestScore = this.MIN // 如果能找到双三以上的棋，则保留bestScore做剪枝，否则直接设置为最小值
    }

    // 美化一下
    candidates = candidates.map((d) => {
      const r = new Piece(d.x, d.y, d.role);
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

    // 排序
    // 经过测试，这个如果放在上面的for循环中（就是每次迭代都排序），反而由于迭代深度太浅，排序不好反而会降低搜索速度。
    candidates.sort((a, b) => {
      a.score = a.score || 0;
      b.score = b.score || 0;
      a.step = a.step || 0;
      b.step = b.step || 0;
      if (commons.equal(a.score || 0, b.score || 0)) {
        // 大于零是优势，尽快获胜，因此取步数短的
        // 小于0是劣势，尽量拖延，因此取步数长的
        if ((a.score || 0) >= 0) {
          if (a.step !== b.step) {
            return a.step - b.step;
          } else {
            return b.score - a.score; // 否则 选取当前分最高的（直接评分)
          }
        } else {
          if (a.step !== b.step) {
            return b.step - a.step;
          } else {
            return b.score - a.score; // 否则 选取当前分最高的（直接评分)
          }
        }
      } else {
        return b.score - a.score;
      }
    });

    const result = candidates[0];
    result.min = Math.min.apply(Math, (result.steps || []).map((d) => d.score || 0));

    if (AI.log) {
      const time = (new Date().getTime() - this.start) / 1000;
      console.log(`选择节点: [${result.x}, ${result.y}], 分数: ${result.score.toFixed(3)}, 步数: ${result.step}, 最小值：${result.min}`);
      console.log(`搜索节点数: ${this.count}, ,AB剪枝次数: ${this.aBcut}, PV剪枝次数: ${this.pVcut}`);
      console.log(`搜索缓存: 总数 ${this.cacheCount}, 命中率 ${(this.cacheGet / this.cacheCount * 100).toFixed(3)}%, ${this.cacheGet}/${this.cacheCount}`);
      //注意，减掉的节点数实际远远不止 ABcut 个，因为减掉的节点的子节点都没算进去。实际 4W个节点的时候，剪掉了大概 16W个节点
      console.log(`当前统计: ${this.count}个节点, 耗时: ${time.toFixed(2)}s, NPS: ${Math.floor(this.count / time)}N/S`);
      console.log('===============统计表===============');
    }

    AI.debug && statistic.print(candidates);

    board.log();
    return result;
  };

  /**
   * this.MAX this.MIN 检索算法
   * @param data 查询需要的数据
   */
  search = (data: ISearch): IScore => {
    const { deep, alpha, beta, role, step, steps, spread } = data;
    AI.debug && board.logSteps();

    if (AI.cache) {
      const c = this.deepCache[zobrist.code || 0];
      if (c) {
        if (c.deep >= deep) { // 如果缓存中的结果搜索深度不比当前小，则结果完全可用
          this.cacheGet++;
          // 记得clone，因为这个分数会在搜索过程中被修改，会使缓存中的值不正确
          return {
            score: c.score.score,
            steps: steps,
            step: step + c.score.step,
            c: c,
            vct: 0,
            vcf: 0,
            abcut: 0
          };
        } else {
          // 如果缓存的结果中搜索深度比当前小，那么任何一方出现双三及以上结果的情况下可用
          // TODO: 只有这一个缓存策略是会导致开启缓存后会和以前的结果有一点点区别的，其他几种都是透明的缓存策略
          // TODO: 存疑这个位置的写法有待验证
          if (commons.greatOrEqualThan(c.score.score, SCORE.FOUR) ||
            commons.equalOrLessThan(c.score.score, -SCORE.FOUR)) {
            this.cacheGet++;
            return c.score;
          }
        }
      }
    }
    // 评估分数
    const _e = board.evaluate(role);

    const leaf: IScore = {
      score: _e,
      step: step,
      steps: steps
    };

    this.count++;
    const FIVE = SCORE.FIVE;
    // 搜索到底 或者已经胜利
    // 注意这里是小于0，而不是1，因为本次直接返回结果并没有下一步棋
    // deep为0循环结束，或者当前的分数有大于连五的分数
    if (deep <= 0 || commons.greatOrEqualThan(_e, FIVE) || commons.equalOrLessThan(_e, -FIVE)) {
      //// 经过测试，把算杀放在对子节点的搜索之后，比放在前面速度更快一些。
      //// vcf
      //// 自己没有形成活四，对面也没有形成活四，那么先尝试VCF
      //if(littleThan(_e, SCORE.FOUR) && greatThan(_e, SCORE.FOUR * -1)) {
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
      //} // vct
      //// 自己没有形成活三，对面也没有高于活三的棋型，那么尝试VCT
      //if(littleThan(_e, SCORE.THREE*2) && greatThan(_e, SCORE.THREE * -2)) {
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
      //}
      return leaf;
    }

    let best: IScore = {
      score: this.MIN,
      step: step,
      steps: steps
    };

    // 双方个下两个子之后，开启star spread 模式
    // 生成可以落子的点
    const points = board.gen(role, board.count > 10 ? step > 1 : step > 3, step > 1);

    if (!points.length) {
      return leaf;
    }

    AI.debug && console.log(`points: ${points.map((d) => `[${d.x}, ${d.y}]`).join(';')}`);
    AI.debug && console.log(`A~B: ${alpha}~${beta}`);

    let _alpha = alpha;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      board.put({ ...p, role: role });

      let _deep = deep - 1;

      let _spread = spread;

      if (_spread < AI.spreadLimit) {
        // 冲四延伸
        const scoreCom = p.scoreCom;
        const scoreHum = p.scoreHum;
        if ((role === ERole.com && scoreHum >= FIVE) || (role === ERole.hum && scoreCom >= FIVE)) {
          // _deep = deep+1
          _deep += 2;
          _spread++;
        }
        // 单步延伸策略：双三延伸
        //if ( (role == ERole.com && p.scoreCom >= SCORE.THREE * 2) || (role == ERole.hum && p.scoreHum >= SCORE.THREE*2)) {
        //  _deep = deep
        //  _spread ++
        //}
      }

      const _steps = cloneDeep(steps);
      _steps.push(p);
      const searchData = {
        deep: _deep,
        beta: -beta,
        alpha: -_alpha,
        role: commons.reverseRole(role),
        step: step + 1,
        steps: _steps,
        spread: _spread
      };
      const v = this.search(searchData);
      v.score *= -1;
      board.remove(p);

      // 注意，这里决定了剪枝时使用的值必须比MAX小
      if (v.score > best.score) {
        best = v;
      }
      //TODO 有很大的问题，这个地方的赋值没找到在那里使用的
      _alpha = Math.max(best.score, _alpha);
      // AB 剪枝
      // 这里不要直接返回原来的值，因为这样上一层会以为就是这个分，实际上这个节点直接剪掉就好了，根本不用考虑，也就是直接给一个很大的值让他被减掉
      // 这样会导致一些差不多的节点都被剪掉，但是没关系，不影响棋力
      // 一定要注意，这里必须是 greatThan 即 明显大于，而不是 commons.greatOrEqualThan 不然会出现很多差不多的有用分支被剪掉，会出现致命错误
      if (commons.greatOrEqualThan(v.score, beta)) {
        AI.debug && console.log(`AB Cut [${p.x}, ${p.y}]${v.score} >= ${beta}`);
        this.aBcut++;
        v.score = this.MAX - 1; // 被剪枝的，直接用一个极大值来记录，但是注意必须比MAX小
        v.abcut = 1; // 剪枝标记
        // cache(deep, v) // 别缓存被剪枝的，而且，这个返回到上层之后，也注意都不要缓存
        return v;
      }
    }

    this.cache(deep, best);

    //console.log('end: role:' + role + ', deep:' + deep + ', best: ' + best)
    return best;
  };

  cache = (deep: number, score: IScore) => {
    if (!AI.cache) {
      return false;
    }
    if (score.abcut) {
      return false; // 被剪枝的不要缓存哦，因为分数是一个极值
    }
    // 记得clone，因为score在搜索的时候可能会被改的，这里要clone一个新的
    this.deepCache[zobrist.code || 0] = {
      deep: deep,
      score: {
        score: score.score,
        steps: score.steps,
        step: score.step
      },
      board: board.toString()
    };
    // AI.debug && console.log('add cache[' + board.zobrist.code + ']', obj)
    this.cacheCount++;
  };
}

export const negamax = new Negamax();
