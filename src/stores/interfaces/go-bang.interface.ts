import { ERole } from '../../services/go-bang-worker/interfaces/role.interface';
import { IPiece } from '../../services/go-bang-worker/interfaces/piece.interface';

export interface IGameStatus {
  gameType: GameType;
  board: IPiece[][];
  winMap: IPiece[];
  first: ERole;
  steps: number;
  winning: ERole;
}

export enum GameType {
  DUEL_READY,
  DUEL_HUM,
  DUEL_COM,
  DUEL_COM_THINK,
  DUEL_COM_RESULT,
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
