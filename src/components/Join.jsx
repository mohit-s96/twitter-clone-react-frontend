import React from 'react'
import favicon from '../assets/static/favicon-blue.png';
import './component-styles/Join.css';
import { Link } from 'react-router-dom';

function Join() {
    return (
        <div className="join-container">
            <div className="headerj"><img src={favicon} alt="logo"/></div>
            <div className="message">Join Whiner Today.</div>
            <div className="login btn"><Link to="/login">Login</Link></div>
            <div className="signup btn"><Link to="/signup">Sign Up</Link></div>
        </div>
    )
}

export default Join