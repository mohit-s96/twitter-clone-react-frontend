import React from 'react';
import './component-styles/NotiModal.css';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {viewOneWhine} from '../redux/actions/dataActions';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const NotiModal = (props) => {
    let notis = [];
    if(props.message.notifications){
        notis = props.message.notifications;
        notis = notis.sort(function(a, b) {
            return (a.createdAt < b.createdAt) ? 1 : ((a.createdAt > b.createdAt) ? -1 : 0);
        });
        notis = notis.map((x, i) => {
            if(i < ((window.innerWidth < 500) ? 40 : 8)){
                return x;
            }
            else{
                return null;
            }
        });
        notis = notis.filter(x => x);
    }
    let parts;
    notis ? 
        parts = notis.map(x => {
            return (
                <div className="noti-body-wrapper dont-lose-focus" key={x.id}>
                    <div className="noti-message-container dont-lose-focus">
                    <Link to={`/user/${x.cUser}`} className="dont-lose-focus">{x.cUser}</Link>{
                        (x.type === 'follow')
                            ?
                            <span className='noti-message dont-lose-focus'> followed you</span>
                            :
                            (x.type === 'comment')
                                ?
                                <span className='noti-message dont-lose-focus'> commented on your <span className="noti-whine-style" onClick={() => showWhineFromNoti(x.whineId, props)}>whine</span></span>
                                :
                                (x.type === 'like')
                                    ?
                                    <span className='noti-message dont-lose-focus'> liked your <span className="noti-whine-style" onClick={() => showWhineFromNoti(x.whineId, props)}>whine</span></span>
                                    :
                                    (x.type === 'rewhine')
                                        ?
                                        <span className='noti-message dont-lose-focus'> rewhined your <span className="noti-whine-style" onClick={() => showWhineFromNoti(x.whineId, props)}>whine</span></span>
                                        :
                                        (x.type === 'mention')
                                            ?
                                            <span className='noti-message dont-lose-focus'> mentioned you in a <span className="noti-whine-style" onClick={() => showMentionFromNoti(x.whineId, props, x.cUser)}>whine</span></span>
                                            :
                                            null
                                
                    }
                    <span className="noti-time dont-lose-focus">{dayjs(x.createdAt).fromNow()}</span>

                    </div>
                </div>
            )
        })
        :
        parts = <div>No notifications</div>
    return (
        parts
    )
}

const showWhineFromNoti = (id, props) => {
    const handle = props.message.handle;
    props.viewOneWhine(id, handle);
    if(props.toggleWhine){
        props.toggleWhine();
    }else{
        setTimeout(() => {
            document.querySelector('.overlay').style.display = 'block';
        }, 500);
    }
}

const showMentionFromNoti = (id, props, handle) => {
    props.viewOneWhine(id, handle);
    if(props.toggleWhine){
        props.toggleWhine();
    }else{
        setTimeout(() => {
            document.querySelector('.overlay').style.display = 'block';
        }, 500);
    }
}

NotiModal.propTypes = {
    message: PropTypes.object.isRequired,
    viewOneWhine: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    message: state.user.message
});

export default connect(mapStateToProps, {viewOneWhine})(NotiModal);
