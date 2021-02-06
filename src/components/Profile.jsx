import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faMapMarkerAlt, faLink } from '@fortawesome/free-solid-svg-icons';
import './component-styles/Profile.css';
// import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
import {uploadImage} from '../redux/actions/userActions';
import {getPublicProfile} from '../redux/actions/dataActions';
import ajaxLoader from '../assets/static/ajax-loader-blue.gif';
import { Link } from 'react-router-dom';

const Profile = (props) => {
    const {user: {message, imageLoading}} = props;
    return (
        <div className="profile-wrapper">
           <div className="profile-image-wrapper">
               <img src={(imageLoading) ? ajaxLoader : message.imgUrl} alt="profile-pic"/>
               <input type="file" id="imageInput" className="hidden-input" onChange={(e) => handleChange(e, props)}/>
               <div className="image-edit-container" onClick={handleClick}><FontAwesomeIcon icon={faEdit}/></div>
           </div>
           <div className="lower-profile">
            <div className="user-name"><Link to={`/user/${message.handle}`} style={{
                textDecoration: 'none',
                color: '#1da1f2'
            }}>@{message.handle}</Link></div>
            {
                message.bio
                 &&
                message.bio.length > 0
                 &&
                 <div className="public-about-container">
                 <span className="public-about">
                     {message.bio}
                 </span>
                </div>
            }
            <div className="profile-info-wrapper">
                <div className="followers-count">{message.followers}</div>
                <div className="following-count">{message.following}</div>
                <div className="profile-info-text">Followers </div>
                <div className="secondary-info">Following </div>
                <div className="public-info-container">
                    {
                        (message.location)
                        ?
                            (message.location.length > 0)
                            ?
                                <div className="location-info-wrapper">
                                    <FontAwesomeIcon icon={faMapMarkerAlt}/>
                                    <span className="location-info">{message.location}</span>
                                </div>
                            :
                            null
                        :
                        null
                    }
                    <div className="social-text">Socials</div>
                    <div className="websites-link-wrapper">
                        <Link to={`/user/${message.handle}`}><FontAwesomeIcon icon={faLink}/></Link>
                        {message.link1 && message.link1.length > 0 && <a href={`http://${message.link1}`} target="_blank" rel="noopener noreferrer"><img src={`https://www.google.com/s2/favicons?domain_url=${message.link1}`} alt=""/></a>}
                        {message.link2 && message.link2.length > 0 && <a href={`http://${message.link2}`} target="_blank" rel="noopener noreferrer"><img src={`https://www.google.com/s2/favicons?domain_url=${message.link2}`} alt=""/></a>}
                        {message.link3 && message.link3.length > 0 && <a href={`http://${message.link3}`} target="_blank" rel="noopener noreferrer"><img src={`https://www.google.com/s2/favicons?domain_url=${message.link3}`} alt=""/></a>}
                    </div>
                 </div>
                <div className="age-wrapper">
                <div className="profile-age-text">Member Since </div>
                <div className="member-since">{dayjs(message.createdAt).format('MMMM YYYY')}</div>
                </div>
            </div>
           </div>
        </div>
    )
}

const handleChange = (e, props) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    props.uploadImage(formData);
}

const handleClick = (e) => {
    e.preventDefault();
    document.getElementById('imageInput').click();
}

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    uploadImage: PropTypes.func.isRequired,
    getPublicProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    user: state.user
});
const mapActionToProps = {
    uploadImage,
    getPublicProfile
}

export default connect(mapStateToProps, mapActionToProps)(Profile);
