import React, { Component } from 'react';
import './component-styles/EditInfo.css';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {updateUserInfo} from '../redux/actions/dataActions';

class EditInfo extends Component {
    constructor(){
        super();
        this.state = {
            bio: '',
            location: '',
            link1: '',
            link2: '',
            link3: ''
        }
    }
    componentDidMount(){
        this.setState({
            bio: this.props.message.bio ? this.props.message.bio : '',
            location: this.props.message.location ? this.props.message.location : '',
            link1: this.props.message.link1 ? this.props.message.link1 : '',
            link2: this.props.message.link2 ? this.props.message.link2 : '',
            link3: this.props.message.link3 ? this.props.message.link3 : ''
        })
    }
    render() {
        return (
            <div className='whine-view-container'>
                <h3>Edit Profile</h3>
                <div className="edit-all-info-wrapper">
                    <div className="edit-about-info">
                        <input type="text" id="bio" placeholder="About you..." defaultValue={this.state.bio} onChange={this.changeData}/>
                    </div>
                    <div className="edit-about-info">
                        <input type="text" id="location" placeholder="City..." defaultValue={this.state.location} onChange={this.changeData}/>
                    </div>
                    <div className="edit-about-info inner-info-flex">
                        <input type="text" id="link1" placeholder="Your Social Profile 1..." defaultValue={this.state.link1} onChange={this.changeData}/>
                        <input type="text" id="link2" placeholder="Your Social Profile 2..." defaultValue={this.state.link2} onChange={this.changeData}/>
                        <input type="text" id="link3" placeholder="Your Social Profile 3..." defaultValue={this.state.link3} onChange={this.changeData}/>
                    </div>
                    <div className="edit-submit-btn">
                        <button type="submit" onClick={this.handleUpdate}>Update</button>
                    </div>
                </div>
            </div>
        )
    }
    changeData = e => {
        if(e.target.value.trim() !== '' && (e.target.id === 'bio' || e.target.id === 'location')){
            this.setState({
                [e.target.id]: e.target.value
            });
        }
        if(e.target.value.trim() !== '' && (e.target.id === 'link1' || e.target.id === 'link2' || e.target.id === 'link3')){
            let x = e.target.value;
            x = x.split('.');
            if(x[0] === 'www' || x[0] === 'http://www' || x[0] === 'https://www'){
                x.shift();
            }
            x = x.join('.'); 
            this.setState({
                [e.target.id]: x
            });
        }
    }

    handleUpdate = () => {
        let body = this.state;
        this.props.updateUserInfo(body, this.props.message.handle);

    }
}

EditInfo.propTypes = {
    message: PropTypes.object.isRequired,
    updateUserInfo: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    message: state.user.message, 
});

export default connect(mapStateToProps, {updateUserInfo})(EditInfo);
