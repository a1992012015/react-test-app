import { IPiece } from '../interfaces/piece.interface';
import { ERole } from '../interfaces/role.interface';

/**
 * 重新构成Piece的定义，在创建的时候x y role是必须的参数
 */
interface ICreatPiece extends Partial<IPiece> {
  x: number;
  y: number;
  role: ERole;
}

/**
 * 棋子
 * 定一个和初始化了棋子所有的属性和方法
 */
export const creatPiece = (data: ICreatPiece): IPiece => {
  return {
    x: data.x,
    y: data.y,
    role: data.role,
    step: data.step || 0,
    score: data.score || 0,
    steps: data.steps || [],
    abCut: !!data.abCut,
    vct: data.vct || 0,
    vcf: data.vcf || 0,
    min: data.min || 0,
    scoreHum: data.scoreHum || 0,
    scoreCom: data.scoreCom || 0,
    data: undefined
  };
};
