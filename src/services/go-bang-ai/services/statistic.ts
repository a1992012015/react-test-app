import { ArrayFun } from './arrary';
import { Piece } from '../interfaces/open-pants.interface';

export class Statistic {
  table: Piece[][] = [];

  init(size: number) {
    this.table = ArrayFun.create(size, size);
  }

  print(candidates: Piece[]) {
    console.log(this.table.map((r) => {
      return r.map(i => parseInt(String(Math.sqrt((i.score || 0) / 10000)))).join(',');
    }));
    let max = 0;
    let p: number[] = [];
    for (let i = 0; i < candidates.length; i++) {
      let c = candidates[i];
      let s = this.table[c.x][c.y];
      if ((s?.score || 0) > max) {
        max = s.score || 0;
        p = [c.x, c.y];
      }
    }
    console.log('历史表推荐走法:', p);
  }
}

export default new Statistic();
