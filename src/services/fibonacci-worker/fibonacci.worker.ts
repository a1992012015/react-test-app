/// <reference lib="webworker" />

import { fibonacci } from './fibonacci';
import { app } from '../../configs/commons.config';

// eslint-disable-next-line no-restricted-globals
addEventListener('message', ({ data }) => {
  app.log && console.log('get message data', data);
  if (data <= 0) {
    return;
  }

  postMessage(fibonacci(data));
});
