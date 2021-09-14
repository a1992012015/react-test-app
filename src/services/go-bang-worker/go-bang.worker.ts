import { WorkerRequest, WorkerType } from './interfaces/go-bang-worker.interface';
import { ERole } from './interfaces/role.interface';
import { AI } from './configs/ai.config';
import { goBangAI } from './services/go-bang-ai.service';

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<WorkerRequest>) => {
  const d = event.data;
  console.log('get message:', d);
  console.log('get type:', WorkerType[d.type]);
  if (d.type === WorkerType.START) {
    const open = goBangAI.start(!!d.first, d.randomOpening);
    postMessage({
      type: WorkerType.BOARD,
      data: { ...open, first: d?.first ? ERole.hum : ERole.com }
    });
  } else if (d.type === WorkerType.BEGIN) {
    const p = goBangAI.begin();
    postMessage({
      type: WorkerType.PUT,
      data: { piece: p }
    });
  } else if (d.type === WorkerType.GO && d.piece) {
    const p = goBangAI.turn(d.piece.x, d.piece.y);
    postMessage({
      type: WorkerType.PUT,
      data: { piece: p }
    });
  } else if (d.type === WorkerType.BACKWARD) {
    goBangAI.backward();
    postMessage({
      type: WorkerType.BACKWARD
    });
  } else if (d.type === WorkerType.FORWARD) {
    goBangAI.forward();
    postMessage({
      type: WorkerType.FORWARD
    });
  } else if (d.type === WorkerType.CONFIG) {
    const { config } = d;
    if (config?.searchDeep !== undefined) {
      AI.searchDeep = config.searchDeep;
    }
    if (config?.countLimit !== undefined) {
      AI.countLimit = config.countLimit;
    }
    if (config?.vcxDeep !== undefined) {
      AI.vcxDeep = config.vcxDeep;
    }
    if (config?.timeLimit !== undefined) {
      AI.timeLimit = config.timeLimit;
    }
    postMessage({
      type: WorkerType.CONFIG
    });
  }
});
