import { createAction } from '@reduxjs/toolkit';

import { IWorkerRequest } from '../interfaces/worker.interface';

export const changeWorkerPost = createAction<IWorkerRequest>('worker/post');
