import React, { Component } from 'react';
import { connect } from 'react-redux';

import Checkerboard from './component/checkerboard/checkerboard';
import Pieces from './component/pieces/pieces';
import Tips from './component/tips/tips';

import logo from '../../assets/images/logo.svg';
import styles from './game.module.scss';

class Game extends Component {

  componentDidMount() {

  }

  goOn = (index, item) => {
    const { chess, dispatch } = this.props;
    if (chess.flag) {
      console.log('游戏结束');
      return;
    }
    const history = chess.chessMap[chess.chessMap.length - 1];
    if (history[index][item].stepNumber !== null && history[index][item].xIsNext !== null) {
      console.log('重复落子无效');
      return;
    }
    dispatch({
      type: 'CHESS_MOVE_LATER',
      payload: [index, item]
    });
  };

  gameStart = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'CHESS_START'
    });
  };

  render() {
    const { chess } = this.props;
    return (
      <div className={styles['game']}>
        <img src={logo} className={styles['game-logo']} alt="logo" />

        <div className={styles['game-box']}>
          {chess.flag && <Tips king={chess.king} gameStart={this.gameStart}/>}
          <Checkerboard/>
          <Pieces chess={chess} goOn={this.goOn}/>
        </div>
      </div>
    );
  }
}

export default connect(({ chess }) => ({ chess }))(Game);
