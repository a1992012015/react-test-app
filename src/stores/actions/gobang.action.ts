import { createAction } from '@reduxjs/toolkit';

import { IGamePut, IGameChange, IGameStart } from '../interfaces/gobang.interface';
import { IWorkerRequest } from '../../services/gobang-worker/interfaces/gobang-worker.interface';
import { IWRBackward, IWRForward } from '../interfaces/worker.interface';

export const gameChangeState = createAction<IGameChange>('gobang/state');
export const gamePut = createAction<IGamePut>('gobang/put');
export const gameInit = createAction('gobang/init');

export const gameSagaChangeConfig = createAction('gobang/saga/config');
export const gameSagaStart = createAction<IGameStart>('gobang/saga/start');
export const gameSagaPut = createAction<IGamePut>('gobang/saga/put');
export const gameSagaChangeForward = createAction<IWRForward>('gobang/saga/forward');
export const gameSagaChangeBoard = createAction<IWorkerRequest>('gobang/saga/board');
export const gameSagaChangeBackward = createAction<IWRBackward>('gobang/saga/backward');
