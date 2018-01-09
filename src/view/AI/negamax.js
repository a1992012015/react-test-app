import R from "./role";
import SCORE from "./score";
import math from "./math";
import checkmateFast from "./checkmate-fast";
import config from "./config";
import debug from "./debug";
import board from "./board";

let T = SCORE;
let MAX = SCORE.FIVE * 10;
let MIN = -1 * MAX;

let total = 0, //总节点数
    steps = 0, //总步数
    count, //每次思考的节点数
    PVcut,
    ABcut, //AB剪枝次数
    cacheCount = 0, //zobrist缓存节点数
    cacheGet = 0; //zobrist缓存命中数量

let Cache = {};

let checkmateDeep = config.checkmateDeep;

/*
 * max min search
 * white is max, black is min
 */

let maxmin = function(deep, _checkmateDeep) {
    let best = MIN;
    let points = board.gen();
    let bestPoints = [];
    console.log(points);
    count = 0;
    ABcut = 0;
    PVcut = 0;
    checkmateDeep = (_checkmateDeep == undefined ? checkmateDeep : _checkmateDeep);

    for(let i = 0; i < points.length; i++) {
        let p = points[i];
        board.put(p, R.com);
        let v = -max(deep - 1, -MAX, -best, R.hum);

        //边缘棋子的话，要把分数打折，避免电脑总喜欢往边上走
        if(p[0] < 3 || p[0] > 11 || p[1] < 3 || p[1] > 11) {
            v = .5 * v;
        }

        //console.log(v, p);
        //如果跟之前的一个好，则把当前位子加入待选位子
        if(math.equal(v, best)) {
            bestPoints.push(p);
        }
        //找到一个更好的分，就把以前存的位子全部清除
        if(math.greatThan(v, best)) {
            best = v;
            bestPoints = [];
            bestPoints.push(p);
        }

        board.remove(p);
    }
    console.log("分数:" + best.toFixed(3) + ", 待选节点:" + JSON.stringify(bestPoints));
    let result = bestPoints[Math.floor(bestPoints.length * Math.random())];
    result.score = best;
    steps++;
    total += count;
    console.log('搜索节点数:' + count + ',AB剪枝次数:' + ABcut + ', PV剪枝次数:' + PVcut + ', 缓存命中:' + (cacheGet / cacheCount).toFixed(3) + ',' + cacheGet + '/' + cacheCount + ',算杀缓存命中:' + (debug.checkmate.cacheGet / debug.checkmate.cacheCount).toFixed(3) + ',' + debug.checkmate.cacheGet + '/' + debug.checkmate.cacheCount); //注意，减掉的节点数实际远远不止 ABcut 个，因为减掉的节点的子节点都没算进去。实际 4W个节点的时候，剪掉了大概 16W个节点
    console.log('当前统计：总共' + steps + '步, ' + total + '个节点, 平均每一步' + Math.round(total / steps) + '个节点');
    console.log("================================");
    return result;
};

let max = function(deep, alpha, beta, role) {

    if(config.cache) {
        let c = Cache[board.zobrist.code];
        if(c) {
            if(c.deep >= deep) {
                cacheGet++;
                return c.score;
            }
        }
    }

    let v = board.evaluate(role);
    count++;
    if(deep <= 0 || math.greatOrEqualThan(v, T.FIVE)) {
        return v;
    }

    let best = MIN;
    let points = board.gen();

    for(let i = 0; i < points.length; i++) {
        let p = points[i];
        board.put(p, role);

        let v = -max(deep - 1, -beta, -1 * (best > alpha ? best : alpha), R.reverse(role)) * config.deepDecrease;
        board.remove(p);

        if(math.greatThan(v, best)) {
            best = v;
        }
        if(math.greatOrEqualThan(v, beta)) { //AB 剪枝
            ABcut++;
            cache(deep, v);
            return v;
        }
    }
    if((deep == 2 || deep == 3) && math.littleThan(best, SCORE.THREE * 2) && math.greatThan(best, SCORE.THREE * -1)) {
        //let mate = checkmate(role, checkmateDeep);
        let mate = checkmateFast(board.board, role, checkmateDeep);
        if(mate) {
            let score = mate.score * Math.pow(.8, mate.length) * (role === R.com ? 1 : -1);
            cache(deep, score);
            return score;
        }
    }
    cache(deep, best);

    return best;
};

let cache = function(deep, score) {
    if(!config.cache) return;
    Cache[board.zobrist.code] = {
        deep: deep,
        score: score
    };
    cacheCount++;
};

let deeping = function(deep) {
    deep = deep === undefined ? config.searchDeep : deep;
    //迭代加深
    //注意这里不要比较分数的大小，因为深度越低算出来的分数越不靠谱，所以不能比较大小，而是是最高层的搜索分数为准
    let result;
    for(let i = 2; i <= deep; i += 2) {
        result = maxmin(i);
        if(math.greatOrEqualThan(result.score, SCORE.FOUR)) return result;
    }
    return result;
};

export default deeping;