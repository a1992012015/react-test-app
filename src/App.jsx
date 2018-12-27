import React, { Component } from 'react';

import Game from './page/game/game';

import logo from './logo.svg';
import styles from './App.module.scss';

class App extends Component {
  render() {
    return (
      <div className={styles['App']}>
        <img src={logo} className={styles['App-logo']} alt="logo" />

        <Game/>
      </div>
    );
  }
}

export default App;
