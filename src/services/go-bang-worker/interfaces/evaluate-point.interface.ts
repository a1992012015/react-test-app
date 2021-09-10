import { Piece } from '../services/piece.service';
import { ERole } from './role.interface';
import { IPiece } from './piece.interface';

/**
 * 打分函数
 */
export interface IScorePoint {
  x: number;
  y: number;
  role: ERole;
  dir?: number;
  pieces: Piece[][];
  scoreCache: number[][][][];
}

export interface ISearch {
  deep: number;
  beta: number;
  alpha: number;
  role: ERole;
  step: number;
  steps: IPiece[];
  spread: number;
}
