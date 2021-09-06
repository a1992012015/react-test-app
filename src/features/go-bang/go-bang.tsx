import React from 'react';
import { Col, Row } from 'antd';

import styles from './go-bang.module.less';
import { BaseComponent } from '../../components/should-component-update';
import { Checkerboard } from './checkerboard/checkerboard';
import { Controller } from './controller/controller';

export class GoBang extends BaseComponent {
  render() {
    return (
      <Row className={styles.container} align="middle" justify="center">
        <Col span={16}>
          <Checkerboard/>
        </Col>

        <Col span={8}>
          <Controller/>
        </Col>
      </Row>
    );
  }
}
