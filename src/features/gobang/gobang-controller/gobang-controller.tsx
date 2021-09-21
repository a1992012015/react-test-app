import React, { MouseEvent } from 'react';
import { Button, Select } from 'antd';

import styles from './gobang-controller.module.less';
import { GameType } from '../../../stores/interfaces/gobang.interface';
import { BaseComponent } from '../../../components/should-component-update';
import { ERole } from '../../../services/gobang-worker/interfaces/role.interface';
import { IPiece } from '../../../services/gobang-worker/interfaces/piece.interface';
import { app } from '../../../configs/commons.config';

export interface IProps {
  time: number;
  width: number;
  steps: number;
  piece: IPiece;
  winning: ERole;
  playChess: ERole;
  gameStatus: GameType;
  gameReset(): void;
  gameStart(first: boolean, opening: boolean): void;
  gameForward(): void;
  gameBackward(): void;
}

interface IState {
  first: boolean;
  open: boolean;
}

export class GobangController extends BaseComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      first: true,
      open: false
    };
  }

  gameStartWay = (event: MouseEvent<HTMLElement>): void => {
    app.log && console.log(event);
    const { first, open } = this.state;
    this.props.gameStart(first, open);
  };

  changeState = (key: keyof IState) => {
    return (value: number): void => {
      this.setState({ ...this.state, [key]: !!value });
    };
  };

  changeOpen = (first: number): void => {
    this.setState({ open: !!first });
  };

  getChessColor = (): string => {
    const { piece, playChess, winning } = this.props;

    if (piece.role === ERole.empty && playChess === ERole.empty) {
      return 'lime';
    } else if (piece.role === ERole.empty && playChess === ERole.white) {
      return 'white';
    } else if (piece.role === ERole.empty && playChess === ERole.black) {
      return 'black';
    } else if (winning === ERole.black) {
      return 'black';
    } else if (winning === ERole.white) {
      return 'white';
    } else if (piece.role === ERole.black) {
      return 'white';
    } else if (piece.role === ERole.white) {
      return 'black';
    } else {
      return 'lime';
    }
  };

  getActiveClass = (): string => {
    const { piece, playChess, winning } = this.props;
    if (piece.role === ERole.empty && playChess === ERole.empty) {
      return '';
    } else if (winning !== ERole.empty) {
      return '';
    } else {
      return styles.active;
    }
  };

  render(): React.ReactNode {
    const { width } = this.props;
    return (
      <div className={styles.container} style={{ width: width * 16 }}>
        <div className={styles.tips}>
          <svg viewBox="0 0 50 50" className={`${styles.loadingSvg} ${this.getActiveClass()}`}>
            <circle className={styles.path} cx="25" cy="25" r="20" fill="none" />
            <circle cx="25" cy="25" r="17" fill={this.getChessColor()} />
          </svg>

          {this.renderMessage()}
        </div>

        <div className={styles.actions}>{this.renderActions()}</div>
      </div>
    );
  }

  renderMessage = (): string => {
    const { gameStatus, winning, steps, piece, time, playChess } = this.props;

    if (gameStatus === GameType.DUEL_FINISH) {
      return `${winning === ERole.white ? '圆环之理' : '您居然'}赢得了胜利！！！`;
    } else if (gameStatus === GameType.DUEL_READY) {
      return '点击开始按钮开始游戏';
    } else if (gameStatus === GameType.DUEL_BLOCK && steps === 0) {
      return '您的先手，请落子';
    } else if (gameStatus === GameType.DUEL_WHITE && steps === 0) {
      return '您的后手，请落子';
    } else if (
      (gameStatus === GameType.DUEL_BLOCK && playChess === ERole.white) ||
      (gameStatus === GameType.DUEL_WHITE && playChess === ERole.black)
    ) {
      return '电脑正在思考中。。。';
    } else {
      return `Score: ${piece.score} Step: ${steps} Time: ${time}s`;
    }
  };

  renderActions = (): React.ReactNode => {
    const { gameReset, gameForward, gameBackward, steps, playChess, gameStatus } = this.props;
    const { first, open } = this.state;
    if (gameStatus === GameType.DUEL_READY) {
      return (
        <React.Fragment>
          <Button className={styles.btn} type="primary" size="large" onClick={this.gameStartWay}>
            开始
          </Button>

          <Select
            className={styles.btn}
            value={first ? 1 : 0}
            size="large"
            onChange={this.changeState('first')}>
            <Select.Option value={1}>先手</Select.Option>
            <Select.Option value={0}>后手</Select.Option>
          </Select>

          <Select
            className={styles.btn}
            value={open ? 1 : 0}
            disabled
            size="large"
            onChange={this.changeState('open')}>
            <Select.Option value={0}>自定义开局</Select.Option>
            <Select.Option value={1}>随机开局</Select.Option>
          </Select>
        </React.Fragment>
      );
    }
    const white = gameStatus === GameType.DUEL_WHITE;
    const block = gameStatus === GameType.DUEL_BLOCK;
    const disabled = steps !== 0 && playChess === ERole.black ? white : block;
    return (
      <React.Fragment>
        <Button type="primary" size="large" disabled={disabled} onClick={gameBackward}>
          悔棋
        </Button>
        <Button type="primary" size="large" onClick={gameReset}>
          重置游戏
        </Button>
        <Button type="primary" size="large" disabled onClick={gameForward}>
          放弃悔棋
        </Button>
      </React.Fragment>
    );
  };
}
