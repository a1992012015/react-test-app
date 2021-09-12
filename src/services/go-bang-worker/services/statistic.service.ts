import { IPiece } from '../interfaces/piece.interface';
import { commons } from './commons.service';

/**
 * 打印现在的分数
 */
export class Statistic {
  table: number[][] = [];

  init = (size: number): void => {
    this.table = commons.createScores(size, size);
  };

  print = (candidates: IPiece[]): void => {
    console.log(
      this.table.map((r) => {
        return r.map((s) => parseInt(String(Math.sqrt((s || 0) / 10000)), 10)).join(',');
      })
    );
    let max = 0;
    let p: number[] = [];
    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      const score = this.table[c.x][c.y];
      if ((score || 0) > max) {
        max = score || 0;
        p = [c.x, c.y];
      }
    }
    console.log('历史表推荐走法:', p);
  };
}

export const statistic = new Statistic();
