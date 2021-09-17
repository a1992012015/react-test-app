import React, { useState } from 'react';

import styles from './counter.module.less';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import {
  decrement,
  increment,
  incrementAsync,
  incrementByAmount,
  incrementIfOdd,
  selectCount
} from '../../stores/reducers/counter.reducer';
import { dynamicTitle } from '../../components/dynamic-title';

export function Counter(): JSX.Element {
  dynamicTitle('计数器');
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div>
      <div className={styles.row}>
        {/* eslint-disable-next-line max-len */}
        <button
          type="button"
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}>
          -
        </button>
        <span className={styles.value}>{count}</span>
        <button
          type="button"
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}>
          +
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          type="button"
          className={styles.button}
          onClick={() => dispatch(incrementByAmount(incrementValue))}>
          Add Amount
        </button>
        <button
          type="button"
          className={styles.asyncButton}
          onClick={() => dispatch(incrementAsync(incrementValue))}>
          Add Async
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => dispatch(incrementIfOdd(incrementValue))}>
          Add If Odd
        </button>
      </div>
    </div>
  );
}
