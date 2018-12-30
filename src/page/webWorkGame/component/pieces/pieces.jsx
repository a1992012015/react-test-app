import React, { Component } from 'react';
import { BigNumber } from 'bignumber.js';

import styles from './pieces.module.scss';
import logo from '../../../../assets/images/logo.svg';

class Pieces extends Component {

  row(index, row) {
    const { chess, width } = this.props;
    return row.map((v, i) => {
      let name = v.stepNumber !== null && v.xIsNext !== null ?
        `${styles['chessman-main']} ${v.xIsNext === 'me' ? styles['chessman-white'] : styles['chessman-black']}`
        :
        styles['chessman-disappear'];

      if (chess.stepNumber === v.stepNumber) {
        name = `${name} ${styles['chessman-anim']}`;
      }

      const position = {
        x: i,
        y: index
      };

      if (chess.flag && chess.king === v.xIsNext && chess.stepNumber !== v.stepNumber) {
        chess.winMap.forEach(item => {
          if (item.x === position.x && item.y === position.y) {
            name = `${name} ${styles['chessman-anim']}`;
          }
        });
      }
      return (
        <div key={i}
             onClick={this.props.goOn.bind(this, index, i)}
             style={{
               width: `${width}px`,
               height: `${width}px`
             }}
             className={styles['chessman']}>
          <button className={name}/>
        </div>
      );
    });
  }

  render() {
    const { chess, width } = this.props;
    const data = chess.chessMap[chess.stepNumber];
    const padding = new BigNumber(width).dividedBy(2).toNumber();
    return (
      <div className={styles['pieces']}>
        <div className={styles['pieces-animation']}>
          <img src={logo} className={styles['pieces-logo']} alt="logo"/>
        </div>

        <ul className={styles['pieces-box']} style={{
          padding: `${padding}px`
        }}>
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
      </div>
    );
  }
}

export default Pieces;
