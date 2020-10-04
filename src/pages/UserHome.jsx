import React, { Component } from 'react';
import {connect} from 'react-redux';
import AuthNavbar from '../components/AuthNavbar';
import Loader from '../components/Loader';
import PropTypes from 'prop-types';
import Feed from '../components/Feed';
import PostWhine from '../components/PostWhine';
import Profile from '../components/Profile'; 
import {getUserData} from '../redux/actions/userActions';
import {loadSuggestions} from '../redux/actions/dataActions';
import WhineView from '../components/WhineView';
import FollowSuggestion from '../components/FollowSuggestion';
import {Helmet} from 'react-helmet';
const callerType = "feed";

export class UserHome extends Component {
    componentWillMount(){
        console.log('hi');
        this.props.getUserData();
        setTimeout(() => {
                if(!this.props.user.authenticated){
                    window.location.href = '/';
                }
        }, 8000)
     }

     componentDidMount(){
         this.props.loadSuggestions();
     }

    render() {
        const { user: {loading, authenticated}} = this.props;
        let x = (!loading)
         ? 
         (authenticated
         ? 
         (<div>
              <Helmet><title>Home / Whiner</title></Helmet>
             <AuthNavbar/>
             <div className="feed-container"><PostWhine/><Feed/></div>
             <div className="profile-container"><Profile history={this.props.history}/></div>
             
             {/* <div>{this.props.commentPosted ? null : <div className="overlay" id="overlay" onClick={this.closeView}><WhineView callerType={callerType}/></div>}</div> */}
             <div><div className="overlay" id="overlay" onClick={this.closeView}><WhineView callerType={callerType}/></div></div>
             <div><FollowSuggestion/></div>
          </div>
         ) 
         : 
         (<div><p>redirect</p></div>))
         : 
         ( <Loader/>);
            return(
               x
            )
        }
        closeView = (e) => {
            if(e.target.classList.contains('overlay')){
                // document.getElementById('whine-view-toggle').classList.remove('show-whine-container');
                document.getElementById('overlay').style.display = 'none';
            }
        }
}

UserHome.propTypes = {
    user: PropTypes.object.isRequired,
    loadSuggestions: PropTypes.func.isRequired,
    getUserData: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    user: state.user,
});

const mapActionToProps = {
    getUserData, 
    loadSuggestions
}

export default connect(mapStateToProps, mapActionToProps)(UserHome);
