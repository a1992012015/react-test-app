import GoBangAI from './main';
import { aiConfig } from './configs/ai-config';

self.onmessage = function (e) {
  const d = e.data;
  console.log('get message: ');
  console.log(d);
  if (d.type === 'START') {
    const open = GoBangAI.start(d.first, d.randomOpening);
    postMessage({
      type: 'board',
      data: open
    });
  } else if (d.type === 'BEGIN') {
    const p = GoBangAI.begin();
    postMessage({
      type: 'put',
      data: p
    });
  } else if (d.type === 'GO') {
    const p = GoBangAI.turn(e.data.x, e.data.y);
    postMessage({
      type: 'put',
      data: p
    });
  } else if (d.type === 'BACKWARD') {
    GoBangAI.backward();
  } else if (d.type === 'FORWARD') {
    GoBangAI.forward();
  } else if (d.type === 'CONFIG') {
    const data = e.data.aiConfig;
    if (data.searchDeep) aiConfig.searchDeep = data.searchDeep;
    if (data.countLimit) aiConfig.countLimit = data.countLimit;
    if (data.vcxDeep) aiConfig.vcxDeep = data.vcxDeep;
    if (data.timeLimit) aiConfig.timeLimit = data.timeLimit;
    if (data.spread !== undefined) aiConfig.spreadLimit = data.spread;
  }
};
