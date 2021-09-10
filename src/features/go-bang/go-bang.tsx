import React from 'react';
import { connect } from 'react-redux';

import styles from './go-bang.module.less';
import { GoBangController } from './go-bang-controller/go-bang-controller';
import { GoBangWorkerRedux } from './go-bang-worker/go-bang-worker';
import { GoBangCheckerboard } from './go-bang-checkerboard/go-bang-checkerboard';
import { AppDispatch, RootState } from '../../stores/main';
import { GameStatus } from '../../stores/interfaces/go-bang.reducer';
import { BaseComponent } from '../../components/should-component-update';
import { Piece } from '../../services/go-bang-ai/interfaces/open-pants.interface';
import { changeWorkerPost } from '../../stores/actions/worker.action';
import { WorkerStatus } from '../../stores/interfaces/worker.interface';
import { WorkerType } from '../../services/go-bang-ai/interfaces/go-bang.interface';

interface State {
  time: number;
  score: number;
}

interface Props extends GameStatus {
  changeWorkerPost(p: WorkerStatus): void;
}

class GoBang extends BaseComponent<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      time: 0,
      score: 0
    };
  }

  gameStart = (first: boolean, opening: boolean) => {
    const post: WorkerStatus = {
      type: WorkerType.START,
      first: first,
      randomOpening: opening
    };
    this.props.changeWorkerPost(post);
  };

  gameConfig = () => {
    console.log('gameConfig');
  };

  gameGo = (piece: Piece) => {
    console.log('gameGo piece:', piece);
    const post: WorkerStatus = {
      type: WorkerType.GO,
      piece: piece
    };
    this.props.changeWorkerPost(post);
  };

  // 前进方法
  gameForward = () => {
    console.log('gameForward');
  };

  // 后退方法
  gameBackward = () => {
    console.log('gameBackward');
  };

  /**
   * 重置游戏
   */
  gameReset = () => {
    console.log('gameReset');
  };

  render() {
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
        <GoBangWorkerRedux/>

        <div className={styles.controller}>
          <GoBangController {...controllerProps}/>
        </div>

        <div className={styles.checkerboard}>
          <GoBangCheckerboard {...boardProps}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return { ...state.goBang };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    changeWorkerPost: (p: WorkerStatus) => dispatch(changeWorkerPost(p))
  };
};

export const GoBangRedux = connect(mapStateToProps, mapDispatchToProps)(GoBang);
