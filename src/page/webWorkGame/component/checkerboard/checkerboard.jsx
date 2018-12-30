import React, { Component } from 'react';
import { BigNumber } from 'bignumber.js';

import styles from './checkerboard.module.scss';

export default class Checkerboard extends Component {

  componentDidMount() {
    this.draftsman();
    window.addEventListener('resize', this.draftsman);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.draftsman);
  }

  draftsman = () => {
    const { width } = this.props;
    const x = new BigNumber(this.props.width).multipliedBy(14).toNumber();
    const y = new BigNumber(this.props.width).multipliedBy(14).toNumber();
    const canvas = document.getElementById('myCanvas');
    const cxt = canvas.getContext('2d');
    //边框
    cxt.moveTo(0, 0);
    cxt.lineTo(x, 0);
    cxt.lineTo(x, y);
    cxt.lineTo(0, y);
    cxt.lineTo(0, 0);
    cxt.stroke();
    //每一排&&每一列
    for (let i = 1; i <= 13; i++) {
      const clo = i * width;
      cxt.moveTo(clo, 0);
      cxt.lineTo(clo, y);
      cxt.stroke();
      cxt.moveTo(0, clo);
      cxt.lineTo(x, clo);
      cxt.stroke();
    }
  };

  render() {
    const width = new BigNumber(this.props.width).multipliedBy(14).toNumber();
    return (
      <canvas className={styles['checkerboard']}
              id='myCanvas'
              height={width}
              width={width}>你的电脑浏览器不支持canvas，换电脑吧~</canvas>
    );
  }
}
