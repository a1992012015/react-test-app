import { MersenneTwister19937, Random } from 'random-js';

import { IPiece } from '../interfaces/piece.interface';
import { ERole } from '../interfaces/role.interface';

/**
 * 生成缓存ID
 */
export class Zobrist {
  private readonly size: number = 0;
  private code = 0;
  private white: number[] = [];
  private black: number[] = [];
  private random = new Random(MersenneTwister19937.autoSeed());

  constructor(size?: number) {
    this.size = size || 15;
    this.init();
  }

  go = (piece: IPiece): number => {
    const index = this.size * piece.x + piece.y;
    this.code ^= piece.role === ERole.white ? this.white[index] : this.black[index];
    return this.code;
  };

  getCode = (): number => {
    return this.code;
  };

  private init = (): void => {
    this.white = [];
    this.black = [];
    for (let i = 0; i < this.size * this.size; i++) {
      this.white.push(this.rand());
      this.black.push(this.rand());
    }

    this.code = this.rand();
  };

  private rand = (): number => {
    // 返回 1 到 一万亿以内的随机整数
    return this.random.integer(1, 1000000000000);
  };
}
