import { MersenneTwister19937, Random } from 'random-js';

import { IPiece } from '../interfaces/piece.interface';
import { ERole } from '../interfaces/role.interface';
import { IZobrist } from '../interfaces/zobrist.interface';

/**
 * 生成缓存ID
 */
export class Zobrist implements IZobrist {
  size = 0;
  code = 0;
  com: number[] = [];
  hum: number[] = [];
  random = new Random(MersenneTwister19937.autoSeed());

  constructor(size?: number) {
    this.size = size || 15;
  }

  init = (): void => {
    this.com = [];
    this.hum = [];
    for (let i = 0; i < this.size * this.size; i++) {
      this.com.push(this.rand());
      this.hum.push(this.rand());
    }

    this.code = this.rand();
  };

  go = (piece: IPiece): number => {
    const index = this.size * piece.x + piece.y;
    this.code ^= piece.role === ERole.com ? this.com[index] : this.hum[index];
    return this.code;
  };

  rand = (): number => {
    return this.random.integer(1, 1000000000); // 再多一位就溢出了。。
  };
}

export const zobrist = new Zobrist();
