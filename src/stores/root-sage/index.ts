import { all } from 'redux-saga/effects';
import { AllEffect } from '@redux-saga/core/effects';

import { goBangSaga } from './go-bang.saga';

export function* rootSaga(): Generator<AllEffect<unknown>> {
  yield all([...goBangSaga]);
}
