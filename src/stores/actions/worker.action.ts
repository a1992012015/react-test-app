import { createAction } from '@reduxjs/toolkit';

import { WorkerStatus } from '../interfaces/worker.interface';

export const changeWorkerPost = createAction<WorkerStatus>('worker/post');
