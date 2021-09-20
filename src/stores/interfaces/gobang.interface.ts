import { ERole } from '../../services/gobang-worker/interfaces/role.interface';
import { IPiece } from '../../services/gobang-worker/interfaces/piece.interface';
import { IBoard } from '../../services/gobang-worker/interfaces/board.interface';
import { IStartOpen } from '../../services/gobang-worker/interfaces/opens.interface';

export interface IGameStatus {
  gameType: GameType;
  name: string; // 棋局的名称
  board: IPiece[][];
  winMap: IPiece[];
  playChess: ERole;
  steps: number;
  winning: ERole;
  piece: IPiece; // 当前的落子
  spendTime: number; // 两次put之间消耗的时间
}

export enum GameType {
  DUEL_READY,
  DUEL_BLOCK,
  DUEL_WHITE,
  DUEL_FINISH
}

export interface IGameChange {
  gameType: GameType;
  playChess?: ERole;
  board?: IPiece[][];
  name?: string;
  winning?: ERole;
  winMap?: IPiece[];
}

export interface IGamePut {
  gameType: GameType;
  piece: IPiece;
}

export interface IGameStart extends IStartOpen {
  first: boolean;
  open: boolean;
}

export interface SagaAction<P> {
  type: string;
  payload: P;
}
