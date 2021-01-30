import React, {useState} from 'react';
import throttle_func from '../util/throttle_func';
import SearchList from '../components/SearchList';
import {getSearchAutoComplete} from '../redux/actions/dataActions';
import {connect} from 'react-redux';

function MobileSearch(props) {
    const [state, setState] = useState('');
    const getSearchList = e => {
        let check = /^[a-zA-Z0-9_.-]*$/
        let x = e.target.value;
        console.log(x);
        if(x.trim() === '' || !(check.test(x)) || x.length < 1){
            setState('');
        }
        if(x.length > 1 && check.test(x)){
            setState(x);
            props.getSearchAutoComplete(x);
        }
    }
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            width: '400px'
        }}>
            <div className="nav-input nav-input1">
                <input 
                    type="text" 
                    className="search" 
                    id="nav-search" 
                    placeholder="Search..." 
                    onChange={throttle_func(getSearchList, 20)}
                />
            </div>
            {
                state.length ? <SearchList/> : null
            }
        </div>
    )
}
const mapActionsToProps = {
    getSearchAutoComplete
}
export default connect(null, mapActionsToProps)(MobileSearch)
