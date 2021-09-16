import { IPiece } from '../../services/go-bang-worker/interfaces/piece.interface';
import { IAI } from '../../services/go-bang-worker/interfaces/ai.interface';
import { WorkerType } from '../../services/go-bang-worker/interfaces/go-bang-worker.interface';

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
