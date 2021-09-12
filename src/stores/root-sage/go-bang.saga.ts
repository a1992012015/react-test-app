import { put } from 'redux-saga/effects';
import { Action } from '@reduxjs/toolkit';
import { PutEffect } from '@redux-saga/core/effects';

import { gameStart } from '../actions/go-bang.action';

function* GoBangWorkerMessage(): Generator<PutEffect<Action>> {
  yield put(gameStart);
}

const goBangSaga = [GoBangWorkerMessage()];

export default goBangSaga;
