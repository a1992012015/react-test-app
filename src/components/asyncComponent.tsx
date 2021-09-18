import React, { ComponentClass, FunctionComponent, NamedExoticComponent } from 'react';

import { BaseComponent } from './should-component-update';

type IAsyncComponent<P> = ComponentClass<P> | NamedExoticComponent | FunctionComponent;

type IAsyncFunction<P> = () => Promise<{ readonly default: IAsyncComponent<P> }>;

interface IState<P> {
  component: IAsyncComponent<P> | null;
}

/**
 * 按需加在所有的component
 * @param importComponent 需要加载的component
 */
export function asyncComponent<P = unknown>(importComponent: IAsyncFunction<P>): ComponentClass<P> {
  class AsyncComponent extends BaseComponent<P, IState<P>> {
    constructor(props: P) {
      super(props);

      this.state = { component: null };
    }

    async componentDidMount(): Promise<void> {
      const { default: component } = await importComponent();
      this.setState({ component });
    }

    render(): React.ReactNode {
      const Component = this.state.component;

      return Component ? <Component {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}
