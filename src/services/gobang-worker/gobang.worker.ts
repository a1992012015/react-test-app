import { IWorkerRequest, IWRConfig, IWRPut, IWRStart } from './interfaces/gobang-worker.interface';
import { WorkerType } from '../../stores/interfaces/worker.interface';
import { GobangAI } from './services/gobang-ai.service';
import { AI } from './configs/ai.config';

let gobangAI: GobangAI = new GobangAI();

// eslint-disable-next-line no-restricted-globals
addEventListener('message', (event: MessageEvent<IWorkerRequest>) => {
  AI.log && console.log(`%c=========== ${WorkerType[event.data.type]} ===========`, 'color: red;');
  const { payload, type } = event.data;
  AI.log && console.log('get message:', payload);
  if (type === WorkerType.START) {
    // 开始游戏
    const startD = payload as IWRStart;
    gobangAI = new GobangAI();
    const open = gobangAI.start(startD.first, startD.randomOpening);

    postMessage({
      type: WorkerType.BOARD,
      payload: { ...open, first: startD.first, open: startD.randomOpening }
    });
  } else if (type === WorkerType.BEGIN) {
    // 电脑下棋
    const p = gobangAI.begin();

    postMessage({ type: WorkerType.PUT, payload: { piece: p } });
  } else if (type === WorkerType.GO) {
    // 走一步棋
    const goD = payload as IWRPut;
    const p = gobangAI.turn(goD.piece.x, goD.piece.y);

    postMessage({ type: WorkerType.PUT, payload: { piece: p } });
  } else if (type === WorkerType.BACKWARD) {
    // 悔棋
    const { board, backward } = gobangAI.backward();
    postMessage({
      type: WorkerType.BACKWARD,
      payload: { ...board, backward }
    });
  } else if (type === WorkerType.FORWARD) {
    // 返回悔棋的一步
    const { board, forward } = gobangAI.forward();
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
