import { setupListeners } from '@reduxjs/toolkit/query';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import { pokemonApi } from '../services/pokemon.service';
// eslint-disable-next-line import/no-cycle
import { createReducer } from './reducers';
import { rootSaga } from './root-sage';

const sagaMiddleware = createSagaMiddleware();

// sagaMiddleware: Makes redux-sagas work
const middlewares = [sagaMiddleware, pokemonApi.middleware];

if (process.env.REACT_APP_LOGGER !== 'true') {
  const logger = createLogger({
    // ...options
  });

  middlewares.push(logger);
}

const initialState = {};

export const rootStore = configureStore({
  reducer: createReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares),
  preloadedState: initialState,
  devTools: false
});

sagaMiddleware.run(rootSaga);

setupListeners(rootStore.dispatch);
