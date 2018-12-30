import React, { Component } from 'react';
import ReactCountdownClock from 'react-countdown-clock';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: 100,
      countdownColor: this.getRandomColor()
    };
  }

  getRandomColor = () => {
    return '#' + ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
  };

  onComplete = () => {
    console.log('end');
    this.setState({
      countdown: Math.floor(Math.random() * 31 + 30),
      countdownColor: this.getRandomColor()
    });
  };

  render() {
    const { countdown, countdownColor } = this.state;
    return (
      <ReactCountdownClock seconds={countdown}
                           color={countdownColor}
                           alpha={0.9}
                           size={300}/>
    );
  }
}
