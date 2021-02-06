import React, { Component } from 'react';
import {Helmet} from 'react-helmet';

export class NotFound extends Component {
    render() {
        let id = this.props.match.params.invalid;
        if((id !== 'home' || id !== 'login' || id !== 'signup')){
            return (
                <div> <Helmet><title>Page Not Found!!</title></Helmet><h3>Page not found</h3></div>
            );
        }
    }
}

export default NotFound
