import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


import registerServiceWorker from './registerServiceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import axios from "axios";

// Our Components
import Login from './components/pages/Login';
import Profile from './components/pages/Profile';
import Signup from './components/pages/Signup';
import Navbar from './components/Navbar';
import Category from './components/pages/Category';
import Item from './components/pages/Item';
import Message from './components/pages/Message';

// Here is if we have an id_token in localStorage
if(localStorage.getItem("id_token")) {
  // then we will attach it to the headers of each request from react application via axios
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('id_token')}`;
}

ReactDOM.render(
    <Router>
        <div>
            <Navbar/>
            <Route exact path="/" component={Category} />
            <Route exact path="/item" component={Item} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/message" component={Message} />
            <Route exact path="/profile" component={Profile} />
        </div>
    </Router>
    , document.getElementById('root')
);
registerServiceWorker();
