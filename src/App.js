import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { db } from "./util/config";
import UserProfile from "./pages/UserProfile";
import UserHome from "./pages/UserHome";
import NotFound from "./pages/NotFound";
import LinkSent from "./pages/LinkSent";
import jwtDecode from "jwt-decode";
import AuthRoute from "./util/AuthRoute";
import { ActiveRoute } from "./util/ActiveRoute";
import { Provider } from "react-redux";
import store from "./redux/store";
import axios from "axios";
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, addNoti } from "./redux/actions/userActions";

axios.defaults.baseURL =
  "https://asia-east2-whiner2-82d5e.cloudfunctions.net/api";

const token = localStorage.getItem("jwt-auth");
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // store.dispatch(getUserData('app'));
  }
} else {
  let x = window.location.href;
  let n = x.split("?oauth=");
  if (n[1]) {
    let tok = n[1].split("&");
    tok = tok[0];
    const decodedToken = jwtDecode(tok);
    if (decodedToken.exp * 1000 < Date.now()) {
      store.dispatch(logoutUser());
      window.location.href = "/";
    } else {
      store.dispatch({ type: SET_AUTHENTICATED });
      localStorage.setItem("jwt-auth", tok);
      axios.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
      // store.dispatch(getUserData('app'));
    }
  }
}

function App() {
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
      db.collection("users")
        .doc(docId)
        .collection("notifications")
        .onSnapshot((res) => {
          res.docChanges().forEach((x) => {
            if (x.type === "added") {
              let a = x.doc.data();
              a.id = x.doc.id;
              store.dispatch(addNoti(a));
            }
          });
        });
    }
  }, [docId]);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <Switch>
            <AuthRoute exact path="/" component={Home} />
            <Route exact path="/home" component={UserHome} />
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/signup" component={Signup} />
            <Route exact path="/verify" component={LinkSent} />
            <ActiveRoute exact path="/user/:handle" component={UserProfile} />
            <Route exact path="/:invalid" component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
