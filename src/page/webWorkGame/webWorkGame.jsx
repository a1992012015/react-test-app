import React, { Component } from 'react';
import { connect } from 'react-redux';

import Checkerboard from './component/checkerboard/checkerboard';
import Pieces from './component/pieces/pieces';
import Tips from './component/tips/tips';
import Worker from './component/game.worker';
import SCORE from '../../gameAi/score';
import win from '../../gameAi/win';

import logo from '../../assets/images/logo.svg';
import styles from './webWorkGame.module.scss';

class WebWorkGame extends Component {
  gameWorker = null;

  constructor(props) {
    super(props);
    this.state = {
      bigText: '',
      score: 0,
      step: -1,
      lastScore: 0,
      startTime: +new Date()
    };
  }


  componentDidMount() {
    this.gameWorker = new Worker();

    this.gameWorker.onmessage = e => {
      const { lastScore, score } = this.state;
      const { dispatch } = this.props;

      const data = e.data;
      const d = data.data;
      if (data.type === 'put') {
        console.log(d);
        // const score = this.score = d.score;
        const position = [d[0], d[1]];
        dispatch({
          type: 'GAME_NEXT',
          payload: position
        });
        // const step = this.state.step = d.step;
        // this._set(position, 1);
        //
        // if (score >= SCORE.FIVE / 2) {
        //   if (lastScore < SCORE.FIVE / 2) this.shouldPop = true;
        //   if (step <= 1) {
        //     // this.$store.dispatch(SET_FIVES, win(this.board));
        //     // this.$store.dispatch(SET_STATUS, STATUS.LOCKED);
        //     // this.showBigText(this.$t('you lose'), this.end);
        //   } else if (step <= 6 && this.shouldPop) {
        //     // this.$refs.winPop.open();
        //     this.shouldPop = false;
        //   }
        // } else if (score <= -SCORE.FIVE / 2) {
        //   if (lastScore > -SCORE.FIVE / 2) this.shouldPop = true;
        //   if (step <= 1) {
        //     this.$store.dispatch(SET_FIVES, win(this.board));
        //     this.$store.dispatch(SET_STATUS, STATUS.LOCKED);
        //     this.showBigText(this.$t('you win'), this.end);
        //   } else if (step <= 6 && this.shouldPop) {
        //     this.$refs.losePop.open();
        //     this.shouldPop = false;
        //   }
        // } else {
        //   this.$store.dispatch(SET_FIVES, []); // reset
        // }
        // lastScore = score;
      } else if (data.type === 'board') { // 返回的开局
        console.log(d);
        const b = d.board;
        // 说明使用了开局
        if (b) {
          // 由于开局没有steps，因此自己创建一下
          dispatch({
            type: 'GAME_START'
          });
          // let second, third;
          // for (var i = 0; i < b.length; i++) {
          //   for (var j = 0; j < b.length; j++) {
          //     if (i == 7 && j == 7) continue;
          //     const r = b[i][j];
          //     if (r === 1) third = { position: [i, j], role: 1 };
          //     if (r === 2) second = { position: [i, j], role: 2 };
          //   }
          // }
          // steps.push(second);
          // steps.push(third);
          // this.$store.dispatch(SET_STEPS, steps);
          // this.showBigText(b.name);
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

    this.gameGo({ x: index, y: item });
  };

  render() {
    const { game } = this.props;
    console.log(game);
    return (
      <div className={styles['game']}>
        <img src={logo} className={styles['game-logo']} alt="logo"/>
        <div className={styles['game-box']}>
          {game.flag && <Tips king={game.king} gameStart={this.startGame.bind(this, 2)}/>}
          <Checkerboard/>
          <Pieces chess={game} goOn={this.goOn}/>
        </div>
      </div>
    );
  }
}

export default connect(({ game }) => ({ game }))(WebWorkGame);
