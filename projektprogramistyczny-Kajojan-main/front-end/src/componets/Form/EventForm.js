import { React, useState } from "react";
import { useFormik } from "formik";
import validate from "./validate";
import { useSelector, useDispatch } from "react-redux";
import { editEvent, postEvent } from "../../features/CurrentDaySlice";
import axios from "axios";

const EventForm = ({ name, pop }) => {
  const currentMonth = useSelector((state) => state.month.currentMonth);
  const user = useSelector((state) => state.user.user_id);
  const day = useSelector((state) => state.day.dayData);
  const cal = useSelector((state) => state.cal.cal);
  const day_id = useSelector((state) => state.day.currentDay);
  const cal_id = cal.cal_id;
  const dispatch = useDispatch();
  const [allday, setAllday] = useState(
    name == "Add Event" ? false : day.event[pop[2]].time
  );
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const formik = useFormik({
    initialValues: {
      name: name == "Add Event" ? "" : day.event[pop[2]].name,
      start: name == "Add Event" ? "" : day.event[pop[2]].start,
      end: name == "Add Event" ? "" : day.event[pop[2]].end,
      time: name == "Add Event" ? "" : day.event[pop[2]].time,
      file: "",
    },
    validate,

    onSubmit: (values) => {
      values.time = allday;
      console.log(values);
      formik.handleReset();
      if (name == "Add Event") {
        if (file != null) {
          const fileData = new FormData();
          fileData.append("file", file);
          axios
            .post(`http://localhost:4000/api/cal/upload/file`, fileData)
            .then((res) => {
              values.file = [res.data];
              dispatch(
                postEvent(user, cal.cal_id, currentMonth, day_id - 1, values)
              );
            });
        } else {
          dispatch(
            postEvent(user, cal.cal_id, currentMonth, day_id - 1, values)
          );
        }
      } else {
        if (file == null) {
          dispatch(
            editEvent(user, cal.cal_id, currentMonth, day_id, pop[2], values)
          );
        } else {
          const fileData = new FormData();
          fileData.append("file", file);
          axios
            .post(`http://localhost:4000/api/cal/upload/file`, fileData)
            .then((res) => {
              values.file = [...day.event[pop[2]].file, res.data];
              dispatch(
                editEvent(
                  user,
                  cal.cal_id,
                  currentMonth,
                  day_id,
                  pop[2],
                  values
                )
              );
            });
        }
        // dispatch(changeCal({cal:{...cal,   cal.cal[num][num2].event = [...cal.cal[num][num2].event, values] }}))
        // }
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
      <h1>{name}</h1>
      {/* {formik.values.time} */}
      <label htmlFor="name"> Event Name</label>
      <input
        id="name"
        name="name"
        type="text"
        onChange={formik.handleChange}
        value={
          name == "Add Event" ? formik.values.name : day.event[pop[2]].name
        }
      />
      {formik.errors.name ? <div>{formik.errors.name}</div> : null}
      {!allday ? (
        <div>
          <label htmlFor="start">Time-Start</label>
          <input
            id="start"
            name="start"
            type="time"
            onChange={formik.handleChange}
            // value={formik.values.start}
            value={
              name == "Add Event"
                ? formik.values.start
                : day.event[pop[2]].start
            }
          />

          <label htmlFor="end">Time-end</label>
          <input
            id="end"
            name="end"
            type="time"
            onChange={formik.handleChange}
            // value={formik.values.end}
            value={
              name == "Add Event" ? formik.values.end : day.event[pop[2]].end
            }
          />
          {formik.errors.end ? <div>{formik.errors.end}</div> : null}
        </div>
      ) : (
        <></>
      )}

      <input id="file" name="file" type="file" onChange={handleFileChange} />
      <button type="button" onClick={() => setAllday(!allday)}>
        AllDay
      </button>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
  );
};

export default EventForm;
