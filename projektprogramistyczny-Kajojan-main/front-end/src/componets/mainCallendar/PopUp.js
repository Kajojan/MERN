import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import {  dellevent } from "../../features/CurrentDaySlice";
import EventForm from '../Form/EventForm';
import fileDownload from 'react-file-download';
import axios from 'axios';


function PopUp({setPop,pop}) {
    const dispatch = useDispatch()
    const user_id = useSelector((state)=>state.user.user_id)
    const cal = useSelector((state)=>state.cal.cal)
    const month_id = useSelector((state)=>state.month.currentMonth)
    const day_id = useSelector((state)=>state.day.currentDay)
    const event_id = pop[2]
    const day = useSelector((state) => state.day.dayData);

    const clickHandler=()=>{
        setPop([false,pop[1], pop[2]])
        dispatch(dellevent(user_id,cal.cal_id,month_id,day_id,event_id))
    }
    const download=(ele)=>{
      console.log(ele)
        axios({url:`http://localhost:4000/${ele}`, method:"GET", responseType:"blob"})
        .then(data => {
          fileDownload(data.data, ele);
        });
    }
  return (
    <div className='PopUp'>
      <div className='editPopUp'>
            <EventForm name={"Update Event"} pop={pop}/>
            <button onClick={()=>setPop([false, ...pop])}>close</button>
          </div>
      <div className='deletePopUp'>
        <a>Do you want delete this event: {pop[1]} ? </a>
        <button className="yes" onClick={clickHandler}>yes</button>
        <button className='no' onClick={()=>setPop(false)}>no</button>
        </div>
        <div>
          <a>załączniki: </a>
            {day.event[pop[2]].file.length > 0 ? 
            day.event[pop[2]].file.map((ele,index)=>{
              console.log(ele)
              return <button key={index} onClick={()=> download(ele)}> {ele}</button>
            }): console.log(day.event[pop[2]].file)}

        </div>
        
    </div>
  )
}

export default PopUp