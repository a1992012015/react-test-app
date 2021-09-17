import { combineReducers } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import { counterReducer } from './counter.reducer';
import { gobangReducer } from './gobang.reducer';
import { pokemonApi } from '../../services/pokemon.service';
import { workerReducer } from './worker.reducer';

export const createReducer = combineReducers({
  counter: counterReducer.reducer,
  gobang: gobangReducer,
  worker: workerReducer,
  [pokemonApi.reducerPath]: pokemonApi.reducer
});
