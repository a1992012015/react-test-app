/*
 * 算杀
 * 算杀的原理和极大极小值搜索是一样的
 * 不过算杀只考虑冲四活三这类对方必须防守的棋
 * 因此算杀的复杂度虽然是 M^N ，但是底数M特别小，可以算到16步以上的杀棋。
 * VCT 连续活三胜
 * VCF 连续冲四胜利
 */

/*
 * 基本思路
 * 电脑有活三或者冲四，认为是玩家必须防守的
 * 玩家防守的时候却不一定根据电脑的棋来走，而是选择走自己最好的棋，比如有可能是自己选择冲四
 */

import { aiRole } from '../configs/ai-role';
import { SCORE } from '../configs/score';
import { aiConfig } from '../configs/ai-config';
import board from '../services/board';
import zobrist from '../services/zobrist';
import debug from './debug';
import W from './neighbor';
import { Piece, Role } from '../interfaces/open-pants.interface';
import { DebugCache } from '../interfaces/debug.interface';

const Cache: DebugCache = {
  vct: {},
  vcf: {}
};

const debugCheckmate = debug.checkmate = {
  cacheCount: 0, // cache 总数
  totalCount: 0, // 算杀总数
  cacheHit: 0 // 缓存命中
};

let MAX_SCORE = SCORE.THREE;
let MIN_SCORE = SCORE.FOUR;

let debugNodeCount = 0;

let lastMaxPoint: Piece | undefined;
let lastMinPoint: Piece | undefined;

//找到所有比目标分数大的位置
//注意，不止要找自己的，还要找对面的，
const findMax = (role: Role, score: number): Piece[] => {
  const result = [],
    fives = [];
  for (let i = 0; i < board.board.length; i++) {
    for (let j = 0; j < board.board[i].length; j++) {
      if (board.board[i][j].role === aiRole.empty) {
        const p: Piece = { x: i, y: j, role: Role.empty }; // [i, j]

        // 注意，防一手对面冲四
        // 所以不管谁能连成五，先防一下。
        if ((board.humScore[p.x][p.y].score || 0) >= SCORE.FIVE) {
          p.score = SCORE.FIVE;
          if (role === aiRole.com) {
            p.score *= -1;
          }
          fives.push(p);
        } else if ((board.comScore[p.x][p.y].score || 0) >= SCORE.FIVE) {
          p.score = SCORE.FIVE;
          if (role === aiRole.hum) {
            p.score *= -1;
          }
          fives.push(p);
        } else {

          if ((!lastMaxPoint || (i === lastMaxPoint.x || j === lastMaxPoint.y ||
            (Math.abs(i - lastMaxPoint.x) === Math.abs(j - lastMaxPoint.y))))) {
            const s = (role === aiRole.com ?
              board.comScore[p.x][p.y].score :
              board.humScore[p.x][p.y].score) || 0;
            p.score = s;
            if (s >= score) {
              result.push(p);
            }
          }
        }
      }
    }
  }
  // 能连五，则直接返回
  // 但是注意不要碰到连五就返回，而是把所有连五的点都考虑一遍，不然可能出现自己能连却防守别人的问题
  if (fives.length) {
    return fives;
  }
  //注意对结果进行排序
  result.sort(function (a, b) {
    return (b.score || 0) - (a.score || 0);
  });
  return result;
};

// MIN层
//找到所有比目标分数大的位置
//这是MIN层，所以己方分数要变成负数
const findMin = (role: Role, score: number): Piece[] => {
  let result: Piece[] = [];
  const fives = [];
  const fours = [];
  const blockedfours = [];
  for (let i = 0; i < board.board.length; i++) {
    for (let j = 0; j < board.board[i].length; j++) {
      if (board.board[i][j].role === aiRole.empty) {
        const p: Piece = { x: i, y: j, role: Role.empty }; // [i, j]

        const s1 = (role === aiRole.com ?
          board.comScore[p.x][p.y].score :
          board.humScore[p.x][p.y].score) || 0;
        const s2 = (role === aiRole.com ?
          board.humScore[p.x][p.y].score :
          board.comScore[p.x][p.y].score) || 0;
        if (s1 >= SCORE.FIVE) {
          p.score = -s1;
          return [p];
        }

        if (s2 >= SCORE.FIVE) {
          p.score = s2;
          fives.push(p);
          continue;
        }

        if (s1 >= SCORE.FOUR) {
          p.score = -s1;
          fours.unshift(p);
          continue;
        }
        if (s2 >= SCORE.FOUR) {
          p.score = s2;
          fours.push(p);
          continue;
        }

        if (s1 >= SCORE.BLOCKED_FOUR) {
          p.score = -s1;
          blockedfours.unshift(p);
          continue;
        }
        if (s2 >= SCORE.BLOCKED_FOUR) {
          p.score = s2;
          blockedfours.push(p);
          continue;
        }

        if (s1 >= score || s2 >= score) {
          p.score = s1;
          result.push(p);
        }
      }
    }
  }
  if (fives.length) {
    return fives;
  }

  // 注意冲四，因为虽然冲四的分比活四低，但是他的防守优先级是和活四一样高的，否则会忽略冲四导致获胜的走法
  if (fours.length) {
    return fours.concat(blockedfours);
  }

  //注意对结果进行排序
  //因为fours可能不存在，这时候不要忽略了 blockedfours
  result = blockedfours.concat(result);
  result.sort((a, b) => Math.abs(b.score || 0) - Math.abs(a.score || 0));
  return result;
};

