import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import loader from '../assets/static/ajax-loader-bar.gif';
import {Link} from 'react-router-dom';

function SearchList(props) {
    let x = props.searchLoading 
                ?
                    <div className='bar-ajax-loader-wrapper'>
                        <img src={loader} alt="loading"/>
                    </div>
                :
                props.autoComplete.map(user => {
                    return (
                        <div className="single-search-item" key={Math.random()*10000}>
                            <div className="search-img">
                                <Link to={`/user/${user.handle}`}><img src={user.imgUrl} alt="avatar"/></Link>
                            </div>
                            <div className="search-handle">
                                <Link to={`/user/${user.handle}`}>@{user.handle}</Link>
                            </div>
                        </div>
                    )
                });

    return (
        
        <div className="search-list-container">
            {x}
        </div>
    )
}

SearchList.propTypes = {
    searchLoading: PropTypes.bool.isRequired,
    autoComplete: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    searchLoading: state.data.searchLoading,
    autoComplete: state.data.autoComplete
});

export default connect(mapStateToProps)(SearchList);