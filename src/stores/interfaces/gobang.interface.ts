import { ERole } from '../../services/gobang-worker/interfaces/role.interface';
import { IPiece } from '../../services/gobang-worker/interfaces/piece.interface';

export interface IGameStatus {
  gameType: GameType;
  board: IPiece[][];
  winMap: IPiece[];
  first: ERole;
  steps: number;
  winning: ERole;
  piece: IPiece; // 当前的落子
  spendTime: number; // 两次put之间消耗的时间
  gameStatus: IGameStatus[]; // 储存所有的state状态
  forwardStatus: IGameStatus[]; // 储存所有悔棋的的state状态，会在任意落子的时候清掉
}

export enum GameType {
  DUEL_READY,
  DUEL_HUM,
  DUEL_COM,
  DUEL_FINISH
}

export interface IGameStart {
  gameType: GameType;
  first?: ERole;
  board?: IPiece[][];
}

export interface IGamePut {
  gameType: GameType;
  piece: IPiece;
  winMap: IPiece[];
}

export interface SagaAction<D> {
  payload: D;
}