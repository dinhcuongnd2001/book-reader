import {
    Action,
    ThunkAction,
    combineReducers,
    configureStore,
  } from '@reduxjs/toolkit';
import bookSlice from './Book/bookSlice';
  
  const reducers = combineReducers({
    book: bookSlice.reducer
  });
  
  export const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  
  export type AppDispatch = typeof store.dispatch;
  export type RootState = ReturnType<typeof store.getState>;
  export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
  >;
  