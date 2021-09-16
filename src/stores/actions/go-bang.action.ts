import { createAction } from '@reduxjs/toolkit';

import { GameType, IGamePut, IGameStart } from '../interfaces/go-bang.interface';
import { IWorkerRequest } from '../interfaces/worker.interface';

export const gameChangeType = createAction<GameType>('goBang/changType');
export const gameStart = createAction<IGameStart>('goBang/start');
export const gamePut = createAction<IGamePut>('goBang/put');
export const gameInit = createAction('goBang/init');

export const gameSagaInit = createAction('goBang/saga/init');
export const gameSagaPut = createAction<IGamePut>('goBang/saga/put');
export const gameSagaChangeGame = createAction('goBang/saga/changeGame');
export const gameSagaChangeBoard = createAction<IWorkerRequest>('goBang/saga/changeBoard');
