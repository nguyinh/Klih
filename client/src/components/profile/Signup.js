import React, { Component } from 'react';
import './Signup.scss';
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

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputs: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
      buttonDisabled: false,
      errorMessage: '',
      inputErrors: {
        lastName: '',
        firstName: '',
        email: '',
        password: ''
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.signUpButton = this.signUpButton.bind(this);
  }

  handleChange(newInputs) {
    this.setState({
      inputs: newInputs,
      errorMessage: '',
      inputErrors: {
        lastName: '',
        firstName: '',
        email: '',
        password: ''
      }
    });
  }

  async signUpButton() {
    // TODO: Setup inputs security
    const { lastName, firstName, email, password } = this.state.inputs;

    await this.setState((state) => {
      return {
        inputErrors: {
          lastName: (lastName ? '' : str.EMPTY_FIELD),
          firstName: (firstName ? '' : str.EMPTY_FIELD),
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

    await this.setState((state) => {
      return {
        inputErrors: {
          lastName: lastName.includes(' ') ? str.ERROR_FIELD : '',
          firstName: firstName.includes(' ') ? str.ERROR_FIELD : '',
          email: email.includes(' ') ? str.ERROR_FIELD : '',
          password: password.includes(' ') ? str.ERROR_FIELD : ''
        }
      }
    });

    const hasSpace = (obj) => {
      for (var key in obj) {
        if (obj[key].includes(' ')) {
          console.log(obj[key]);
          return true;
        }
      }
      return false;
    }

    if (hasSpace(this.state.inputs))
      return;

    if (!email.includes('@') || !email.includes('.')) {
      await this.setState((state) => {
        return {
          inputErrors: {
            email: !email.includes('@') || !email.includes('.') ? str.EMAIL_FORMAT_INCORRECT : '',
          }
        }
      });

      return;
    }

    // TODO: check if password is strong enough
    // if ()

    this.setState({ buttonDisabled: true });

    try {
      const signRes = await axios.post('api/signup', {
        firstName: this.state.inputs.firstName,
        lastName: this.state.inputs.lastName,
        email: this.state.inputs.email,
        password: this.state.inputs.password
      })

      if (signRes.status === 201) {
        this.props.setUser({
          fullName: signRes.data.fullName,
          email: signRes.data.email,
          _id: signRes.data._id,
        });
        this.props.setUserAuth(true);
        // this.props.setToken(res.data.token);
      }
      this.setState({ buttonDisabled: false });

    } catch (err) {
      console.log(err);
      // TODO: Highligh errors
      // this.props.setToken('');
      this.setState({
        errorMessage: str[err.response.data.error] || str.INTERNAL_SERVER_ERROR,
        buttonDisabled: false
      });
      this.props.setUserAuth(false);
    }
  }

  render() {
    return <Form fluid={true} onChange={this.handleChange} inputs={this.state.inputs}>
      <FormGroup>
        <FormControl
          name="lastName"
          placeholder={str.LASTNAME}
          errorMessage={this.state.inputErrors.lastName}
          errorPlacement='bottomLeft'/>
      </FormGroup>
      <FormGroup>
        <FormControl
          name="firstName"
          placeholder={str.FIRSTNAME}
          errorMessage={this.state.inputErrors.firstName}
          errorPlacement='bottomLeft'/>
      </FormGroup>
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
          onClick={this.signUpButton}
          disabled={this.state.buttonDisabled}
          className='roundButton green'>
          {str.CREATE_ACCOUNT}
        </Button>
      </FormGroup>
    </Form>
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup));