import React, { Component } from 'react';
import { connect } from 'react-redux';

import Checkerboard from './component/checkerboard/checkerboard';
import Pieces from './component/pieces/pieces';
import Tips from './component/tips/tips';

import logo from '../../assets/images/logo.svg';
import styles from './webWorkGame.module.scss';

class WebWorkGame extends Component {
  gameWorker = null;

  componentDidMount() {
    // this.gameWorker = new Worker(AI);
    // this.gameWorker = new WebWorker(AI);

    // this.gameWorker.onmessage = e => {
    //   console.log(e.data);
    // };
  }

  startGame = (first = 1) => {
    this.gameWorker.postMessage({
      type: 'START',
      random: first === 1
    });
    //if (first === 1 && !this.randomOpening) {
    //  this.gameWorker.postMessage({
    //    type: "BEGIN"
    //  });
    //}
  };

  gameForward = () => {
    this.gameWorker.postMessage({
      type: 'FORWARD'
    });
  };

  gaemBackward = () => {
    this.gameWorker.postMessage({
      type: 'BACKWARD'
    });
  };

  gameGo = ({ x, y }) => {
    this.gameWorker.postMessage({
      type: 'GO',
      x: x,
      y: y
    });
  };

  gameConfig = () => {
    this.gameWorker.postMessage({
      type: 'CONFIG',
      config: {
        searchDeep: this.deep,
        spread: this.spread
      }
    });
  };

  goOn = (index, item) => {
    const { game, dispatch } = this.props;
    if (game.flag) {
      console.log('游戏结束');
      return;
    }
    const history = game.chessMap[game.chessMap.length - 1];
    if (history[index][item].stepNumber !== null && history[index][item].xIsNext !== null) {
      console.log('重复落子无效');
      return;
    }
    dispatch({
      type: 'GAME_NEXT',
      payload: [index, item]
    });
  };

  render() {
    const { game } = this.props;
    console.log(game);
    return (
      <div className={styles['game']}>
        <img src={logo} className={styles['game-logo']} alt="logo"/>
        <div className={styles['game-box']}>
          {game.flag && <Tips king={game.king} gameStart={this.startGame}/>}
          <Checkerboard/>
          <Pieces chess={game} goOn={this.goOn}/>
        </div>
      </div>
    );
  }
}

export default connect(({ game }) => ({ game }))(WebWorkGame);
