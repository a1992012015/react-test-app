import React from 'react';

import styles from './error.module.less';
import { BaseComponent } from '../../components/should-component-update';

export class Error extends BaseComponent {
  render(): React.ReactNode {
    return <div className={styles.container}>This is 404!!!.</div>;
  }
}
