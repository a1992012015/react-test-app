import { ERole } from './role.interface';

/**
 * 每一颗棋子的对象
 */
export interface IPiece {
  x: number; // 横轴 二维数组的第二层的坐标
  y: number; // 竖轴 二维数组的第一层坐标
  role: ERole; // 这颗棋子是属于那个选手
  step: number; // 当前是第几步
  score: number; // 这颗棋子的分数
  steps: IPiece[]; // 这颗棋子的所有走法。会根据剪枝的结果和分数选取走法
  endgame: ERole[][]; // 当前的局势分布
  abCut: boolean;
  scoreHum: number; // 在这里记录的是当前局势的玩家的分数
  scoreCom: number; // 在这里记录的是当前局势的电脑的分数
}

/**
 * 重新构成Piece的定义，在创建的时候x y role是必须的参数
 */
export interface ICreatPiece extends Partial<IPiece> {
  x: number;
  y: number;
  role: ERole;
}
