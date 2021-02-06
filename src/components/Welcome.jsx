import React from 'react';
// import favicon from '../assets/static/favicon-blu.png';
import './component-styles/Welcome.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Welcome() {
    return (
        <div className="welcome-container-card">
            {/* <div className="header"><img src={favicon} alt="logo"/></div> */}
           <div className="welcome-content">
           <div className="text-heading">Welcome, To Whiner</div>
            <div className="text-content"><FontAwesomeIcon icon={faComments}/>Join today and start complaining</div>
            <div className="text-content"><FontAwesomeIcon icon={faUser}/>Follow people to see why they are sad</div>
           </div>
        </div>
    )
}

export default Welcome
