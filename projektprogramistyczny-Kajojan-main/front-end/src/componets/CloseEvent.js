import React from "react";
import { useSelector } from "react-redux";
import "../scss/closeEvent.scss";

function CloseEvent() {
  const allCal = useSelector((state) => state.cal.Allcall);
  const currentday = new Date().getDate();
  const month = new Date().getMonth();

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

  const event = connectArrays
    .slice(month, connectArrays.length)
    .reduce((acc, ele) => {
      ele.map((ele2, index) => {
        if (
          acc.length < 3 &&
          ele2.event.length > 0 &&
          (ele2.month_Id > month || ele2.id >= currentday)
        ) {
          acc.push(ele2);
        }
        return acc;
      });
      return acc;
    }, []);

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

  return (
    <div className="CloseEvent">
      <p className="title">Your next Events: </p>
      {event.map((ele, index) => {
        if (ele.event.length == 1) {
          return (
            
            <a key={index}>
              name: {ele.event[0].name} <br /> 
              date: {ele.id}  {monthNames[ele.month_Id]}<br /> 
              time:{" "}
              {ele.event[0].time
                ? "AllDay"
                : `${ele.event[0].start} : ${ele.event[0].end} `}{" "}
            </a>
          );
        } else {
           return ele.event.filter(a=> a != null).map((ele2, index2) => {
            return (
              <a key={index2}>
                name: {ele2.name} <br /> 
                date: {monthNames[ele.month_Id]}: {ele.id} <br /> 
                time: {ele2.time ? "AllDay " : `${ele2.start} : ${ele2.end} `}
              </a>
            );
          });
        }
      })}
    </div>
  );
}

export default CloseEvent;
