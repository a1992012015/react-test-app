import { createAction } from '@reduxjs/toolkit';

import { IGamePut, IGameStart, IGameStatus } from '../interfaces/go-bang.interface';

export const gameStart = createAction<IGameStart>('goBang/start');
export const gameInit = createAction<IGameStatus>('goBang/init');
export const gamePut = createAction<IGamePut>('goBang/put');

export const gameSagaPut = createAction<IGamePut>('goBang/saga/put');
