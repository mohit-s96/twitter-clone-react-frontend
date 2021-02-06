import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import favicon from '../assets/static/favicon-blue.png';
import {Link} from 'react-router-dom';
import {getSearchAutoComplete} from '../redux/actions/dataActions';
import './component-styles/AuthNavbar.css';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import throttle_func from '../util/throttle_func';
import SearchList from '../components/SearchList';

class UnAuthNavbar extends React.Component {
    constructor(){
        super();
        this.state = {
            inputField: ''
        }
    }
    render(){
        return (
            <div className="auth-nav-container">
                <div className="auth-nav-flex-main">
                    <div className="auth-nav-flex-left">
                        <div className="nav-home nav-item"><Link to="/">Home</Link></div>
                        <div className="nav-login nav-item"><Link to="/login">Login</Link></div>
                        <div className="nav-signup nav-item"><Link to="/signup">Signup</Link></div>
                    </div>
                   {
                       !this.props.device ?  <div className="branding"><Link to="/"><img src={favicon} alt=""/></Link></div> : null
                   }
                    <div className="auth-nav-flex-right">
                        <div className="nav-input">
                            {
                                !this.props.device ? <input type="text" className="search" id="nav-search" placeholder="Search..." onChange={throttle_func(this.getSearchList, 20)}/> : null
                            }
                            <div className="nav-search-icon1">
                                <FontAwesomeIcon icon={faSearch}/>
                            </div>
                        </div>
                        {
                            (this.state.inputField !== '')
                            ?
                            <SearchList/>
                            :
                            null
                        }
                    </div>
                </div>
            </div>
        )
    }

    getSearchList = e => {
        let check = /^[a-zA-Z0-9_.-]*$/
        let x = e.target.value;
        if(x.trim() === '' || !(check.test(x)) || x.length < 1){
            this.setState({
                inputField: ''
            });
        }
        if(x.length > 1 && check.test(x)){
            this.setState({
                inputField: x
            });
            this.props.getSearchAutoComplete(x);
        }
    }

}

UnAuthNavbar.propTypes = {
    getSearchAutoComplete: PropTypes.func.isRequired
}

const mapActionsToProps = {
    getSearchAutoComplete
}
export default connect(null, mapActionsToProps)(UnAuthNavbar);