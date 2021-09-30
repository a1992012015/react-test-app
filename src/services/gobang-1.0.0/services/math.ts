import { SCORE } from '../configs/score';
import { Piece } from '../interfaces/open-pants.interface';

const threshold = 1.15;

export const equal = (a: number, b: number): boolean => {
  const bb = b || 0.01;
  return bb >= 0
    ? a >= bb / threshold && a <= bb * threshold
    : a >= bb * threshold && a <= bb / threshold;
};
export const greatThan = (a: number, b: number): boolean => {
  // 注意处理b为0的情况，通过加一个0.1 做简单的处理
  return b >= 0 ? a >= (b + 0.1) * threshold : a >= (b + 0.1) / threshold;
};

export const greatOrEqualThan = (a: number, b: number): boolean => {
  return equal(a, b) || greatThan(a, b);
};

export const littleThan = (a: number, b: number): boolean => {
  return b >= 0 ? a <= (b - 0.1) / threshold : a <= (b - 0.1) * threshold;
};

export const littleOrEqualThan = (a: number, b: number): boolean => {
  return equal(a, b) || littleThan(a, b);
};

export const containPoint = (arrays: number[][], p: Piece): boolean => {
  return arrays.some((a) => {
    return a[0] === p.x && a[1] === p.y;
  });
};

export const pointEqual = (a: Piece, [x, y]: number[]): boolean => {
  return a.x === x && a.y === y;
};

export const round = (score: number): number => {
  const neg = score < 0 ? -1 : 1;
  const abs = Math.abs(score);
  if (abs <= SCORE.ONE / 2) return 0;
  if (abs <= SCORE.TWO / 2 && abs > SCORE.ONE / 2) return neg * SCORE.ONE;
  if (abs <= SCORE.THREE / 2 && abs > SCORE.TWO / 2) return neg * SCORE.TWO;
  if (abs <= SCORE.THREE * 1.5 && abs > SCORE.THREE / 2) return neg * SCORE.THREE;
  if (abs <= SCORE.FOUR / 2 && abs > SCORE.THREE * 1.5) return neg * SCORE.THREE * 2;
  if (abs <= SCORE.FIVE / 2 && abs > SCORE.FOUR / 2) return neg * SCORE.FOUR;
  return neg * SCORE.FIVE;
};
