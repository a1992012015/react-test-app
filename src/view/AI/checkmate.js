import R from "./role";
import hasNeighbor from "./neighbor";
import S from "./dup";
import W from "./neighbor";
import config from "./win";
import zobrist from "./zobrist";
import debug from "./debug";
import board from "./board";


/*
 * 算杀
 * 算杀的原理和极大极小值搜索是一样的
 * 不过算杀只考虑冲四活三这类对方必须防守的棋
 * 因此算杀的复杂度虽然是 M^N ，但是底数M特别小，可以算到16步以上的杀棋。
 */

/*
 * 基本思路
 * 电脑有活三或者冲四，认为是玩家必须防守的
 * 玩家防守的时候却不一定根据电脑的棋来走，而是选择走自己最好的棋，比如有可能是自己选择冲四
 */

let Cache = {};

let debugNodeCount = 0;

let MAX_SCORE = S.THREE;
let MIN_SCORE = S.FOUR;

let debugCheckmate = debug.checkmate = {
    cacheCount: 0,
    cacheGet: 0
};

//找到所有比目标分数大的位置
let findMax = function (role, score) {
    let result = [];
    for (let i = 0; i < board.board.length; i++) {
        for (let j = 0; j < board.board[i].length; j++) {
            if (board.board[i][j] == R.empty) {
                let p = [i, j];
                if (hasNeighbor(board.board, p, 2, 1)) { //必须是有邻居的才行

                    let s = (role == R.com ? board.comScore[p[0]][p[1]] : board.humScore[p[0]][p[1]]);
                    p.score = s;
                    if (s >= S.FIVE) {
                        return [p];
                    }
                    if (s >= score) {
                        result.push(p);
                    }
                }
            }
        }
    }
    //注意对结果进行排序
    result.sort(function (a, b) {
        return b.score - a.score;
    });
    return result;
};

//找到所有比目标分数大的位置
let findMin = function (role, score) {
    let result = [];
    let fives = [];
    let fours = [];
    for (let i = 0; i < board.board.length; i++) {
        for (let j = 0; j < board.board[i].length; j++) {
            if (board.board[i][j] == R.empty) {
                let p = [i, j];
                if (hasNeighbor(board.board, p, 2, 1)) { //必须是有邻居的才行

                    let s1 = (role == R.com ? board.comScore[p[0]][p[1]] : board.humScore[p[0]][p[1]]);
                    let s2 = (role == R.com ? board.humScore[p[0]][p[1]] : board.comScore[p[0]][p[1]]);
                    if (s1 >= S.FIVE) {
                        p.score = -s1;
                        return [p];
                    }
                    if (s1 >= S.FOUR) {
                        p.score = -s1;
                        fours.unshift(p);
                        continue;
                    }
                    if (s2 >= S.FIVE) {
                        p.score = s2;
                        fives.push(p);
                        continue;
                    }
                    if (s2 >= S.FOUR) {
                        p.score = s2;
                        fours.push(p);
                        continue;
                    }

                    if (s1 >= score || s2 >= score) {
                        p = [i, j];
                        p.score = s1;
                        result.push(p);
                    }
                }
            }
        }
    }
    if (fives.length) return [fives[0]];
    if (fours.length) return [fours[0]];
    //注意对结果进行排序
    result.sort(function (a, b) {
        return Math.abs(b.score) - Math.abs(a.score);
    });
    return result;
};

let max = function (role, deep) {
    debugNodeCount++;
    if (deep <= 0) return false;

    if (config.cache) {
        let c = Cache[zobrist.code];
        if (c) {
            if (c.deep >= deep || c.result !== false) {
                debugCheckmate.cacheGet++;
                return c.result;
            }
        }
    }

    let points = findMax(role, MAX_SCORE);
    if (points.length && points[0].score >= S.FOUR) return [points[0]]; //为了减少一层搜索，活四就行了。
    if (points.length == 0) return false;
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        board.put(p, role);
        let m = min(role, deep - 1);
        board.remove(p);
        if (m) {
            if (m.length) {
                m.unshift(p); //注意 unshift 方法返回的是新数组长度，而不是新数组本身
                cache(deep, m);
                return m;
            } else {
                cache(deep, [p]);
                return [p];
            }
        }
    }
    cache(deep, false);
    return false;
};

//只要有一种方式能防守住，就可以了
let min = function (role, deep) {
    debugNodeCount++;
    let w = W(board.board);
    if (w == role) return true;
    if (w == R.reverse(role)) return false;
    if (deep <= 0) return false;
    if (config.cache) {
        let c = Cache[zobrist.code];
        if (c) {
            if (c.deep >= deep || c.result !== false) {
                debugCheckmate.cacheGet++;
                return c.result;
            }
        }
    }
    let points = findMin(R.reverse(role), MIN_SCORE);
    if (points.length == 0) return false;
    if (points.length && -1 * points[0].score >= S.FOUR) return false; //为了减少一层搜索，活四就行了。

    let cands = [];
    let currentRole = R.reverse(role);
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        board.put(p, currentRole);
        let m = max(role, deep - 1);
        board.remove(p);
        if (m) {
            m.unshift(p);
            cands.push(m);
            cache(deep, m);
            continue;
        } else {
            cache(deep, false);
            return false; //只要有一种能防守住
        }
    }
    let result = cands[Math.floor(cands.length * Math.random())]; //无法防守住
    cache(deep, result);
    return result;
};

let cache = function (deep, result) {
    if (!config.cache) return;
    Cache[zobrist.code] = {
        deep: deep,
        result: result
    };
    debugCheckmate.cacheCount++;
};

//迭代加深
let deeping = function (role, deep) {
    let start = new Date();
    let debugNodeCount = 0;
    let result;
    for (let i = 1; i <= deep; i++) {
        result = max(role, i);
        if (result) break; //找到一个就行
    }
    let time = Math.round(new Date() - start);
    if (result) {
        console.log("算杀成功(" + time + "毫秒, " + debugNodeCount + "个节点):" + JSON.stringify(result))
    }else {
        console.log("算杀失败("+time+"毫秒)");
    }
    return result;
};

export default function (role, deep, onlyFour) {

    deep = deep || config.checkmateDeep;
    if (deep <= 0) return false;

    //先计算冲四赢的
    MAX_SCORE = S.FOUR;
    MIN_SCORE = S.FIVE;

    let result = deeping(role, deep);
    if (result) {
        result.score = S.FOUR;
        return result;
    }

    if (onlyFour) return false; //只计算冲四

    //再计算通过 活三 赢的；
    MAX_SCORE = S.THREE;
    MIN_SCORE = S.FOUR;
    result = deeping(role, deep);
    if (result) {
        result.score = S.THREE * 2; //虽然不如活四分数高，但是还是比活三分数要高的
    }

    return result;

}