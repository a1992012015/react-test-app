import { IPiece } from './piece.interface';

/**
 * 创建缓存函数的type
 */
export interface IZobrist {
  size: number;
  code: number;
  com: number[];
  hum: number[];

  init(): void;

  go(piece: IPiece): number;

  _rand(): number;
}
