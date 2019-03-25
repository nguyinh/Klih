import React, { Component } from 'react';
import './Auth.scss';
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
  Icon
} from 'rsuite';
import Signin from '../Signin/Signin';
import Signup from '../Signup/Signup';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import config from '../../config/oauth.config.js'
import { setUserAuth } from '../../redux/actions/index.actions.js'
import str from '../../constants/labels.constants.js'

const mapDispatchToProps = dispatch => {
  return ({
    setUserAuth: (value) => {
      dispatch(setUserAuth(value))
    }
  })
}

const mapStateToProps = state => {
  return { isConnected: state.isConnected };
};

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

  facebookResponse = (response) => {
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
    fetch('/api/auth/facebook', options).then(res => {
      const token = res.headers.get('x-auth-token');
      res.json().then(user => {
        if (token) {
          this.setState({ isAuthenticated: true, user, token })
          this.props.setUserAuth(true);
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
    fetch('/api/auth/google', options).then(res => {
      const token = res.headers.get('x-auth-token');
      res.json().then(user => {
        if (token) {
          this.setState({ isAuthenticated: true, user, token })
          this.props.setUserAuth(true);
        }
      });
    })
  };

  render() {
    return <div>
      <Grid>
        <Row>
          <Col xsOffset={1} xs={11}>
            <Button
              block={true}
              onClick={this.switchAuth}
              color='blue'
              className='switchLogButton'>
              <Icon icon='sign-in'/>
              {
              this.state.signMode === 'signin'
                ? '   ' + str.SIGNUP
                : '   ' + str.SIGNIN
            }</Button>
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

        <Row>
          <Col xs={22} xsOffset={1}>
            <FacebookLogin
              size='metro'
              appId={config.FACEBOOK_APP_ID}
              disableMobileRedirect={true}
              autoLoad={false} fields="name,email,picture"
              callback={this.facebookResponse}
              className='facebookLogin'
              icon="fa-facebook"
              textButton={str.SIGNIN + ' avec Facebook'}/>
          </Col>
        </Row>

        <Row>
          <Col xs={22} xsOffset={1}>
            <GoogleLogin
              clientId={config.GOOGLE_CLIENT_ID}
              buttonText={str.SIGNIN + ' avec Google'}
              onSuccess={this.googleResponse}
              onFailure={this.googleResponse}
              className='googleLogin'/>
          </Col>
        </Row>
      </Grid>

    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Auth);