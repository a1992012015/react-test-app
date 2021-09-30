/*
 * 一个简单的开局库，用花月+浦月必胜开局
 */
import cloneDeep from 'lodash-es/cloneDeep';

import { containPoint, pointEqual } from './math';
import { Board } from './board';
import { Piece, Role } from '../interfaces/open-pants.interface';
import { aiConfig } from '../configs/ai-config';
import { deepAll } from './negamax';

/**
 * -2-
 * -1-
 * ---
 */
const huayue = (board: Board): Piece => {
  console.log('使用花月开局');
  const s = board.steps;
  if (pointEqual(s[1], [6, 7])) {
    if (s.length === 2) {
      return { x: 6, y: 8, role: 0 };
    }
  }
  if (pointEqual(s[1], [7, 6])) {
    if (s.length === 2) {
      return { x: 6, y: 6, role: 0 };
    }
  }
  if (pointEqual(s[1], [8, 7])) {
    if (s.length === 2) {
      return { x: 8, y: 6, role: 0 };
    }
  }
  if (pointEqual(s[1], [7, 8])) {
    if (s.length === 2) {
      return { x: 8, y: 8, role: 0 };
    }
  }
  return { x: 7, y: 7, role: 0 };
};

const puyue = (board: Board): Piece => {
  console.log('使用浦月开局');
  const s = board.steps;
  if (pointEqual(s[1], [6, 6])) {
    if (s.length === 2) {
      return { x: 6, y: 8, role: 0 };
    }
  }
  if (pointEqual(s[1], [8, 6])) {
    if (s.length === 2) {
      return { x: 6, y: 6, role: 0 };
    }
  }
  if (pointEqual(s[1], [8, 8])) {
    if (s.length === 2) {
      return { x: 8, y: 6, role: 0 };
    }
  }
  if (pointEqual(s[1], [6, 8])) {
    if (s.length === 2) {
      return { x: 8, y: 8, role: 0 };
    }
  }
  return { x: 7, y: 7, role: 0 };
};

export const match = (board: Board): Piece => {
  const s = board.allSteps;
  console.log('match => s', cloneDeep(s));
  const { x } = s[0];
  const { y } = s[0];
  console.log('match', board.board[x][y].role !== Role.com);
  if (board.board[x][y].role !== Role.com) {
    return deepAll(undefined, aiConfig.searchDeep);
  }
  if (s.length > 2) {
    return deepAll(undefined, aiConfig.searchDeep);
  }
  console.log(
    containPoint(
      [
        [6, 7],
        [7, 6],
        [8, 7],
        [7, 8]
      ],
      s[1]
    )
  );
  if (
    containPoint(
      [
        [6, 7],
        [7, 6],
        [8, 7],
        [7, 8]
      ],
      s[1]
    )
  ) {
    return huayue(board);
  } else if (
    containPoint(
      [
        [6, 6],
        [8, 8],
        [8, 6],
        [6, 8]
      ],
      s[1]
    )
  ) {
    return puyue(board);
  }
  return deepAll(undefined, aiConfig.searchDeep);
};
