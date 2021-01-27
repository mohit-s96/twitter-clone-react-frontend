import './component-styles/PostWhine.css';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {postWhine} from '../redux/actions/userActions';
import loader from '../assets/static/ajax-loader-blue.gif';

class PostWhine extends Component {
    constructor(){
        super();
        this.state = {
            whineBody: ''
        }
    }
    handleChange = e => {
        this.setState({
            whineBody: e.target.textContent,
            errors: null
        })
    }
    handleClick = (e) => {
        e.preventDefault();
        let whineAction = {};
        whineAction.body = this.state.whineBody;
        whineAction.body = whineAction.body.trim();
        whineAction.originalAuthor = "";
        if(whineAction.body.length <=0 ){
            this.setState({
                errors: "Can't be empty"
            })
        }
        else if(whineAction.body.length > 300){
            this.setState({
                errors: `Whine is ${whineAction.body.length} characters long which exceeds character limit of 300`
            })
        }
        else{
            this.props.postWhine(whineAction);
            document.getElementById('post-message').innerText = '';
            this.setState({
                whineBody: ''
            });
            setTimeout(() => {
                if(this.props.toggleEdit){
                    this.props.toggleEdit();
                }
            }, 500)
        }
    }
    render() {
        return (
            <div className="post-input">
                <div type="text" className="post-title post-message" id="post-message" data-placeholder="Complain about Something..." contentEditable="true" onKeyUp={this.handleChange}></div>
                <button type="submit" className="btn-post" onClick={this.handleClick}>{(this.props.whineLoading) ? (<img src={loader} alt="loading"/>) : 'Post'}</button>
                <div className="post-whine-error">{(this.state.errors) ? this.state.errors : null}</div>
            </div>
        )
    }
}

PostWhine.propTypes = {
    whineLoading: PropTypes.bool.isRequired,
    postWhine: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    whineLoading: state.user.whineLoading
});
const mapActionToProps = {
    postWhine
}

export default connect(mapStateToProps, mapActionToProps)(PostWhine);
