import { put, call, takeEvery } from 'redux-saga/effects';

import { SAVE_INFO, DELETE_INFO, SAVE_TOKEN } from '../actionType/AuthType';
import { getAuthTokenApi, getUserInfoApi } from '../../services/authService';

// 提交用户token
function saveToken(option) {
  return {
    type: SAVE_TOKEN,
    payload: {
      token: option
    }
  };
}

// 提交用户信息
function saveInfo(option) {
  return {
    type: SAVE_INFO,
    payload: {
      userInfo: option,
      isSignIn: true
    }
  };
}

// 删除用户信息
function deletedInfo() {
  return {
    type: DELETE_INFO,
  };
}

// 异步任务 - 获取用户信息
function* getUserInfo() {
  try {
    const data = yield call(getUserInfoApi);
    yield put(saveInfo(data));
  } catch (e) {
    yield put(deletedInfo());
  }
}

// 异步任务 - 获取用户token并且保存到store
function* getAuthToken(action) {
  try {
    const data = yield call(getAuthTokenApi, action.payload);
    yield put(saveToken(data));
    yield call(getUserInfo);
  } catch (e) {
    console.log(e);
  }
}

// 开始异步 - 登陆任务
function* signIn() {
  yield takeEvery('SIGN_IN', getAuthToken);
}

// 开始异步 - 登陆任务
function* getInfo() {
  yield takeEvery('GET_INFO', getUserInfo);
}

export default [
  signIn(),
  getInfo(),
];
