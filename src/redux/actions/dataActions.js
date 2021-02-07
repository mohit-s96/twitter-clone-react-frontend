import {
  SET_PUBLIC_WHINES,
  LOADING_PUBLIC,
  SET_PUBLIC_DATA,
  SET_PUB_ERRORS,
  ONE_WHINE_LOADED,
  LOAD_ONE_WHINE,
  POSTED_COMMENT,
  POSTING_COMMENT,
  LOADING_SUGGESTIONS,
  SUGGESTIONS_LOADED,
  SEARCH_LOADING,
  SEARCH_LOADED,
  UPDATING_INFO,
  UPDATED_INFO,
  SET_NEWTWORK_ERROR,
  MENTIONS_LOADED,
} from "../types";
import { getOnlyUserData } from "./userActions";
import axios from "axios";

export const getPublicProfile = (handle, history1) => (dispatch) => {
  dispatch({ type: LOADING_PUBLIC });
  if (handle.trim().length < 1 || handle.trim().length > 15) {
    dispatch({
      type: SET_PUB_ERRORS,
      payload: { error: "Invalid User" },
    });
  } else {
    let req = { handle: handle };
    axios
      .post("/publicprofile", req)
      .then((res) => {
        dispatch({
          type: SET_PUBLIC_DATA,
          payload: res.data,
        });
        if (!history1) {
          let x = res.data.userPublicProfile.whineCount > 0 ? 1 : 0;
          dispatch(getPublicFeed(x, handle));
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.toJSON().message === "Network Error") {
          dispatch({
            type: SET_NEWTWORK_ERROR,
          });
        } else {
          dispatch({
            type: SET_PUB_ERRORS,
            payload: { error: "Invalid User" },
          });
        }
      });
  }
};
export const getPublicFeed = (x, handle) => (dispatch) => {
  if (x > 0) {
    const req = { handle: handle };
    axios
      .post("/whine", req)
      .then((res) => {
        dispatch({
          type: SET_PUBLIC_WHINES,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err.response));
  } else {
    dispatch({
      type: SET_PUBLIC_WHINES,
      payload: [],
    });
  }
};

export const updateUserInfo = (body, handle) => (dispatch) => {
  dispatch({ type: UPDATING_INFO });
  axios
    .post("/updateinfo", body)
    .then(() => {
      dispatch({ type: UPDATED_INFO });
      dispatch(getPublicProfile(handle, false));
      dispatch(getOnlyUserData(1));
    })
    .catch((err) => console.log(err));
};

export const viewOneWhine = (id, handle) => (dispatch) => {
  if (id.trim().length > 0 && id.trim().length < 25) {
    dispatch({ type: LOAD_ONE_WHINE });
    let body = { originalAuthor: handle };
    axios
      .post(
        `https://asia-east2-whiner2-82d5e.cloudfunctions.net/api/whines/${id.trim()}`,
        body
      )
      .then((res) => {
        dispatch({
          type: ONE_WHINE_LOADED,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  }
};

export const postComment = (body, handle, id) => (dispatch) => {
  dispatch({ type: POSTING_COMMENT });
  axios
    .post("/comment", body)
    .then(() => {
      dispatch({ type: POSTED_COMMENT });
      dispatch(viewOneWhine(id, handle));
    })
    .catch((err) => console.log(err));
};

export const loadSuggestions = () => (dispatch) => {
  dispatch({
    type: LOADING_SUGGESTIONS,
  });
  axios
    .get("/topusers")
    .then((res) => {
      dispatch({
        type: SUGGESTIONS_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const getSearchAutoComplete = (keyword, flag) => (dispatch) => {
  if (!flag) {
    dispatch({ type: SEARCH_LOADING });
    axios
      .post("/userlist", { searchWords: keyword })
      .then((res) => {
        console.log(res.data);
        dispatch({
          type: SEARCH_LOADED,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  } else {
    axios
      .post("/userlist", { searchWords: keyword })
      .then((res) => {
        dispatch({
          type: MENTIONS_LOADED,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  }
};
