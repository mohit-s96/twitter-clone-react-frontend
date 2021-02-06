import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import favicon from '../assets/static/favicon-blue.png';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import throttle_func from '../util/throttle_func';
import {logoutUser, markNotiRead} from '../redux/actions/userActions';
import {getSearchAutoComplete} from '../redux/actions/dataActions';
import SearchList from '../components/SearchList';
import NotiModal from '../components/NotiModal';
import './component-styles/AuthNavbar.css';


class AuthNavbar extends React.Component{
    constructor(){
        super();
        this.state = {
            inputField: ''
        }
    }
    closeAllModals = () => {
        if(this.props.closeAll){
            this.props.closeAll();
        }
    }
   render(){
    return (
        <div className="auth-nav-container">
            <div className="auth-nav-flex-main">
                <div className="auth-nav-flex-left">
                    <div className="nav-home nav-item">
                        <FontAwesomeIcon 
                            icon={faHome}
                            onClick={this.closeAllModals}/>
                        <Link to="/home">
                            {
                                !this.props.device && 'Home'
                            }
                        </Link>
                    </div>
                    <div className="nav-login nav-item noti-nav" onClick={this.notiReadEvent} >
                        {
                            this.props.message.notifications
                            ?
                            (this.getUnread())
                                ?
                                <>
                               <div className="blue-noti">
                                    <div className="not-count-wrapper">
                                    <span className="noti-count">
                                    {this.getUnread()}
                                    </span>
                                    </div>
                                    {
                                        !this.props.device && <><FontAwesomeIcon icon={faBell}/>
                                        Notifications</> 
                                    }
                               </div>
                               {
                                   this.props.device && <FontAwesomeIcon icon={faBell}/>
                               }
                               
                                </>
                                
                                :
                                <div><FontAwesomeIcon icon={faBell}/> {
                                    !this.props.device && 'Notifications'
                                }</div>
                            :
                            <div><FontAwesomeIcon icon={faBell}/> {
                                !this.props.device && 'Notifications'
                            }</div>
                        }
                        <div className="noti-container" id="show-hide-noti" onBlur={this.closeNotiModal} tabIndex={0}><NotiModal/></div>
                        </div>
                    <div className="nav-signup nav-item" onClick={this.handleClick}>
                        <FontAwesomeIcon icon={faSignOutAlt}/>
                        {
                            !this.props.device && 'Logout'
                        }
                    </div>
                </div>
                {
                    !this.props.device ? <div className="branding"><Link to="/"><img src={favicon} alt=""/></Link></div> : null
                }
                <div className="auth-nav-flex-right">
                    <div className="nav-input nav-input1">
                        {
                            !this.props.device 
                            ? 
                            <input 
                                type="text" 
                                className="search" 
                                id="nav-search" 
                                placeholder="Search..." 
                                onChange={throttle_func(this.getSearchList, 20)}/>
                            : 
                            null
                        }
                        <div className="nav-search-icon1" onClick={this.toggleSearch}>
                            <FontAwesomeIcon icon={faSearch}/>
                        </div>
                    </div>
                    {
                        (this.state.inputField !== '')
                        ?
                            <SearchList/>
                        :
                        null
                    }
                </div>
            </div>
        </div>
    )
   }
   toggleSearch = () => {
       console.log('hi');
       if(this.props.openSearch){
           console.log('hello');
            this.props.openSearch();
       }
   }
   openProfile = () => {
       this.props.toggleProfile();
   }

   closeNotiModal = (e) => {
    if(!e.relatedTarget){
            document.getElementById('show-hide-noti').classList.remove('show-notis');
    }
    else{
        if(!e.relatedTarget.classList.contains('dont-lose-focus')){
            document.getElementById('show-hide-noti').classList.remove('show-notis');
        }
    }
   
}

   getSearchList = e => {
       let check = /^[a-zA-Z0-9_.-]*$/
       let x = e.target.value;
       if(x.trim() === '' || !(check.test(x)) || x.length < 1){
           this.setState({
               inputField: ''
           });
       }
       if(x.length > 1 && check.test(x)){
           this.setState({
               inputField: x
           });
           this.props.getSearchAutoComplete(x);
       }
   }


   notiReadEvent = () => {
        if(this.props.toggleNoti){
            this.props.toggleNoti();
        }else{
            document.getElementById('show-hide-noti').classList.add('show-notis');
            document.getElementById('show-hide-noti').focus();
        }
        let x = this.props.message.notifications;
        let i = [];
        x.forEach(a => {
            if(!a.read){
                i.push(a.id);
            }
        });
        this.props.markNotiRead(i);
        setTimeout(() => {
            this.forceUpdate();
        }, 1000);
}
    handleClick = () => {
        this.props.logoutUser();
}
    getUnread = () => {
        let x = this.props.message.notifications;
        let i = 0;
        x.forEach(a => {
            if(!a.read){
                i++;
            }
        })
        if(i > 0){
            return i;
        }
        else{
            return null;
        }
}
}

AuthNavbar.propTypes = {
    message: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    markNotiRead: PropTypes.func.isRequired,
    getSearchAutoComplete: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
    message: state.user.message
});

const mapActionsToProps = {
    logoutUser,
    markNotiRead,
    getSearchAutoComplete
}

export default connect(mapStateToProps, mapActionsToProps)(AuthNavbar);