import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import './component-styles/Footer.css';

function Footer() {
    return (
        <div className="footer-container">
            <div className="footer-flex-main">
                <div className="footer-home footer-main"><a href="mailto:mohitsrivastava67@gmail.com" target="_blank" rel="noopener noreferrer"><span className="footer-item"><FontAwesomeIcon icon={faEnvelope}/></span></a></div>
                <div className="footer-login footer-main"><a href="https://github.com/msx47/twitter-clone-react-frontend#readme" target="_blank" rel="noopener noreferrer"><span className="footer-item"><FontAwesomeIcon icon={faInfo}/></span></a></div>
                <div className="footer-signup footer-main"><a href="https://github.com/msx47/twitter-clone-react-frontend" target="_blank" rel="noopener noreferrer"><span className="footer-item"><FontAwesomeIcon icon={faCode}/></span></a></div>
            </div>
            <span className="copyright">© 2020 Whiner</span>
        </div>
    )
}
export default Footer;
