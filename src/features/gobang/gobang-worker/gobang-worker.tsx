import React from 'react';
import { connect } from 'react-redux';

import { BaseComponent } from '../../../components/should-component-update';
import { IWorkerRequest } from '../../../services/gobang-worker/interfaces/gobang-worker.interface';
import { GameType, IGameStart } from '../../../stores/interfaces/gobang.interface';
import {
  gameSagaChangeBackward,
  gameSagaChangeConfig,
  gameSagaChangeForward,
  gameSagaPut,
  gameSagaStart
} from '../../../stores/actions/gobang.action';
import {
  IWorkerResponse,
  IWRBackward,
  IWRForward,
  IWRPut,
  IWRStart,
  WorkerType
} from '../../../stores/interfaces/worker.interface';
import { AppDispatch, RootState } from '../../../stores/interfaces/store.interface';
import { ERole } from '../../../services/gobang-worker/interfaces/role.interface';
import { app } from '../../../configs/commons.config';

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
      app.log && console.log(`%c========== ${WorkerType[data.type]} ==========`, 'color: aqua;');
      app.log && console.log('get onmessage:', data);

      if (data.type === WorkerType.PUT) {
        const putData = data.payload as IWRPut;
        const payload = {
          gameType: putData.piece.role === ERole.white ? GameType.DUEL_BLOCK : GameType.DUEL_WHITE,
          piece: putData.piece
        };

        this.props.dispatch(gameSagaPut(payload));
      } else if (data.type === WorkerType.BOARD) {
        // 返回的开局
        const boardData = data.payload as IWRStart;
        const payload: IGameStart = {
          board: boardData.board,
          piece: boardData.piece,
          name: boardData.name,
          first: boardData.first,
          open: boardData.open
        };
        this.props.dispatch(gameSagaStart(payload));
      } else if (data.type === WorkerType.BACKWARD) {
        app.log && console.log('悔棋成功。。。');
        const backwardData = data.payload as IWRBackward;
        app.log && console.log('backwardData', backwardData);
        this.props.dispatch(gameSagaChangeBackward(backwardData));
      } else if (data.type === WorkerType.FORWARD) {
        app.log && console.log('前进成功。。。');
        const forwardData = data.payload as IWRForward;
        this.props.dispatch(gameSagaChangeForward(forwardData));
      } else if (data.type === WorkerType.CONFIG) {
        app.log && console.log('设置config成功。。。');
        this.props.dispatch(gameSagaChangeConfig());
      } else {
        // TODO 意外的Type返回，无法处理，检查代码，或者结束游戏
        app.log && console.log(`worker => ${WorkerType[data.type]}`);
        app.log && console.log('错误的Type。。。');
      }
    };

    this.gameWorker.onerror = (e) => {
      app.log && console.warn(e);
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
