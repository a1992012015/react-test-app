import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

import UserState from './userState/userState';
import NavigationList from './navigationList/navigationList';

import styles from './header.module.scss';

class Header extends Component {
  componentDidMount() {
    const { dispatch, auth } = this.props;
    if (auth.token.access_token) {
      dispatch({
        type: 'GET_INFO',
      })
    }
  }

  signIn = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'SIGN_IN',
      payload: data
    })
  };

  signOut = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'DELETE_INFO',
    })
  };

  render() {
    const { history, auth } = this.props;
    return (
      <AppBar position="static">
        <Toolbar className={styles['header']}>
          <div className={styles['navigation']}>
            <NavLink to="/" className={styles['nav-link']} activeClassName={styles['nav-link-active']}>
              <Typography className={styles['logo']} variant="h6" color="inherit" noWrap>
                React-Typescript-Template
              </Typography>
            </NavLink>

            <NavigationList history={history}/>
          </div>

          <UserState signOut={this.signOut} signIn={this.signIn} auth={auth}/>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(connect(({ auth }) => ({ auth }))(Header));
