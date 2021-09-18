import React, { Ref, Suspense } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { BaseComponent } from './should-component-update';
import { asyncComponent } from './asyncComponent';
import { IEProps } from '../features/error/error';

const Error = asyncComponent<IEProps>(() => import('../features/error/error'));

interface Props {
  history: RouteComponentProps['history'];
}

/**
 * 默认路由跳转，添加路由跳转动画
 */
export class SwitchDefault extends BaseComponent<Props> {
  nodeRef: Ref<HTMLDivElement> = React.createRef();

  render(): React.ReactNode {
    const { history, children } = this.props;
    const { pathname } = history.location;
    return (
      <TransitionGroup className="wrap-transition">
        <CSSTransition key={pathname} classNames="alert" nodeRef={this.nodeRef} timeout={300}>
          <div className="wrap-container" ref={this.nodeRef}>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch location={history.location}>
                {children}
                <Route path="*" component={Error} />
              </Switch>
            </Suspense>
          </div>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
