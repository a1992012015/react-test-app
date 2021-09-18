import React, { MouseEvent } from 'react';
import { Button } from 'antd';

import styles from './gobang-controller.module.less';
import { GameType } from '../../../stores/interfaces/gobang.interface';
import { BaseComponent } from '../../../components/should-component-update';
import { ERole } from '../../../services/gobang-worker/interfaces/role.interface';
import { IPiece } from '../../../services/gobang-worker/interfaces/piece.interface';

export interface Props {
  time: number;
  width: number;
  steps: number;
  first: ERole;
  piece: IPiece;
  winning: ERole;
  gameStatus: GameType;
  gameReset(): void;
  gameStart(first: boolean, opening: boolean): void;
  gameForward(): void;
  gameBackward(): void;
}

export class GobangController extends BaseComponent<Props> {
  gameStartWay = (first: number) => {
    return (event: MouseEvent<HTMLElement>): void => {
      console.log(event);
      if (first === 1) {
        this.props.gameStart(false, false);
      } else if (first === 2) {
        this.props.gameStart(true, true);
      } else {
        this.props.gameStart(true, false);
      }
    };
  };

  getChessColor = (): string => {
    const { piece, first } = this.props;

    if (piece.role === ERole.empty && first === ERole.empty) {
      return 'lime';
    } else if (piece.role === ERole.empty && first === ERole.white) {
      return 'white';
    } else if (piece.role === ERole.empty && first === ERole.block) {
      return 'black';
    } else if (piece.role === ERole.block) {
      return 'white';
    } else if (piece.role === ERole.white) {
      return 'black';
    } else {
      return 'lime';
    }
  };

  render(): React.ReactNode {
    const { width, piece, first } = this.props;
    const active = piece.role === ERole.empty && first === ERole.empty ? '' : styles.active;
    return (
      <div className={styles.container} style={{ width: width * 16 }}>
        <div className={styles.tips}>
          <svg viewBox="0 0 50 50" className={`${styles.loadingSvg} ${active}`}>
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
    const { gameStatus, winning, steps, piece, time } = this.props;

    if (gameStatus === GameType.DUEL_FINISH) {
      return `${winning === ERole.white ? '圆环之理' : '您居然'}赢得了胜利！！！`;
    }
    if (gameStatus === GameType.DUEL_READY) {
      return '点击开始按钮开始游戏';
    }
    if (gameStatus === GameType.DUEL_HUM && steps === 0) {
      return '您的先手，请落子';
    }
    if (gameStatus === GameType.DUEL_HUM) {
      return `Score: ${piece.score} Step: ${steps} Time: ${time}s`;
    }
    return '电脑正在思考中。。。';
  };

  renderActions = (): React.ReactNode => {
    const { gameStatus } = this.props;
    if (gameStatus === GameType.DUEL_READY) {
      return (
        <React.Fragment>
          <Button type="primary" size="large" onClick={this.gameStartWay(1)}>
            先手开始
          </Button>
          <Button type="primary" size="large" onClick={this.gameStartWay(2)}>
            随机开始
          </Button>
          <Button type="primary" size="large" onClick={this.gameStartWay(3)}>
            后手开始
          </Button>
        </React.Fragment>
      );
    }
    const { gameReset, gameForward, gameBackward } = this.props;
    return (
      <React.Fragment>
        <Button type="primary" size="large" onClick={gameForward}>
          前一步
        </Button>
        <Button type="primary" size="large" onClick={gameReset}>
          重置游戏
        </Button>
        <Button type="primary" size="large" onClick={gameBackward}>
          后一步
        </Button>
      </React.Fragment>
    );
  };
}
