import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Add, postData , error} from "../features/UserSlice";
import { v4 as uuidv4 } from "uuid";
import "../scss/signUp.scss";


function SingUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state)=> state.user.check)
  const errorMsg = useSelector((state)=> state.user.error)


  // function setCookie(cname, cvalue, exdays) {
  //     const d = new Date();
  //     d.setTime(d.getTime() + (exdays*24*60*60*1000));
  //     let expires = "expires="+ d.toUTCString();
  //     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  //   }

  useEffect(()=>{
    if(user==true){
      formik.handleReset()
      navigate('/mainpage')
    }
  },[user,error])

  const formik = useFormik({
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
      lastName: Yup.string()
        .min(2, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("This field is required"),
      ConPassword: Yup.string().when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Both password need to be the same"
        ),
      }),
    }),

    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      ConPassword: "",
    },
    onSubmit: (values) => {
      const user_id = uuidv4();
      dispatch(
        postData({
          user_id: user_id,
          name: values.firstName,
          lastname: values.lastName,
          email: values.email,
          password: values.password,
        })
      );

      // setCookie("username", values.lastName, 30)

      
    },
  });
  return (
    <form className="Sign" onSubmit={formik.handleSubmit}>
      <h2>Welcome to Calendar</h2>

      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.firstName}
        placeholder={"First Name"}
      />
      {formik.errors.firstName && formik.touched.firstName ? (
        <div  className="Error">{formik.errors.firstName}</div>
      ) : null}{" "}
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.lastName}
        placeholder={"Last Name"}

      />
      {formik.errors.lastName && formik.touched.lastName ? (
        <div className="Error">{formik.errors.lastName}</div>
      ) : null}{" "}
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
        placeholder={"Email Adress"}

      />
      {formik.errors.email && formik.touched.email ? (
        <div  className="Error">{formik.errors.email}</div>
      ) : null}{" "}
      <input
        id="password"
        type="password"
        name="password"
        onBlur={Formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.password}
        placeholder={"Password"}

      />
      {formik.errors.password && formik.touched.password ? (
        <div  className="Error"> {formik.errors.password}</div>
      ) : null}{" "}
      <input
        id="ConPassword"
        type="password"
        name="ConPassword"
        onBlur={Formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.ConPassword}
        placeholder={"Confirm Password"}

      />
      {formik.errors.ConPassword && formik.touched.ConPassword ? (
        <div>{formik.errors.ConPassword}</div>
      ) : null}{" "}
      {!user ? <div  className="Error">{errorMsg} </div > :<a></a>}

      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SingUp;
