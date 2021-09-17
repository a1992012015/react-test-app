import { createAction } from '@reduxjs/toolkit';

import { IGamePut, IGameStart } from '../interfaces/go-bang.interface';
import { IWorkerRequest } from '../interfaces/worker.interface';

export const gameChangeState = createAction<IGameStart>('goBang/start');
export const gameBackward = createAction('goBang/backward');
export const gamePut = createAction<IGamePut>('goBang/put');
export const gameForward = createAction('goBang/forward');
export const gameInit = createAction('goBang/init');

export const gameSagaInit = createAction('goBang/saga/init');
export const gameSagaChangeGame = createAction('goBang/saga/changeGame');
export const gameSagaPut = createAction<Omit<IGamePut, 'winMap'>>('goBang/saga/put');
export const gameSagaChangeBoard = createAction<IWorkerRequest>('goBang/saga/changeBoard');
