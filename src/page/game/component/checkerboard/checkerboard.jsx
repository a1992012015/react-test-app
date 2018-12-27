import React, { Component } from 'react';

import styles from './checkerboard.module.scss';

export default class Checkerboard extends Component {

  componentDidMount() {
    let canvas = document.getElementById('myCanvas');
    let cxt = canvas.getContext('2d');
    //边框
    cxt.moveTo(0, 0);
    cxt.lineTo(700, 0);
    cxt.lineTo(700, 700);
    cxt.lineTo(0, 700);
    cxt.lineTo(0, 0);
    cxt.stroke();
    //每一排&&每一列
    for (let i = 1; i <= 13; i++) {
      let clo = i * 50;
      cxt.moveTo(clo, 0);
      cxt.lineTo(clo, 700);
      cxt.stroke();
      cxt.moveTo(0, clo);
      cxt.lineTo(700, clo);
      cxt.stroke();
    }
  }

  render() {
    return (
      <canvas className={styles['checkerboard']} id='myCanvas' height='700' width='700'>你的电脑浏览器不支持canvas，换电脑吧~</canvas>
    );
  }
}
