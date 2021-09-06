import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import { pokemonApi } from '../services/pokemon.service';
import createReducer from './reducers';
import sagas from './root-sage';

const configureAdminStore = (initialState = {}) => {
  const sagaMiddleware = createSagaMiddleware();

  // sagaMiddleware: Makes redux-sagas work
  const middlewares = [sagaMiddleware, logger, pokemonApi.middleware];

  const creatStore = configureStore({
    reducer: createReducer(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares),
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production'
  });

  sagaMiddleware.run(sagas);

  return creatStore;
};

const store = configureAdminStore();

setupListeners(store.dispatch)

export { store };

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
