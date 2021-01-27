import React, { Component } from 'react';
import Footer from '../components/Footer';
import Favicon from '../assets/static/favicon-blue.png';
import './page-styles/login.css';
import loader from '../assets/static/ajax-loader-blue.gif';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {signupUser} from '../redux/actions/userActions';
import {Helmet} from 'react-helmet';


export class Signup extends Component {

    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            response: {},
            errors: {},
            confirmPassword: '',
            handle: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.ui.errors){
            this.setState({errors: nextProps.ui.errors});
        }
    }
    handleSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        };
        this.props.signupUser(userData, this.props.history);
    }
    handleChange = e => {
        this.setState({ 
            [e.target.id]: e.target.value
        })
    }

    render() {
        const {errors} = this.state;
        const {ui: {loading}} = this.props;
        return (
            <div className="login-wrapper">
            <Helmet><title>Signup to Whiner!!</title></Helmet>
            <div className="login-main signup-main">
                <div className="login-header">
                    <div className="login-logo"><img src={Favicon} alt="logo"/></div>
                    <h3 className="login-h3">Sign Up to Whiner</h3>
                </div>
               <div className="form-wrapper signup-form-wrapper">
               <form action="#" className="login-form" onSubmit={this.handleSubmit}>
                    <input type="text" className="register" id="email" onChange={this.handleChange} placeholder="Enter your Email"/>
                    <label htmlFor="email" className="login-label">E-mail</label>
                    <div className="login-error">{(errors.email) ? errors.email : null}</div>

                    <input type="password" className="register" id="password" onChange={this.handleChange} placeholder="Choose a password"/>
                    <label htmlFor="password" className="login-label">Password</label>
                    <div className="login-error">{(errors.password) ? errors.password : null}</div>

                    <input type="password" className="register" id="confirmPassword" onChange={this.handleChange} placeholder="Confirm Password"/>
                    <label htmlFor="confirmPassword" className="login-label">Confirm password</label>
                    <div className="login-error">{(errors.confirmPassword) ? errors.confirmPassword : null}</div>

                    <input type="text" className="register" id="handle" onChange={this.handleChange} placeholder="Choose a unique user handle"/>
                    <label htmlFor="handle" className="login-label">User Handle</label>
                    <div className="login-error">{(errors.handle) ? errors.handle : null}</div>

                    <div className="btn-login">
                    {loading ? (<button className="login-button" type="submit"><img src={loader} alt="loading"/></button>) : (<button className="login-button" type="submit">Sign Up</button>)}
                    </div>
                     <div className="general-error">{(errors.handleTaken) ? errors.handleTaken : null}</div>
                </form>
               </div>
            </div>
            <div>
                <Footer/>
            </div>
        </div>
        )
    }
}

Signup.propTypes = {
    ui: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    user: state.user,
    ui: state.ui
});

const mapActionsToProps = {
    signupUser
}

export default connect(mapStateToProps, mapActionsToProps)(Signup);
