import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './component-styles/Footer.css';

function Footer() {
    return (
        <div className="footer-container">
            <div className="footer-flex-main">
                <div className="footer-home footer-main"><a href="mailto:mohitsrivastava67@gmail.com" target="_blank" rel="noopener noreferrer"><span className="footer-item"><FontAwesomeIcon icon={faEnvelope}/></span></a></div>
                <div className="footer-login footer-main"><Link to="/login"><span className="footer-item"><FontAwesomeIcon icon={faInfo}/></span></Link></div>
                <div className="footer-signup footer-main"><Link to="/signup"><span className="footer-item"><FontAwesomeIcon icon={faCode}/></span></Link></div>
            </div>
            <span className="copyright">© 2020 Whiner</span>
        </div>
    )
}
export default Footer;
