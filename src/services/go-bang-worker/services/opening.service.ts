/*
 * 一个简单的开局库，用花月+浦月必胜开局
 */

import { IPiece } from '../interfaces/piece.interface';
import { Board } from './board.service';
import { commons } from './commons.service';
import { AI } from '../configs/ai.config';
import { ERole } from '../interfaces/role.interface';
import { creatPiece } from './piece.service';
import { negamax } from './negamax.service';

/**
 * -2-
 * -1-
 * ---
 */
export class Opening {
  match = (board: Board): IPiece => {
    const s = board.allSteps;
    console.log('match => s', s);
    const { x } = s[0];
    const { y } = s[0];
    console.log(board.board.pieces[x][y].role !== ERole.com);
    if (board.board.pieces[x][y].role !== ERole.com) {
      return negamax.deepAll(ERole.com, AI.searchDeep);
    }
    if (s.length > 2) {
      return negamax.deepAll(ERole.com, AI.searchDeep);
    }
    console.log(
      commons.containPoint(
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
      commons.containPoint(
        [
          [6, 7],
          [7, 6],
          [8, 7],
          [7, 8]
        ],
        s[1]
      )
    ) {
      return this.huayue(board);
    }
    if (
      commons.containPoint(
        [
          [6, 6],
          [8, 8],
          [8, 6],
          [6, 8]
        ],
        s[1]
      )
    ) {
      return this.puyue(board);
    }
    return negamax.deepAll(ERole.com, AI.searchDeep);
  };

  private huayue = (board: Board): IPiece => {
    console.log('使用花月开局');
    const s = board.steps;
    if (commons.pointEqual(s[1], [6, 7])) {
      if (s.length === 2) {
        return creatPiece({ x: 6, y: 8, role: ERole.empty });
      }
    }
    if (commons.pointEqual(s[1], [7, 6])) {
      if (s.length === 2) {
        return creatPiece({ x: 6, y: 6, role: ERole.empty });
      }
    }
    if (commons.pointEqual(s[1], [8, 7])) {
      if (s.length === 2) {
        return creatPiece({ x: 8, y: 6, role: ERole.empty });
      }
    }
    if (commons.pointEqual(s[1], [7, 8])) {
      if (s.length === 2) {
        return creatPiece({ x: 8, y: 8, role: ERole.empty });
      }
    }
    return creatPiece({ x: 7, y: 7, role: ERole.empty });
  };

  private puyue = (board: Board): IPiece => {
    console.log('使用浦月开局');
    const s = board.steps;
    if (commons.pointEqual(s[1], [6, 6])) {
      if (s.length === 2) {
        return creatPiece({ x: 6, y: 8, role: ERole.empty });
      }
    }
    if (commons.pointEqual(s[1], [8, 6])) {
      if (s.length === 2) {
        return creatPiece({ x: 6, y: 6, role: ERole.empty });
      }
    }
    if (commons.pointEqual(s[1], [8, 8])) {
      if (s.length === 2) {
        return creatPiece({ x: 8, y: 6, role: ERole.empty });
      }
    }
    if (commons.pointEqual(s[1], [6, 8])) {
      if (s.length === 2) {
        return creatPiece({ x: 8, y: 8, role: ERole.empty });
      }
    }
    return creatPiece({ x: 7, y: 7, role: ERole.empty });
  };
}

export const opening = new Opening();
