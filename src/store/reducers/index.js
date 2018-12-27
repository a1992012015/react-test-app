import { Reducer, combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

/**
 * Create a reducer creator for potential additional reducer key/value pairs
 * @param history react-router
 * @param reducers Reducers map
 * @return Reducer creator
 */
export default function createReducerCreator(history, reducers) {
  return function createReducer(extraReducers = {}) {
    // tslint:disable-next-line:prefer-object-spread
    return combineReducers(
      Object.assign(
        {
          router: connectRouter(history)
        },
        reducers,
        extraReducers
      )
    ) // tslint:disable-line:no-useless-intersection
  };
}
