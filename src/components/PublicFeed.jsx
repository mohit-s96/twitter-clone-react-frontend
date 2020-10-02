import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import relativeTime from 'dayjs/plugin/relativeTime';
import {viewOneWhine} from '../redux/actions/dataActions';
import parseBody from '../util/parseBody';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';
import dayjs from 'dayjs';
import {likeUnlikeWhine, postRewhine, deleteWhine} from '../redux/actions/userActions';
dayjs.extend(relativeTime);

class PublicFeed extends React.Component {
    constructor(){
        super();
        this.state = {
            modalOpen: ''
        }
    }
    render(){
        let userFeed = this.props.oneUserWhines;
    let sortedFeed = [];
    if(userFeed.length > 0){
        sortedFeed = userFeed.sort(function(a, b) {
            return (a.createdAt < b.createdAt) ? 1 : ((a.createdAt > b.createdAt) ? -1 : 0);
        });
    }
    let whines = <h3>Loading</h3>;
    if(userFeed){
        whines = (userFeed.length > 0)
    ? 
    (sortedFeed.map(x => {
            return (
                <div className='single-feed-container' key={(x.reWhinedBy) ? `_rewhine_${x.whineId}` : x.whineId}>
                   <div className="one-whine" onClick={(e) => this.handleViewWhine(x.whineId, x.handle, e)}>
                   <div className="rewhine-message-container">{(x.reWhinedBy) ? (<div><span className='rewhine-icon'><FontAwesomeIcon icon={faRetweet}/></span><span className="rewhine-message">{x.reWhinedBy} re-whined</span></div>) : (null)}</div>
                    <div className="handle-container">
                        <div className='whine-image'><Link to={`/user/${x.handle}`}><img src={x.imgUrl} alt="user"/></Link></div>
                        <Link to={`/user/${x.handle}`}><span className="handle-text">@{x.handle} · </span></Link>
                        <span className="whine-time">{dayjs(x.createdAt).fromNow(true)}</span>
                        {
                            (this.props.authenticated)
                                ?
                                <div className="delete-btn-feed">
                                {
                                (this.props.message.handle === x.handle)
                                ?
                                    <div>
                                        <FontAwesomeIcon icon={faChevronDown} onClick={this.toggleDeleteView} data-id={x.whineId} />
                                        {
                                            (this.state.modalOpen === x.whineId)
                                                ?
                                                <div className="delete-modal" onBlur={this.blurEvent} tabIndex={0} onClick={(e) => this.deleteOneWhine(x.whineId, x.handle, x.reWhinedBy, e)}>
                                                <FontAwesomeIcon icon={faTrash}/>
                                                </div>
                                                :
                                                null
                                        }
                                    </div>
                                :
                                null
                                }
                                    </div>
                                :
                                null
                        }
                    </div>
                    <div className="whine-body-container">
                        <div className="whine-text"><div dangerouslySetInnerHTML={{__html: x.body ? parseBody(x.body) : null}} /></div>
                        <div className="engagement-wrapper">
                            <div className="engagement">
                              <div className="fa-container reply"><FontAwesomeIcon icon={faReply}/></div>
                                <span className="engagement-count">{x.comments}</span>
                            </div>
                            <div className="engagement">
                                {
                                    (this.props.authenticated) 
                                    ? 
                                    <div className="fa-container rewhine" onClick={() => this.handleRewhine(x.whineId, x.handle)}>
                                        {this.props.message.rewhines
                                         ? 
                                         this.props.message.rewhines.includes(x.whineId)
                                         ? 
                                         <FontAwesomeIcon icon={faRetweet} className='rewhined'/>
                                         : 
                                         <FontAwesomeIcon icon={faRetweet}/>
                                         :
                                         <FontAwesomeIcon icon={faRetweet}/>
                                        }
                                    </div>
                                    :
                                    (<div className="fa-container rewhine"><FontAwesomeIcon icon={faRetweet}/></div>)
                                }
                                <span className="engagement-count">{x.reWhines}</span>
                            </div>
                            <div className="engagement">
                                {
                                    (this.props.authenticated) 
                                    ? 
                                     <div className="fa-container like" onClick={() => this.handleLike(x.whineId, x.handle)}>
                                        {this.props.message.likes
                                        ? 
                                         this.props.message.likes.includes(x.whineId)
                                        ?
                                        <FontAwesomeIcon icon={faHeart} className='liked'/>
                                        : 
                                        <FontAwesomeIcon icon={faHeart}/>
                                        :
                                        <FontAwesomeIcon icon={faHeart}/>
                                        }
                                    </div>
                                    :
                                    (<div className="fa-container like"><FontAwesomeIcon icon={faHeart}/></div>)
                                }
                                <span className="engagement-count">{x.likes}</span>
                            </div>
                        </div>
                    </div>
                   </div>
                </div>
            )
    }))
    : 
    (<div className="no-feed"><h3>No whines to show</h3></div>)
    return (
        <div> {whines}</div>
     );

    }
    }

