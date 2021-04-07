import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {cloutAction} from '../redux/actions/userActions';
import {Link} from 'react-router-dom';

const FollowSuggestion = (props) => {
    let topAccounts = [];
    topAccounts = (!props.suggestionLoading)
     ?
     props.topUsers.list
        ?
        (props.topUsers.list.length > 0)
            ?
            props.topUsers.list.map(x => {
                return(
                    <div className="suggestion-item-wrapper" key={x.id}>
                    <div className="noti-body-wrapper suggested-item">
                        <div className="item-image">
                            <img src={x.imgUrl} alt="display-avatar"/>
                        </div>
                        <div className="suggestion-handle">
                            <Link to={`/user/${x.id}`}>@{x.id}</Link>
                        </div>
                        <div className="follow-suggestion">
                            <button className="follow-suggested-item" onClick={(e) => handleSuggestedFollow(e, x.id, props)}>Follow</button>
                        </div>
                    </div>
                </div>
                )
            })
            :
           null
        :
        null
     :
     null
    return (
       topAccounts ?
       <div className="suggestion-container">
            <div className="noti-body-wrapper suggestion-text">
                Who to follow?
            </div>
            {topAccounts}
       </div> 
        : 
        null
    )
}

const handleSuggestedFollow = (e, handle, props) => {
    e.persist();
        e.target.classList.add('crimson-follow');
        setTimeout(() => {
            e.target.parentElement.parentElement.parentElement.style.display = 'none';
        }, 800);
    const body = {cloutType: 'follow', targetUser: handle};
    props.cloutAction(body);
}

FollowSuggestion.propTypes = {
    topUsers: PropTypes.object.isRequired,
    suggestionLoading: PropTypes.bool.isRequired,
    cloutAction: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
    topUsers: state.data.topUsers,
    suggestionLoading: state.data.suggestionLoading
});


export default connect(mapStateToProps, {cloutAction})(FollowSuggestion);
