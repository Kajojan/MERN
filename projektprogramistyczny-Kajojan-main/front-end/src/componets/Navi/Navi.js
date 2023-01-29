import React from "react";
import "../../scss/navi.scss";
import { useSelector, useDispatch } from "react-redux";
import {Link} from "react-router-dom"


function Navi() {

  const usersName = useSelector((state)=>state.user.name)
  return (
    <div className="Navi">
      <div className="Link">
      <Link to="/mainpage"> Home</Link>
      <Link to="/profile"> Profile</Link>
      </div>
      <div className="Welcome">
      <p>Welcome: {usersName}</p>
      </div>
    
      {/* <Link to="/Notice"> Notice</Link> */}
      {/* <Link to="/Settings"> Settings</Link> */}


      {/* <Profile />
      <Callendars />
      <Notice />
      <Settings /> */}
    </div>
  );
}

export default Navi;
