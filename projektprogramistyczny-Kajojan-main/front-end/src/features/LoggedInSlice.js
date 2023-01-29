import { createSlice } from "@reduxjs/toolkit";
import axios from "axios"
import { upload } from "./CalSlice";
import { Add } from "./UserSlice";
export const LoggedinSlice = createSlice({
  name: 'logged',
  initialState:{
    loggedin: undefined,
  },
  reducers: {
    change: (state, action) => {
      state.loggedin = action.payload      
    },
 
  },
});

export const loggedIn = () => {
    return (dispatch) => {
      axios
        .get(`http://localhost:4000/api/cal/if/logged/in`)
        .then((response) => {
          if(response.data.status==true){
            dispatch(upload(response.data.data.callendars))
            dispatch(change(response.data.status))
            dispatch(Add(response.data.data))
          }else{
            dispatch(change(response.data.status))

          }

        })
        .catch((error) => {
          dispatch({ type: "POST_ERROR", error });
        });
    };
  };

export const logout = () => {
    return (dispatch) => {
      axios
        .get(`http://localhost:4000/api/cal/`)
        .then((response) => {
          dispatch(change(false))
        })
        .catch((error) => {
          dispatch({ type: "POST_ERROR", error });
        });
    };
  };
  

export const { change } = LoggedinSlice.actions;

export default LoggedinSlice.reducer;
