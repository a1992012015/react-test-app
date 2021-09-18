import { IPiece } from './piece.interface';
import { IAI } from './ai.interface';
import { WorkerType } from '../../../stores/interfaces/worker.interface';

export interface IWorkerRequest {
  type: WorkerType;
  payload?: IWRStart | IWRPut | IWRConfig;
}

export interface IWRStart {
  first: boolean;
  randomOpening: boolean;
}

export interface IWRPut {
  piece: IPiece;
}

export interface IWRConfig {
  config: IAI;
}
