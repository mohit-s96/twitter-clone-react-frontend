import {
  SET_USER,
  SET_UNAUTHENTICATED,
  SET_AUTHENTICATED,
  USER_FEED,
  LOADING_USER,
  LIKE_WHINE,
  UNLIKE_WHINE,
  RE_WHINE,
  LOADING_IMAGE,
  WHINE_LOADING,
  FOLLOW_USER_ACTION,
  UNFOLLOW_USER_ACTION,
  ADD_LIKE_LIST,
  ADD_UNLIKE_LIST,
  ADD_REWHINE_LIST,
  MARK_NOTI_READ,
  LINK_SENT,
  FETCHED_FEED,
  FETCHING_FEED,
  NO_MORE_DATA,
  ADD_LIVE_NOTI,
} from "../types";

const initialState = {
  authenticated: false,
  message: {
    notifications: [],
  },
  userFeed: [],
  refs: [],
  pagedFetching: false,
  moreData: true,
  loading: false,
  emailLinkSent: {},
  imageLoading: false,
  whineLoading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_LIVE_NOTI:
      let message = {
        ...state.message,
        notifications: [action.payload, ...state.message.notifications],
      };
      return {
        ...state,
        message,
      };
    case FETCHING_FEED:
      return {
        ...state,
        pagedFetching: true,
      };
    case FETCHED_FEED:
      let pagedFeed = action.payload.userFeed.sort(function (a, b) {
        return a.createdAt < b.createdAt
          ? 1
          : a.createdAt > b.createdAt
          ? -1
          : 0;
      });
      return {
        ...state,
        pagedFetching: false,
        userFeed: [...state.userFeed, ...pagedFeed],
        refs: action.payload.refs,
      };
    case NO_MORE_DATA:
      return {
        ...state,
        pagedFetching: false,
        moreData: false,
      };
    case LINK_SENT:
      return {
        ...state,
        emailLinkSent: {
          email: action.payload,
        },
      };
    case SET_AUTHENTICATED:
      return {
        ...state,
        loading: true,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return {
        ...state,
        authenticated: false,
      };
    case SET_USER:
      action.payload.message.notifications = [];
      return {
        ...state,
        loading: false,
        authenticated: true,
        ...action.payload,
      };
    case FOLLOW_USER_ACTION:
      state.message.following_list.push(action.payload);
      state.message.following += 1;
      return {
        ...state,
      };
    case UNFOLLOW_USER_ACTION:
      const a = state.message.following_list.indexOf(action.payload);
      if (a > -1) {
        state.message.following_list.splice(a, 1);
      }
      return {
        ...state,
      };
    case USER_FEED:
      let normalFeed = action.payload.userFeed.sort(function (a, b) {
        return a.createdAt < b.createdAt
          ? 1
          : a.createdAt > b.createdAt
          ? -1
          : 0;
      });
      return {
        ...state,
        loading: false,
        imageLoading: false,
        whineLoading: false,
        userFeed: [...normalFeed],
        refs: [...action.payload.refs],
      };
    case LOADING_USER:
      return {
        loading: true,
        ...state,
      };
    case LIKE_WHINE:
      state.message.likes.push(action.payload);
      state.userFeed.forEach((x) => {
        if (x.whineId === action.payload) {
          x.likes += 1;
        }
      });
      return {
        ...state,
      };
    case UNLIKE_WHINE:
      const index = state.message.likes.indexOf(action.payload);
      if (index > -1) {
        state.message.likes.splice(index, 1);
      }
      state.userFeed.forEach((x) => {
        if (x.whineId === action.payload) {
          x.likes -= 1;
        }
      });
      return {
        ...state,
      };
    case RE_WHINE:
      state.message.rewhines.push(action.payload);
      state.userFeed.forEach((x) => {
        if (x.whineId === action.payload) {
          x.reWhines += 1;
        }
      });
      return {
        ...state,
      };
    case ADD_UNLIKE_LIST:
      const index1 = state.message.likes.indexOf(action.payload);
      if (index1 > -1) {
        state.message.likes.splice(index1, 1);
      }
      return {
        ...state,
      };
    case ADD_LIKE_LIST:
      state.message.likes.push(action.payload);
      return {
        ...state,
      };
    case ADD_REWHINE_LIST:
      state.message.rewhines.push(action.payload);
      return {
        ...state,
      };
    case MARK_NOTI_READ:
      let m = state.message.notifications.map((x) => {
        return {
          ...x,
          read: true,
        };
      });
      return {
        ...state,
        message: {
          ...state.message,
          notifications: m,
        },
      };
    case LOADING_IMAGE:
      return {
        ...state,
        imageLoading: true,
      };
    case WHINE_LOADING:
      return {
        ...state,
        whineLoading: true,
      };
    default:
      return state;
  }
}
