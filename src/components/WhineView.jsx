import React, { Component } from 'react';
import './component-styles/WhineView.css';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {likeUnlikeWhine, postRewhine} from '../redux/actions/userActions';
import loader from '../assets/static/ajax-loader.gif';
import loaderBlue from '../assets/static/ajax-loader-blue.gif';
import dayjs from 'dayjs';
import {Link} from 'react-router-dom';
import parseBody from '../util/parseBody';
import {postComment} from '../redux/actions/dataActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import Comments from '../components/Comments';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

class WhineView extends Component {
    constructor(){
        super();
        this.state = {
            replyBody: '',
            errors: null
        }
    }
    handleChange = e => {
        this.setState({
            replyBody: e.target.textContent,
            errors: null
        })
    }

    handleClick = (e) => {
        e.preventDefault();
        let replyAction = {};
        replyAction.body = this.state.replyBody;
        replyAction.body = replyAction.body.trim();
        replyAction.originalAuthor = this.props.singleWhineData.handle;
        replyAction.whineId = this.props.singleWhineData.whineId;
        if(replyAction.body.length <=0 ){
            this.setState({
                errors: "Can't be empty"
            })
        }
        else if(replyAction.body.length > 300){
            this.setState({
                errors: `Whine is ${replyAction.body.length} characters long which exceeds character limit of 300`
            })
        }
        else{
            this.props.postComment(replyAction, this.props.singleWhineData.handle, this.props.singleWhineData.whineId);
            document.getElementById('post-reply').innerText = '';
            setTimeout(() => {
                this.forceUpdate();
            }, 1500);
        }
    }

    render() {
        let renderData;
        let x = this.props.singleWhineData;
        renderData = 
            (!this.props.whineLoading)
            ?
                <div className="whine-view-container" tabIndex={0}>
                    <div className="whine-view-relative">
                        <div className="whine-view-wrapper">
                            <div className="handle-container-one">
                                <div className='whine-image-one'>
                                    <Link to={`/user/${x.handle}`}>
                                        <img src={x.imgUrl} alt="user"/>
                                    </Link>
                                </div>
                                <div className="handle-info-flex">
                                <Link className="style-handle" to={`/user/${x.handle}`}>
                                    <span className="handle-text-one">@{x.handle} </span>
                                </Link>
                                <span className="at-text"> at</span> 
                                <span className="whine-time-one">{dayjs(x.createdAt).format('hh:mm - DD MMMM YYYY')}</span>
                                </div>
                            </div>

                            <div className="whine-body-container-one">
                                <div className="whine-text-one">
                                    <div className="safe-click"
                                     dangerouslySetInnerHTML={(x.body)
                                      ? 
                                      {__html: parseBody(x.body)} 
                                      : 
                                      {__html: parseBody(`Whine deleted :-/`)}} />
                                    </div>
                                   
                                        <div className="engagement-wrapper-one">
                                    <div className="engagement-one">
                                            <div className="fa-container-one reply1"><FontAwesomeIcon icon={faReply}/></div>
                                            <span className="engagement-count-one">{x.comments ? x.comments.length : 0} Comments</span>
                                        </div>
                                        <div className="engagement-one">
                                           {
                                               this.props.authenticated 
                                                ? 
                                                <div className="fa-container-one rewhine1" onClick={() => this.handleRewhine(x.whineId, x.handle)}>
                                               {(this.props.message.rewhines.includes(x.whineId))
                                                ? 
                                                (<FontAwesomeIcon icon={faRetweet} className='rewhined'/>)
                                                : 
                                                (<FontAwesomeIcon icon={faRetweet}/>)}
                                                </div>
                                                :
                                                <div className="fa-container-one rewhine1"><FontAwesomeIcon icon={faRetweet}/></div>
                                           }
                                            <span className="engagement-count-one">{x.reWhines} Rewhines</span>
                                        </div>
                                        <div className="engagement-one">
                                           {
                                               this.props.authenticated
                                               ?
                                               <div className="fa-container-one like1" onClick={() => this.handleLike(x.whineId, x.handle)}>
                                               {(this.props.message.likes.includes(x.whineId)) 
                                               ? 
                                               (<FontAwesomeIcon icon={faHeart} className='liked'/>) 
                                               : 
                                               (<FontAwesomeIcon icon={faHeart}/>)}
                                               </div>
                                               :
                                               <div className="fa-container-one like1"><FontAwesomeIcon icon={faHeart}/></div>
                                           }
                                            <span className="engagement-count-one">{x.likes} Likes</span>
                                        </div>
                                    </div>
                                   
                                </div>
                            </div> 
                         </div>
                        {
                            (this.props.authenticated) 
                            ? 
                            <div className="reply-input">
                            <div className="reply-button-wrapper">
                            <div type="text" className="reply-title post-reply" id="post-reply" data-placeholder="Reply to this whine..." contentEditable="true" onKeyUp={this.handleChange}></div>
                                                 <button type="submit" className="btn-post-reply" onClick={this.handleClick}>
                                                     {
                                                         this.props.commentPosting
                                                         ?
                                                         <img src={loaderBlue} alt=""/>
                                                         :
                                                         'Reply'
                                                     }
                                                 </button>
                            </div>
                             <div className="post-whine-error">{(this.state.errors) ? this.state.errors : null}</div>
                         </div>
                         :
                         null
                        }
                         <div className="comment-container">
                            <Comments comments={this.props.singleWhineData.comments}/>                     
                         </div>
                </div>
           
            :
                <div className="whine-view-container" id="whine-view-toggle" tabIndex={0}>
                    <div className="loader-whine-container">
                        <img src={loader} alt="loading"/>
                    </div>
                </div>
        
        return (
           (this.props.singleWhineData.handle === undefined) ? <div className='whine-view-container'><h3>Whine deleted :/</h3></div> : renderData
        )
    }

