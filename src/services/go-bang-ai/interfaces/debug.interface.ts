import { Piece } from './open-pants.interface';

export interface DebugInterface {
  checkmate: { [key: string]: number };
}

export interface DebugCache {
  vct: { [key: number]: Piece | boolean };
  vcf: { [key: number]: Piece | boolean };
}
