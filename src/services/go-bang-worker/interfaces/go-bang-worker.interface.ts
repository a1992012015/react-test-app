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
  data?: ResponseData;
}

export interface ResponseData {
  board?: IPiece[][];
  first: ERole;
  name: string;
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
