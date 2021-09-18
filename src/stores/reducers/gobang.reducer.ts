import { createReducer } from '@reduxjs/toolkit';

import { GameType, IGameStatus } from '../interfaces/gobang.interface';
import { gameChangeState, gameInit, gamePut } from '../actions/gobang.action';
import { ERole } from '../../services/gobang-worker/interfaces/role.interface';
import { wuyue } from '../../services/gobang-worker/configs/opens.config';
import { creatPiece } from '../../services/gobang-worker/services/piece.service';

const initialState: IGameStatus = {
  gameType: GameType.DUEL_READY,
  board: wuyue.pieces,
  name: wuyue.name,
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

export const gobangReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(gameInit, () => {
      return initialState;
    })
    .addCase(gameChangeState, (state, action) => {
      state.gameType = action.payload.gameType;

      if (action.payload.first != null) {
        state.first = action.payload.first;
      }

      if (action.payload.board != null) {
        state.board = action.payload.board;
      }

      if (action.payload.name != null) {
        state.name = action.payload.name;
      }

      if (action.payload.winning != null) {
        state.winning = action.payload.winning;
      }

      if (action.payload.winMap != null) {
        state.winMap = action.payload.winMap;
      }
    })
    .addCase(gamePut, (state, action) => {
      const { piece } = action.payload;
      state.steps += 1;
      piece.step = state.steps;
      state.piece = piece;
      state.board[piece.y][piece.x] = piece;
      state.gameType = piece.role === ERole.white ? GameType.DUEL_HUM : GameType.DUEL_COM;

      if (piece.role === ERole.block) {
        startTime = new Date().getTime();
      } else {
        endTime = new Date().getTime();
        state.spendTime = (endTime - startTime) / 1000;
      }
    });
});
