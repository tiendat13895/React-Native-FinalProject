import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/CounterSlice';
import movieSlice from '../features/Movie/MovieSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    movie: movieSlice,
    // TODO:
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
