import { Piece, Role } from '../interfaces/open-pants.interface';

export const ArrayFun = {
  create: (w: number, h: number): Piece[][] => {
    const r = [];
    for (let i = 0; i < w; i++) {
      const row: Piece[] = [];
      for (let j = 0; j < h; j++) {
        row.push({ x: j, y: i, role: Role.empty });
      }
      r.push(row);
    }
    return r;
  }
};
