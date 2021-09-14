import { IPiece } from './piece.interface';
import { IAI } from './ai.interface';
import { ERole } from './role.interface';

export interface WorkerRequest {
  type: WorkerType;
  piece?: IPiece;
  first?: boolean;
  config?: IAI;
  randomOpening?: boolean;
}

export interface WorkerResponse {
  type: WorkerType;
  data: IResponseStart | IResponsePut;
}

export interface IResponseStart {
  pieces: IPiece[][];
  first: ERole;
  name: string;
}

export interface IResponsePut {
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
