import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

import NavigationList from './navigationList/navigationList';

import styles from './header.module.scss';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logo: 'carol'
    };
  }


  componentDidMount() {
    const { dispatch, auth } = this.props;
    if (auth.token.access_token) {
      dispatch({
        type: 'GET_INFO'
      });
    }
  }

  signIn = (data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'SIGN_IN',
      payload: data
    });
  };

  signOut = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'DELETE_INFO'
    });
  };

  render() {
    const { history } = this.props;
    return (
      <AppBar position="static">
        <Toolbar className={styles['header']}>
          <Typography className={styles['logo']} variant="h6" color="inherit" noWrap>
            <NavLink to="/" className={styles['nav-link']} activeClassName={styles['nav-link-active']}>
              {this.state.logo.toLocaleUpperCase()}
            </NavLink>
          </Typography>


          <NavigationList history={history}/>

          {/*<UserState signOut={this.signOut} signIn={this.signIn} auth={auth}/>*/}
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(connect(({ auth }) => ({ auth }))(Header));
