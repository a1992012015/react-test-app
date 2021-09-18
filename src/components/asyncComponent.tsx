import React, {
  ComponentClass,
  ComponentType,
  FunctionComponent,
  NamedExoticComponent
} from 'react';

import { BaseComponent } from './should-component-update';

type IAsyncComponent = ComponentClass | NamedExoticComponent | FunctionComponent;

type IAsyncFunction = () => Promise<{ readonly default: IAsyncComponent }>;

interface IState {
  component: IAsyncComponent | null;
}

/**
 * 按需加在所有的component
 * @param importComponent 需要加载的component
 */
export const asyncComponent = (importComponent: IAsyncFunction): ComponentType => {
  class AsyncComponent extends BaseComponent<unknown, IState> {
    constructor(props: unknown) {
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
};
