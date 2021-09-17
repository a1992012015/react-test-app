import { createAction } from '@reduxjs/toolkit';

import { IGamePut, IGameStart } from '../interfaces/gobang.interface';
import { IWorkerRequest } from '../interfaces/worker.interface';

export const gameChangeState = createAction<IGameStart>('gobang/start');
export const gameBackward = createAction('gobang/backward');
export const gamePut = createAction<IGamePut>('gobang/put');
export const gameForward = createAction('gobang/forward');
export const gameInit = createAction('gobang/init');

export const gameSagaInit = createAction('gobang/saga/init');
export const gameSagaChangeGame = createAction('gobang/saga/changeGame');
export const gameSagaPut = createAction<Omit<IGamePut, 'winMap'>>('gobang/saga/put');
export const gameSagaChangeBoard = createAction<IWorkerRequest>('gobang/saga/changeBoard');
