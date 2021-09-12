import { IPiece, IScore } from '../interfaces/piece.interface';
import { ERole } from '../interfaces/role.interface';

/**
 * 棋子
 * 定一个和初始化了棋子所有的属性和方法
 */
export class Piece implements IPiece {
  x = 0;
  y = 0;
  role: ERole = ERole.empty;

  constructor(x: number, y: number, role: ERole) {
    this.x = x;
    this.y = y;
    this.role = role;
  }

  score = 0;
  steps: IPiece[] = [];
  vct = 0;
  vcf = 0;
  min = 0;
  step = 0;
  scoreHum = 0;
  scoreCom = 0;
  data?: IScore;
}
