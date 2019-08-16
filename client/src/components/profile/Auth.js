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
import {
  Signup,
  Signin
} from './';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import config from '../../config/oauth.config.js'
import { setUserAuth, setUser } from '../../redux/actions/index.actions.js'
import str from '../../constants/labels.constants.js'
import { arrayBufferToBase64 } from '../../utils';

const mapDispatchToProps = dispatch => {
  return ({
    setUserAuth: (value) => {
      dispatch(setUserAuth(value))
    },
    setUser: (value) => {
      dispatch(setUser(value))
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

  facebookResponse = async (response) => {
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
    try {
      const res = await fetch('/api/auth/facebook', options);
      const token = res.headers.get('x-auth-token');
      const user = await res.json();
      if (token) {
        const base64Flag = 'data:image/jpeg;base64,';
        const imageStr = arrayBufferToBase64(user.avatar.data.data);
        this.props.setUser({
          fullName: user.fullName,
          avatar: base64Flag + imageStr,
          email: user.email,
          _id: user._id,
        });
        this.setState({ isAuthenticated: true, user, token })
        this.props.setUserAuth(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  googleResponse = async (response) => {
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
    try {
      const res = await fetch('/api/auth/google', options);
      const token = res.headers.get('x-auth-token');
      const user = await res.json();
      if (token) {
        const base64Flag = 'data:image/jpeg;base64,';
        const imageStr = arrayBufferToBase64(user.avatar.data.data);
        this.props.setUser({
          fullName: user.fullName,
          avatar: base64Flag + imageStr,
          email: user.email,
          _id: user._id,
        });
        this.setState({ isAuthenticated: true, user, token })
        this.props.setUserAuth(true);
      }

    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return <Grid>
        <Row>
          <Col
            xsOffset={1}
            xs={22}
            className='container'>

            <Row className='switch-log'>
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

            <div className='auth-buttons'>
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
            </div>
          </Col>
        </Row>
      </Grid>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Auth);