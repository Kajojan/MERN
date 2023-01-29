import { createSlice } from "@reduxjs/toolkit";

export const MonthSlice = createSlice({
  name: 'currentMonth',
  initialState:{
    currentMonth: new Date().getMonth(),
  },
  reducers: {
    Next: (state) => {
      state.currentMonth += 1
    },
    Prev: (state) => {
       state.currentMonth -= 1
    }
  },
});

export const { Next, Prev } = MonthSlice.actions;

export default MonthSlice.reducer;
