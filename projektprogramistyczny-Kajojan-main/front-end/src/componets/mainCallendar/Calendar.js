import React from "react";
import Day from "./Day";
import Month from "./Month"

function Calendar() {


  return (
    <div className="container">
    <Month></Month>
     <Day/>
    </div>
  );
}

export default Calendar;
