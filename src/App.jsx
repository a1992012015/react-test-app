import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';

import Game from './page/game/game';
import WebWork from './page/webWork/webWork';
import WebWorkGame from './page/webWorkGame/webWorkGame';
import SwitchDefault from './components/switchDefault';

import styles from './App.module.scss';

class App extends Component {
  render() {
    return (
      <div className={styles['App']}>
        <ul className={styles['App-nav']}>
          <li className={styles['App-nav-list']}><NavLink to='/'>首页</NavLink></li>
          <li className={styles['App-nav-list']}><NavLink to='/web-work'>webWork</NavLink></li>
          <li className={styles['App-nav-list']}><NavLink to='/web-work-game'>优化五子棋</NavLink></li>
        </ul>

        <SwitchDefault>
          <Route exact={true} path='/' component={Game}/>
          <Route exact={true} path='/web-work' component={WebWork}/>
          <Route exact={true} path='/web-work-game' component={WebWorkGame}/>
        </SwitchDefault>
      </div>
    );
  }
}

export default App;
