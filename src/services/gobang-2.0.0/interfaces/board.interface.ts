import { IPiece } from './piece.interface';

/**
 * 棋盘的所有棋子
 * 必须是 15 * 15 的二维数组
 */
export interface IOpenBoard {
  name: string;
  board: IPiece[][];
}

/**
 * 打分函数的返回结果
 */
export interface IEvaluate {
  evaluate: number;
}

/**
 * 当前棋盘分数的分组
 */
export interface IScoreElement {
  attackPoints: IPiece[]; // 进攻点 双星延伸需要
  defendPoints: IPiece[]; // 防守点 双星延伸需要
  fives: IPiece[]; // 五连
  firstFours: IPiece[]; // 当前role的活四
  backFours: IPiece[]; // 另一role的活四
  firstBlockedFours: IPiece[]; // 当前role的眠四
  backBlockedFours: IPiece[]; // 另一role的眠四
  firstTwoThrees: IPiece[]; // 当前role的双三
  backTwoThrees: IPiece[]; // 另一role的双三
  firstThrees: IPiece[]; // 当前role的活三
  backThrees: IPiece[]; // 另一role的活三
  firstTwos: IPiece[]; // 当前role的活二
  backTwos: IPiece[]; // 另一role的活二
  neighbors: IPiece[]; // 相邻的棋子
}
