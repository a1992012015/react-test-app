import { ERole } from './role.interface';

export interface IPiece {
  x: number; // 横轴 二维数组的第二层的坐标
  y: number; // 竖轴 二维数组的第一层坐标
  role: ERole; // 这颗棋子是属于那个选手
  step: number; // 当前是第几步
  score: number; // 这颗棋子的分数
  steps: IPiece[]; // 这颗棋子的所有走法。会根据剪枝的结果和分数选取走法
  abCut: boolean; // 是否是被剪掉的分支
  vct: number;
  vcf: number;
  min: number;
  scoreHum: number;
  scoreCom: number;
  data?: IScore;
}

export interface IScore {
  score: number; // 这一步的分数
  step: number; // 走了几步
  steps: IPiece[]; // 这几步的落子
  optional?: IPiece[]; // 可以选这的落子位置评分之后的
  abCut?: number; // 被剪掉的分支
  vct?: number;
  vcf?: number;
  c?: ICacheBoard;
}

export interface IScore1 {
  score: number; // 这一步的分数
  step: number; // 走了几步
  steps: IPiece[]; // 这几步的落子
  optional: IPiece[]; // 可以选这的落子位置评分之后的
  abCut: number; // 被剪掉的分支
}

export interface ICacheBoard {
  deep: number;
  score: IScore;
  board: string;
}
