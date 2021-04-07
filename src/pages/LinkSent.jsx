import React, {useEffect} from 'react';
import {connect} from 'react-redux';

function LinkSent(props) {
    useEffect(() => {
        if(!props.status.email){
            props.history.push('/');
        }
    }, [])
    return (
        <div style={{
            backgroundColor: 'yellowgreen',
            width: '100%',
            textAlign: 'center',
            padding: '12px',
            fontSize: '1.2rem',
            letterSpacing: '0.125rem',
            color: '#fff',
            fontWeight: '500'
        }}>
            A verification link was sent to <span style={{color: 'blue', fontWeight: '700'}}>{props.status.email && props.status.email}</span>. Please follow the link to complete the signup process.
        </div>
    )
}

const mapStateToProps = state => ({
    status: state.user.emailLinkSent
});

export default connect(mapStateToProps)(LinkSent);
