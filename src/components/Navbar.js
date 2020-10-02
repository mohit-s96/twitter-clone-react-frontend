import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './component-styles/Navbar.css';
import throttle_func from '../util/throttle_func';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SearchList from '../components/SearchList';
import {getSearchAutoComplete} from '../redux/actions/dataActions';

class Navbar extends React.Component {
    constructor(){
        super();
        this.state = {
            inputField: ''
        }
    }
    render(){
        return (
            <div className="nav-container">
                <div className="nav-flex-main">
                    <div className="nav-flex-right">
                       <div className="home-search-list">
                       <div className="nav-input">
                            <input type="text" id="nav-search" placeholder="Search..." onChange={throttle_func(this.getSearchList, 20)}/>
                            <div className="nav-search-icon">
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

Navbar.propTypes = {
    getSearchAutoComplete: PropTypes.func.isRequired
}

export default connect(null, {getSearchAutoComplete})(Navbar);
