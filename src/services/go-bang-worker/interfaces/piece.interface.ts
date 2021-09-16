import { ERole } from './role.interface';

export interface IPiece {
  x: number; // 横轴 二维数组的第二层的坐标
  y: number; // 竖轴 二维数组的第一层坐标
  role: ERole; // 这颗棋子是属于那个选手
  step: number; // 当前是第几步
  score: number; // 这颗棋子的分数
  steps: IPiece[]; // 这颗棋子的所有走法。会根据剪枝的结果和分数选取走法
  abCut: boolean;
  scoreHum: number;
  scoreCom: number;
}
