import { createAction } from '@reduxjs/toolkit';

import { IWorkerRequest } from '../../services/gobang-2.0.0/interfaces/gobang-worker.interface';

export const changeWorkerPost = createAction<IWorkerRequest>('worker/post');
