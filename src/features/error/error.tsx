import React from 'react';

import styles from './error.module.less';
import { BaseComponent } from '../../components/should-component-update';
import { dynamicTitle } from '../../components/dynamic-title';

export class Error extends BaseComponent {
  componentDidMount(): void {
    dynamicTitle('404了...');
  }

  render(): React.ReactNode {
    return <div className={styles.container}>This is 404!!!.</div>;
  }
}
