import React, { Component } from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Welcome from '../components/Welcome';
import Join from '../components/Join';

export class Home extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <div className="flex-home-mobile">
                    <Welcome/>
                    <Join/>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Home
