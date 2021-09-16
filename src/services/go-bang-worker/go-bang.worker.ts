import {
  IWorkerRequest,
  IWRequestConfig,
  IWRequestPut,
  IWRequestStart,
  WorkerType
} from './interfaces/go-bang-worker.interface';
import { ERole } from './interfaces/role.interface';
import { AI } from './configs/ai.config';
import { goBangAI } from './services/go-bang-ai.service';

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<IWorkerRequest>) => {
  const { payload, type } = event.data;
  console.log(`%c=============== ${WorkerType[type]} ===============`, 'color: red;');
  console.log('get message:', payload);
  if (type === WorkerType.START) {
    const startD = payload as IWRequestStart;
    const open = goBangAI.start(startD.first, startD.randomOpening);
    postMessage({
      type: WorkerType.BOARD,
      payload: { ...open, first: startD.first ? ERole.block : ERole.white }
    });
  } else if (type === WorkerType.BEGIN) {
    const p = goBangAI.begin();
    postMessage({
      type: WorkerType.PUT,
      payload: { piece: p }
    });
  } else if (type === WorkerType.GO) {
    const goD = payload as IWRequestPut;
    const p = goBangAI.turn(goD.piece.x, goD.piece.y);
    postMessage({
      type: WorkerType.PUT,
      payload: { piece: p }
    });
  } else if (type === WorkerType.BACKWARD) {
    goBangAI.backward();
    postMessage({
      type: WorkerType.BACKWARD
    });
  } else if (type === WorkerType.FORWARD) {
    goBangAI.forward();
    postMessage({
      type: WorkerType.FORWARD
    });
  } else if (type === WorkerType.CONFIG) {
    const { config } = payload as IWRequestConfig;
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
