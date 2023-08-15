import { configureStore } from '@reduxjs/toolkit';
import userRedux from './userSlice';
import noteWow from './noteSlice';



const store = configureStore({
  reducer: {
    appRedux: userRedux,
    note: noteWow,
  },
  
});

export default store;
