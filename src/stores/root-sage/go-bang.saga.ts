import { put, take } from 'redux-saga/effects';
import { PutEffect, TakeEffect } from '@redux-saga/core/effects';

import { gameInit, gameStart } from '../actions/go-bang.action';

function* GoBangWorkerMessage(): Generator<TakeEffect | PutEffect> {
  while (true) {
    const payload = yield take([gameInit]);

    console.log('payload', payload);

    yield put(gameStart);
  }
}

const goBangSaga = [GoBangWorkerMessage()];

export default goBangSaga;
