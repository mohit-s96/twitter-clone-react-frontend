import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import favicon from "../assets/static/favicon-blue.png";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import throttle_func from "../util/throttle_func";
import {
  logoutUser,
  markNotiRead,
  addNoti,
} from "../redux/actions/userActions";
import { getSearchAutoComplete } from "../redux/actions/dataActions";
import SearchList from "../components/SearchList";
import { db } from "../util/config";
import NotiModal from "../components/NotiModal";
import "./component-styles/AuthNavbar.css";

function AuthNavbar(props) {
  const [inputField, setInputField] = useState("");
  const [docId, setDocId] = useState();
  useEffect(() => {
    let docid;
    const id = localStorage.getItem("jwt-auth");
    if (id) {
      const dt = jwtDecode(id);
      let mail = dt.email;
      db.collection("users")
        .where("email", "==", mail)
        .get()
        .then((res) => {
          docid = res.docs[0].id;
          setDocId(docid);
        });
    }
  }, []);
  useEffect(() => {
    if (docId) {
      const unsub = db
        .collection("users")
        .doc(docId)
        .collection("notifications")
        .onSnapshot((res) => {
          res.docChanges().forEach((x) => {
            if (x.type === "added") {
              let a = x.doc.data();
              a.id = x.doc.id;
              props.addNoti(a);
            }
          });
        });
      return unsub;
    }
  }, [docId]);
  const closeAllModals = () => {
    if (props.closeAll) {
      props.closeAll();
    }
  };
  const toggleSearch = () => {
    console.log("hi");
    if (props.openSearch) {
      console.log("hello");
      props.openSearch();
    }
  };

  const closeNotiModal = (e) => {
    if (!e.relatedTarget) {
      document.getElementById("show-hide-noti").classList.remove("show-notis");
    } else {
      if (!e.relatedTarget.classList.contains("dont-lose-focus")) {
        document
          .getElementById("show-hide-noti")
          .classList.remove("show-notis");
      }
    }
  };

  const getSearchList = (e) => {
    let check = /^[a-zA-Z0-9_.-]*$/;
    let x = e.target.value;
    if (x.trim() === "" || !check.test(x) || x.length < 1) {
      setInputField("");
    }
    if (x.length > 1 && check.test(x)) {
      setInputField(x);
      props.getSearchAutoComplete(x);
    }
  };

  const notiReadEvent = () => {
    if (props.toggleNoti) {
      props.toggleNoti();
    } else {
      document.getElementById("show-hide-noti").classList.add("show-notis");
      document.getElementById("show-hide-noti").focus();
    }
    let x = props.message.notifications;
    let i = [];
    x.forEach((a) => {
      if (!a.read) {
        i.push(a.id);
      }
    });
    props.markNotiRead(i);
    //  setTimeout(() => {
    //      this.forceUpdate();
    //  }, 1000);
  };
  const handleClick = () => {
    props.logoutUser();
  };
  const getUnread = () => {
    let x = props.message.notifications;
    let i = 0;
    x.forEach((a) => {
      if (!a.read) {
        i++;
      }
    });
    if (i > 0) {
      return i;
    } else {
      return null;
    }
  };
  return (
    <div className="auth-nav-container">
      <div className="auth-nav-flex-main">
        <div className="auth-nav-flex-left">
          <div className="nav-home nav-item">
            <FontAwesomeIcon icon={faHome} onClick={closeAllModals} />
            <Link to="/home">{!props.device && "Home"}</Link>
          </div>
          <div className="nav-login nav-item noti-nav" onClick={notiReadEvent}>
            {props.message.notifications ? (
              getUnread() ? (
                <>
                  <div className="blue-noti">
                    <div className="not-count-wrapper">
                      <span className="noti-count">{getUnread()}</span>
                    </div>
                    {!props.device && (
                      <>
                        <FontAwesomeIcon icon={faBell} />
                        Notifications
                      </>
                    )}
                  </div>
                  {props.device && <FontAwesomeIcon icon={faBell} />}
                </>
              ) : (
                <div>
                  <FontAwesomeIcon icon={faBell} />{" "}
                  {!props.device && "Notifications"}
                </div>
              )
            ) : (
              <div>
                <FontAwesomeIcon icon={faBell} />{" "}
                {!props.device && "Notifications"}
              </div>
            )}
            <div
              className="noti-container"
              id="show-hide-noti"
              onBlur={closeNotiModal}
              tabIndex={0}
            >
              <NotiModal />
            </div>
          </div>
          <div className="nav-signup nav-item" onClick={handleClick}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            {!props.device && "Logout"}
          </div>
        </div>
        {!props.device ? (
          <div className="branding">
            <Link to="/">
              <img src={favicon} alt="" />
            </Link>
          </div>
        ) : null}
        <div className="auth-nav-flex-right">
          <div className="nav-input nav-input1">
            {!props.device ? (
              <input
                type="text"
                className="search"
                id="nav-search"
                placeholder="Search..."
                onChange={throttle_func(getSearchList, 20)}
              />
            ) : null}
            <div className="nav-search-icon1" onClick={toggleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
          {inputField !== "" ? <SearchList /> : null}
        </div>
      </div>
    </div>
  );
}

AuthNavbar.propTypes = {
  message: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  markNotiRead: PropTypes.func.isRequired,
  getSearchAutoComplete: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  message: state.user.message,
});

const mapActionsToProps = {
  logoutUser,
  markNotiRead,
  getSearchAutoComplete,
  addNoti,
};

export default connect(mapStateToProps, mapActionsToProps)(AuthNavbar);
