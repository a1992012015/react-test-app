import { createReducer } from '@reduxjs/toolkit';

import { GameType, IGameStatus } from '../interfaces/go-bang.interface';
import { gameChangeType, gameInit, gamePut, gameStart } from '../actions/go-bang.action';
import { ERole } from '../../services/go-bang-worker/interfaces/role.interface';
import { wuyue } from '../../services/go-bang-worker/configs/opens.config';
import { creatPiece } from '../../services/go-bang-worker/services/piece.service';

const initialState: IGameStatus = {
  gameType: GameType.DUEL_READY,
  board: wuyue.pieces,
  first: ERole.empty,
  steps: 0,
  winning: ERole.empty,
  winMap: [],
  piece: creatPiece({ x: 0, y: 0, role: ERole.empty }),
  spendTime: 0
};

// 开始时间
let startTime = new Date().getTime();
// 结束时间
let endTime = new Date().getTime();
let flag = 0;

export const goBangReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(gameStart, (state, action) => {
      state.gameType = action.payload.gameType;
      state.first = action.payload.first;
      state.board = action.payload.board;
    })
    .addCase(gameChangeType, (state, action) => {
      state.gameType = action.payload;
    })
    .addCase(gameInit, () => {
      return initialState;
    })
    .addCase(gamePut, (state, action) => {
      flag++;

      if (flag === 1) {
        startTime = new Date().getTime();
      } else if (flag === 2) {
        endTime = new Date().getTime();
        state.spendTime = (endTime - startTime) / 1000;
        flag = 0;
      }

      const { piece } = action.payload;

      state.steps += 1;
      piece.step = state.steps;
      state.piece = piece;
      state.board[piece.x][piece.y] = piece;
      state.gameType = piece.role === ERole.white ? GameType.DUEL_HUM : GameType.DUEL_COM;
    });
});
