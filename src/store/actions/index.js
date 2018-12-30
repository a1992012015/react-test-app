import { all } from 'redux-saga/effects';

import gameAction from './GameAction';
import notificationAction from './NotificationAction';
import authAction from './AuthAction';

export default function* rootSaga() {
  yield all([
    ...notificationAction,
    ...gameAction,
    ...authAction
  ]);
}
