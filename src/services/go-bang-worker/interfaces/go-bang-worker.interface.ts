import { IPiece } from './piece.interface';
import { IAI } from './ai.interface';
import { ERole } from './role.interface';

export interface IWorkerRequest {
  type: WorkerType;
  payload: IWRequestStart | IWRequestPut | IWRequestConfig;
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
