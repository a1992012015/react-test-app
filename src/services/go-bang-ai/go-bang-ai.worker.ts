import GoBangAI from './services/main';
import { aiConfig } from './configs/ai-config';
import { WorkerRequest, WorkerType } from './interfaces/go-bang.interface';
import { Role } from './interfaces/open-pants.interface';

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<WorkerRequest>) => {
  const d = event.data;
  console.log('get message:', d);
  console.log('get type:', WorkerType[d.type])
  if (d.type === WorkerType.START) {
    const open = GoBangAI.start(!!d?.first, d.randomOpening);
    postMessage({
      type: WorkerType.BOARD,
      data: { ...open, first: !!d?.first ? Role.hum : Role.com },
    });
  } else if (d.type === WorkerType.BEGIN) {
    const p = GoBangAI.begin();
    postMessage({
      type: WorkerType.PUT,
      data: p
    });
  } else if (d.type === WorkerType.GO && d.piece) {
    const p = GoBangAI.turn(d.piece.x || 0, d.piece.y || 0);
    postMessage({
      type: WorkerType.PUT,
      data: p
    });
  } else if (d.type === WorkerType.BACKWARD) {
    GoBangAI.backward();
    postMessage({
      type: WorkerType.BACKWARD
    });
  } else if (d.type === WorkerType.FORWARD) {
    GoBangAI.forward();
    postMessage({
      type: WorkerType.FORWARD
    });
  } else if (d.type === WorkerType.CONFIG) {
    const config = d.aiConfig;
    if (config?.searchDeep !== undefined) {
      aiConfig.searchDeep = config.searchDeep;
    }
    if (config?.countLimit !== undefined) {
      aiConfig.countLimit = config.countLimit;
    }
    if (config?.vcxDeep !== undefined) {
      aiConfig.vcxDeep = config.vcxDeep;
    }
    if (config?.timeLimit !== undefined) {
      aiConfig.timeLimit = config.timeLimit;
    }
    postMessage({
      type: WorkerType.CONFIG
    });
  }
});
