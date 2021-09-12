import { Action, ThunkAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { rootStore } from '../main';

export type AppDispatch = typeof rootStore.dispatch;
export type RootState = ReturnType<typeof rootStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
