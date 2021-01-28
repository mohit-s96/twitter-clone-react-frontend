import {SET_USER, SET_UNAUTHENTICATED, SET_AUTHENTICATED, USER_FEED, LOADING_USER,
        LIKE_WHINE, UNLIKE_WHINE, RE_WHINE, LOADING_IMAGE, WHINE_LOADING, FOLLOW_USER_ACTION, UNFOLLOW_USER_ACTION,
        ADD_LIKE_LIST, ADD_UNLIKE_LIST, ADD_REWHINE_LIST, MARK_NOTI_READ, LINK_SENT} from '../types';

const initialState = {
    authenticated: false,
    message: {},
    userFeed: {},
    loading: false,
    emailLinkSent: {},
    imageLoading: false,
    whineLoading: false
};

export default function (state = initialState, action){
    switch(action.type){
        case LINK_SENT:
            return{
                ...state,
                emailLinkSent: {
                    email: action.payload
                }
            }
        case SET_AUTHENTICATED:
            return{
                ...state,
                loading: true,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return{
                ...state,
                authenticated: false
            }
        case SET_USER:
            return{
                ...state,
                loading: true,
                authenticated: true,
                ...action.payload
            }
        case FOLLOW_USER_ACTION:
            state.message.following_list.push(action.payload);
            state.message.following += 1;
            return{
                ...state
            }
        case UNFOLLOW_USER_ACTION:
            const a = state.message.following_list.indexOf(action.payload);
            if(a > -1){
                state.message.following_list.splice(a, 1)
            }
            return{
                ...state
            }
        case USER_FEED:
            return{
                ...state,
                loading: false,
                imageLoading: false,
                whineLoading: false,
                ...action.payload
            }
        case LOADING_USER:
            return{
                loading: true,
                ...state
            }
        case LIKE_WHINE:
            state.message.likes.push(action.payload);
            state.userFeed.forEach(x => {
                if(x.whineId === action.payload){
                    x.likes+=1;
                }
            });
            return{
                ...state
            }
        case UNLIKE_WHINE:
            const index = state.message.likes.indexOf(action.payload);
            if (index > -1) {
                state.message.likes.splice(index, 1);
            }
            state.userFeed.forEach(x => {
                if(x.whineId === action.payload){
                    x.likes-=1;
                }
            });
            return{
                ...state
            }
        case RE_WHINE:
            state.message.rewhines.push(action.payload);
            state.userFeed.forEach(x => {
                if(x.whineId === action.payload){
                    x.reWhines+=1;
                }
            });
            return{
                ...state
            }
        case ADD_UNLIKE_LIST:
            const index1 = state.message.likes.indexOf(action.payload);
            if (index1 > -1) {
                state.message.likes.splice(index1, 1);
            }
            return{
                ...state
            }
        case ADD_LIKE_LIST:
            state.message.likes.push(action.payload);
            return{
                ...state
            }
        case ADD_REWHINE_LIST:
            state.message.rewhines.push(action.payload);
            return{
                ...state
            }
        case MARK_NOTI_READ:
            state.message.notifications.forEach(x => {
                x.read = true;
            });
            return{
                ...state
            }
        case LOADING_IMAGE:
            return{
                ...state,
                imageLoading: true    
            }
        case WHINE_LOADING:
            return{
                ...state,
                whineLoading: true
            }   
        default: 
            return state;
    }
}