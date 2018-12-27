import { all } from 'redux-saga/effects';

import chessAction from './ChessAction';

export default function* rootSaga() {
  yield all([
    ...chessAction
  ]);
}
