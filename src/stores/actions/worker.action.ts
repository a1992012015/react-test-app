import { createAction } from '@reduxjs/toolkit';

import { IWorkerRequest } from '../../services/gobang-worker/interfaces/gobang-worker.interface';

export const changeWorkerPost = createAction<IWorkerRequest>('worker/post');
