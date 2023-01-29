import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
import MonthReducer from '../features/MonthSlice';
import YearSlice from '../features/YearSlice';
import CurrentDaySlice from '../features/CurrentDaySlice'
import CalSlice from '../features/CalSlice';
import UserSlice from '../features/UserSlice'
import LoggedInSlice from '../features/LoggedInSlice';
import thunk from 'redux-thunk';
import  { logger } from "redux-logger"


 const store = configureStore({
  reducer:{
    month: MonthReducer,
    year: YearSlice,
    day: CurrentDaySlice,
    cal: CalSlice,
    user: UserSlice,
    loggedin : LoggedInSlice,

  },
  middleware: (getDefaultMiddleware)=> getDefaultMiddleware().concat(logger)
},applyMiddleware(thunk));
export default store