/*
 * 启发式评价函数
 * 这个是专门给某一个位置打分的，不是给整个棋盘打分的
 * 并且是只给某一个角色打分
 */
/* eslint-disable */
import { aiRole } from '../configs/ai-role';
import { SCORE } from '../configs/score';
import { Board } from './board';
import { Role } from '../interfaces/open-pants.interface';

let count = 0;
let block = 0;
let empty = 0;
let secondCount = 0; // 另一个方向的count

/*
 * 表示在当前位置下一个棋子后的分数
 * 为了性能考虑，增加了一个dir参数，如果没有传入则默认计算所有四个方向，如果传入值，则只计算其中一个方向的值
 */
export const scorePoint = (b: Board, px: number, py: number, role: Role, dir?: number): number => {
  const { board } = b;
  let result = 0;

  const len = board.length;

  if (dir === undefined || dir === 0) {
    reset();

    for (let i = py + 1; true; i++) {
      if (i >= len) {
        block++;
        break;
      }
      const t = board[px][i];
      if (t.role === aiRole.empty) {
        if (empty === -1 && i < len - 1 && board[px][i + 1].role === role) {
          empty = count;
          continue;
        } else {
          break;
        }
      }
      if (t.role === role) {
        count++;
      } else {
        block++;
        break;
      }
    }

    for (let i = py - 1; true; i--) {
      if (i < 0) {
        block++;
        break;
      }
      const t = board[px][i];
      if (t.role === aiRole.empty) {
        if (empty === -1 && i > 0 && board[px][i - 1].role === role) {
          empty = 0; // 注意这里是0，因为是从右往左走的
          continue;
        } else {
          break;
        }
      }
      if (t.role === role) {
        secondCount++;
        empty !== -1 && empty++; // 注意这里，如果左边又多了己方棋子，那么empty的位置就变大了
      } else {
        block++;
        break;
      }
    }

    count += secondCount;

    b.scoreCache[role][0][px][py].score = countToScore(count, block, empty);
  }
  result += b.scoreCache[role][0][px][py].score || 0;

  if (dir === undefined || dir === 1) {
    // |
    reset();

    for (let i = px + 1; true; i++) {
      if (i >= len) {
        block++;
        break;
      }
      const t = board[i][py];
      if (t.role === aiRole.empty) {
        if (empty === -1 && i < len - 1 && board[i + 1][py].role === role) {
          empty = count;
          continue;
        } else {
          break;
        }
      }
      if (t.role === role) {
        count++;
      } else {
        block++;
        break;
      }
    }

    for (let i = px - 1; true; i--) {
      if (i < 0) {
        block++;
        break;
      }
      const t = board[i][py];
      if (t.role === aiRole.empty) {
        if (empty === -1 && i > 0 && board[i - 1][py].role === role) {
          empty = 0;
          continue;
        } else {
          break;
        }
      }
      if (t.role === role) {
        secondCount++;
        empty !== -1 && empty++; // 注意这里，如果左边又多了己方棋子，那么empty的位置就变大了
      } else {
        block++;
        break;
      }
    }

    count += secondCount;

    b.scoreCache[role][1][px][py].score = countToScore(count, block, empty);
  }
  result += b.scoreCache[role][1][px][py]?.score || 0;

  // \
  if (dir === undefined || dir === 2) {
    reset();

    for (let i = 1; true; i++) {
      const x = px + i;
      const y = py + i;
      if (x >= len || y >= len) {
        block++;
        break;
      }
      const t = board[x][y];
      if (t.role === aiRole.empty) {
        if (empty === -1 && x < len - 1 && y < len - 1 && board[x + 1][y + 1].role === role) {
          empty = count;
          continue;
        } else {
          break;
        }
      }
      if (t.role === role) {
        count++;
      } else {
        block++;
        break;
      }
    }

    for (let i = 1; true; i++) {
      const x = px - i;
      const y = py - i;
      if (x < 0 || y < 0) {
        block++;
        break;
      }
      const t = board[x][y];
      if (t.role === aiRole.empty) {
        if (empty === -1 && x > 0 && y > 0 && board[x - 1][y - 1].role === role) {
          empty = 0;
          continue;
        } else {
          break;
        }
      }
      if (t.role === role) {
        secondCount++;
        empty !== -1 && empty++; // 注意这里，如果左边又多了己方棋子，那么empty的位置就变大了
      } else {
        block++;
        break;
      }
    }

    count += secondCount;

    b.scoreCache[role][2][px][py].score = countToScore(count, block, empty);
  }
  result += b.scoreCache[role][2][px][py]?.score || 0;

  // /
  if (dir === undefined || dir === 3) {
    reset();

    for (let i = 1; true; i++) {
      const x = px + i;
      const y = py - i;
      if (x < 0 || y < 0 || x >= len || y >= len) {
        block++;
        break;
      }
      const t = board[x][y];
      if (t.role === aiRole.empty) {
        if (empty === -1 && x < len - 1 && y > 0 && board[x + 1][y - 1].role === role) {
          empty = count;
          continue;
        } else {
          break;
        }
      }
      if (t.role === role) {
        count++;
      } else {
        block++;
        break;
      }
    }

    for (let i = 1; true; i++) {
      const x = px - i;
      const y = py + i;
      if (x < 0 || y < 0 || x >= len || y >= len) {
        block++;
        break;
      }
      const t = board[x][y];
      if (t.role === aiRole.empty) {
        if (empty === -1 && x > 0 && y < len - 1 && board[x - 1][y + 1].role === role) {
          empty = 0;
          continue;
        } else {
          break;
        }
      }
      if (t.role === role) {
        secondCount++;
        empty !== -1 && empty++; // 注意这里，如果左边又多了己方棋子，那么empty的位置就变大了
      } else {
        block++;
        break;
      }
    }

    count += secondCount;

    b.scoreCache[role][3][px][py].score = countToScore(count, block, empty);
  }
  result += b.scoreCache[role][3][px][py]?.score || 0;

  return result;
};

