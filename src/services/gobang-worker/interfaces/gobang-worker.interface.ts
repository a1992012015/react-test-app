import { IPiece } from './piece.interface';
import { ERole } from './role.interface';

export interface IWorkerResponse {
  type: WorkerType;
  payload: IWResponseStart | IWResponsePut;
}

export interface IWResponseStart {
  pieces: IPiece[][];
  first: ERole;
  name: string;
}

export interface IWResponsePut {
  piece: IPiece;
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
