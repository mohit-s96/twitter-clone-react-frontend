import {SET_PUBLIC_WHINES, LOADING_PUBLIC, SET_PUBLIC_DATA, FOLLOW_ACTION, 
        UNFOLLOW_ACTION, LIKE_WHINE_PUBLIC, UNLIKE_WHINE_PUBLIC,
         RE_WHINE_PUBLIC, LOAD_ONE_WHINE, ONE_WHINE_LOADED, POSTING_COMMENT,
         POSTED_COMMENT, LOADING_SUGGESTIONS, SUGGESTIONS_LOADED, SEARCH_LOADING,
            SEARCH_LOADED, UPDATED_INFO, UPDATING_INFO} from '../types';

const initialState = {
    topUsers: {},
    singleWhineData: {}, //view one whine
    oneUserWhines: [],
    userPublicProfile: {},
    updatingInfo: false,
    publoading: false,
    whineLoading: false,
    commentPosting : false,
    suggestionLoading: false,
    searchLoading: false,
    autoComplete: []
};
export default function (state = initialState, action){
    switch(action.type){
       case UPDATING_INFO:
           return{
               ...state,
               updatingInfo: true
           }
       case UPDATED_INFO:
           return{
               ...state,
               updatingInfo: false
           }
       case SET_PUBLIC_WHINES:
           return{
            ...state,
            publoading: false,
            oneUserWhines: action.payload
           }
        case LOADING_SUGGESTIONS:
            return{
                ...state,
                suggestionLoading: true
            }
        case SEARCH_LOADING:
            return{
                ...state,
                searchLoading: true
            }
        case SEARCH_LOADED:
            return{
                ...state,
                searchLoading: false,
                ...action.payload
            }
        case SUGGESTIONS_LOADED:
            return{
                ...state,
                suggestionLoading:false,
                ...action.payload
            }
        case LOAD_ONE_WHINE:
            return{
                ...state,
                whineLoading: true,
                commentPosted: false
            }
        case POSTING_COMMENT:
            return{
                ...state,
                commentPosting: true
            }
        case POSTED_COMMENT:
            return{
                ...state,
                commentPosting: false
            }
        case ONE_WHINE_LOADED:
            return{
                ...state,
                whineLoading: false,
                ...action.payload
            }
        case FOLLOW_ACTION:
            state.userPublicProfile.followers += 1;
            return{
                ...state
            }
        case UNFOLLOW_ACTION:
            state.userPublicProfile.followers -= 1;
            return{
                ...state
            }
        case LOADING_PUBLIC:
            return{
                ...state,
                publoading: true
            }
        case SET_PUBLIC_DATA:
            return{
                ...state,
                ...action.payload
            }
        case LIKE_WHINE_PUBLIC:
            state.oneUserWhines.forEach(x => {
                if(x.whineId === action.payload){
                    x.likes+=1;
                }
            });
            return{
                ...state
            }
        case UNLIKE_WHINE_PUBLIC:
            state.oneUserWhines.forEach(x => {
                if(x.whineId === action.payload){
                    x.likes-=1;
                }
            });
            return{
                ...state
            }
        case RE_WHINE_PUBLIC:
            // state.userPublicProfile.rewhines.push(action.payload);
            state.oneUserWhines.forEach(x => {
                if(x.whineId === action.payload){
                    x.reWhines+=1;
                }
            });
            return{
                ...state
            }
        default:
            return state;
    }
}