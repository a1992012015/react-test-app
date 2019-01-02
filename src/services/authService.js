import qs from 'qs';
import { request, authRequest } from '../utils/request';
import config from '../config';

export const getAuthTokenApi = data =>
  request.post(`${config.authApi}/oauth/token`, qs.stringify(data), {
    headers: {
      Authorization: 'Basic Y2xpZW50OnNlY3JldA==',
      'Content-type': 'application/x-www-form-urlencoded'
    }
  });

export const getUserInfoApi = () => authRequest.get(`${config.mallApi}/users`);

export const testMocker = () =>
  request.post(`/api/oauth`, {
    username: 'Garnet',
    password: 'liujie123'
  });
