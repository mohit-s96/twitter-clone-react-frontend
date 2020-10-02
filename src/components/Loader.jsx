import React from 'react';
import './component-styles/Loader.css';
import loader from '../assets/static/ajax-loader.gif';

function Loader() {
    return (
        <div className='loader-container'>
            <div className="loader-wrapper">
                <img src={loader} alt="loader"/>
            </div>
        </div>
    )
}

export default Loader
