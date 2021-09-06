import React, { RefObject } from 'react';
import multiply from 'lodash-es/multiply';
import divide from 'lodash-es/divide';

import styles from './checkerboard.module.less';
import logo from '../../../assets/logo.svg';
import { BaseComponent } from '../../../components/should-component-update';

interface State {
  width: number;
}

export class Checkerboard extends BaseComponent<object, State> {
  canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
  containerRef: RefObject<HTMLDivElement> = React.createRef();

  constructor(props: object) {
    super(props);

    this.state = {
      width: 0
    };
  }

  componentDidMount() {
    const width = Math.floor(divide(this.containerRef?.current?.clientWidth || 0, 16));

    this.setState({ width: width }, () => {
      this.draftsman();
    });
  }

  draftsman = () => {
    const { width } = this.state;
    const x = multiply(width, 14);
    const y = multiply(width, 14);
    const cxt = this.canvasRef?.current?.getContext('2d');
    if (cxt) {
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
    }
  };

  getPieceClassName(v: { stepNumber: null; xIsNext: null }) {
    if (v.stepNumber !== null && v.xIsNext !== null) {
      if (v.xIsNext === 'me') {
        return `${styles.chessmanMain} ${styles.chessmanWhite}`
      } else {
        return `${styles.chessmanMain} ${styles.chessmanBlack}`
      }
    } else {
      return styles.chessmanDisappear;
    }
  }

  render() {
    const { width } = this.state;
    const padding = divide(width, 2);
    return (
      <div ref={this.containerRef} className={styles.container}>
        <canvas className={styles.canvas} ref={this.canvasRef} width={width * 14} height={width * 14}>
          你的电脑浏览器不支持canvas，换电脑吧~
        </canvas>

        <div className={styles.pieces}>
          <div className={styles.piecesAnimation}>
            <img src={logo} className={styles.piecesLogo} alt="logo"/>
          </div>

          <ul className={styles.piecesBox} style={{ padding: `${padding}px` }}>
            {this.renderRowDiv()}
          </ul>
        </div>
      </div>
    );
  }

  renderRowDiv() {
    const chessMap = [];
    for (let i = 0; i < 15; i++) {
      const chessRow = [];
      for (let g = 0; g < 15; g++) {
        chessRow.push({
          stepNumber: null,
          xIsNext: null
        });
      }
      chessMap.push(chessRow);
    }
    return chessMap.map((v, i) => {
      return (
        <li className={styles.piecesRow} key={i}>
          {this.row(i, v)}
        </li>
      );
    })
  }

  row(index: number, row: { stepNumber: null; xIsNext: null }[]) {
    // const { chess, width } = this.props;
    const { width } = this.state;
    return row.map((v, i) => {

      // if (chess.stepNumber === v.stepNumber) {
      //   name = `${name} ${styles['chessman-anim']}`;
      // }

      // const position = {
      //   x: i,
      //   y: index
      // };

      // if (chess.flag && chess.king === v.xIsNext && chess.stepNumber !== v.stepNumber) {
      //   chess.winMap.forEach(item => {
      //     if (item.x === position.x && item.y === position.y) {
      //       name = `${name} ${styles['chessman-anim']}`;
      //     }
      //   });
      // }
      const style = { width: `${width}px`, height: `${width}px` };
      return (
        <div key={i} style={style} className={styles.chessman}>
          <button className={this.getPieceClassName(v)}/>
        </div>
      );
    });
  }
}
