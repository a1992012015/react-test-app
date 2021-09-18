import { createAction } from '@reduxjs/toolkit';

import { IGamePut, IGameStart } from '../interfaces/gobang.interface';
import { IWorkerRequest } from '../../services/gobang-worker/interfaces/gobang-worker.interface';
import { IWRBackward, IWRForward } from '../interfaces/worker.interface';

export const gameChangeState = createAction<IGameStart>('gobang/start');
export const gamePut = createAction<IGamePut>('gobang/put');
export const gameInit = createAction('gobang/init');

export const gameSagaInit = createAction('gobang/saga/init');
export const gameSagaChangeConfig = createAction('gobang/saga/config');
export const gameSagaPut = createAction<Omit<IGamePut, 'winMap'>>('gobang/saga/put');
export const gameSagaChangeForward = createAction<IWRForward>('gobang/saga/forward');
export const gameSagaChangeBoard = createAction<IWorkerRequest>('gobang/saga/board');
export const gameSagaChangeBackward = createAction<IWRBackward>('gobang/saga/backward');
