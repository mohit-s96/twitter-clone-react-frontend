import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_PUB_ERRORS,
  SET_NEWTWORK_ERROR,
} from "../types";

const initialState = {
  loading: false,
  errors: null,
  publicErrors: {},
  netError: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_NEWTWORK_ERROR:
      return {
        ...state,
        netError: true,
      };
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null,
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true,
      };
    case SET_PUB_ERRORS:
      return {
        ...state,
        publicErrors: action.payload,
      };
    default:
      return state;
  }
}
