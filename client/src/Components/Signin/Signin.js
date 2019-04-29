import React, { Component } from 'react';
import './Signin.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Button,
  Form,
  FormGroup,
  FormControl,
} from 'rsuite';
import { setUserAuth, setUser } from '../../redux/actions/index.actions.js';
import str from '../../constants/labels.constants.js'

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

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  let bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return window.btoa(binary);
};

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {
        email: '',
        password: ''
      },
      errorMessage: '',
      buttonDisabled: false,
      inputErrors: {
        email: '',
        password: ''
      }
    }

    this.handleChange = this.handleChange.bind(this);
    this.signInButton = this.signInButton.bind(this);
  }

  handleChange(newInputs) {
    this.setState({
      inputs: newInputs,
      errorMessage: '',
      inputErrors: {
        email: '',
        password: ''
      }
    });
  }

  async signInButton() {
    const { email, password } = this.state.inputs;

    await this.setState((state) => {
      return {
        inputErrors: {
          email: (email ? '' : str.EMPTY_FIELD),
          password: (password ? '' : str.EMPTY_FIELD)
        }
      }
    });

    const hasEmpty = (obj) => {
      for (var key in obj) {
        if (obj[key] !== '')
          return true;
      }
      return false;
    }

    if (hasEmpty(this.state.inputErrors))
      return;

    this.setState({ buttonDisabled: true });

    try {
      const signRes = await axios.post('api/signin', {
        email: email,
        password: password
      });

      if (signRes.status === 200) {
        const base64Flag = 'data:image/jpeg;base64,';
        const imageStr = arrayBufferToBase64(signRes.data.avatar.data.data);
        this.props.setUser({
          fullName: signRes.data.fullName,
          avatar: base64Flag + imageStr,
          email: signRes.data.email,
          _id: signRes.data._id,
        });
        this.props.setUserAuth(true);
      }
      this.setState({ buttonDisabled: false });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: str[err.response.data.error] || str.INTERNAL_SERVER_ERROR,
        usernameState: 'error',
        passwordState: 'error',
        buttonDisabled: false
      });
      this.props.setUserAuth(false);
    }
  }

  render() {
    return <Form fluid={true} onChange={this.handleChange} inputs={this.state.inputs}>
      <FormGroup>
        <FormControl
          name="email"
          type="email"
          placeholder={str.EMAIL}
          errorMessage={this.state.inputErrors.email}
          errorPlacement='bottomLeft'/>
      </FormGroup>
      <FormGroup>
        <FormControl
          name="password"
          type="password"
          placeholder={str.PASSWORD}
          errorMessage={this.state.inputErrors.password}
          errorPlacement='bottomLeft'/>
      </FormGroup>
      <div style={{
          display: this.state.errorMessage ? 'block' : 'none',
          color: 'red',
          marginTop: 6
        }}>
        {this.state.errorMessage}
      </div>
      <FormGroup>
        <Button
          appearance="primary"
          block={true}
          size="lg"
          onClick={this.signInButton}
          disabled={this.state.buttonDisabled}
          className='roundButton green'>
          {str.SIGNIN}
        </Button>
      </FormGroup>
    </Form>
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signin));