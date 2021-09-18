import { ERole } from '../../services/gobang-worker/interfaces/role.interface';
import { IPiece } from '../../services/gobang-worker/interfaces/piece.interface';

export interface IGameStatus {
  gameType: GameType;
  name: string; // 棋局的名称
  board: IPiece[][];
  winMap: IPiece[];
  first: ERole;
  steps: number;
  winning: ERole;
  piece: IPiece; // 当前的落子
  spendTime: number; // 两次put之间消耗的时间
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
  name?: string;
  winning?: ERole;
  winMap?: IPiece[];
}

export interface IGamePut {
  gameType: GameType;
  piece: IPiece;
}

export interface SagaAction<P> {
  type: string;
  payload: P;
}
