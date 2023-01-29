import {React, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loggedIn, logout } from "../../features/LoggedInSlice";
import { raport, raportChange } from "../../features/UserSlice";
import "../../scss/profile.scss";
import FileSaver from "file-saver";
import { change } from "../../features/YearSlice";

function Profile() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const id = useSelector((state) => state.user.user_id);
  const name = useSelector((state) => state.user.name);
  const lastName = useSelector((state) => state.user.lastname);
  const email = useSelector((state) => state.user.email);
  const dispatch = useDispatch();
  const User_raport = useSelector((state) => state.user.raportChange);


  

  const ClickHandler = () => {
    dispatch(logout());
    dispatch(loggedIn());
    navigate("/");
  };
  const selectHandler = (event) => {
  //  merge()
    changeRaport(event.target.value)
    
  };

  const handleDownload = () => {
    const data = User_raport.reduce((acc, ele) => {
      acc += `cal_id : ${ele.cal_id} \n users: \n admin: ${ele.count_admin} \n reader: ${ele.count_reader} \n spec: ${ele.count_spec} \n`;
      User_raport.map((ele2, index) => {
        if (ele2._id == ele.cal_id) {
          acc += `events: ${ele2.eventCount} \n`;
        }
        return acc;
      });
      return acc;
    }, "");

    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "raport.txt");
  };

  const generateRaport = () => {
    dispatch(raport(id));
  };

  const changeRaport =(a)=>{
    const sortByKey = (key) => (a, b) => a[key] < b[key] ? 1 : -1;
    if(a != "event"){

    let helper = [...User_raport];    
     dispatch(raportChange(helper.sort(sortByKey(`count_${a}`))))
    }else{
    let helper = [...User_raport];    
    dispatch(raportChange(helper.sort(sortByKey(`eventCount`))))

    }
  }

  return (
    <div className="Profile">
      <div className="Info">
        <a>Name: {name} </a>
        <a>Last name: {lastName} </a>
        <a>email : {email} </a>
        <a>Your unique id : {id} </a>
      </div>
      <div className="Raports">
        <button onClick={generateRaport}>Generate Raports</button>
        {User_raport != undefined ? (
          <div className="Sort">
            <label>Sort by</label>
            <select onChange={selectHandler}>
              <option value="admin">Admin</option>
              <option value="reader">Reader</option>
              <option value="spec">Spectator</option>
              <option value="event">Event</option>

            </select>
          </div>
        ) : null}
        {User_raport != undefined
          ? User_raport.map((ele, index) => {
              return (
                <div className="Raport_cal" key={index}>
                  <a>cal_id: {ele.cal_id}</a>
                  <ul>
                    users:
                    <li>admin: {ele.count_admin}</li>
                    <li>reader: {ele.count_reader}</li>
                    <li>spectetor: {ele.count_spec}</li>
                    events: 
                    <li>events: {ele.eventCount}</li>
                  </ul>
                 
                
                  
                </div>
              );
            })
          : null}
        <button onClick={handleDownload}>Downloand you Raport </button>
      </div>

      <button className="LogOut" onClick={ClickHandler}>
        Log Out
      </button>
    </div>
  );
}

export default Profile;
