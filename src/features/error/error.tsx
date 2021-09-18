import React from 'react';
import { Button } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import styles from './error.module.less';
import { BaseComponent } from '../../components/should-component-update';
import { dynamicTitle } from '../../components/dynamic-title';

export interface IEProps {
  history: RouteComponentProps['history'];
}

export default class Error extends BaseComponent<IEProps> {
  componentDidMount(): void {
    dynamicTitle('404了...');
  }

  pathToHome = (): void => {
    const { history } = this.props;
    history.push({ pathname: '/' });
  };

  render(): React.ReactNode {
    return (
      <div className={styles.container}>
        <p className={styles.tooltip}>This is 404!!!.</p>
        <Button type="primary" onClick={this.pathToHome}>
          回到主页
        </Button>
      </div>
    );
  }
}
