import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { calendar } from "./cal";

const initialState = {
  cal: [],
  Allcall: [],
  error: { status: true, data: "" },
};

const CalSlice = createSlice({
  name: "Cal",
  initialState,
  reducers: {
    changeCal: (state, action) => {
      state.cal = action.payload.cal;
      
    },
    // fetchCal: (state, action) => {
    //   state.cal = action.payload;
    // },
    add: (state, action) => {
      state.Allcall.push(action.payload);
    },
    upload: (state, action) => {
      state.Allcall = action.payload;
    },
    error: (state, action) => {
      state.error = action.payload;
    },
    addUser: (state, action) => {
      state.cal.users = action.payload;
    },
  },
});

// export const fetchData = (user_id) => async (dispatch, getState) => {
//   const cals = await axios.get(`http://localhost:4000/api/cal/${user_id}/`);
//   dispatch(fetchCal(cals.data.callendars.cal));
// };

export const postData = (
  user_id,
  name ,
  admin_name = null,
  data = calendar(user_id,name,admin_name),
  seUser_id = null,
  cal_id = null,
  role = null,
  
) => {
  return (dispatch) => {
    axios
      .put(`http://localhost:4000/api/cal/${user_id}`, {
        seUser_id: seUser_id,
        seUsersCal_id: cal_id,
        role: role,
        data: data,
      })
      .then((response) => {
        if (response.data.status != "error") {
          if (seUser_id == null) {
            dispatch(changeCal(data));
            dispatch(add(data));
          }else{
            dispatch(addUser(response.data.cal[0].users));
            dispatch(error({ status: false, data: "" }));
          }
          
        } else {
          dispatch(error({ status: true, data: response.data.error }));
        }
      })
      .catch((error) => {
        dispatch({ type: "POST_ERROR", error });
      });
  };
};

export const delCal = (user_id, cal_id) => {
  return (dispatch) => {
    axios
      .delete(`http://localhost:4000/api/cal/${user_id}/${cal_id}`)
      .then((response) => {
        dispatch(upload(response.data[0].callendars))
      })
      .catch((error) => {
        dispatch({ type: "POST_ERROR", error });
      });
  };
};

export const deleteUser = (user_id, cal_id,role,index) => {
  return (dispatch) => {
    axios
      .delete(`http://localhost:4000/api/cal/${user_id}/${cal_id}/${role}/${index}`)
      .then((response) => {
        dispatch(changeCal({cal:response.data[0]}))
      })
      .catch((error) => {
        dispatch({ type: "POST_ERROR", error });
      });
  };
};


export const editRole = (user_id, cal_id,role,index, newRole, id,name) => {
  return (dispatch) => {
    axios
      .put(`http://localhost:4000/api/cal/change/role/${user_id}/${cal_id}/${role}/${index}`, {role: newRole, user:[id, name]})
      .then((response) => {
        dispatch(changeCal({cal:response.data[0]}))
      })
      .catch((error) => {
        dispatch({ type: "POST_ERROR", error });
      });
  };
};


export const { changeCal, fetchCal, add, upload, error, addUser } =
  CalSlice.actions;

export default CalSlice.reducer;
