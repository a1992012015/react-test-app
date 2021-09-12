import { combineReducers } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import { counterReducer } from './counter.reducer';
import { goBangReducer } from './go-bang.reducer';
import { pokemonApi } from '../../services/pokemon.service';
import { workerReducer } from './worker.reducer';

export const createReducer = combineReducers({
  counter: counterReducer.reducer,
  goBang: goBangReducer,
  worker: workerReducer,
  [pokemonApi.reducerPath]: pokemonApi.reducer
});
