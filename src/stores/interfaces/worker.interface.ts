import { IPiece } from '../../services/gobang-worker/interfaces/piece.interface';
import { IAI } from '../../services/gobang-worker/interfaces/ai.interface';
import { WorkerType } from '../../services/gobang-worker/interfaces/gobang-worker.interface';

export interface IWorkerRequest {
  type: WorkerType;
  payload?: IWRequestStart | IWRequestPut | IWRequestConfig;
}

export interface IWRequestStart {
  first: boolean;
  randomOpening: boolean;
}

export interface IWRequestPut {
  piece: IPiece;
}

export interface IWRequestConfig {
  config: IAI;
}
