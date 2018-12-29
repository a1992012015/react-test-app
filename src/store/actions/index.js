import { all } from 'redux-saga/effects';

import chessAction from './ChessAction';
import gameAction from './GameAction';

export default function* rootSaga() {
  yield all([
    ...chessAction,
    ...gameAction
  ]);
}
