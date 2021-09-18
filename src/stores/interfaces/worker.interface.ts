import { IPiece } from '../../services/gobang-worker/interfaces/piece.interface';
import { ERole } from '../../services/gobang-worker/interfaces/role.interface';
import { IBoard } from '../../services/gobang-worker/interfaces/board.interface';

/**
 * worker 的返回值
 */
export interface IWorkerResponse {
  type: WorkerType;
  payload: IWRStart | IWRPut | IWRBackward | IWRForward;
}

/**
 * 游戏启动的返回值的 payload
 */
export interface IWRStart extends IBoard {
  first: ERole;
}

/**
 * 游戏落子的返回值的 payload
 */
export interface IWRPut {
  piece: IPiece;
}

/**
 * 游戏悔棋的的返回值的 payload
 */
export interface IWRBackward extends IBoard {
  backward: boolean;
}

/**
 * 游戏返回上一步的的返回值的 payload
 */
export interface IWRForward extends IBoard {
  forward: boolean;
}

export enum WorkerType {
  GO,
  PUT,
  START,
  BEGIN,
  BOARD,
  CONFIG,
  FORWARD,
  BACKWARD
}
