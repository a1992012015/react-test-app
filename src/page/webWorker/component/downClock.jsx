import React, { Component } from 'react';
import ReactCountdownClock from 'react-countdown-clock';

export default class DownClock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: this.getRandomNumber(50, 10, 0),
      countdownColor: this.getRandomColor()
    };
  }

  getRandomNumber = (start, end, now) => {
    const nowCountdown = Math.floor(Math.random() * (end - start + 1) + start);

    if (now === nowCountdown) {
      return this.getRandomNumber(start, end, now);
    }

    return nowCountdown;
  };

  getRandomColor = () => {
    return '#' + ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
  };

  onComplete = () => {
    const { countdown } = this.state;
    this.setState({
      countdown: this.getRandomNumber(50, 10, countdown),
      countdownColor: this.getRandomColor()
    });
  };

  render() {
    const { countdown, countdownColor } = this.state;
    return <ReactCountdownClock seconds={countdown} color={countdownColor} alpha={0.8} onComplete={this.onComplete} timeFormat='hms' size={300} />;
  }
}
