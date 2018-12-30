import F from './Fibonacci';

// Respond to message from parent thread
self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
  if (!e) return;
  console.log(e.data);

  const num = F(e.data);

  postMessage(num);
});
