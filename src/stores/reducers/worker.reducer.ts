import { createReducer } from '@reduxjs/toolkit';

import { changeWorkerPost } from '../actions/worker.action';
import { WorkerStatus } from '../interfaces/worker.interface';
import { WorkerType } from '../../services/go-bang-worker/interfaces/go-bang-worker.interface';

const initialState: WorkerStatus = {
  type: WorkerType.START
};

export const workerReducer = createReducer(initialState, (builder) => {
  builder.addCase(changeWorkerPost, (state, action) => {
    return action.payload;
  });
});
