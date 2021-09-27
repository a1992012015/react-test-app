import { MersenneTwister19937, Random } from 'random-js';

import { IPiece } from '../interfaces/piece.interface';
import { ERole } from '../interfaces/role.interface';

/**
 * 生成缓存ID
 */
export class Zobrist {
  private readonly size: number = 0;
  private code = 0;
  private com: number[] = [];
  private hum: number[] = [];
  private random = new Random(MersenneTwister19937.autoSeed());

  constructor(size?: number) {
    this.size = size || 15;
    this.init();
  }

  go = (piece: IPiece): number => {
    const index = this.size * piece.x + piece.y;
    this.code ^= piece.role === ERole.white ? this.com[index] : this.hum[index];
    return this.code;
  };

  getCode = (): number => {
    return this.code;
  };

  private init = (): void => {
    this.com = [];
    this.hum = [];
    for (let i = 0; i < this.size * this.size; i++) {
      this.com.push(this.rand());
      this.hum.push(this.rand());
    }

    this.code = this.rand();
  };

  private rand = (): number => {
    return this.random.integer(1, 1000000000); // 再多一位就溢出了。。
  };
}
