import { cloneDeep } from 'lodash-es';

import { IPiece } from '../interfaces/piece.interface';
import { ERole } from '../interfaces/role.interface';
import { Commons } from './commons.service';
import { AI } from '../configs/ai.config';

/**
 * 打印现在的分数
 */
export class Statistic {
  private table: number[][] = [];
  private commons = new Commons();

  constructor(size = 15) {
    this.init(size);
  }

  print = (candidates: IPiece[]): void => {
    AI.log &&
      console.log(
        this.table.map((r) => {
          return r.map((s) => parseInt(String(Math.sqrt(s / 10000)), 10)).join(',');
        })
      );
    let max = 0;
    let p: number[] = [];
    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      const score = this.table[c.y][c.x];
      if (score > max) {
        max = score;
        p = [c.y, c.x];
      }
    }
    AI.log && console.log('历史表推荐走法:', p);
  };

  printBoard = (board: IPiece[][]): ERole[][] => {
    const numberBoard = this.commons.createScores(15, 15);
    board.forEach((row) => {
      row.forEach((p) => {
        numberBoard[p.y][p.x] = p.role;
      });
    });

    return numberBoard;
  };

  printClone = (data: unknown, name?: string): void => {
    AI.log && console.log(`${name || 'printClone'} => `, cloneDeep(data));
  };

  private init = (size: number): void => {
    this.table = this.commons.createScores(size, size);
  };
}
