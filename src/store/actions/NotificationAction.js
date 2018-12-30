import { take, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { push } from 'connected-react-router';

import { OPEN_NOTIFICATION, CLOSE_NOTIFICATION } from '../actionType/NotificationType';


function openNotification(action) {
  return {
    type: OPEN_NOTIFICATION,
    payload: action
  };
}

function closeNotification() {
  return {
    type: CLOSE_NOTIFICATION
  };
}

// 开始异步 - 消息提示任务开启到结束
function* notification() {
  try {
    while (true) {
      const action = yield take('START_NOTIFICATION');
      yield put(openNotification({ open: true, message: action.payload.message }));
      yield delay(action.payload.time);
      yield put(closeNotification());
      yield put(push('/'));
    }
  } catch (e) {
    console.log(e);
    yield put(closeNotification());
  }

}

export default [
  notification()
];
