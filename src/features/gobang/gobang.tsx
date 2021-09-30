import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import divide from 'lodash-es/divide';

import styles from './gobang.module.less';
import { GobangController } from './gobang-controller/gobang-controller';
import { GoBangWorkerRedux } from './gobang-worker/gobang-worker';
import { GobangCheckerboard } from './gobang-checkerboard/gobang-checkerboard';
import { GameType, IGameStatus } from '../../stores/interfaces/gobang.interface';
import { BaseComponent } from '../../components/should-component-update';
import { changeWorkerPost } from '../../stores/actions/worker.action';
import { IWorkerRequest } from '../../services/gobang-2.0.0/interfaces/gobang-worker.interface';
import { WorkerType } from '../../stores/interfaces/worker.interface';
import { IPiece } from '../../services/gobang-2.0.0/interfaces/piece.interface';
import { AppDispatch, RootState } from '../../stores/interfaces/store.interface';
import { gameInit, gameSagaChangeBoard, gameSagaPut } from '../../stores/actions/gobang.action';
import { creatPiece } from '../../services/gobang-2.0.0/services/piece.service';
import { IAI } from '../../services/gobang-2.0.0/interfaces/ai.interface';
import { dynamicTitle } from '../../components/dynamic-title';
import { app } from '../../configs/commons.config';
import { ERole } from '../../services/gobang-2.0.0/interfaces/role.interface';

interface IState {
  width: number;
  clickPiece: IPiece;
}

interface IProps extends IGameStatus {
  dispatch: AppDispatch;
}

class Gobang extends BaseComponent<IProps, IState> {
  containerRef: RefObject<HTMLDivElement> = React.createRef();
  initPiece = creatPiece({ x: 0, y: 0, role: ERole.empty });

  constructor(props: IProps) {
    super(props);

    this.state = {
      width: 0,
      clickPiece: this.initPiece
    };
  }

  componentDidMount(): void {
    dynamicTitle('五子棋');
    this.resizeCheckerboard();
    window.addEventListener('resize', this.resizeCheckerboard);
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.resizeCheckerboard);
  }

  /**
   * 启动游戏
   * @param first 是否需要先手
   * @param opening 是否需要随机棋谱
   */
  gameStart = (first: boolean, opening: boolean): void => {
    const post: IWorkerRequest = {
      type: WorkerType.START,
      payload: { first, randomOpening: opening }
    };
    this.props.dispatch(changeWorkerPost(post));
  };

  /**
   * 修改AI配置
   * @param config 需要修改的配置
   */
  gameConfig = (config: IAI): void => {
    app.log && console.log('gameConfig');
    const post: IWorkerRequest = {
      type: WorkerType.CONFIG,
      payload: { config }
    };
    this.props.dispatch(gameSagaChangeBoard(post));
  };

  /**
   * 落子
   * @param piece 需要落子的点的对象
   */
  gameGo = (piece: IPiece): void => {
    app.log && console.log('gameGo piece:', piece);
    const { playChess } = this.props;

    if (/Android|webOS|iPhone|iPad|BlackBerry/i.test(navigator.userAgent)) {
      const { clickPiece } = this.state;

      if (clickPiece.x === piece.x && clickPiece.y === piece.y && clickPiece.role === piece.role) {
        const payload = {
          gameType: playChess === ERole.black ? GameType.DUEL_WHITE : GameType.DUEL_BLOCK,
          piece: creatPiece(piece)
        };
        this.props.dispatch(gameSagaPut(payload));
      } else {
        this.setState({ clickPiece: piece });
      }
    } else {
      const payload = {
        gameType: playChess === ERole.black ? GameType.DUEL_WHITE : GameType.DUEL_BLOCK,
        piece: creatPiece(piece)
      };
      this.props.dispatch(gameSagaPut(payload));
    }
  };

  /**
   * 放弃悔棋
   */
  gameForward = (): void => {
    app.log && console.log('gameForward');
    const post: IWorkerRequest = { type: WorkerType.FORWARD };
    this.props.dispatch(gameSagaChangeBoard(post));
    this.setState({ clickPiece: this.initPiece });
  };

  /**
   * 悔棋
   */
  gameBackward = (): void => {
    app.log && console.log('gameBackward');
    const post: IWorkerRequest = { type: WorkerType.BACKWARD };
    this.props.dispatch(gameSagaChangeBoard(post));
    this.setState({ clickPiece: this.initPiece });
  };

  /**
   * 重置游戏
   */
  gameReset = (): void => {
    app.log && console.log('gameReset');
    this.props.dispatch(gameInit());
    this.setState({ clickPiece: this.initPiece });
  };

  private resizeCheckerboard = (): void => {
    if (this.containerRef?.current) {
      const maxWidth = 720;
      const controllerHeight = 98;
      const bounding = this.containerRef.current.getBoundingClientRect();
      const boundingWidth = bounding.width;
      const boundingHeight = bounding.height - controllerHeight;
      const clientWidth = boundingWidth > boundingHeight ? boundingHeight : boundingWidth;
      const canvasWidth = clientWidth > maxWidth ? maxWidth : clientWidth;
      const width = Math.floor(divide(canvasWidth, 16));

      this.setState({ width });
    }
  };

  render(): React.ReactNode {
    const boardProps = {
      width: this.state.width,
      steps: this.props.steps,
      board: this.props.board,
      winMap: this.props.winMap,
      winning: this.props.winning,
      gameStatus: this.props.gameType,
      playChess: this.props.playChess,
      gameGo: this.gameGo
    };

    const controllerProps = {
      width: this.state.width,
      steps: this.props.steps,
      piece: this.props.piece,
      time: this.props.spendTime,
      winning: this.props.winning,
      playChess: this.props.playChess,
      gameStatus: this.props.gameType,
      gameReset: this.gameReset,
      gameStart: this.gameStart,
      gameForward: this.gameForward,
      gameBackward: this.gameBackward
    };
    return (
      <div ref={this.containerRef} className={styles.container}>
        <GoBangWorkerRedux />

        <GobangCheckerboard {...boardProps} />

        <GobangController {...controllerProps} />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): Omit<IProps, 'dispatch'> => {
  return { ...state.gobang };
};

const mapDispatchToProps = (dispatch: AppDispatch): Omit<IProps, keyof IGameStatus> => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Gobang);
