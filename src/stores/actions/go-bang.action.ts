import { createAction } from '@reduxjs/toolkit';

import { IGameStart, IGameStatus } from '../interfaces/go-bang.interface';

export const gameStart = createAction<IGameStart>('goBang/start');
export const gameInit = createAction<IGameStatus>('goBang/init');
export const gamePut = createAction<IGameStatus>('goBang/put');
