import { Piece } from '../services/piece.service';
import { ERole } from './role.interface';

export interface IPiece {
  x: number;
  y: number;
  role: ERole;
  score: number;
  steps: Piece[];
  vct: number;
  vcf: number;
  min: number;
  step: number;
  scoreHum: number;
  scoreCom: number;
  data?: IScore;
}

export interface IScore {
  score: number;
  step: number;
  steps: Piece[];
  abcut?: number;
  vct?: number;
  vcf?: number;
  c?: ICacheBoard;
}

export interface ICacheBoard {
  deep: number;
  score: IScore;
  board: string;
}
