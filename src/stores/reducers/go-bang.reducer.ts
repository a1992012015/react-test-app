import { createReducer, current } from '@reduxjs/toolkit';

import { cloneDeep } from 'lodash-es';
import { GameType, IGameStatus } from '../interfaces/go-bang.interface';
import {
  gameBackward,
  gameChangeState,
  gameForward,
  gameInit,
  gamePut
} from '../actions/go-bang.action';
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
  spendTime: 0,
  gameStatus: [],
  forwardStatus: []
};

// 开始时间
let startTime = new Date().getTime();
// 结束时间
let endTime = new Date().getTime();

export const goBangReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(gameInit, () => {
      return initialState;
    })
    .addCase(gameChangeState, (state, action) => {
      state.gameType = action.payload.gameType;

      if (action.payload.first) {
        state.first = action.payload.first;
      }

      if (action.payload.board) {
        state.board = action.payload.board;
      }
    })
    .addCase(gameBackward, (state) => {
      console.log('gameBackward state', current(state));
      // const lastState = cloneDeep(state);
      const currentState = cloneDeep(state.gameStatus.pop());
      if (currentState) {
        return currentState;
      } else {
        return initialState;
      }
    })
    .addCase(gameForward, (state) => {
      console.log(current(state));
    })
    .addCase(gamePut, (state, action) => {
      const { piece, winMap } = action.payload;
      const currentState = cloneDeep(state);

      state.winning = winMap.length ? piece.role : ERole.empty;
      state.winMap = winMap;
      state.steps += 1;
      piece.step = state.steps;
      state.piece = piece;
      state.board[piece.y][piece.x] = piece;
      state.gameType = piece.role === ERole.white ? GameType.DUEL_HUM : GameType.DUEL_COM;
      state.forwardStatus = [];

      if (piece.role === ERole.block) {
        startTime = new Date().getTime();
        console.log('currentState', currentState);
        state.gameStatus.push(currentState);
      } else {
        endTime = new Date().getTime();
        state.spendTime = (endTime - startTime) / 1000;
      }
      console.log('gamePut state', current(state));
    });
});
