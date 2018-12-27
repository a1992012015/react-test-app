import R from './role';

//有邻居
let hasNeighbor = function(board, point, distance, count) {
  let len = board.length;
  let startX = point[0] - distance;
  let endX = point[0] + distance;
  let startY = point[1] - distance;
  let endY = point[1] + distance;
  for (let i = startX; i <= endX; i++) {
    if (i < 0 || i >= len) continue;
    for (let j = startY; j <= endY; j++) {
      if (j < 0 || j >= len) continue;
      if (i === point[0] && j === point[1]) continue;
      if (board[i][j] !== R.empty) {
        count--;
        if (count <= 0) return true;
      }
    }
  }
  return false;
};

export default hasNeighbor;
