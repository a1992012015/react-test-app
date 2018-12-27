import React, { Component } from 'react';
import { connect } from 'react-redux';

import Checkerboard from './component/checkerboard/checkerboard';
import Pieces from './component/pieces/pieces';

import styles from './game.module.scss';

class Game extends Component {

  goOn = (index, item) => {
    const { chess, dispatch } = this.props;
    console.log(chess.flag);
    if (chess.flag) {
      console.log('游戏结束');
      return;
    }
    const history = chess.chessMap[chess.chessMap.length - 1];
    if (history[index][item].stepNumber !== null && history[index][item].xIsNext !== null) {
      console.log('重复落子无效');
      return;
    }
    console.log('继续');
    dispatch({
      type: 'MOVE_LATER',
      payload: [index, item]
    });
  };

  gameStart = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'GAME_START'
    });
  };

  render() {
    const { chess } = this.props;
    console.log(chess);
    return (
      <div className={styles['game']}>
        {chess.flag && <button className={styles['game-start']} onClick={this.gameStart}>开始</button>}
        <Checkerboard/>
        <Pieces chess={chess} goOn={this.goOn}/>
      </div>
    );
  }
}

export default connect(({ chess }) => ({ chess }))(Game);
