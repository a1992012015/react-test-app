import React from 'react';
import { connect } from 'react-redux';

import { BaseComponent } from '../../../components/should-component-update';
import { IWorkerRequest } from '../../../stores/interfaces/worker.interface';
import { GameType } from '../../../stores/interfaces/gobang.interface';
import {
  gameSagaChangeGame,
  gameSagaPut,
  gameChangeState
} from '../../../stores/actions/gobang.action';
import {
  IWorkerResponse,
  IWResponsePut,
  IWResponseStart,
  WorkerType
} from '../../../services/gobang-worker/interfaces/gobang-worker.interface';
import { AppDispatch, RootState } from '../../../stores/interfaces/store.interface';
import { ERole } from '../../../services/gobang-worker/interfaces/role.interface';

interface IProps {
  workerPost: IWorkerRequest;
  dispatch: AppDispatch;
}

class GobangWorker extends BaseComponent<IProps> {
  // static defaultProps = { dispatch: {}, workerPost: undefined };
  gameWorker?: Worker;

  componentDidMount(): void {
    this.gameWorker = new Worker('../../../services/gobang-worker/gobang.worker.ts', {
      type: 'module'
    });

    this.gameWorker.onmessage = (event: MessageEvent<IWorkerResponse>) => {
      const { data } = event;
      console.log(`%c=============== ${WorkerType[data.type]} ===============`, 'color: aqua;');
      console.log('get onmessage:', data);

      if (data.type === WorkerType.PUT) {
        const putData = data.payload as IWResponsePut;
        const payload = {
          gameType: putData.piece.role === ERole.white ? GameType.DUEL_HUM : GameType.DUEL_COM,
          piece: putData.piece
        };

        this.props.dispatch(gameSagaPut(payload));
      } else if (data.type === WorkerType.BOARD) {
        // 返回的开局
        const putData = data.payload as IWResponseStart;
        const payload = {
          gameType: putData.first ? GameType.DUEL_HUM : GameType.DUEL_COM,
          first: putData.first ? ERole.block : ERole.white,
          board: putData.pieces
        };
        this.props.dispatch(gameChangeState(payload));
      } else if (data.type === WorkerType.BACKWARD) {
        console.log('悔棋成功。。。');
        this.props.dispatch(gameSagaChangeGame());
      } else if (data.type === WorkerType.FORWARD) {
        console.log('前进成功。。。');
        this.props.dispatch(gameSagaChangeGame());
      } else if (data.type === WorkerType.CONFIG) {
        console.log('设置config成功。。。');
        this.props.dispatch(gameSagaChangeGame());
      } else {
        // TODO 意外的Type返回，无法处理，检查代码，或者结束游戏
        console.log(`worker => ${WorkerType[data.type]}`);
        console.log('错误的Type。。。');
      }
    };

    this.gameWorker.onerror = (e) => {
      console.warn(e);
    };
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<unknown>): void {
    const { workerPost } = this.props;

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

export const GoBangWorkerRedux = connect(mapStateToProps, mapDispatchToProps)(GobangWorker);
