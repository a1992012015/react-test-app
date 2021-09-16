import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import divide from 'lodash-es/divide';

import styles from './go-bang.module.less';
import { GoBangController } from './go-bang-controller/go-bang-controller';
import { GoBangWorkerRedux } from './go-bang-worker/go-bang-worker';
import { GoBangCheckerboard } from './go-bang-checkerboard/go-bang-checkerboard';
import { GameType, IGameStatus } from '../../stores/interfaces/go-bang.interface';
import { BaseComponent } from '../../components/should-component-update';
import { changeWorkerPost } from '../../stores/actions/worker.action';
import { IWorkerRequest } from '../../stores/interfaces/worker.interface';
import { WorkerType } from '../../services/go-bang-worker/interfaces/go-bang-worker.interface';
import { IPiece } from '../../services/go-bang-worker/interfaces/piece.interface';
import { AppDispatch, RootState } from '../../stores/interfaces/store.interface';
import {
  gameSagaChangeBoard,
  gameSagaInit,
  gameSagaPut
} from '../../stores/actions/go-bang.action';
import { creatPiece } from '../../services/go-bang-worker/services/piece.service';
import { IAI } from '../../services/go-bang-worker/interfaces/ai.interface';

interface IState {
  width: number;
}

interface IProps extends IGameStatus {
  dispatch: AppDispatch;
}

class GoBang extends BaseComponent<IProps, IState> {
  containerRef: RefObject<HTMLDivElement> = React.createRef();

  constructor(props: IProps) {
    super(props);

    this.state = { width: 0 };
  }

  componentDidMount(): void {
    this.resizeCheckerboard();
    window.addEventListener('resize', this.resizeCheckerboard);
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.resizeCheckerboard);
  }

  gameStart = (first: boolean, opening: boolean): void => {
    const post: IWorkerRequest = {
      type: WorkerType.START,
      payload: { first, randomOpening: opening }
    };
    this.props.dispatch(changeWorkerPost(post));
  };

  gameConfig = (config: IAI): void => {
    console.log('gameConfig');
    const post: IWorkerRequest = {
      type: WorkerType.CONFIG,
      payload: { config }
    };
    this.props.dispatch(gameSagaChangeBoard(post));
  };

  gameGo = (piece: IPiece): void => {
    console.log('gameGo piece:', piece);
    const payload = {
      gameType: GameType.DUEL_COM,
      piece: creatPiece(piece)
    };
    this.props.dispatch(gameSagaPut(payload));
  };

  // 前进方法
  gameForward = (): void => {
    console.log('gameForward');
    const post: IWorkerRequest = { type: WorkerType.FORWARD };
    this.props.dispatch(gameSagaChangeBoard(post));
  };

  // 悔棋
  gameBackward = (): void => {
    console.log('gameBackward');
    const post: IWorkerRequest = { type: WorkerType.BACKWARD };
    this.props.dispatch(gameSagaChangeBoard(post));
  };

  /**
   * 重置游戏
   */
  gameReset = (): void => {
    console.log('gameReset');
    this.props.dispatch(gameSagaInit());
  };

  private resizeCheckerboard = (): void => {
    if (this.containerRef?.current) {
      const maxWidth = 720;
      const bounding = this.containerRef.current.getBoundingClientRect();
      const boundingWidth = bounding.width - 40;
      const boundingHeight = bounding.height - 40;
      const clientWidth = boundingWidth > boundingHeight ? boundingHeight : boundingWidth;
      const canvasWidth = clientWidth > maxWidth ? maxWidth : clientWidth;
      const width = Math.floor(divide(canvasWidth, 16));

      this.setState({ width });
    }
  };

  render(): React.ReactNode {
    const boardProps = {
      width: this.state.width,
      first: this.props.first,
      steps: this.props.steps,
      board: this.props.board,
      winMap: this.props.winMap,
      winning: this.props.winning,
      gameStatus: this.props.gameType,
      gameGo: this.gameGo
    };

    const controllerProps = {
      time: this.props.spendTime,
      width: this.state.width,
      steps: this.props.steps,
      first: this.props.first,
      piece: this.props.piece,
      winning: this.props.winning,
      gameStatus: this.props.gameType,
      gameReset: this.gameReset,
      gameStart: this.gameStart,
      gameForward: this.gameForward,
      gameBackward: this.gameBackward
    };
    return (
      <div ref={this.containerRef} className={styles.container}>
        <GoBangWorkerRedux />

        <GoBangCheckerboard {...boardProps} />

        <GoBangController {...controllerProps} />
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
