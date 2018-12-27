import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './pieces.module.scss';

class Pieces extends Component {

  row(index, row) {
    return row.map((v, i) => {
      const name = v.stepNumber !== null && v.xIsNext !== null ?
        `${styles['chess']} ${v.xIsNext ? styles['chess-white'] : styles['chess-black']}`
        :
        styles['disappear'];
      return (
        <div key={i} onClick={this.props.goOn.bind(this, index, i)} className={styles['pieces-box']}>
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
