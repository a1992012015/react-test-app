import { createReducer } from '@reduxjs/toolkit';

import { changeWorkerPost } from '../actions/worker.action';
import { WorkerType } from '../../services/go-bang-ai/interfaces/go-bang.interface';
import { WorkerStatus } from '../interfaces/worker.interface';

const initialState: WorkerStatus = {
  type: WorkerType.START
};

export const workerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeWorkerPost, (state, action) => {
      return action.payload;
    });
});
