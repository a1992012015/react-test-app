import { createReducer } from '@reduxjs/toolkit';

import { changeWorkerPost } from '../actions/worker.action';
import { IWorkerRequest } from '../../services/gobang-2.0.0/interfaces/gobang-worker.interface';
import { WorkerType } from '../interfaces/worker.interface';

const initialState: IWorkerRequest = {
  type: WorkerType.START,
  payload: { first: true, randomOpening: false }
};

export const workerReducer = createReducer(initialState, (builder) => {
  builder.addCase(changeWorkerPost, (state, action) => {
    return action.payload;
  });
});
