import AI from '../../../gameAi/ai';
import config from '../../../gameAi/config';

const ai = new AI();

self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
  if (!e) return;

  const d = e.data;
  console.log('get message:', d);
  if (d.type === 'START') {
    const open = ai.start(d.random);
    postMessage({
      type: 'board',
      data: open
    });
  } else if (d.type === 'BEGIN') {
    const p = ai.begin();
    postMessage({
      type: 'put',
      data: p
    });
  } else if (d.type === 'GO') {
    const p = ai.turn(e.data.x, e.data.y);
    postMessage({
      type: 'put',
      data: p
    });
  } else if (d.type === 'BACKWARD') {
    ai.backward();
  } else if (d.type === 'FORWARD') {
    ai.forward();
  } else if (d.type === 'CONFIG') {
    const c = e.data.config;
    if (c.searchDeep) config.searchDeep = c.searchDeep;
    if (c.countLimit) config.countLimit = c.countLimit;
    if (c.vcxDeep) config.vcxDeep = c.vcxDeep;
    if (c.timeLimit) config.timeLimit = c.timeLimit;
    if (c.spread !== undefined) config.spreadLimit = c.spread;
  }

});
