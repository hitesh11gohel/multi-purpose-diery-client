import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const Protected = (props) => {
  const { Component } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (!isLoggedIn) {
      swal({
        title: "Session Expired",
        text: "Please log in again.",
        icon: "error",
        button: "Ok",
        dangerMode: true,
        closeOnClickOutside: false,
        closeOnEsc: false,
      }).then((out) => {
        if (out) {
          navigate("/login");
        }
      });
    }
  }, [navigate]);

  return <Component />;
};

export default Protected;
