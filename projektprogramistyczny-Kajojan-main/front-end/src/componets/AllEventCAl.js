import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "./mainCallendar/Calendar";
import { changeCal } from "../features/CalSlice";

function AllEventCAl() {
  const allCal = useSelector((state) => state.cal.Allcall);
  const dispatch = useDispatch()

  // let combinedArray = allCal.reduce((acc, val) => acc.concat(val.cal), []);

  const connectArrays = allCal.reduce((acc, ele, index) => {
    ele.cal.map((ele2, index2) => {
      if (index == 0) {
        acc.push([]);
      }
      ele2.map((ele3, index3) => {
        if (index == 0) {
          acc[index2].push({ month_Id: ele3.month_Id, id: ele3.id, event: [] });
        }
        ele3.event.forEach((ele) => {
          acc[ele3.month_Id][ele3.id - 1].event.push(ele);
        });

        return acc;
      });
      return acc;
    });
    return acc;
  }, []);
  
  dispatch(changeCal({cal:{ cal: connectArrays, users:[]}}));
  
  return <div>
    <Calendar></Calendar>
  </div>;
}

export default AllEventCAl;
