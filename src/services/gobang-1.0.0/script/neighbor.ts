import { aiRole } from '../configs/ai-role';
import { Piece } from '../interfaces/open-pants.interface';

const initPiece = { x: 0, y: 0, role: aiRole.empty };

// 有邻居
const hasNeighbor = (
  board: Piece[][],
  point: Piece = initPiece,
  distance = 0,
  count = 0
): boolean => {
  const len = board.length;
  const startX = (point.x || 0) - distance;
  const endX = point.x + distance;
  const startY = point.y - distance;
  const endY = point.y + distance;

  let currentCount = count;
  for (let i = startX; i <= endX; i++) {
    if (i < 0 || i >= len) {
      // eslint-disable-next-line no-continue
      continue;
    }
    for (let j = startY; j <= endY; j++) {
      if (j < 0 || j >= len) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (i === point.x && j === point.y) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (board[i][j].role !== aiRole.empty) {
        currentCount--;
        if (currentCount <= 0) {
          return true;
        }
      }
    }
  }
  return false;
};

export default hasNeighbor;
