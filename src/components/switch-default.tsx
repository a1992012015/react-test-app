import React, { Ref } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Error } from '../features/error/error';
import { BaseComponent } from './should-component-update';

interface Props {
  history: RouteComponentProps['history'];
}

/**
 * 默认路由跳转，添加路由跳转动画
 */
export class SwitchDefault extends BaseComponent<Props, object> {
  nodeRef: Ref<HTMLDivElement> = React.createRef();

  render() {
    const { history: { location }, children } = this.props;
    const pathname = location.pathname;
    return (
      <TransitionGroup className="wrap-transition">
        <CSSTransition key={pathname} classNames="alert" nodeRef={this.nodeRef} timeout={300}>
          <div className="wrap-container" ref={this.nodeRef}>
            <Switch location={location}>
              {children}
              <Route path="*" component={Error}/>
            </Switch>
          </div>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
