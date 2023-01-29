import FileSaver from "file-saver";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actions } from "../../features/CurrentDaySlice";
import "../../scss/day.scss";
import ImportFile from "./ImportFile";
import axios from 'axios'

function Day() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user_id);
  const [days, setdays] = useState(32);
  const [week, setweek] = useState(-1);
  const [Import , setImport] = useState(false)
  const month = useSelector((state) => state.month.currentMonth);
  const currentYear = useSelector((state) => state.year.currentYear);
  const cal = useSelector((state) => state.cal.cal);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [click, setClick] = useState(false);

  const handleSubmit = (id) => {
    dispatch(actions.change(id));
    dispatch(actions.changeData(cal.cal[month][id - 1]));
    navigate(`/callander/${user}/${currentYear}/${month}/${id}`);
  };
  const clickhandler = (a) => {
    setdays(a);
    setweek(-1);
    if (a == 7) {
      setweek(0);
    }
  };
  const searchhandler = (event) => {
    setClick(false);
    setSearch(event.target.value);
  };
  const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecie",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];
  const Clicksearch = () => {
    const events = [];
    cal.cal.map((ele, index) => {
      ele.map((ele2, index2) => {
        if (ele2.event.length > 0) {
          ele2.event
            .filter((a) => a != null)
            .forEach((element) => {
              if (element.name.toLowerCase() == search.toLowerCase()) {
                events.push([element, ele2]);
              }
            });
        }
      });
    });
    setData(events);
    setClick(true);
  };

  const weekHandler = (a) => {
    if (a == "next") {
      setdays(days + 7);
      setweek(week + 7);
    } else {
      setdays(days - 7);
      setweek(week - 7);
    }
  };
  const handleDownload = () => {
    axios.get(`http://localhost:4000/api/cal/${user}/${cal.cal_id}`).then((res)=>{
      const jsonData = JSON.stringify(res.data[0].events[0]);
      const blob = new Blob([jsonData], { type: 'application/json' });
      // console.log(blob)
      FileSaver.saveAs(blob, `events_${cal.cal_id}.json`);
    })
    
  };

 

  return (
    <div className="day">
      <div className="search">
        <input
          type="search"
          placeholder="Search event"
          value={search}
          onChange={searchhandler}
        ></input>
        <button onClick={Clicksearch}>Search</button>
        <div className="searchEvents">
          {data.length > 0 ? (
            data.map((ele, index) => {
              return (
                <a key={index}>
                  name: {ele[0].name}, time:{" "}
                  {ele[0].time ? "AllDay" : `${ele[0].start} - ${ele[0].end}`},
                  date: {monthNames[ele[1].month_Id]}, {ele[1].id}{" "}
                </a>
              );
            })
          ) : click ? (
            <a>Not found "{search}"</a>
          ) : null}
        </div>
      </div>
      {/* {console.log(cal)} */}
     { !Array.isArray(cal.users) && cal.users.admin.find(ele => ele[0] === user) != undefined  ?  <div className="Import">
        <button onClick={()=>setImport(true)}>Import File</button>
        {Import ? <ImportFile></ImportFile> : null }
        <button onClick={()=>handleDownload()}>Export events</button>
        
      </div>:  null }
      <div className="week">
        <button onClick={() => clickhandler(7)}>Week view</button>
        <button onClick={() => clickhandler(32)}>Month view</button>
        {week >= 0 ? (
          <>
            {days != 7 ? (
              <button onClick={() => weekHandler("prev")}>Prev Week</button>
            ) : null}
            {days < 32 ? (
              <button onClick={() => weekHandler("next")}>Next Week</button>
            ) : null}
          </>
        ) : null}
      </div>
      <div className="cal">
        <div className="weekDays">
          <div className="weekday">M</div>
          <div className="weekday">T</div>
          <div className="weekday">W</div>
          <div className="weekday">T</div>
          <div className="weekday">F</div>
          <div className="weekday isSaturday">S</div>
          <div className="weekday isSunday">S</div>
        </div>

        <div className="Month">
          {cal.cal[month].map((el, index) => {
            if (index < days && index >= week) {
              const key = `${el.month_Id}_${el.id}`;
              return (
                <button key={key} onClick={() => handleSubmit(el.id)}>
                  {el.id}
                  {
                    <ul>
                      {el.event.map((ele, index) => {
                        return ele == null ? null : (
                          <a key={index}>{ele.name}</a>
                        );
                      })}
                    </ul>
                  }
                </button>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default Day;
