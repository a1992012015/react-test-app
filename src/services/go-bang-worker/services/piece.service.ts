import { IPiece } from '../interfaces/piece.interface';
import { ERole } from '../interfaces/role.interface';

/**
 * 棋子
 * 定一个和初始化了棋子所有的属性和方法
 */
export const creatPiece = (data: Partial<IPiece>): IPiece => {
  return {
    x: 0,
    y: 0,
    role: ERole.empty,
    score: 0,
    steps: [],
    vct: 0,
    vcf: 0,
    min: 0,
    step: 0,
    scoreHum: 0,
    scoreCom: 0,
    data: undefined,
    ...data
  };
};
