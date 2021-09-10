import { createAction } from '@reduxjs/toolkit';

import { GameStart, GameStatus } from '../interfaces/go-bang.reducer';

export const gameStart = createAction<GameStart>('goBang/start');
export const gameInit = createAction<GameStatus>('goBang/init');
export const gamePut = createAction<GameStatus>('goBang/put');
