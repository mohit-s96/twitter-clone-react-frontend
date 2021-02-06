import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import UserHome from './pages/UserHome';
import NotFound from './pages/NotFound';
import LinkSent from './pages/LinkSent';
import jwtDecode from 'jwt-decode';
import AuthRoute from './util/AuthRoute'; 
import {ActiveRoute} from './util/ActiveRoute'; 
import { Provider } from 'react-redux';
import store from './redux/store';
import axios from 'axios';
import {SET_AUTHENTICATED} from './redux/types';
import {logoutUser} from './redux/actions/userActions'

axios.defaults.baseURL = "https://asia-east2-whiner2-82d5e.cloudfunctions.net/api";

const token = localStorage.getItem('jwt-auth');
if(token){
  const decodedToken = jwtDecode(token);
  if(decodedToken.exp * 1000 < Date.now()){
    store.dispatch(logoutUser());
    window.location.href = '/';
  }
  else{
    store.dispatch({type: SET_AUTHENTICATED});
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // store.dispatch(getUserData('app'));
  }
}else{
  let x = window.location.href;
  let n = x.split('?oauth=');
  if(n[1]){
    let tok = n[1].split('&');
    tok = tok[0];
    const decodedToken = jwtDecode(tok);
    if(decodedToken.exp * 1000 < Date.now()){
      store.dispatch(logoutUser());
      window.location.href = '/';
    }
    else{
      store.dispatch({type: SET_AUTHENTICATED});
      localStorage.setItem('jwt-auth', tok);
      axios.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
      // store.dispatch(getUserData('app'));
    }
  }
}

function App() {
  return (
    
    <Provider store = {store}>
      <BrowserRouter>
      <div className="app">
        
            <Switch>
              <AuthRoute exact path='/' component={Home} />
              <Route exact path='/home' component={UserHome} />
              <AuthRoute exact path='/login' component={Login} />
              <AuthRoute exact path='/signup' component={Signup} />
              <Route exact path='/verify' component={LinkSent} />
              <ActiveRoute exact path='/user/:handle' component={UserProfile}/>
              <Route exact path='/:invalid' component={NotFound}/>
            </Switch>
      </div>
      </BrowserRouter>
    </Provider>
    
  );
}

export default App;
