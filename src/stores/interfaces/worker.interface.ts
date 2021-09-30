import { IPiece } from '../../services/gobang-2.0.0/interfaces/piece.interface';
import { IOpenBoard } from '../../services/gobang-2.0.0/interfaces/board.interface';
import { IStartOpen } from '../../services/gobang-2.0.0/interfaces/gobang-ai.interface';

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
export interface IWRBackward extends IOpenBoard {
  backward: boolean;
}

/**
 * 游戏返回上一步的的返回值的 payload
 */
export interface IWRForward extends IOpenBoard {
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
