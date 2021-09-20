import React from 'react';
import Countdown from 'react-countdown';

import styles from './web-worker.module.less';
import { BaseComponent } from '../../components/should-component-update';
import { fibonacci } from '../../services/fibonacci-worker/fibonacci';
import { dynamicTitle } from '../../components/dynamic-title';
import { app } from '../../configs/commons.config';

interface State {
  count1: number;
  count2: number;
  time1: number;
  time2: number;
}

const Completionist = (): JSX.Element => <span>You are good to go!</span>;

export default class WebWorker extends BaseComponent<unknown, State> {
  worker?: Worker;

  constructor(props: unknown) {
    super(props);

    this.state = {
      count1: 0,
      count2: 0,
      time1: 0,
      time2: 0
    };
  }

  componentDidMount(): void {
    dynamicTitle('Web Worker');
    this.worker = new Worker('../../services/fibonacci-worker/fibonacci.worker.ts', {
      type: 'module'
    });
    this.worker.onerror = (event) => {
      console.warn(event);
    };
  }

  componentWillUnmount(): void {
    this.worker?.terminate();
  }

  fetchUsers = (): void => {
    const start = new Date().getTime();
    const num = fibonacci(43);
    const end = new Date().getTime();
    const expenditure = (end - start) / 1000;
    this.setState({
      count1: num,
      time1: expenditure
    });
  };

  fetchWebWorker = (): void => {
    this.worker?.postMessage(43);
    const start = new Date().getTime();
    this.worker?.addEventListener('message', ({ data }) => {
      app.log && console.log('get response data', data);
      const end = new Date().getTime();
      const expenditure = (end - start) / 1000;
      this.setState({
        count2: data,
        time2: expenditure
      });
    });
  };

  render(): React.ReactNode {
    const { count1, count2, time1, time2 } = this.state;
    return (
      <div className={styles.container}>
        <Countdown date={Date.now() + 1000000}>
          <Completionist />
        </Countdown>

        <section className={styles['web-work-option']}>
          <section className={styles['web-work-left']}>
            <p className={styles['web-work-center']}>Total User Count: {count1}</p>
            <p className={styles['web-work-center']}>time: {time1}</p>
            <button type="button" onClick={this.fetchUsers}>
              Fetch Users Directly
            </button>
          </section>

          <section className={styles['web-work-right']}>
            <p className={styles['web-work-center']}>Total User Count: {count2}</p>
            <p className={styles['web-work-center']}>time: {time2}</p>
            <button type="button" onClick={this.fetchWebWorker}>
              Fetch Users with Web Worker
            </button>
          </section>
        </section>
      </div>
    );
  }
}
