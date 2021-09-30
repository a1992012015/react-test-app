import { AiConfig } from '../configs/ai-config';
import { Piece, Role } from './open-pants.interface';

export interface WorkerRequest {
  type: WorkerType;
  payload?: {
    piece?: Piece;
  };
  first?: boolean;
  aiConfig?: AiConfig;
  randomOpening?: boolean;
}

export interface WorkerResponse {
  type: WorkerType;
  data?: ResponseData;
}

export interface ResponseData {
  board?: Piece[][];
  first: Role;
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