const countToScore = (count: number, block: number, empty: number) => {
  if (empty === undefined) {
    empty = 0;
  }

  // 没有空位
  if (empty <= 0) {
    if (count >= 5) return SCORE.FIVE;
    if (block === 0) {
      switch (count) {
        case 1:
          return SCORE.ONE;
        case 2:
          return SCORE.TWO;
        case 3:
          return SCORE.THREE;
        case 4:
          return SCORE.FOUR;
      }
    }

    if (block === 1) {
      switch (count) {
        case 1:
          return SCORE.BLOCKED_ONE;
        case 2:
          return SCORE.BLOCKED_TWO;
        case 3:
          return SCORE.BLOCKED_THREE;
        case 4:
          return SCORE.BLOCKED_FOUR;
      }
    }
  } else if (empty === 1 || empty === count - 1) {
    // 第1个是空位
    if (count >= 6) {
      return SCORE.FIVE;
    }
    if (block === 0) {
      switch (count) {
        case 2:
          return SCORE.TWO / 2;
        case 3:
          return SCORE.THREE;
        case 4:
          return SCORE.BLOCKED_FOUR;
        case 5:
          return SCORE.FOUR;
      }
    }

    if (block === 1) {
      switch (count) {
        case 2:
          return SCORE.BLOCKED_TWO;
        case 3:
          return SCORE.BLOCKED_THREE;
        case 4:
          return SCORE.BLOCKED_FOUR;
        case 5:
          return SCORE.BLOCKED_FOUR;
      }
    }
  } else if (empty === 2 || empty === count - 2) {
    // 第二个是空位
    if (count >= 7) {
      return SCORE.FIVE;
    }
    if (block === 0) {
      switch (count) {
        case 3:
          return SCORE.THREE;
        case 4:
        case 5:
          return SCORE.BLOCKED_FOUR;
        case 6:
          return SCORE.FOUR;
      }
    }

    if (block === 1) {
      switch (count) {
        case 3:
          return SCORE.BLOCKED_THREE;
        case 4:
          return SCORE.BLOCKED_FOUR;
        case 5:
          return SCORE.BLOCKED_FOUR;
        case 6:
          return SCORE.FOUR;
      }
    }

    if (block === 2) {
      switch (count) {
        case 4:
        case 5:
        case 6:
          return SCORE.BLOCKED_FOUR;
      }
    }
  } else if (empty === 3 || empty === count - 3) {
    if (count >= 8) {
      return SCORE.FIVE;
    }
    if (block === 0) {
      switch (count) {
        case 4:
        case 5:
          return SCORE.THREE;
        case 6:
          return SCORE.BLOCKED_FOUR;
        case 7:
          return SCORE.FOUR;
      }
    }

    if (block === 1) {
      switch (count) {
        case 4:
        case 5:
        case 6:
          return SCORE.BLOCKED_FOUR;
        case 7:
          return SCORE.FOUR;
      }
    }

    if (block === 2) {
      switch (count) {
        case 4:
        case 5:
        case 6:
        case 7:
          return SCORE.BLOCKED_FOUR;
      }
    }
  } else if (empty === 4 || empty === count - 4) {
    if (count >= 9) {
      return SCORE.FIVE;
    }
    if (block === 0) {
      switch (count) {
        case 5:
        case 6:
        case 7:
        case 8:
          return SCORE.FOUR;
      }
    }

    if (block === 1) {
      switch (count) {
        case 4:
        case 5:
        case 6:
        case 7:
          return SCORE.BLOCKED_FOUR;
        case 8:
          return SCORE.FOUR;
      }
    }

    if (block === 2) {
      switch (count) {
        case 5:
        case 6:
        case 7:
        case 8:
          return SCORE.BLOCKED_FOUR;
      }
    }
  } else if (empty === 5 || empty === count - 5) {
    return SCORE.FIVE;
  }

  return 0;
};

const reset = () => {
  count = 1;
  block = 0;
  empty = -1;
  secondCount = 0; // 另一个方向的count
};
