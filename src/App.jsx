import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import WebWorker from './page/webWorker/webWorker';
import WebWorkGame from './page/webWorkGame/webWorkGame';
import Error from './page/error/error';
import Header from './components/header/header';
import Notification from './components/notification';
import SwitchDefault from './components/switchDefault';

import styles from './App.module.scss';

class App extends Component {
  render() {
    return (
      <section className={styles['App']}>
        <Header/>

        <SwitchDefault>
          <Route exact={true} path='/' component={WebWorkGame}/>
          <Route exact={true} path='/worker' component={WebWorker}/>
          <Route exact={true} path='/error' component={Error}/>
        </SwitchDefault>

        <Notification/>
      </section>
    );
  }
}

export default App;
