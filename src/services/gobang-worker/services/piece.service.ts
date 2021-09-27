import { ICreatPiece, IPiece } from '../interfaces/piece.interface';

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
    endgame: [],
    abCut: !!data.abCut,
    scoreHum: data.scoreHum || 0,
    scoreCom: data.scoreCom || 0
  };
};
