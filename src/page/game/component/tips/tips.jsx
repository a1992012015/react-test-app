import React, { Component } from 'react';

import styles from './tips.module.scss';

class Tips extends Component {
  render() {
    const { king } = this.props;
    const tips = typeof king === 'boolean' ? king ? '电脑胜利' : '您胜利了'
      :
      '点击开始游戏';
    return (
      <div className={styles['tips']}>
        <p>{tips}</p>
        <button className={styles['tips-start']} onClick={this.props.gameStart}>开始</button>
      </div>
    );
  }
}

export default Tips;
