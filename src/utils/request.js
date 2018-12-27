import axios, { AxiosError } from 'axios';
import { store } from '../store';

const errorHandle = (error) => {
  const { response } = error;
  let msg;
  let statusCode;
  if (response && response instanceof Object) {
    const { data, statusText } = response;
    statusCode = response.status;

    if (data instanceof Object) {
      msg = data.message || statusText;
    } else {
      msg = data;
    }
  } else {
    statusCode = 600;
    msg = error.message || 'Network Error';
  }

  return Promise.reject({ success: false, statusCode, message: msg, error });
};

axios.interceptors.response.use(response => response.data, errorHandle);

axios.interceptors.request.use(config => {
  return config;
});

const authRequest = axios.create();

authRequest.interceptors.response.use(response => response.data, errorHandle);

authRequest.interceptors.request.use(config => {
  const { auth } = store.getState();

  if (auth.token.access_token) {
    return {
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `${auth.token.token_type} ${auth.token.access_token}`
      }
    };
  }

  return config;
});

const request = axios;

export { request, authRequest };
