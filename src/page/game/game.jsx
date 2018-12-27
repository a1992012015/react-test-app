import React, { Component } from 'react';

import Checkerboard from './component/checkerboard/checkerboard';
import Pieces from './component/pieces/pieces';

import styles from './game.module.scss';

export default class Game extends Component {

  componentDidMount() {

  }

  render() {
    return (
      <div className={styles['game']}>
        <Checkerboard/>
        <Pieces/>
      </div>
    );
  }
}
