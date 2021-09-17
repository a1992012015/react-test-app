import React from 'react';

import styles from './dashboard.module.less';
import logo from '../../assets/logo.svg';
import { BaseComponent } from '../../components/should-component-update';
import { dynamicTitle } from '../../components/dynamic-title';

export class Dashboard extends BaseComponent {
  componentDidMount(): void {
    dynamicTitle('Dashboard');
  }

  render(): React.ReactNode {
    return (
      <div className={styles.container}>
        <header className={styles.AppHeader}>
          <img src={logo} className={styles.AppLogo} alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className={styles.AppLink}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
