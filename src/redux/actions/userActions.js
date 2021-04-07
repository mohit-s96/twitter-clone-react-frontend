import {
  SET_ERRORS,
  SET_USER,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  USER_FEED,
  LOADING_USER,
  LIKE_WHINE,
  UNLIKE_WHINE,
  RE_WHINE,
  LOADING_IMAGE,
  WHINE_LOADING,
  FOLLOW_ACTION,
  UNFOLLOW_ACTION,
  FOLLOW_USER_ACTION,
  UNFOLLOW_USER_ACTION,
  LIKE_WHINE_PUBLIC,
  UNLIKE_WHINE_PUBLIC,
  RE_WHINE_PUBLIC,
  ADD_LIKE_LIST,
  ADD_UNLIKE_LIST,
  ADD_REWHINE_LIST,
  MARK_NOTI_READ,
  LINK_SENT,
  FETCHING_FEED,
  FETCHED_FEED,
  NO_MORE_DATA,
  ADD_LIVE_NOTI,
  SET_NEWTWORK_ERROR,
} from "../types";
import { getPublicFeed } from "./dataActions";
import axios from "axios";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      localStorage.setItem("jwt-auth", res.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
      //   dispatch(getUserData("login"));
      dispatch({ type: CLEAR_ERRORS });
      history.push("/home");
    })
    .catch((err) => {
      if (err.toJSON().message === "Network Error") {
        dispatch({
          type: SET_NEWTWORK_ERROR,
        });
      } else {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data.errors
            ? err.response.data.errors
            : err.response.data,
        });
      }
    });
};
export const refreshMsgToken = (token) => {
  axios
    .post("/msgtoken", { token })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const logoutUser = () => (dispatch) => {
  if (window.navigator && navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        if (
          registration.scope ===
          "http://localhost:3000/firebase-cloud-messaging-push-scope"
        ) {
          registration.unregister();
        }
      }
    });
  }
  localStorage.clear();
  delete axios.defaults.headers.common["Authorization"];
  window.location.href = "/";
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const signupUser = (userData, history, mail) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", userData)
    .then(() => {
      dispatch({ type: LINK_SENT, payload: mail });
      // localStorage.setItem('jwt-auth', res.data.token);
      // axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      // dispatch(getUserData('signup'));
      dispatch({ type: CLEAR_ERRORS });
      history.push("/verify");
    })
    .catch((err) => {
      if (err.toJSON().message === "Network Error") {
        dispatch({
          type: SET_NEWTWORK_ERROR,
        });
      } else {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data.errors
            ? err.response.data.errors
            : err.response.data,
        });
      }
    });
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/userauth")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
      //  let x = ((res.data.message.whineCount > 0) || (res.data.message.following > 0)) ? 1 : 0;
      dispatch(getUserFeed(1));
    })
    .catch((err) => {
      if (err.toJSON().message === "Network Error") {
        dispatch({
          type: SET_NEWTWORK_ERROR,
        });
      }
      console.log(err);
    });
};
export const getOnlyUserData = (x) => (dispatch) => {
  if (x === "reload") {
    dispatch({ type: LOADING_USER });
  }
  axios
    .get("/userauth")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};
export const getPaginatedFeed = (refs) => (dispatch) => {
  dispatch({
    type: FETCHING_FEED,
  });
  axios.post("/paged", { refs: [...refs] }).then((res) => {
    if (res.data.refs.length) {
      dispatch({
        type: FETCHED_FEED,
        payload: res.data,
      });
    } else {
      dispatch({
        type: NO_MORE_DATA,
      });
    }
  });
};
export const getUserFeed = (x) => (dispatch) => {
  if (x > 0) {
    axios
      .get("/home")
      .then((res) => {
        if (!res.data.refs.length) {
          dispatch({
            type: NO_MORE_DATA,
          });
        }
        dispatch({
          type: USER_FEED,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err.response));
  } else {
    dispatch({
      type: USER_FEED,
      payload: { userFeed: [] },
    });
  }
};

export const uploadImage = (data) => (dispatch) => {
  dispatch({ type: LOADING_IMAGE });
  axios
    .post("/user/img", data)
    .then(() => {
      dispatch(getOnlyUserData());
    })
    .catch((err) => console.log(err));
};
export const likeUnlikeWhine = (likeAction, flag) => (dispatch) => {
  if (flag === "public") {
    if (likeAction.type === "like") {
      dispatch({
        type: LIKE_WHINE_PUBLIC,
        payload: likeAction.whineId,
      });
      dispatch({
        type: ADD_LIKE_LIST,
        payload: likeAction.whineId,
      });
    } else if (likeAction.type === "unlike") {
      dispatch({
        type: UNLIKE_WHINE_PUBLIC,
        payload: likeAction.whineId,
      });
      dispatch({
        type: ADD_UNLIKE_LIST,
        payload: likeAction.whineId,
      });
    }
  } else if (flag === "") {
    if (likeAction.type === "like") {
      dispatch({
        type: LIKE_WHINE,
        payload: likeAction.whineId,
      });
    } else if (likeAction.type === "unlike") {
      dispatch({
        type: UNLIKE_WHINE,
        payload: likeAction.whineId,
      });
    }
  }
  axios
    .post("/like", likeAction)
    .then(() => {
      console.log("");
    })
    .catch((err) => console.log(err));
};
export const postRewhine = (rewhineAction, flag) => (dispatch) => {
  if (flag === "public") {
    dispatch({
      type: RE_WHINE_PUBLIC,
      payload: rewhineAction.whineId,
    });
    dispatch({
      type: ADD_REWHINE_LIST,
      payload: rewhineAction.whineId,
    });
  } else if (flag === "") {
    dispatch({
      type: RE_WHINE,
      payload: rewhineAction.whineId,
    });
  }
  axios
    .post("/whines", rewhineAction)
    .then(() => {
      console.log("");
    })
    .catch((err) => console.log(err));
};

export const postWhine = (whineAction) => (dispatch) => {
  dispatch({ type: WHINE_LOADING });
  axios
    .post("/whines", whineAction)
    .then(() => {
      dispatch(getUserFeed(1));
    })
    .catch((err) => console.log(err));
};

export const cloutAction = (body) => (dispatch) => {
  if (body.cloutType === "follow") {
    dispatch({ type: FOLLOW_ACTION });
    dispatch({ type: FOLLOW_USER_ACTION, payload: body.targetUser });
  } else if (body.cloutType === "unfollow") {
    dispatch({ type: UNFOLLOW_ACTION });
    dispatch({ type: UNFOLLOW_USER_ACTION, payload: body.targetUser });
  }
  axios
    .post("/clout", body)
    .then(() => {
      dispatch(getOnlyUserData(""));
    })
    .catch((err) => console.log(err));
};
export const markNotiRead = (body) => (dispatch) => {
  axios
    .post("/user/markread", body)
    .then(() => {
      dispatch({
        type: MARK_NOTI_READ,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const addNoti = (body) => (dispatch) => {
  dispatch({
    type: ADD_LIVE_NOTI,
    payload: body,
  });
};

export const deleteWhine = (body, x, handle) => (dispatch) => {
  axios
    .post("/delete", body)
    .then(() => {
      if (x) {
        dispatch(getUserFeed(1));
      } else {
        dispatch(getPublicFeed(1, handle));
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