const max = (role: Role, deep: number): boolean | Piece[] => {
  debugNodeCount++;
  //board.logSteps();
  if (deep <= 1) {
    return false;
  }

  const points = findMax(role, MAX_SCORE);
  if (points.length && (points[0].score || 0) >= SCORE.FOUR) {
    return [points[0]]; //为了减少一层搜索，活四就行了。
  }

  if (points.length === 0) {
    return false;
  }

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    board.put(p, role);
    // 如果是防守对面的冲四，那么不用记下来
    // TODO 存疑这个位置写法有很大的错误
    // const flag = !(p.score || 0) ? 1 : 0;
    if ((p.score || 0) <= -SCORE.FIVE) {
      lastMaxPoint = p;
    }
    const m = min(aiRole.reverse(role), deep - 1);
    board.remove(p);
    if (m === true || m instanceof Array) {
      if (m instanceof Array) {
        m.unshift(p); //注意 unshift 方法返回的是新数组长度，而不是新数组本身
        return m;
      } else {
        return [p];
      }
    }
  }
  return false;
};

//只要有一种方式能防守住，就可以了
const min = (role: Role, deep: number): Piece[] | boolean => {
  debugNodeCount++;
  const w = W(board.board);
  const flag = w ? aiRole.com : aiRole.hum;
  //board.logSteps();
  if (flag === role) {
    return false;
  }
  if (flag === aiRole.reverse(role)) {
    return true;
  }
  if (deep <= 1) {
    return false;
  }
  const points = findMin(role, MIN_SCORE);
  if (points.length === 0) {
    return false;
  }
  if (points.length && -1 * (points[0].score || 0) >= SCORE.FOUR) {
    return false; //为了减少一层搜索，活四就行了。
  }

  const cands: Piece[][] = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    board.put(p, role);
    // lastMinPoint = p;
    const m = max(aiRole.reverse(role), deep - 1);
    board.remove(p);
    if (m instanceof Array) {
      m.unshift(p);
      cands.push(m);
    } else {
      return false; //只要有一种能防守住
    }
  }
  //无法防守住
  return cands[Math.floor(cands.length * Math.random())];
};

const cache = (result: Piece | boolean, vcf: boolean = false) => {
  if (!aiConfig.cache) {
    return;
  }

  if (vcf) {
    Cache.vcf[zobrist.code] = result;
  } else {
    Cache.vct[zobrist.code] = result;
  }
  debugCheckmate.cacheCount++;
};

const getCache = (vcf: boolean = false) => {
  if (!aiConfig.cache) {
    return;
  }
  debugCheckmate.totalCount++;

  let result;
  if (vcf) {
    result = Cache.vcf[zobrist.code];
  } else {
    result = Cache.vct[zobrist.code];
  }
  if (result) {
    debugCheckmate.cacheHit++;
  }
  return result;
};

//迭代加深
const deeping = (role: Role, deep: number): Piece | boolean => {
  const start = +new Date();
  debugNodeCount = 0;
  let result: boolean | Piece[] = false;
  for (let i = 1; i <= deep; i++) {
    lastMaxPoint = undefined;
    // lastMinPoint = undefined;
    result = max(role, i);
    if (result) {
      break; //找到一个就行
    }
  }

  const time = Math.round(+new Date() - start);
  if (result) {
    aiConfig.log &&
    console.log('算杀成功(' + time + '毫秒, ' + debugNodeCount + '个节点):' + JSON.stringify(result));
  } else {
    console.log('算杀失败(' + time + '毫秒)');
  }

  return result instanceof Array ? result[0] : result;
};

const vcx = (role: Role, deep: number, onlyFour: boolean) : Piece | boolean => {
  deep = deep === undefined ? aiConfig.vcxDeep : deep;

  if (deep <= 0) {
    return false;
  }

  if (onlyFour) {
    //计算冲四赢的
    MAX_SCORE = SCORE.BLOCKED_FOUR;
    MIN_SCORE = SCORE.FIVE;

    const result = deeping(role, deep);
    if (typeof result !== 'boolean') {
      result.score = SCORE.FOUR;
      return result;
    }

    return false;
  } else {
    //计算通过 活三 赢的；
    MAX_SCORE = SCORE.THREE;
    MIN_SCORE = SCORE.BLOCKED_FOUR;

    const result = deeping(role, deep);
    if (typeof result !== 'boolean') {
      result.score = SCORE.THREE * 2; //连续冲三赢，就等于是双三
    }

    return result;
  }
};

// 连续冲四
const vcf = (role: Role, deep: number) => {
  const c = getCache(true);
  if (c) {
    return c;
  }
  const result = vcx(role, deep, true);
  cache(result, true);
  return result;
};

// 连续活三
const vct = (role: Role, deep: number) => {
  const c = getCache();
  if (c)  {
    return c;
  }
  const result = vcx(role, deep, false);
  cache(result);
  return result;
};

export {
  vct,
  vcf
};
