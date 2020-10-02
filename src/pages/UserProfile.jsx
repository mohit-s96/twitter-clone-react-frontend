import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import '../components/component-styles/Profile.css';
import {getPublicProfile} from '../redux/actions/dataActions';
import UnAuthNabar from '../components/UnAuthNavbar';
import AuthNabar from '../components/AuthNavbar';
import Loader from '../components/Loader';
import PublicProfile from '../components/PublicProfile';
import PublicFeed from '../components/PublicFeed';
import {getOnlyUserData} from '../redux/actions/userActions';
import NotiModal from '../components/NotiModal';
import WhineView from '../components/WhineView';
import EditInfo from '../components/EditInfo';
import {withRouter} from 'react-router-dom';
import {Helmet} from 'react-helmet';
const callerType = 'pfeed';
class UserProfile extends Component {
    componentWillMount(){
        this.props.getPublicProfile(this.props.match.params.handle, false);
        if(this.props.authenticated){
            this.props.getOnlyUserData('reload');
        }
     }
    render() {
        return (
            <div>
                <Helmet><title>{this.props.match.params.handle}</title></Helmet>
               { (!this.props.publicErrors.error) ? ((this.props.publoading || this.props.loading) ? <Loader/>
               : 
               (<div>
                   {this.props.authenticated ? <AuthNabar/> : <UnAuthNabar/>}
                    <PublicProfile history={this.props.history}/>
                    <div className="feed-container"><PublicFeed/></div>
                    {(this.props.authenticated) ?  <div className="noti-container" id="show-hide-noti" onBlur={this.closeNotiModal} tabIndex={0}><NotiModal/></div> : null}
                    <div><div className="overlay" id="overlay" onClick={this.closeView}><WhineView callerType={callerType}/></div></div>
                    <div>{<div className="overlay overlay2" id="overlay2" onClick={this._closeView}><EditInfo/></div>}</div>
                </div>))
               : 
               <h3>Invalid User</h3>}
            </div>
        )
    }

    closeView = (e) => {
        if(e.target.classList.contains('overlay')){
            // document.getElementById('whine-view-toggle').classList.remove('show-whine-container');
            document.getElementById('overlay').style.display = 'none';
        }
    }
    _closeView = e => {
        if(e.target.classList.contains('overlay2')){
            // document.getElementById('whine-view-toggle').classList.remove('show-whine-container');
            document.getElementById('overlay2').style.display = 'none';
        }
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

}

UserProfile.propTypes = {
   publoading: PropTypes.bool.isRequired,
   authenticated: PropTypes.bool.isRequired,
   publicErrors: PropTypes.object.isRequired,
   getPublicProfile: PropTypes.func.isRequired,
   loading: PropTypes.bool.isRequired,
   getOnlyUserData: PropTypes.func.isRequired
};
const mapActionToProps = {
    getPublicProfile,
    getOnlyUserData
}
const mapStateToProps = state => ({
    publoading: state.data.publoading,
    publicErrors: state.ui.publicErrors,
    authenticated: state.user.authenticated,
    loading: state.user.loading
});

export default withRouter(connect(mapStateToProps, mapActionToProps)(UserProfile));
