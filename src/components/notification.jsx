import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Snackbar } from '@material-ui/core';

class Notification extends Component {
  render() {
    const { notification } = this.props;
    return (
      // 全局消息提示
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={notification.open}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id="message-id">{notification.message}</span>}
      />
    )
  }
}

export default connect(({ notification }) => ({ notification }))(Notification);
