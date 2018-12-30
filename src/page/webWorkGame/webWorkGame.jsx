import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BigNumber } from 'bignumber.js';

import Checkerboard from './component/checkerboard/checkerboard';
import Pieces from './component/pieces/pieces';
import DashBoard from './component/dashBoard/dashBoard';

import Worker from './component/game.worker';

import styles from './webWorkGame.module.scss';

class WebWorkGame extends Component {
  gameWorker = null;
  pieces = null;

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      aiInfo: [],
      startTime: 0
    };
  }

  componentDidMount() {
    this.getWidth();

    window.addEventListener('resize', this.onresize);
    this.gameWorker = new Worker();

    this.gameWorker.onmessage = e => {
      const { startTime } = this.state;
      const { dispatch } = this.props;
      const data = e.data;
      const d = data.data;
      console.log('get response', d);

      if (data.type === 'put') {
        const endTime = new Date().getTime();
        d['time'] = (endTime - startTime) / 1000;
        // const score = this.score = d.score;
        this.setState({
          aiInfo: d
        });
        const position = [d[0], d[1]];
        dispatch({
          type: 'GAME_NEXT',
          payload: position
        });
      } else if (data.type === 'board') { // 返回的开局
        const b = d.board;
        // 说明使用了开局
        if (b) {
          // 由于开局没有steps，因此自己创建一下
          dispatch({
            type: 'GAME_START'
          });
        } else {
          dispatch({
            type: 'GAME_START'
          });
        }
      }
    };

    this.gameWorker.onerror = e => {
      console.log(e);
    };
  }

  onresize = () => {
    this.getWidth();
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.onresize);
  }

  getWidth = () => {
    const { clientWidth } = this.pieces;
    const width = new BigNumber(clientWidth).dividedBy(16).toNumber();
    this.setState({ width });
  };

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

  // 前进方法
  gameForward = () => {
    const { dispatch } = this.props;

    dispatch({ type: 'GAME_ADVANCE' });
    this.gameWorker.postMessage({
      type: 'FORWARD'
    });
  };

  // 后退方法
  gameBackward = () => {
    const { game, dispatch } = this.props;

    if (game.chessMap.length < 2) {
      dispatch({
        type: 'START_NOTIFICATION',
        payload: {
          message: '已经不能再后退了！！',
          time: 2000
        }
      });
      return;
    }

    dispatch({ type: 'GAME_RETREAT' });
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
    if (game.flag || game.xIsNext === 'me') {
      dispatch({
        type: 'START_NOTIFICATION',
        payload: {
          message: game.flag ? '点击开始按钮开始游戏' : '还没到您的回合!',
          time: 2000
        }
      });
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

    this.gameGo({ x: index, y: item });

    this.setState({
      startTime: new Date().getTime()
    });
  };

  reStart = () => {
    const { dispatch } = this.props;

    dispatch({ type: 'GAME_FINISH' });
  };

  render() {
    const { game } = this.props;
    const { width, aiInfo } = this.state;
    return (
      <div className={styles['game']}>
        <div ref={v => this.pieces = v} className={styles['game-box']}>
          {width && <Checkerboard width={width}/>}
          {width && <Pieces chess={game} goOn={this.goOn} width={width}/>}
        </div>
        <DashBoard startGame={this.startGame}
                   reStart={this.reStart}
                   gameForward={this.gameForward}
                   gameBackward={this.gameBackward}
                   aiInfo={aiInfo}
                   game={game}/>
      </div>
    );
  }
}

export default connect(({ game }) => ({ game }))(WebWorkGame);
