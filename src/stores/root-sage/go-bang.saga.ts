import { put } from 'redux-saga/effects';

import { gameStart } from '../actions/go-bang.action';

function* GoBangWorkerMessage() {
  yield put(gameStart);
}

const goBangSaga = [
  GoBangWorkerMessage()
];

export default goBangSaga;
