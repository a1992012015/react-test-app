import { OpenPantsInterface, Piece, Role } from '../interfaces/open-pants.interface';

const getBoard = (points: number[][] = []): Piece[][] => {
  const boards: Piece[][] = [];

  for (let y = 0; y < 15; y++) {
    const row: Piece[] = [];
    for (let x = 0; x < 15; x++) {
      row.push({ x, y, role: Role.empty });
    }
    boards.push(row);
  }

  points.forEach(([x, y], index) => {
    boards.forEach((board) => {
      board.forEach((piece) => {
        if (piece.x === x && piece.y === y) {
          piece.role = index % 2 === 0 ? Role.com : Role.hum;
        }
      });
    });
  });

  return boards;
};

const open26: OpenPantsInterface[] = [];

// 疏
// open26.shuyue[5][5] = 1;
open26.push({
  name: '疏月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [5, 5]
  ])
});

// 溪
// open26.xiyue[5][6] = 1;
open26.push({
  name: '溪月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [5, 6]
  ])
});

// 寒
// open26.hanyue[5][7] = 1;
open26.push({
  name: '寒月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [5, 7]
  ])
});

// 残
// open26.canyue[6][5] = 1;
open26.push({
  name: '残月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [6, 5]
  ])
});

// 花
// open26.huayue[6][6] = 1;
open26.push({
  name: '花月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [6, 6]
  ])
});

// 金
// open26.jinyue[7][5] = 1;
open26.push({
  name: '金月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [7, 5]
  ])
});

// 雨
// open26.yuyue[7][6] = 1;
open26.push({
  name: '雨月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [7, 8]
  ])
});

// 新
// open26.xinyue[8][5] = 1;
open26.push({
  name: '新月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [8, 5]
  ])
});

// 丘
// open26.qiuyue[8][6] = 1;
open26.push({
  name: '丘月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [8, 6]
  ])
});

// 松
// open26.songyue[8][7] = 1;
open26.push({
  name: '松月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [8, 7]
  ])
});

// 游
// open26.youyue[9][5] = 1;
open26.push({
  name: '游月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [9, 5]
  ])
});

// 山
// open26.shanyue[9][6] = 1;
open26.push({
  name: '山月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [9, 6]
  ])
});

// 瑞
// open26.ruiyue[9][7] = 1;
open26.push({
  name: '瑞月',
  checkerboard: getBoard([
    [7, 7],
    [6, 7],
    [9, 7]
  ])
});

// getBoard = function () {
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
// open26.liuyue[5][5] = 1;
open26.push({
  name: '流月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [5, 5]
  ])
});

// 水
// open26.shuiyue[5][6] = 1;
open26.push({
  name: '水月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [5, 6]
  ])
});

// 恒
// open26.hengyue[5][7] = 1;
open26.push({
  name: '恒月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [5, 7]
  ])
});

// 峡
// open26.xiayue[5][8] = 1;
open26.push({
  name: '峡月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [5, 8]
  ])
});

// 长
// open26.changyue[5][9] = 1;
open26.push({
  name: '长月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [5, 9]
  ])
});

// 岚
// open26.lanyue[6][5] = 1;
open26.push({
  name: '岚月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [6, 5]
  ])
});

// 浦
// open26.puyue[6][6] = 1;
open26.push({
  name: '浦月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [6, 6]
  ])
});

// 云
// open26.yunyue[6][7] = 1;
open26.push({
  name: '云月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [6, 7]
  ])
});

// 明
// open26.mingyue[7][5] = 1;
open26.push({
  name: '明月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [7, 5]
  ])
});

// 银
// open26.yinyue[7][6] = 1;
open26.push({
  name: '银月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [7, 6]
  ])
});

// 名
// open26.ming2yue[8][5] = 1;
open26.push({
  name: '名月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [8, 5]
  ])
});

// 斜
// open26.xieyue[8][6] = 1;
open26.push({
  name: '斜月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [8, 6]
  ])
});

// 慧
// open26.huiyue[9][5] = 1;
open26.push({
  name: '慧月',
  checkerboard: getBoard([
    [7, 7],
    [6, 8],
    [9, 5]
  ])
});

const open1 = getBoard([[7, 7]]);

export { open26, open1, getBoard };
