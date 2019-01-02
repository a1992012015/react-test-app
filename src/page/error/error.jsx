import React, { Component } from 'react';
import moment from 'moment';

import styles from './error.module.scss';

export default class extends Component {
  time = null;

  constructor(props) {
    super(props);
    this.state = {
      time: this.getNowTime()
    };
  }

  componentDidMount() {
    this.time = setInterval(() => {
      const time = this.getNowTime();
      this.setState({ time });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.time);
  }

  getNowTime = () => {
    const years = moment().get('year');
    const month = moment().get('month') + 1 >= 10 ? moment().get('month') + 1 : `0${moment().get('month') + 1}`;
    const day = moment().get('date') >= 10 ? moment().get('date') : `0${moment().get('date')}`;
    const futureTime = moment(`${years}-${month}-${day}T17:30:00`)
      .utc()
      .valueOf();
    const newTime = moment()
      .utc()
      .valueOf();
    const time = futureTime - newTime;
    if (time < 0) {
      return '该下班啦！！！！！！';
    }
    const nowHour =
      moment(time)
        .utc()
        .get('hour') >= 10
        ? moment(time)
            .utc()
            .get('hour')
        : `0${moment(time)
            .utc()
            .get('hour')}`;
    const nowMinute =
      moment(time)
        .utc()
        .get('minute') >= 10
        ? moment(time)
            .utc()
            .get('minute')
        : `0${moment(time)
            .utc()
            .get('minute')}`;
    const nowSecond =
      moment(time)
        .utc()
        .get('second') >= 10
        ? moment(time)
            .utc()
            .get('second')
        : `0${moment(time)
            .utc()
            .get('second')}`;
    return `${nowHour}:${nowMinute}:${nowSecond}`;
  };

  render() {
    const { time } = this.state;
    return (
      <div className={styles['error']}>
        <p>{time}</p>
      </div>
    );
  }
}
