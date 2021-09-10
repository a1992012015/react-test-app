import { Piece, Role } from '../../services/go-bang-ai/interfaces/open-pants.interface';

export interface GameStatus {
  gameType: GameType;
  board: Piece[][];
  winMap: Piece[]
  steps: number;
  winning: Role;
}

export enum GameType {
  DUEL_READY,
  DUEL_HUM,
  DUEL_COM,
  DUEL_COM_THINK,
  DUEL_COM_RESULT,
  DUEL_FINISH,
}

export interface GameStart {
  first: GameType;
  board: Piece[][];
}
