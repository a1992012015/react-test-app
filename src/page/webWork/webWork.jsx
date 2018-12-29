import React, { Component } from 'react';
import ReactCountdownClock from 'react-countdown-clock';
// import worker from './component/worker';
// import WebWorker from '../../utils/webWorker';
import Worker from './component/fibonacci.worker.js';
import fibonacci from './component/Fibonacci';

import styles from './webWork.module.scss';

class WebWorks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count1: 0,
      count2: 0,
      time1: 0,
      time2: 0
    };
  }

  componentDidMount() {
    this.worker = new Worker();

    this.worker.onerror = function(event) {
      console.log(event);
    };
  };

  fetchUsers = () => {
    const start = new Date().getTime();
    const num = fibonacci(43);
    const end = new Date().getTime();

    console.log(start);
    console.log(end);
    const expenditure = (end - start) / 1000;
    this.setState({
      count1: num,
      time1: expenditure
    });
  };

  fetchWebWorker = () => {
    this.worker.postMessage(43);

    const start = new Date().getTime();
    this.worker.addEventListener('message', event => {
      const end = new Date().getTime();

      const expenditure = (end - start) / 1000;
      this.setState({
        count2: event.data,
        time2: expenditure
      });
    });
  };

  render() {
    const { count1, count2, time1, time2 } = this.state;
    return (
      <div className={styles['web-work-bottom']}>
        <section className={styles['web-work-left']}>
          <ReactCountdownClock seconds={100} color="#000" alpha={0.9} size={300}/>
          <p className={styles['web-work-center']}>Total User Count: {count1}</p>
          <p className={styles['web-work-center']}>time: {time1}</p>
          <button className={styles['web-work-direct']} onClick={this.fetchUsers}>
            Fetch Users Directly
          </button>
        </section>

        <section className={styles['web-work-right']}>
          <ReactCountdownClock seconds={100} color="#e56" alpha={0.9} size={300}/>
          <p className={styles['web-work-center']}>Total User Count: {count2}</p>
          <p className={styles['web-work-center']}>time: {time2}</p>
          <button className={styles['web-work-worker']} onClick={this.fetchWebWorker}>
            Fetch Users with Web Worker
          </button>
        </section>
      </div>
    );
  }
}

export default WebWorks;