    deleteOneWhine = (id, handle, e) => {
        let body = {
            originalAuthor: handle,
            whineId: id
        }
        this.props.deleteWhine(body, false, handle);
        this.setState({
            modalOpen: ''
        });
        setTimeout(() => {
            this.forceUpdate();
        }, 1500);
    }

    blurEvent = (e) => {
        if(e.relatedTarget){
            if(!(e.relatedTarget.classList.contains('delete-modal')) 
               && (e.relatedTarget.tagName !== 'svg')
               && (e.relatedTarget.tagName !== 'path')){
                   this.setState({
                       modalOpen: ''
                   });
               };
        }
        else if(e.relatedTarget === null){
            this.setState({
                modalOpen: ''
            });
        }

    }

    toggleDeleteView = (e) => {
        e.persist();
        this.setState({
            modalOpen: e.target.getAttribute('data-id') ? e.target.getAttribute('data-id') : e.target.parentElement.getAttribute('data-id')
        }, () => {e.target.nextElementSibling ? e.target.nextElementSibling.focus() : e.target.parentElement.nextElementSibling.focus()});
    }

    handleViewWhine = (id, handle, e) => {
        if(e.target.classList){
            if(!(e.target.classList.contains('whine-image'))
             && !(e.target.classList.contains('handle-text'))
             && !(e.target.classList.contains('liked')) 
             && !(e.target.classList.contains('fa-container')) 
             && !(e.target.classList.contains('whine-time')) 
             && !(e.target.classList.contains('rewhined'))
             && !(e.target.classList.contains('replied'))
             && !(e.target.classList.contains('match'))
             && (e.target.tagName !== 'path')
             && (e.target.tagName !== 'IMG')
             && (e.target.tagName !== 'svg')){
                this.props.viewOneWhine(id, handle);
                setTimeout(() => {
                    document.querySelector('.overlay').style.display = 'block';
                }, 500);
    
            }
        }
    }

   
    handleRewhine = (id, handle) => {
        let rewhineAction = {};
        rewhineAction.whineId = id;
        rewhineAction.originalAuthor = handle;
        if(!this.props.message.rewhines.includes(id)){
            this.props.postRewhine(rewhineAction, 'public');
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
        this.props.likeUnlikeWhine(likeAction, 'public');
        setTimeout(() => {
            this.forceUpdate();
        }, 1000);
    }

}


PublicFeed.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    likeUnlikeWhine: PropTypes.func.isRequired,
    postRewhine: PropTypes.func.isRequired,
    oneUserWhines: PropTypes.array.isRequired,
    message: PropTypes.object.isRequired,
    viewOneWhine: PropTypes.func.isRequired,
    deleteWhine: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    authenticated: state.user.authenticated,
    message: state.user.message,
    oneUserWhines: state.data.oneUserWhines
});
const mapActionToProps = {
    likeUnlikeWhine,
    postRewhine,
    viewOneWhine,
    deleteWhine
}

export default withRouter(connect(mapStateToProps, mapActionToProps)(PublicFeed));