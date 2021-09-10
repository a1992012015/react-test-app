import React, { MouseEvent } from 'react';
import { Button } from 'antd';

import styles from './go-bang-controller.module.less';
import { GameType } from '../../../stores/interfaces/go-bang.reducer';
import { BaseComponent } from '../../../components/should-component-update';
import { Role } from '../../../services/go-bang-ai/interfaces/open-pants.interface';

interface Props {
  steps: number;
  time: number;
  winning: Role;
  score: number;
  gameStatus: GameType;

  gameReset(): void;

  gameStart(first: boolean, opening: boolean): void;

  gameForward(): void;

  gameBackward(): void;
}

export class GoBangController extends BaseComponent<Props, object> {

  gameStartWay = (first: number) => {
    return (event: MouseEvent<HTMLElement>) => {
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

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.tips}>
          <span className={styles.chess}/>
          {this.renderMessage()}
        </div>

        <div className={styles.actions}>
          {this.renderActions()}
        </div>
      </div>
    );
  }

  renderMessage = () => {
    const { gameStatus, winning, steps, score, time } = this.props;

    if (gameStatus === GameType.DUEL_FINISH) {
      return `${winning === Role.com ? '圆环之理' : '您居然'}赢得了胜利！！！`;
    } else if (gameStatus === GameType.DUEL_READY) {
      return '点击开始按钮开始游戏';
    } else if (gameStatus === GameType.DUEL_HUM && steps === 0) {
      return '您的先手，请落子';
    } else if (gameStatus === GameType.DUEL_HUM) {
      return `Score:${score} Step:${steps} Time:${time}`;
    } else {
      return '电脑正在思考中。。。';
    }
  };

  renderActions = () => {
    const { gameStatus } = this.props;
    if (gameStatus === GameType.DUEL_READY) {
      return (
        <React.Fragment>
          <Button type="primary" size="large" onClick={this.gameStartWay(1)}>先手开始</Button>
          <Button type="primary" size="large" onClick={this.gameStartWay(2)}>随机开始</Button>
          <Button type="primary" size="large" onClick={this.gameStartWay(3)}>后手开始</Button>
        </React.Fragment>
      );
    } else {
      const { gameReset, gameForward, gameBackward } = this.props;
      return (
        <React.Fragment>
          <Button type="primary" size="large" onClick={gameForward}>前一步</Button>
          <Button type="primary" size="large" onClick={gameReset}>重置游戏</Button>
          <Button type="primary" size="large" onClick={gameBackward}>后一步</Button>
        </React.Fragment>
      );
    }
  };
}
