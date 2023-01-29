import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import '../scss/mainPage.scss'
import { changeCal, postData } from "../features/CalSlice";
import { change } from "../features/YearSlice";
import CloseEvent from "./CloseEvent";

function MainPage() {
  const navigate = useNavigate();
  const currentMonth = useSelector((state) => state.month.currentMonth);
  const currentYear = useSelector((state) => state.year.currentYear);
  const user = useSelector((state) => state.user.user_id);
  const lastname = useSelector((state) => state.user.lastname);
  const callanders = useSelector((state) => state.cal.Allcall);
  const dispatch = useDispatch();
  const [pop, setPop] = useState(false);
  const [name, setName] = useState("");

  const clickHandler = () => {
    dispatch(postData(user, name, lastname));

    setPop(false);
    setName("");
  };
  const clickHandlerCal = async (index) => {
    dispatch(changeCal({ cal: callanders[index] }));
    dispatch(change(callanders[index].year));
    navigate(`/callander/${user}/${callanders[index].year}/${currentMonth}`);
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };



  return (
    <div className="mainpage">
      {callanders.map((el, index) => {
        return el ? (
          <button key={index} onClick={() => clickHandlerCal(index)}>
            {el.name}
          </button>
        ) : null;
      })}
      <button onClick={() => setPop(true)}>Add Callander</button>
      {pop ? (
        <div className="namePurpose">
          <input onChange={handleChange} value={name} placeholder={"Name/Purpose of calendar"}></input>
          <button onClick={clickHandler}>Add</button>
        </div>
      ) : null}

      {callanders.length > 0 ? <button onClick={() => navigate(`/callander/${user}/allCal`)}>
        All Event In One Calendar
      </button> : null }

      <CloseEvent></CloseEvent>
    </div>
  );
}

export default MainPage;
