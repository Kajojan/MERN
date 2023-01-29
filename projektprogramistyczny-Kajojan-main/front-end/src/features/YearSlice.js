import { createSlice } from "@reduxjs/toolkit";

export const YearSlice = createSlice({
  name: 'Year',
  initialState:{
    currentYear: "2022",
  },
  reducers: {
    change: (state,action) => {
      state.currentYear = action.payload
    },
    
  },
});

export const { change} = YearSlice.actions;

export default YearSlice.reducer;
