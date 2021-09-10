import React from 'react';
import Countdown from 'react-countdown';

import styles from './web-worker.module.less';
import { BaseComponent } from '../../components/should-component-update';
import fibonacci from './component/fibonacci';

interface State {
  count1: number;
  count2: number;
  time1: number;
  time2: number;
}

const Completionist = () => <span>You are good to go!</span>;

export class WebWorker extends BaseComponent<object, State> {
  worker?: Worker;

  constructor(props: object) {
    super(props);

    this.state = {
      count1: 0,
      count2: 0,
      time1: 0,
      time2: 0
    };
  }

  componentDidMount() {
    this.worker = new Worker('./component/fibonacci.worker.ts', { type: 'module' });
    this.worker.onerror = function (event) {
      console.warn(event);
    };
  }

  componentWillUnmount() {
    this.worker?.terminate()
  }

  fetchUsers = () => {
    const start = new Date().getTime();
    const num = fibonacci(43);
    const end = new Date().getTime();
    const expenditure = (end - start) / 1000;
    this.setState({
      count1: num,
      time1: expenditure
    });
  };

  fetchWebWorker = () => {
    this.worker?.postMessage(43);
    const start = new Date().getTime();
    this.worker?.addEventListener('message', ({ data }) => {
      console.log('get response data', data);
      const end = new Date().getTime();
      const expenditure = (end - start) / 1000;
      this.setState({
        count2: data,
        time2: expenditure
      });
    });
  };

  render() {
    const { count1, count2, time1, time2 } = this.state;
    return (
      <div className={styles.container}>
        <Countdown date={Date.now() + 1000000} >
          <Completionist/>
        </Countdown>

        <section className={styles['web-work-option']}>
          <section className={styles['web-work-left']}>
            <p className={styles['web-work-center']}>Total User Count: {count1}</p>
            <p className={styles['web-work-center']}>time: {time1}</p>
            <button className={styles['web-work-direct']} onClick={this.fetchUsers}>
              Fetch Users Directly
            </button>
          </section>

          <section className={styles['web-work-right']}>
            <p className={styles['web-work-center']}>Total User Count: {count2}</p>
            <p className={styles['web-work-center']}>time: {time2}</p>
            <button className={styles['web-work-worker']} onClick={this.fetchWebWorker}>
              Fetch Users with Web Worker
            </button>
          </section>
        </section>
      </div>
    );
  }
}
