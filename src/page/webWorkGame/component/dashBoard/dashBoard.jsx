import React, { Component } from 'react';
import { Button } from '@material-ui/core';

import styles from './dashBoard.module.scss';

export default class extends Component {
  setUpMessage = () => {
    const { game, aiInfo } = this.props;
    if (game.flag && game.king) {
      return `${game.king === 'ai' ? '圆环之理' : '您居然'}赢得了胜利！！！`;
    } else if (game.flag) {
      return '点击开始按钮开始游戏';
    } else if (!game.flag && game.stepNumber === 0) {
      return '您的先手，请落子';
    } else if (!game.flag && game.xIsNext === 'ai') {
      return `Score:${aiInfo['score']} Step:${game.stepNumber} Time:${aiInfo['time']}`;
    } else {
      return '电脑正在思考中。。。';
    }
  };

  render() {
    const message = this.setUpMessage();
    const { game, startGame, reStart, gameForward, gameBackward } = this.props;
    return (
      <div className={styles['dash-board']}>
        <div className={styles['dash-board-tips']}>
          <span className={styles['dash-board-chess']}/>
          {message}
        </div>
        {
          game.flag ?
            <Button onClick={startGame.bind(this, 2)} variant="contained" color="primary">开始游戏</Button>
            :
            <div className={styles['dash-board-loading']}>
              <Button variant="contained"
                      color="primary"
                      onClick={gameBackward}
                      disabled={game.worldMap.length === 0}
                      className={styles['btn-green']}>后退一步</Button>
              <Button variant="contained" color="secondary" onClick={reStart}>重新开始</Button>
              <Button variant="contained"
                      color="primary"
                      onClick={gameForward}
                      disabled={game.worldMap.length === 0 || game.worldMap.length === game.chessMap.length}
                      className={styles['btn-green']}>前进一步</Button>
            </div>
        }
      </div>
    );
  }
}
