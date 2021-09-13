import {
  counterReducer,
  CounterState,
  increment,
  decrement,
  incrementByAmount
} from './counter.reducer';

describe('counter reducer', () => {
  const initialState: CounterState = {
    value: 3,
    status: 'idle'
  };
  it('should handle initial state', () => {
    expect(counterReducer.reducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
      status: 'idle'
    });
  });

  it('should handle increment', () => {
    const actual = counterReducer.reducer(initialState, increment());
    expect(actual.value).toEqual(4);
  });

  it('should handle decrement', () => {
    const actual = counterReducer.reducer(initialState, decrement());
    expect(actual.value).toEqual(2);
  });

  it('should handle incrementByAmount', () => {
    const actual = counterReducer.reducer(initialState, incrementByAmount(2));
    expect(actual.value).toEqual(5);
  });
});
