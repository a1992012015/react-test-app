import { combineReducers } from '@reduxjs/toolkit';

import counterReducer from './counterReducer';
import { pokemonApi } from '../../services/pokemon.service';

const createReducer = () => {
  return combineReducers({
    counter: counterReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer
  });
};

export default createReducer;
