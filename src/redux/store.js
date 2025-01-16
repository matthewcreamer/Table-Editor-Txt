import { configureStore } from '@reduxjs/toolkit';
import layoutReducer from './slice';

export default configureStore({
  reducer: {
    layout: layoutReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
