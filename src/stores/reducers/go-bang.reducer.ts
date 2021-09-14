import { createReducer } from '@reduxjs/toolkit';

import { GameType, IGameStatus } from '../interfaces/go-bang.interface';
import { gameInit, gamePut, gameStart } from '../actions/go-bang.action';
import { ERole } from '../../services/go-bang-worker/interfaces/role.interface';
import { wuyue } from '../../services/go-bang-worker/configs/opens.config';

const initialState: IGameStatus = {
  gameType: GameType.DUEL_READY,
  board: wuyue.pieces,
  first: ERole.empty,
  steps: 0,
  winning: ERole.empty,
  winMap: []
};

export const goBangReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(gameStart, (state, action) => {
      state.gameType = action.payload.gameType;
      state.first = action.payload.first;
      state.board = action.payload.board;
    })
    .addCase(gameInit, () => {
      return initialState;
    })
    .addCase(gamePut, (state, action) => {
      const { piece } = action.payload;
      state.board[piece.x][piece.y] = piece;
      state.gameType = piece.role === ERole.com ? GameType.DUEL_HUM : GameType.DUEL_COM;
      state.steps += 1;
    });
});
