import { createReducer } from '@reduxjs/toolkit';

import { GameType, GameStatus } from '../interfaces/go-bang.reducer';
import { Role } from '../../services/go-bang-ai/interfaces/open-pants.interface';
import { getBoard } from '../../services/go-bang-ai/configs/open-pants-26';
import { gameInit, gamePut, gameStart } from '../actions/go-bang.action';

const initialState: GameStatus = {
  gameType: GameType.DUEL_READY,
  board: getBoard(),
  steps: 0,
  winning: Role.empty,
  winMap: []
};

export const goBangReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(gameStart, (state, action) => {
      state.gameType = action.payload.first;
      state.board = action.payload.board;
    })
    .addCase(gameInit, () => {
      return initialState;
    })
    .addCase(gamePut, (state, action) => {
      state.board = action.payload.board;
      state.gameType = action.payload.gameType;
      state.steps = state.steps + 1;
    });
});
