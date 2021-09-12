import React from 'react';
import { connect } from 'react-redux';

import styles from './go-bang.module.less';
import { GoBangController } from './go-bang-controller/go-bang-controller';
import { GoBangWorkerRedux } from './go-bang-worker/go-bang-worker';
import { GoBangCheckerboard } from './go-bang-checkerboard/go-bang-checkerboard';
import { IGameStatus } from '../../stores/interfaces/go-bang.interface';
import { BaseComponent } from '../../components/should-component-update';
import { changeWorkerPost } from '../../stores/actions/worker.action';
import { WorkerStatus } from '../../stores/interfaces/worker.interface';
import { WorkerType } from '../../services/go-bang-worker/interfaces/go-bang-worker.interface';
import { IPiece } from '../../services/go-bang-worker/interfaces/piece.interface';
import { AppDispatch, RootState } from '../../stores/interfaces/store.interface';

interface IState {
  time: number;
  score: number;
}

interface IProps extends IGameStatus {
  dispatch: AppDispatch;
}

class GoBang extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      time: 0,
      score: 0
    };
  }

  gameStart = (first: boolean, opening: boolean): void => {
    const post: WorkerStatus = {
      type: WorkerType.START,
      first,
      randomOpening: opening
    };
    this.props.dispatch(changeWorkerPost(post));
  };

  gameConfig = (): void => {
    console.log('gameConfig');
  };

  gameGo = (piece: IPiece): void => {
    console.log('gameGo piece:', piece);
    const post: WorkerStatus = {
      type: WorkerType.GO,
      piece
    };
    this.props.dispatch(changeWorkerPost(post));
  };

  // 前进方法
  gameForward = (): void => {
    console.log('gameForward');
  };

  // 后退方法
  gameBackward = (): void => {
    console.log('gameBackward');
  };

  /**
   * 重置游戏
   */
  gameReset = (): void => {
    console.log('gameReset');
  };

  render(): React.ReactNode {
    const boardProps = {
      steps: this.props.steps,
      board: this.props.board,
      winMap: this.props.winMap,
      winning: this.props.winning,
      gameStatus: this.props.gameType,
      gameGo: this.gameGo
    };

    const controllerProps = {
      time: this.state.time,
      steps: this.props.steps,
      score: this.state.score,
      winning: this.props.winning,
      gameStatus: this.props.gameType,
      gameReset: this.gameReset,
      gameStart: this.gameStart,
      gameForward: this.gameForward,
      gameBackward: this.gameBackward
    };
    return (
      <div className={styles.container}>
        <GoBangWorkerRedux />

        <div className={styles.controller}>
          <GoBangController {...controllerProps} />
        </div>

        <div className={styles.checkerboard}>
          <GoBangCheckerboard {...boardProps} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): Omit<IProps, 'dispatch'> => {
  return { ...state.goBang };
};

const mapDispatchToProps = (dispatch: AppDispatch): Omit<IProps, keyof IGameStatus> => ({
  dispatch
});

export const GoBangRedux = connect(mapStateToProps, mapDispatchToProps)(GoBang);
