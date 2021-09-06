import React from 'react';
import { Button, Radio } from 'antd';

import styles from './controller.module.less';
import { BaseComponent } from '../../../components/should-component-update';
import { RadioChangeEvent } from 'antd/lib/radio/interface';

interface State {
  startWay: number;
}

export class Controller extends BaseComponent<object, State> {

  constructor(props: object) {
    super(props);

    this.state = {
      startWay: 2
    };
  }

  onChangeWay = (event: RadioChangeEvent) => {
    console.log('radio3 checked', event.target.value);
    this.setState({ startWay: event.target.value });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.tips}>
          <span className={styles.chess}/>
          {this.renderMassage()}
        </div>

        <div className={styles.actions}>
          {this.renderActions()}
        </div>
      </div>
    );
  }

  renderMassage = () => {
    // const { game, aiInfo } = this.props;
    // if (game.flag && game.king) {
    //   return `${game.king === 'ai' ? '圆环之理' : '您居然'}赢得了胜利！！！`;
    // } else if (game.flag) {
    //   return '点击开始按钮开始游戏';
    // } else if (!game.flag && game.stepNumber === 0) {
    //   return '您的先手，请落子';
    // } else if (!game.flag && game.xIsNext === 'ai') {
    //   return `Score:${aiInfo['score']} Step:${game.stepNumber} Time:${aiInfo['time']}`;
    // } else {
    //   return '电脑正在思考中。。。';
    // }
    return '电脑正在思考中。。。';
  };

  renderActions = () => {
    const flag = true;
    const { startWay: v } = this.state;
    if (flag) {
      return (
        <React.Fragment>
          <Button type="primary" size="large">开始游戏</Button>

          <Radio.Group value={v} onChange={this.onChangeWay} className={styles.radio} size="large">
            <Radio.Button value={1}>先手</Radio.Button>
            <Radio.Button value={2}>随机</Radio.Button>
            <Radio.Button value={0}>后手</Radio.Button>
          </Radio.Group>
        </React.Fragment>
      );
    } else  {
      return (
        <React.Fragment>
          <Button type="primary" size="large">开始游戏</Button>

          <Radio.Group value={v} onChange={this.onChangeWay} className={styles.radio} size="large">
            <Radio.Button value={1}>先手</Radio.Button>
            <Radio.Button value={2}>随机</Radio.Button>
            <Radio.Button value={0}>后手</Radio.Button>
          </Radio.Group>
        </React.Fragment>
      )
    }
  };
}
