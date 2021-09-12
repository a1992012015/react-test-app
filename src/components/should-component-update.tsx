import { Component } from 'react';
import { is } from 'immutable';

export class BaseComponent<P = unknown, S = unknown> extends Component<P, S> {
  shouldComponentUpdate(props: P, state: S): boolean {
    const thisProps = this.props || {};
    const thisState = this.state || {};
    const nextProps = props || ({} as P);
    const nextState = state || ({} as S);

    if (
      Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length
    ) {
      return true;
    }

    for (const key in nextProps) {
      if (thisProps[key] !== nextProps[key] && !is(thisProps[key], nextProps[key])) {
        return true;
      }
    }

    for (const key in nextState) {
      if (thisState[key] !== nextState[key] && !is(thisState[key], nextState[key])) {
        return true;
      }
    }

    return false;
  }
}
