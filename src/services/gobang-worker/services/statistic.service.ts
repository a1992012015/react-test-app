import { cloneDeep } from 'lodash-es';

import { IPiece } from '../interfaces/piece.interface';
import { commons } from './commons.service';
import { AI } from '../configs/ai.config';

/**
 * 打印现在的分数
 */
export class Statistic {
  table: number[][] = [];

  init = (size: number): void => {
    this.table = commons.createScores(size, size);
  };

  print = (candidates: IPiece[]): void => {
    AI.log &&
      console.log(
        this.table.map((r) => {
          return r.map((s) => parseInt(String(Math.sqrt((s || 0) / 10000)), 10)).join(',');
        })
      );
    let max = 0;
    let p: number[] = [];
    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      const score = this.table[c.y][c.x];
      if ((score || 0) > max) {
        max = score || 0;
        p = [c.y, c.x];
      }
    }
    AI.log && console.log('历史表推荐走法:', p);
  };

  printBoard = (board: IPiece[][], name?: string): void => {
    const numberBoard = commons.createScores(15, 15);
    board.forEach((row) => {
      row.forEach((p) => {
        numberBoard[p.y][p.x] = p.role;
      });
    });

    AI.log && console.log(`${name || 'printBoard'} => `, numberBoard);
  };

  printClone = (data: unknown, name?: string): void => {
    AI.log && console.log(`${name || 'printClone'} => `, cloneDeep(data));
  };
}

export const statistic = new Statistic();
