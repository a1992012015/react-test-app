import { IScorePoint } from '../interfaces/evaluate-point.interface';
import { EvaluatePoint } from './evaluate-point.service';
import { ERole } from '../interfaces/role.interface';
import { commons } from './commons.service';

describe('evaluate point service', () => {
  const board = commons.getOpenBoard();
  const evaluatePoint = new EvaluatePoint('test');
  const mockTest: IScorePoint = {
    x: 0,
    y: 0,
    role: ERole.black,
    pieces: board
  };
  const chessRecord = [
    { y: 7, x: 7, role: ERole.black, score: 40 },
    { y: 6, x: 6, role: ERole.white, score: 31 },
    { y: 8, x: 7, role: ERole.black, score: 130 },
    { y: 6, x: 8, role: ERole.white, score: 31 },
    { y: 8, x: 8, role: ERole.black, score: 130 },
    { y: 6, x: 7, role: ERole.white, score: 1021 },
    { y: 8, x: 6, role: ERole.black, score: 1030 },
    { y: 6, x: 5, role: ERole.white, score: 100030 },
    { y: 9, x: 7, role: ERole.black, score: 310 },
    { y: 6, x: 4, role: ERole.white, score: 10000030 },
    { y: 10, x: 7, role: ERole.black, score: 10030 },
    { y: 8, x: 10, role: ERole.white, score: 40 },
    { y: 7, x: 9, role: ERole.black, score: 1020 },
    { y: 6, x: 9, role: ERole.white, score: 10000021 },
    { y: 7, x: 4, role: ERole.black, score: 22 },
    { y: 4, x: 4, role: ERole.white, score: 40 },
    { y: 7, x: 3, role: ERole.black, score: 120 },
    { y: 10, x: 10, role: ERole.white, score: 40 },
    { y: 7, x: 10, role: ERole.black, score: 112 },
    { y: 4, x: 10, role: ERole.white, score: 40 },
    { y: 7, x: 6, role: ERole.black, score: 100021 },
    { y: 3, x: 11, role: ERole.white, score: 130 },
    { y: 10, x: 6, role: ERole.black, score: 100210 },
    { y: 10, x: 8, role: ERole.white, score: 31 },
    { y: 10, x: 4, role: ERole.black, score: 220 },
    { y: 1, x: 13, role: ERole.white, score: 120 },
    { y: 8, x: 4, role: ERole.black, score: 10210 },
    { y: 2, x: 12, role: ERole.white, score: 100030 },
    { y: 6, x: 2, role: ERole.black, score: 10010 },
    { y: 10, x: 12, role: ERole.white, score: 40 },
    { y: 12, x: 4, role: ERole.black, score: 10030 },
    { y: 10, x: 9, role: ERole.white, score: 10030 },
    { y: 9, x: 4, role: ERole.black, score: 10030 },
    { y: 4, x: 8, role: ERole.white, score: 40 },
    { y: 9, x: 9, role: ERole.black, score: 10 },
    { y: 1, x: 8, role: ERole.white, score: 40 },
    { y: 9, x: 6, role: ERole.black, score: 10400 },
    { y: 4, x: 6, role: ERole.white, score: 50 },
    { y: 10, x: 1, role: ERole.black, score: 40 },
    { y: 3, x: 9, role: ERole.white, score: 220 },
    { y: 10, x: 3, role: ERole.black, score: 10220 },
    { y: 1, x: 9, role: ERole.white, score: 130 },
    { y: 14, x: 6, role: ERole.black, score: 21 },
    { y: 1, x: 11, role: ERole.white, score: 320 },
    { y: 12, x: 6, role: ERole.black, score: 10020 },
    { y: 0, x: 4, role: ERole.white, score: 13 },
    { y: 12, x: 1, role: ERole.black, score: 120 },
    { y: 7, x: 11, role: ERole.white, score: 30 },
    { y: 12, x: 5, role: ERole.black, score: 1030 },
    { y: 6, x: 11, role: ERole.white, score: 10110 },
    { y: 14, x: 11, role: ERole.black, score: 12 },
    { y: 1, x: 6, role: ERole.white, score: 130 },
    { y: 7, x: 0, role: ERole.black, score: 13 },
    { y: 1, x: 4, role: ERole.white, score: 40 },
    { y: 13, x: 6, role: ERole.black, score: 10110 },
    { y: 1, x: 7, role: ERole.white, score: 100120 },
    { y: 14, x: 7, role: ERole.black, score: 10102 },
    { y: 4, x: 3, role: ERole.white, score: 130 },
    { y: 9, x: 2, role: ERole.black, score: 10120 },
    { y: 4, x: 7, role: ERole.white, score: 100030 },
    { y: 9, x: 11, role: ERole.black, score: 20 },
    { y: 8, x: 11, role: ERole.white, score: 210 },
    { y: 7, x: 2, role: ERole.black, score: 100120 },
    { y: 3, x: 7, role: ERole.white, score: 310 },
    { y: 13, x: 11, role: ERole.black, score: 30 },
    { y: 0, x: 11, role: ERole.white, score: 111 },
    { y: 11, x: 11, role: ERole.black, score: 110 },
    { y: 4, x: 11, role: ERole.white, score: 110020 },
    { y: 12, x: 2, role: ERole.black, score: 10030 },
    { y: 3, x: 5, role: ERole.white, score: 220 },
    { y: 13, x: 10, role: ERole.black, score: 120 },
    { y: 9, x: 12, role: ERole.white, score: 110 },
    { y: 3, x: 12, role: ERole.black, score: 11 },
    { y: 3, x: 4, role: ERole.white, score: 10210 },
    { y: 11, x: 8, role: ERole.black, score: 100010 },
    { y: 3, x: 8, role: ERole.white, score: 100310 },
    { y: 9, x: 8, role: ERole.black, score: 100100 },
    { y: 3, x: 1, role: ERole.white, score: 40 },
    { y: 9, x: 0, role: ERole.black, score: 40 },
    { y: 3, x: 0, role: ERole.white, score: 20 },
    { y: 9, x: 3, role: ERole.black, score: 100300 },
    { y: 3, x: 3, role: ERole.white, score: 100210 }
  ];

  it('Should return the correct score', () => {
    const qi = chessRecord.map((chess) => [chess.y, chess.x]);

    console.log(JSON.stringify(qi));

    chessRecord.forEach((chess) => {
      board[chess.y][chess.x].role = chess.role;
      mockTest.y = chess.y;
      mockTest.x = chess.x;
      mockTest.role = chess.role;

      const result = evaluatePoint.scorePoint(mockTest);

      expect(result).toEqual(chess.score);
    });
  });
});
