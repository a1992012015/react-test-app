import { IOpen } from '../interfaces/opens.interface';
import { commons } from '../services/commons.service';

export const opens: IOpen[] = [];

export const wuyue: IOpen = {
  name: '无月',
  pieces: commons.getOpenBoard()
};

// 疏
// opens.shuyue[5][5] = 1;
opens.push({
  name: '疏月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [5, 5]
  ])
});

// 溪
// opens.xiyue[5][6] = 1;
opens.push({
  name: '溪月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [5, 6]
  ])
});

// 寒
// opens.hanyue[5][7] = 1;
opens.push({
  name: '寒月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [5, 7]
  ])
});

// 残
// opens.canyue[6][5] = 1;
opens.push({
  name: '残月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [6, 5]
  ])
});

// 花
// opens.huayue[6][6] = 1;
opens.push({
  name: '花月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [6, 6]
  ])
});

// 金
// opens.jinyue[7][5] = 1;
opens.push({
  name: '金月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [7, 5]
  ])
});

// 雨
// opens.yuyue[7][6] = 1;
opens.push({
  name: '雨月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [7, 8]
  ])
});

// 新
// opens.xinyue[8][5] = 1;
opens.push({
  name: '新月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [8, 5]
  ])
});

// 丘
// opens.qiuyue[8][6] = 1;
opens.push({
  name: '丘月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [8, 6]
  ])
});

// 松
// opens.songyue[8][7] = 1;
opens.push({
  name: '松月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [8, 7]
  ])
});

// 游
// opens.youyue[9][5] = 1;
opens.push({
  name: '游月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [9, 5]
  ])
});

// 山
// opens.shanyue[9][6] = 1;
opens.push({
  name: '山月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [9, 6]
  ])
});

// 瑞
// opens.ruiyue[9][7] = 1;
opens.push({
  name: '瑞月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 7], [9, 7]
  ])
});

// commons.getOpenBoard = function () {
//   return [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//   ];
// };

// 流
// opens.liuyue[5][5] = 1;
opens.push({
  name: '流月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [5, 5]
  ])
});

// 水
// opens.shuiyue[5][6] = 1;
opens.push({
  name: '水月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [5, 6]
  ])
});

// 恒
// opens.hengyue[5][7] = 1;
opens.push({
  name: '恒月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [5, 7]
  ])
});

// 峡
// opens.xiayue[5][8] = 1;
opens.push({
  name: '峡月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [5, 8]
  ])
});

// 长
// opens.changyue[5][9] = 1;
opens.push({
  name: '长月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [5, 9]
  ])
});

// 岚
// opens.lanyue[6][5] = 1;
opens.push({
  name: '岚月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [6, 5]
  ])
});

// 浦
// opens.puyue[6][6] = 1;
opens.push({
  name: '浦月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [6, 6]
  ])
});

// 云
// opens.yunyue[6][7] = 1;
opens.push({
  name: '云月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [6, 7]
  ])
});

// 明
// opens.mingyue[7][5] = 1;
opens.push({
  name: '明月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [7, 5]
  ])
});

// 银
// opens.yinyue[7][6] = 1;
opens.push({
  name: '银月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [7, 6]
  ])
});

// 名
// opens.ming2yue[8][5] = 1;
opens.push({
  name: '名月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [8, 5]
  ])
});

// 斜
// opens.xieyue[8][6] = 1;
opens.push({
  name: '斜月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [8, 6]
  ])
});

// 慧
// opens.huiyue[9][5] = 1;
opens.push({
  name: '慧月',
  pieces: commons.getOpenBoard([
    [7, 7], [6, 8], [9, 5]
  ])
});
