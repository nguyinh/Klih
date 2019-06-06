import React, { Component } from 'react';
import './App.scss';
import axios from 'axios';
// import { Link, withRouter } from "react-router-dom";
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import Match from './Components/Match/Match';
import Lobby from './Components/Lobby/Lobby';
import History from './Components/History/History';
import Statistics from './Components/Statistics/Statistics';
import Monitor from './Components/Monitor/Monitor';
import Profile from './Components/Profile/Profile';
import Navigation from './Components/Navigation/Navigation';
import Welcome from './Components/Welcome/Welcome';

import { connect } from 'react-redux';
import { setNavigationState, setUserAuth, setAvatar, setUser } from './redux/actions/index.actions.js';
require('dotenv').config()

const mapDispatchToProps = dispatch => {
  return ({
    setNavigationState: (value) => {
      dispatch(setNavigationState(value))
    },
    setUserAuth: (value) => {
      dispatch(setUserAuth(value))
    },
    setAvatar: (value) => {
      dispatch(setAvatar(value))
    },
    setUser: (value) => {
      dispatch(setUser(value))
    }
  })
}

const mapStateToProps = state => {
  return { isConnected: state.isConnected };
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAppLoaded: false
    }
  }

  componentDidMount() {
    // Fetch user session with token in cookies
    this.tryConnect();
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  // DEBUG
  async tryConnect() {
    axios.defaults.withCredentials = true;
    try {
      const authResponse = await axios.post('/api/connect', {})
      const base64Flag = 'data:image/jpeg;base64,';
      const imageStr = this.arrayBufferToBase64(authResponse.data.avatar.data.data);
      console.log(authResponse);
      this.props.setUser({
        fullName: authResponse.data.fullName,
        avatar: base64Flag + imageStr,
        email: authResponse.data.email,
        _id: authResponse.data._id,
      });
      this.setState({
        playerName: authResponse.data.fullName,
        image: base64Flag + imageStr,
        isAppLoaded: true
      });


    } catch (err) {
      // DEBUG: if status==500, then back-end not initialized, retry connect until back-end up
      this.setState({
        playerName: '',
        isAppLoaded: true
      });
      console.log(err);
      if (err.response.status === 500 && process.env.NODE_ENV === 'development') {
        this.tryConnect();
      }
    }
  }
  // DEBUG END

  render() {
    return <Router>
      <div>

        <Navigation/>

        <Route exact={true} path="/" render={props => <div>
            <Redirect to={'/lobby'}/>
          </div>}/>

        <Route path="/lobby/:tableTag?" component={Lobby}/>

        <Route path="/match" component={Match}/>

        <Route path="/history" component={History}/>

        <Route path="/statistics" component={Statistics}/>

        <Route path="/monitor" component={Monitor}/>

        <Route path="/profile" component={Profile}/>

        <Route path="/join/:teamTag?" component={Profile}/>

        <CSSTransition
          in={!this.state.isAppLoaded}
          timeout={1000}
          classNames="welcome"
          unmountOnExit>
          <Welcome/>
        </CSSTransition>
      </div>
    </Router>;
  }
}

// export default App;
export default connect(mapStateToProps, mapDispatchToProps)(App);