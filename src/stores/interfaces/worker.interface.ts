import { IPiece } from '../../services/gobang-worker/interfaces/piece.interface';
import { IBoard } from '../../services/gobang-worker/interfaces/board.interface';
import { IStartOpen } from '../../services/gobang-worker/interfaces/opens.interface';

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
export interface IWRStart extends IStartOpen {
  first: boolean;
  open: boolean;
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
