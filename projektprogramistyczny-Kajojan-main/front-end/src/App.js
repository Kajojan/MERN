import { React, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import CurrentDay from "./componets/mainCallendar/CurrentDay";
import Calendar from "./componets/mainCallendar/Calendar";
import Navi from "./componets/Navi/Navi";
import MainPage from "./componets/MainPage";
import Login from "./componets/Login";
import Profile from "./componets/Navi/Profile";
import Notice from "./componets/Navi/Notice";
import Settings from "./componets/Navi/Settings";
import SingUp from "./componets/SingUp";
import axios from "axios";
import { loggedIn } from "./features/LoggedInSlice";
import AllEventCAl from "./componets/AllEventCAl";
axios.defaults.withCredentials = true;

function App() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const currentMonth = useSelector((state) => state.month.currentMonth);
  const currentYear = useSelector((state) => state.year.currentYear);
  const user = useSelector((state) => state.user.user_id);
  const logged = useSelector((state) => state.loggedin.loggedin);

  useEffect(() => {
    dispatch(loggedIn());
  });

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <div className="App">
      {logged == true ? (
        <>
          <Navi />
          <div className="BackButton">
            <button onClick={handleClick}>Cofnij</button>
          </div>
          <Routes>
            <Route
              path={`/callander/${user}/allCal`}
              element={<AllEventCAl />}
            ></Route>
            <Route path={`/mainpage`} element={<MainPage />} />
            <Route path={`/profile`} element={<Profile />} />
            <Route path="/Notice" element={<Notice />} />
            <Route path="/Settings" element={<Settings />} />
            <Route
              path={`/callander/${user}/${currentYear}/${currentMonth}/:currentday`}
              element={<CurrentDay />}
            />
            <Route
              path={`/callander/${user}/${currentYear}/${currentMonth}`}
              element={<Calendar />}
            />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/singup" element={<SingUp />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
