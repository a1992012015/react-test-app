/// <reference lib="webworker" />

import F from './fibonacci';

// eslint-disable-next-line no-restricted-globals
addEventListener('message', ({ data }) => {
  console.log('get message data', data);
  if (data <= 0) {
    return;
  }

  const num = F(data);

  postMessage(num);
});
