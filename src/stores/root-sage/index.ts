import { all } from 'redux-saga/effects';

import goBangSaga from './go-bang.saga';

export default function* rootSaga() {
  yield all([
    ...goBangSaga
  ]);
}
