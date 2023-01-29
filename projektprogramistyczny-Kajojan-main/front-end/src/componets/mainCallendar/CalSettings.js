import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import '../../scss/calSettings.scss'

import { postData, error, delCal, deleteUser, editRole } from "../../features/CalSlice";

function CalSettings({ setpop }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cal = useSelector((state) => state.cal.cal);
  const user_id = useSelector((state) => state.user.user_id);
  const lastname = useSelector((state) => state.user.lastname);
  const cal_id = cal.cal_id;
  const errorMsg = useSelector((state) => state.cal.error);
  const [input, setinput] = useState("");
  const [sure, setSure] = useState(false);
  const [role, setRole] = useState("");
  const [change, setChange] = useState({
    status: false,
    role: "",
    id: "",
    name: "",
    index:0,
  });
  const [changeYes, setChangeYes] = useState(false);

  // useEffect(() => {
  //   if (errorMsg.status == false) {
  //     setinput("");
  //   }
  // }, [errorMsg]);

  const handleChange = (event) => {
    setinput(event.target.value);
    dispatch(
      error({ status: false, data: "User is already in this calendar " })
    );
   
  };
  const selectHandler = (event) => {
    setRole(event.target.value);
  };
  const clickHandler = () => {
    setpop(false);
  };
  const DataHandler = () => {
    if ([input].some(elem =>
      Object.values(cal.users).some(array => array.some(subArray => subArray != null && subArray.includes(elem))))) {

      dispatch(
        error({ status: true, data: "User is already in this calendar " })
      );
    } else if (input == "") {
      dispatch(error({ status: true, data: "Input user_id" }));
    } else {

      dispatch(postData(input, cal.name, lastname, cal, user_id, cal_id, role));
      setinput("")
    }
  };

  const sureHandler = () => {
    dispatch(delCal(user_id, cal_id));
    navigate("/mainpage");
  };

  const delHandler = () => {
    dispatch(deleteUser(change.id, cal_id, change.role, change.index))
    setChange({...change, status:false})
  };
  const changeHandler = () => {
    dispatch(editRole(change.id, cal_id, change.role, change.index, role, change.id, change.name))
    setChange({...change, status:false})

  };

  return (
    <div className="CalSettings">
      <div className="users">
        <a>Users list: </a>
        <button>admin: {cal.users.admin[0][1]} </button>
        {cal.users.reader.map((el, index) => {
           return el != null ? (
            <button
              key={index}
              onClick={() =>
                setChange({
                  status: true,
                  role: "reader",
                  id: el[0],
                  name: el[1],
                  index: index
                })
              }
            >
              reader {el[1]}
            </button>
          ): null
        })}
        {cal.users.spec.map((el, index) => {
           return el != null ?  (
            <button
              key={index}
              onClick={() =>
                setChange({
                  status: true,
                  role: "spec",
                  id: el[0],
                  name: el[1],
                  index: index
                })
              }
            >
              spectaitor {el[1]}
            </button>
          ): null 
        })}
        {change.status && user_id == cal.users.admin[0][0] ? (
          <div className="Del_change">
            <div className="Del">
              <a>Do you want delete this user ({change.name}) ?</a>
              <button className="no" onClick={() => setChange({ ...change ,status: false})}>
                No
              </button>
              <button className="yes" onClick={delHandler}>Yes</button>
            </div>
            <div className="Change">
              <a>Do you want change role to this user ({change.name}) ?</a>
              <button className="no" onClick={() => setChange({  ...change,status: false })}>
                No
              </button>
              <button className="yes" onClick={() => setChangeYes(true)}>Yes</button>
              {changeYes ? (
                <div className="ChangeYes">
                  
                  <select onChange={selectHandler}>
                    <option value="admin">Admin</option>
                    <option value="reader">Reader</option>
                    <option value="spec">Spectator</option>
                  </select>
                  <button onClick={changeHandler}>change</button>

                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      {user_id == cal.users.admin[0][0] ? (
        <div className="add_users">
          <label>Enter user ID:</label>
          <input onChange={handleChange} value={input}></input>
          <select onChange={selectHandler}>
            <option value="admin">Admin</option>
            <option value="reader">Reader</option>
            <option value="spec">Spectator</option>
          </select>
          <button className="user" onClick={DataHandler}>Add User</button>
          {errorMsg.status ? <a>{errorMsg.data}</a> : null}
        </div>
      ) : null}

      {user_id == cal.users.admin[0][0] ? (
        <div className="Delete">
          <button onClick={() => setSure(true)}>Delete this calendar</button>
          {sure ? (
            <div className="sure">
              <a>Are you sure to delete this calendar?</a>
              <button className="yes" onClick={sureHandler}>Yes</button>
              <button className="no" onClick={() => setSure(false)}>No</button>
            </div>
          ) : null}{" "}
        </div>
      ) : null}

      <button onClick={clickHandler}>Close</button>
    </div>
  );
}

export default CalSettings;
