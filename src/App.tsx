import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';

import styles from './App.module.less';
import { MenuInfo } from 'rc-menu/lib/interface';
import { GoBang } from './features/go-bang/go-bang';
import { Dashboard } from './features/dashboard/dashboard';
import { SwitchDefault } from './components/switch-default';
import { BaseComponent } from './components/should-component-update';
import { Counter } from './features/counter/counter';
import { Pokemon } from './features/pokemon/pokemon';
import { WebWorker } from './features/web-worker/web-worker';

interface State {
  collapsed: boolean;
  defaultKeys: string[];
}

interface Props {
  history: RouteComponentProps['history'];
}

export default class App extends BaseComponent<Props, State> {
  menuList = [
    { name: 'Dashboard', icon: <UserOutlined/>, value: '/dashboard' },
    { name: '五子棋', icon: <VideoCameraOutlined/>, value: '/go-bang' },
    { name: '计数器', icon: <VideoCameraOutlined/>, value: '/counter' },
    { name: 'WebWorker', icon: <VideoCameraOutlined/>, value: '/web-worker' },
    { name: 'Pokemon', icon: <VideoCameraOutlined/>, value: '/pokemon' }
  ];

  constructor(props: Props) {
    super(props);
    const activeMenu = this.menuList.filter((menu) => {
      return props.history.location.pathname.includes(menu.value);
    });

    const activeKeys = activeMenu.map((menu) => menu.value);

    this.state = {
      collapsed: false,
      defaultKeys: activeKeys.length ? activeKeys : ['/dashboard']
    };
  }

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  pathTo = (info: MenuInfo) => {
    const { history } = this.props;
    history.push({ pathname: info.key });
  };

  render() {
    const { collapsed, defaultKeys } = this.state;
    const { history } = this.props;
    return (
      <Layout className={styles.container}>
        <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
          <div className={styles.logo}/>

          <Menu onClick={this.pathTo} theme="dark" mode="inline" defaultSelectedKeys={defaultKeys}>
            {this.renderHomeMenu()}
          </Menu>
        </Layout.Sider>

        <Layout className={styles.siteLayout}>
          {/*<Layout.Header className={styles.siteLayoutHeader}>*/}
          {/*  {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {*/}
          {/*    className: styles.trigger,*/}
          {/*    onClick: this.toggle*/}
          {/*  })}*/}
          {/*</Layout.Header>*/}

          <Layout.Content className={styles.siteLayoutContent}>
            <SwitchDefault history={history}>
              <Route exact={true} path="/dashboard" component={Dashboard}/>
              <Route exact={true} path="/go-bang" component={GoBang}/>
              <Route exact={true} path="/counter" component={Counter}/>
              <Route exact={true} path="/pokemon" component={Pokemon}/>
              <Route exact={true} path="/web-worker" component={WebWorker}/>
              <Redirect exact={true} from="/" to="/dashboard"/>
            </SwitchDefault>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }

  renderHomeMenu = () => {
    return this.menuList.map((menu) => {
      return <Menu.Item key={menu.value} icon={menu.icon}>{menu.name}</Menu.Item>;
    });
  };
}
