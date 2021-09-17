import { all } from 'redux-saga/effects';
import { AllEffect } from '@redux-saga/core/effects';

import { gobangSaga } from './gobang.saga';

export function* rootSaga(): Generator<AllEffect<unknown>> {
  yield all([...gobangSaga]);
}
