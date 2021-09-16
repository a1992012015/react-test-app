import { ERole } from '../../services/go-bang-worker/interfaces/role.interface';
import { IPiece } from '../../services/go-bang-worker/interfaces/piece.interface';

export interface IGameStatus {
  gameType: GameType;
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
  first: ERole;
  board: IPiece[][];
}

export interface IGamePut {
  gameType: GameType;
  piece: IPiece;
}

export interface SagaAction<D> {
  payload: D;
}
