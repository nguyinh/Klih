import React, { Component } from 'react';
import './Auth.scss';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Button,
  Grid,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  ButtonToolbar
} from 'rsuite';
import Signin from '../Signin/Signin';
import Signup from '../Signup/Signup';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import config from '../../config/oauth.config.js'

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signMode: 'signin',
      isAuthenticated: false,
      user: null,
      token: ''
    }

    this.switchAuth = this.switchAuth.bind(this);
    this.sendCookie = this.sendCookie.bind(this);
  }

  switchAuth() {
    this.setState((state, props) => {
      return {
        signMode: (
          state.signMode === 'signin' ?
          'signup' :
          'signin')
      };
    });
  }

  sendCookie() {
    axios.defaults.withCredentials = true;
    // if (this.props.isStarting) {
    axios.post('http://localhost:8116/api/connect', {}).then((res) => {
      console.log(res);
      // this.props.setToken(res.data.token);
    }).catch((err) => {
      console.error(err.response);
      // this.props.setToken('');
    });
    // }
  }

  facebookResponse = (response) => {
    console.log(response);
    const tokenBlob = new Blob([JSON.stringify({
      access_token: response.accessToken
    }, null, 2)], { type: 'application/json' });
    const options = {
      method: 'POST',
      body: tokenBlob,
      mode: 'cors',
      cache: 'default',
      credentials: 'include'
    };
    fetch('http://localhost:8116/api/auth/facebook', options).then(res => {
      console.log(res);
      const token = res.headers.get('x-auth-token');
      res.json().then(user => {
        console.log(user);
        if (token) {
          this.setState({ isAuthenticated: true, user, token })
        }
      });
    })
  };

  googleResponse = (response) => {
    const tokenBlob = new Blob([JSON.stringify({
      access_token: response.accessToken
    }, null, 2)], { type: 'application/json' });
    const options = {
      method: 'POST',
      body: tokenBlob,
      mode: 'cors',
      cache: 'default',
      credentials: 'include'
    };
    fetch('http://localhost:8116/api/auth/google', options).then(res => {
      const token = res.headers.get('x-auth-token');
      res.json().then(user => {
        if (token) {
          this.setState({ isAuthenticated: true, user, token })
        }
      });
    })
  };

  render() {
    return <div>
      <Grid>
        <Row>
          <Col xs={22} xsOffset={1}>
            <Button block={true} onClick={this.switchAuth}>Switch</Button>
          </Col>
        </Row>

        <Row>
          <Col xs={22} xsOffset={1}>
            <Button block={true} onClick={this.sendCookie}>Send Cookie</Button>
          </Col>
        </Row>

        <Row>
          <Col xs={22} xsOffset={1}>
            <FacebookLogin appId={config.FACEBOOK_APP_ID} autoLoad={false} fields="name,email,picture" callback={this.facebookResponse}/>
            <GoogleLogin clientId={config.GOOGLE_CLIENT_ID} buttonText="Login" onSuccess={this.googleResponse} onFailure={this.googleResponse}/>
          </Col>
        </Row>

        <Row>
          <Col xs={22} xsOffset={1}>
            {
              this.state.signMode === 'signin'
                ? <Signin/>
                : <Signup/>
            }
          </Col>
        </Row>
      </Grid>

    </div>
  }
}
export default connect(null, null)(Auth);