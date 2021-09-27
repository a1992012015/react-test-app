import { aiRole } from '../configs/ai-role';
import { Piece } from '../interfaces/open-pants.interface';

const initPiece = { x: 0, y: 0, role: aiRole.empty };

//有邻居
let hasNeighbor = (board: Piece[][], point: Piece = initPiece, distance: number = 0, count: number = 0): boolean => {
  let len = board.length;
  let startX = (point.x || 0) - distance;
  let endX = point.x + distance;
  let startY = point.y - distance;
  let endY = point.y + distance;
  for (let i = startX; i <= endX; i++) {
    if (i < 0 || i >= len) {
      continue;
    }
    for (let j = startY; j <= endY; j++) {
      if (j < 0 || j >= len) {
        continue;
      }
      if (i === point.x && j === point.y) {
        continue;
      }
      if (board[i][j].role !== aiRole.empty) {
        count--;
        if (count <= 0) {
          return true;
        }
      }
    }
  }
  return false;
};

export default hasNeighbor;
