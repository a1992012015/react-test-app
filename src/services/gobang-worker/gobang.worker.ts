import { WorkerType } from '../../stores/interfaces/worker.interface';
import { ERole } from './interfaces/role.interface';
import { AI } from './configs/ai.config';
import { goBangAI } from './services/gobang-ai.service';
import { IWorkerRequest, IWRConfig, IWRPut, IWRStart } from './interfaces/gobang-worker.interface';

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<IWorkerRequest>) => {
  const { payload, type } = event.data;
  AI.log && console.log(`%c=============== ${WorkerType[type]} ===============`, 'color: red;');
  AI.log && console.log('get message:', payload);
  if (type === WorkerType.START) {
    // 开始游戏
    const startD = payload as IWRStart;
    const open = goBangAI.start(startD.first, startD.randomOpening);

    postMessage({
      type: WorkerType.BOARD,
      payload: { ...open, first: startD.first ? ERole.block : ERole.white }
    });
  } else if (type === WorkerType.BEGIN) {
    // 电脑下棋
    const p = goBangAI.begin();

    postMessage({ type: WorkerType.PUT, payload: { piece: p } });
  } else if (type === WorkerType.GO) {
    // 走一步棋
    const goD = payload as IWRPut;
    const p = goBangAI.turn(goD.piece.x, goD.piece.y);

    postMessage({ type: WorkerType.PUT, payload: { piece: p } });
  } else if (type === WorkerType.BACKWARD) {
    // 悔棋
    const { board, backward } = goBangAI.backward();
    postMessage({
      type: WorkerType.BACKWARD,
      payload: { ...board, backward }
    });
  } else if (type === WorkerType.FORWARD) {
    // 返回悔棋的一步
    const { board, forward } = goBangAI.forward();
    postMessage({
      type: WorkerType.FORWARD,
      payload: { ...board, forward }
    });
  } else if (type === WorkerType.CONFIG) {
    // 设置config
    const { config } = payload as IWRConfig;
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

    postMessage({ type: WorkerType.CONFIG });
  }
});
