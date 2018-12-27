import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './pieces.module.scss';

class Pieces extends Component {

  goOn(index, item) {
    const { chess, dispatch } = this.props;
    console.log(chess.flag);
    if (chess.flag) {
      console.log('游戏结束');
      return;
    }
    const history = chess.chessMap[chess.chessMap.length -1];
    if (history[index][item].stepNumber !== null && history[index][item].xIsNext !== null) {
      console.log('重复落子无效');
      return;
    }
    console.log('继续');
    dispatch({
      type: 'MOVE_LATER',
      payload: [index, item]
    });
  }

  row(index, row) {
    return row.map((v, i) => {
      const name = v.stepNumber !== null && v.xIsNext !== null ?
        `${styles['chess']} ${v.xIsNext ? styles['chess-white'] : styles['chess-black']}`
        :
        styles['disappear'];
      return (
        <div key={i} onClick={this.goOn.bind(this, index, i)} className={styles['pieces-box']}>
          <button className={name}/>
        </div>
      );
    });
  }

  render() {
    const { chess } = this.props;
    const data = chess.chessMap[chess.stepNumber];
    return (
      <ul className={styles['pieces']}>
        {
          data.map((v, i) => {
            return (
              <li className={styles['pieces-row']} key={i}>
                {this.row(i, v)}
              </li>
            );
          })
        }
      </ul>
    );
  }
}

export default connect(({ chess }) => ({ chess }))(Pieces);
