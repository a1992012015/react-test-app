import { MersenneTwister19937, Random } from 'random-js';

import { Piece } from '../interfaces/open-pants.interface';
import { aiRole } from '../configs/ai-role';

const random = new Random(MersenneTwister19937.autoSeed());

export class Zobrist {
  size = 0;
  code = 0;
  com: number[] = [];
  hum: number[] = [];

  constructor(size?: number) {
    this.size = size || 15;
  }

  init = () => {
    this.com = [];
    this.hum = [];
    for (let i = 0; i < this.size * this.size; i++) {
      this.com.push(this._rand());
      this.hum.push(this._rand());
    }

    this.code = this._rand();
  };

  _rand = () => {
    return random.integer(1, 1000000000);  //再多一位就溢出了。。
  };

  go = (piece: Piece) => {
    const index = this.size * piece.x + piece.y;
    this.code ^= (piece.role === aiRole.com ? this.com[index] : this.hum[index]);
    return this.code;
  };
}

const zobrist = new Zobrist();

export default zobrist;
