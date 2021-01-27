import React from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import parseBody from '../util/parseBody';
import {Link} from 'react-router-dom';
dayjs.extend(relativeTime);

const Comments = props => {
    let sortedFeed = [];
    if(props.comments){
        if(props.comments.length > 0){
            sortedFeed = props.comments.sort(function(a, b) {
                return (a.createdAt < b.createdAt) ? 1 : ((a.createdAt > b.createdAt) ? -1 : 0);
            });
    }
    }
    let a = (props.comments)
            ? 
            sortedFeed.map(com => {
               return(
                <div className="comment-view-wrapper" key={com.createdAt.concat(Math.random())}>
                    <div className="comment-img">
                       <Link to={`/user/${com.createdBy}`}><img src={com.imgUrl} alt="commenter-avatar"/></Link>
                    </div>
                    <div className="comment-author"><Link to={`/user/${com.createdBy}`}>@{com.createdBy}</Link></div>
                    <div className="comment-time">{dayjs(com.createdAt).fromNow(true)} ago</div>
                    <div className="comment-body" dangerouslySetInnerHTML={{__html: parseBody(com.body)}}>
                    </div>
                </div>
               )
                })  
            :
            null
    return (
        a
    )
}

export default Comments
