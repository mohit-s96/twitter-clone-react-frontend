import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {uploadImage, cloutAction} from '../redux/actions/userActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faMapMarkerAlt, faLink } from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import ajaxLoader from '../assets/static/ajax-loader-blue.gif';

class PublicProfile extends React.Component{
    handleClick = (e) => {
        e.preventDefault();
        document.getElementById('imageInput').click();
    }
    handleChange = (e) => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        this.props.uploadImage(formData);
    }
    handleAuth = (action) => {
        if(action === 'login'){
            this.props.history.push('/login');
        }
        else if(action === 'signup'){
            this.props.history.push('/signup');
        }
    }
    handleHover = () => {
      let x = document.getElementById('fbtn');
      if(x.textContent === 'Following'){
          x.textContent = 'Unfollow';
          x.classList.add('red-bg-follow');
      }
    }
    handleLeave = () => {
        let x = document.getElementById('fbtn');
        if(x.textContent === 'Unfollow'){
            x.textContent = 'Following';
            x.classList.remove('red-bg-follow');
        }
    }
    handleClout = () => {
        let x = document.getElementById('fbtn');
        if(x.textContent === 'Follow'){
            const req = {};
            req.targetUser = this.props.userPublicProfile.handle;
            req.cloutType = 'follow';
            this.props.cloutAction(req);
        }
        else if(x.textContent === 'Unfollow'){
            const req = {};
            req.targetUser = this.props.userPublicProfile.handle;
            req.cloutType = 'unfollow';
            this.props.cloutAction(req);
        }
    }
    render(){
        let x = this.props.message;
        return (
            <div className="profile-wrapper">
            <div className="profile-image-wrapper">
                <img src={(this.props.imageLoading) ? ajaxLoader : this.props.userPublicProfile.imgUrl} alt="profile-pic"/>
                {(this.props.authenticated && (this.props.message.handle === this.props.userPublicProfile.handle))
                 ?
                (<div>
                     <input type="file" id="imageInput" className="hidden-input" onChange={(e) => this.handleChange(e)}/>
                     <div className="image-edit-container" onClick={this.handleClick}><FontAwesomeIcon icon={faEdit}/></div>
                </div>)
                :
                (this.props.authenticated ? <button className="follow-button" id="fbtn" onMouseEnter={this.handleHover} onMouseLeave={this.handleLeave} onClick={this.handleClout}>{
                   (x.following_list ? x.following_list.includes(this.props.userPublicProfile.handle) ? 'Following' : 'Follow' : 'Follow'
                   )}</button> : 
                <div>
                    <button className="follow-button login-pub-btn" onClick={() => this.handleAuth('login')}>Login</button>
                    <button className="follow-button signup-pub-btn"onClick={() => this.handleAuth('signup')}>SignUp</button>
                </div>
                ) 
                 }
            </div>
            <div className="lower-profile">
            <div className="user-name">@{this.props.userPublicProfile.handle}</div>
            {
                this.props.userPublicProfile.bio
                 &&
                 this.props.userPublicProfile.bio.length > 0
                 &&
                 <div className="public-about-container">
                 <span className="public-about">
                     {this.props.userPublicProfile.bio}
                 </span>
                </div>
            }
             <div className="profile-info-wrapper">
                 <div className="followers-count">{this.props.userPublicProfile.followers}</div>
                 <div className="following-count">{this.props.userPublicProfile.following}</div>
                 <div className="profile-info-text">Followers </div>
                 <div className="secondary-info">Following </div>
                 <div className="public-info-container">
                 {
                        (this.props.userPublicProfile.location)
                        ?
                            (this.props.userPublicProfile.location.length > 0)
                            ?
                                <div className="location-info-wrapper">
                                    <FontAwesomeIcon icon={faMapMarkerAlt}/>
                                    <span className="location-info">{this.props.userPublicProfile.location}</span>
                                </div>
                            :
                            null
                        :
                        null
                    }
                    <div className="social-text">Socials</div>
                    <div className="websites-link-wrapper">
                        <Link to={`/user/${this.props.userPublicProfile.handle}`}><FontAwesomeIcon icon={faLink}/></Link>
                        {this.props.userPublicProfile.link1 && this.props.userPublicProfile.link1.length > 0 && <a href={`http://${this.props.userPublicProfile.link1}`} target="_blank" rel="noopener noreferrer"><img src={`https://www.google.com/s2/favicons?domain_url=${this.props.userPublicProfile.link1}`} alt=""/></a>}
                        {this.props.userPublicProfile.link2 && this.props.userPublicProfile.link2.length > 0 && <a href={`http://${this.props.userPublicProfile.link2}`} target="_blank" rel="noopener noreferrer"><img src={`https://www.google.com/s2/favicons?domain_url=${this.props.userPublicProfile.link2}`} alt=""/></a>}
                        {this.props.userPublicProfile.link3 && this.props.userPublicProfile.link3.length > 0 && <a href={`http://${this.props.userPublicProfile.link3}`} target="_blank" rel="noopener noreferrer"><img src={`https://www.google.com/s2/favicons?domain_url=${this.props.userPublicProfile.link3}`} alt=""/></a>}
                    </div>
                 </div>
                 <div className="age-wrapper">
                    <div className="profile-age-text">Member Since </div>
                    <div className="member-since">{dayjs(this.props.userPublicProfile.createdAt).format('MMMM YYYY')}</div>
                    {
                        (this.props.authenticated && (this.props.message.handle === this.props.userPublicProfile.handle))
                        ?
                        <FontAwesomeIcon icon={faEdit} onClick={this.handleEditState}/>
                        :
                        null
                    }
                 </div>
             </div>
            </div>
         </div>
        )
    }

    handleEditState = () => {
        if(this.props.editModal){
            this.props.editModal();
        }else{
            document.getElementById('overlay2').style.display = 'block';
        }
    }
}



PublicProfile.propTypes = {
   userPublicProfile: PropTypes.object.isRequired,
   authenticated: PropTypes.bool.isRequired,
   imageLoading: PropTypes.bool.isRequired,
   message: PropTypes.object.isRequired,
   uploadImage: PropTypes.func.isRequired,
   cloutAction: PropTypes.func.isRequired
};

const mapActionToprops = {
    uploadImage,
    cloutAction
}

const mapStateToprops = state => ({
    userPublicProfile: state.data.userPublicProfile,
    authenticated: state.user.authenticated,
    message: state.user.message,
    imageLoading: state.user.imageLoading
});

export default connect(mapStateToprops, mapActionToprops)(PublicProfile);
