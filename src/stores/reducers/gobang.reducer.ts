import { createReducer } from '@reduxjs/toolkit';

import { GameType, IGameStatus } from '../interfaces/gobang.interface';
import { gameChangeState, gameInit, gamePut } from '../actions/gobang.action';
import { ERole } from '../../services/gobang-worker/interfaces/role.interface';
import { wuyue } from '../../services/gobang-worker/configs/opens.config';
import { creatPiece } from '../../services/gobang-worker/services/piece.service';
import { commons } from '../../services/gobang-worker/services/commons.service';

const boards = commons.getOpenBoard([
  [7, 7],
  [4, 7],
  [7, 8],
  [6, 7],
  [7, 10],
  [8, 7],
  [5, 7],
  [4, 6],
  [5, 9],
  [4, 5],
  [9, 7],
  [8, 8],
  [5, 3],
  [8, 8],
  [5, 2],
  [8, 9],
  [5, 4],
  [8, 10],
  [0, 6],
  [1, 7],
  [0, 5],
  [13, 5],
  [0, 4],
  [11, 5],
  [0, 2],
  [0, 1]
]);

const initialStateTest: IGameStatus = {
  gameType: GameType.DUEL_BLOCK,
  board: boards,
  name: wuyue.name,
  playChess: ERole.black,
  steps: 0,
  winning: ERole.empty,
  winMap: [],
  piece: creatPiece({ x: 0, y: 0, role: ERole.empty }),
  spendTime: 0
};

const initialState: IGameStatus = {
  gameType: GameType.DUEL_READY,
  board: wuyue.pieces,
  name: wuyue.name,
  playChess: ERole.empty,
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

export const gobangReducer = createReducer(initialStateTest, (builder) => {
  builder
    .addCase(gameInit, () => {
      return initialState;
    })
    .addCase(gameChangeState, (state, action) => {
      state.gameType = action.payload.gameType;

      state.playChess = action.payload?.playChess || state.playChess;
      state.winning = action.payload?.winning || state.winning;
      state.winMap = action.payload?.winMap || state.winMap;
      state.board = action.payload?.board || state.board;
      state.name = action.payload?.name || state.name;
    })
    .addCase(gamePut, (state, action) => {
      const { piece } = action.payload;
      state.steps += 1;
      piece.step = state.steps;
      state.piece = piece;
      state.board[piece.y][piece.x] = piece;
      state.gameType = piece.role === ERole.white ? GameType.DUEL_BLOCK : GameType.DUEL_WHITE;

      if (piece.role === ERole.black) {
        startTime = new Date().getTime();
      } else {
        endTime = new Date().getTime();
        state.spendTime = (endTime - startTime) / 1000;
      }
    });
});
