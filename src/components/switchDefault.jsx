import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router-dom';

export default class extends Component {
  render() {
    return (
      <Switch>
        {this.props.children}
        <Redirect to='/error'/>
      </Switch>
    );
  }
}
