import { WorkerType } from '../../../stores/interfaces/worker.interface';
import { IPiece } from './piece.interface';
import { IAI } from './ai.interface';

/**
 * worker 的返回值
 */
export interface IWorkerRequest {
  type: WorkerType;
  payload?: IWRStart | IWRPut | IWRConfig;
}

/**
 * 启动游戏的返回值
 */
export interface IWRStart {
  first: boolean;
  randomOpening: boolean;
}

/**
 * 落子的返回值
 */
export interface IWRPut {
  piece: IPiece;
}

/**
 * 设置config的返回值
 */
export interface IWRConfig {
  config: IAI;
}
