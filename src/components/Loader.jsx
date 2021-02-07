import React from "react";
import "./component-styles/Loader.css";
import loader from "../assets/static/ajax-loader.gif";
import netError from "../assets/static/neterror.png";

function Loader(props) {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        {props.flag ? (
          <p
            style={{
              margin: "0 auto",
              fontSize: "1.2rem",
            }}
          >
            Please check your internet connection and reload!!
          </p>
        ) : null}
        <img
          src={props.flag ? netError : loader}
          alt="loader"
          width={props.flag ? "150px" : null}
        />
      </div>
    </div>
  );
}

export default Loader;
