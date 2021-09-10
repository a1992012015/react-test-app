import { IPiece, IScore } from '../interfaces/piece.interface';
import { ERole } from '../interfaces/role.interface';

/**
 * 棋子
 * 定一个和初始化了棋子所有的属性和方法
 */
export class Piece implements IPiece {
  x: number = 0;
  y: number = 0;
  role: ERole = ERole.empty;

  constructor(x: number, y: number, role: ERole) {
    this.x = x;
    this.y = y;
    this.role = role;
  }

  score: number = 0;
  steps: Piece[] = [];
  vct: number = 0;
  vcf: number = 0;
  min: number = 0;
  step: number = 0;
  scoreHum: number = 0;
  scoreCom: number = 0;
  data?: IScore;
}
