import React from 'react';
import { connect } from 'react-redux';

import { BaseComponent } from '../../../components/should-component-update';
import { WorkerStatus } from '../../../stores/interfaces/worker.interface';
import { GameType } from '../../../stores/interfaces/go-bang.interface';
import { gameStart } from '../../../stores/actions/go-bang.action';
import {
  WorkerResponse,
  WorkerType
} from '../../../services/go-bang-worker/interfaces/go-bang-worker.interface';
import { AppDispatch, RootState } from '../../../stores/interfaces/store.interface';

interface IProps {
  workerPost: WorkerStatus;
  dispatch: AppDispatch;
}

class GoBangWorker extends BaseComponent<IProps> {
  // static defaultProps = { dispatch: {}, workerPost: undefined };
  gameWorker?: Worker;

  componentDidMount(): void {
    this.gameWorker = new Worker('../../../services/go-bang-worker/go-bang.worker.ts', {
      type: 'module'
    });

    this.gameWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { data } = event;
      console.log('get response data:', data);

      if (data.type === WorkerType.PUT) {
        console.log(`worker => ${WorkerType[data.type]}`);
        // const endTime = new Date().getTime();
      } else if (data.type === WorkerType.BOARD) {
        // 返回的开局
        console.log(`worker => ${WorkerType[data.type]}`);
        const first = data.data?.first;
        if (data.data?.board) {
          this.props.dispatch(
            gameStart({
              first: first ? GameType.DUEL_HUM : GameType.DUEL_COM,
              board: data.data.board
            })
          );
        } else {
          console.log('没有返回棋盘。。。');
        }
      } else {
        console.log(`worker => ${WorkerType[data.type]}`);
        console.log('错误的Type。。。');
      }
    };

    this.gameWorker.onerror = (e) => {
      console.log(e);
    };
  }

  componentDidUpdate(
    prevProps: Readonly<IProps>,
    prevState: Readonly<unknown>,
    snapshot?: unknown
  ): void {
    console.log('GoBangWorker => componentDidUpdate:', this.props);
    const { workerPost } = this.props;
    console.log('postMessage', workerPost);
    if (workerPost && this.gameWorker) {
      this.gameWorker.postMessage(workerPost);
    }
  }

  componentWillUnmount(): void {
    this.gameWorker?.terminate();
  }

  render(): React.ReactNode {
    return null;
  }
}

const mapStateToProps = (state: RootState): Omit<IProps, 'dispatch'> => {
  return { workerPost: state.worker };
};

const mapDispatchToProps = (dispatch: AppDispatch): Omit<IProps, 'workerPost'> => ({ dispatch });

export const GoBangWorkerRedux = connect(mapStateToProps, mapDispatchToProps)(GoBangWorker);
