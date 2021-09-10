import { connect } from 'react-redux';

import { BaseComponent } from '../../../components/should-component-update';
import {
  WorkerResponse,
  WorkerType
} from '../../../services/go-bang-ai/interfaces/go-bang.interface';
import { AppDispatch, RootState } from '../../../stores/main';
import { WorkerStatus } from '../../../stores/interfaces/worker.interface';
import { GameStart, GameType } from '../../../stores/interfaces/go-bang.reducer';
import { gameStart } from '../../../stores/actions/go-bang.action';

interface Props {
  workerPost?: WorkerStatus;

  gameStart(p: GameStart): void;
}

class GoBangWorker extends BaseComponent<Props, object> {
  gameWorker?: Worker;

  componentDidMount() {
    this.gameWorker = new Worker(
      '../../../services/go-bang-ai/go-bang-ai.worker.ts',
      { type: 'module' }
    );

    this.gameWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const data = event.data;
      console.log('get response data:', data);

      if (data.type === WorkerType.PUT) {
        console.log(`worker => ${WorkerType[data.type]}`);
        // const endTime = new Date().getTime();

      } else if (data.type === WorkerType.BOARD) {
        // 返回的开局
        console.log(`worker => ${WorkerType[data.type]}`);
        const first = data.data?.first;
        if (data.data?.board) {
          this.props.gameStart({
            first: first ? GameType.DUEL_HUM : GameType.DUEL_COM,
            board: data.data.board
          });
        } else {
          console.log('没有返回棋盘。。。');
        }
      } else {
        console.log(`worker => ${WorkerType[data.type]}`);
        console.log('错误的Type。。。');
      }
    };

    this.gameWorker.onerror = e => {
      console.log(e);
    };
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
    console.log('GoBangWorker => componentDidUpdate:', this.props);
    const { workerPost } = this.props;
    console.log('postMessage', workerPost);
    if (workerPost && this.gameWorker) {
      this.gameWorker.postMessage(workerPost);
    }
  }

  componentWillUnmount() {
    this.gameWorker?.terminate();
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    workerPost: state.worker
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    gameStart: (p: GameStart) => dispatch(gameStart(p))
  };
};

export const GoBangWorkerRedux = connect(mapStateToProps, mapDispatchToProps)(GoBangWorker);