    handleRewhine = (id, handle) => {
        let rewhineAction = {};
        rewhineAction.whineId = id;
        rewhineAction.originalAuthor = handle;
        if(!this.props.message.rewhines.includes(id)){
            if(this.props.callerType === 'feed'){
                this.props.postRewhine(rewhineAction, '');
            }
            else if(this.props.callerType === 'pfeed'){
                this.props.postRewhine(rewhineAction, 'public');
            }
        }
        setTimeout(() => {
            this.forceUpdate();
        }, 1000);
    }
    
    handleLike = (id, handle) => {
        let likeAction = {};
        likeAction.whineId = id;
        likeAction.originalAuthor = handle;
        if(this.props.message.likes.includes(id)){
            likeAction.type = 'unlike';
        }
        else{
            likeAction.type = 'like';
        }
        if(this.props.callerType === 'feed'){
            this.props.likeUnlikeWhine(likeAction, '');
        }
        else if(this.props.callerType === 'pfeed'){
            this.props.likeUnlikeWhine(likeAction, 'public');
        }
        setTimeout(() => {
            this.forceUpdate();
        }, 1000);
    }
}


WhineView.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    likeUnlikeWhine: PropTypes.func.isRequired,
    postRewhine: PropTypes.func.isRequired,
    message: PropTypes.object.isRequired,
    singleWhineData: PropTypes.object.isRequired,
    whineLoading: PropTypes.bool.isRequired,
    commentPosting: PropTypes.bool.isRequired,
    postComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    authenticated: state.user.authenticated,
    message: state.user.message,
    whineLoading: state.data.whineLoading,
    singleWhineData: state.data.singleWhineData, 
    commentPosting: state.data.commentPosting,
});
const mapActionToProps = {
    likeUnlikeWhine,
    postRewhine, 
    postComment
}

export default connect(mapStateToProps, mapActionToProps)(WhineView);
