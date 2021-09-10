import { combineReducers } from '@reduxjs/toolkit';

import counterReducer from './counter.reducer';
import { goBangReducer } from './go-bang.reducer';
import { pokemonApi } from '../../services/pokemon.service';
import { workerReducer } from './worker.reducer';

const createReducer = () => {
  return combineReducers({
    counter: counterReducer,
    goBang: goBangReducer,
    worker: workerReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer
  });
};

export default createReducer;
