import React, { Component } from 'react';

import styles from './pieces.module.scss';

class Pieces extends Component {

  row(index, row) {
    const { chess } = this.props;
    return row.map((v, i) => {
      let name = v.stepNumber !== null && v.xIsNext !== null ?
        `${styles['chess']} ${v.xIsNext === 'me' ? styles['chess-white'] : styles['chess-black']}`
        :
        styles['disappear'];

      if (chess.stepNumber === v.stepNumber) {
        name = `${name} ${styles['chess-anim']}`
      }
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

export default Pieces;
