import React, { Component } from 'react';
import './Signin.scss';
import { withRouter, Link } from "react-router-dom";
import { connect } from 'react-redux';
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

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <Form fluid={true}>
      <FormGroup>
        <ControlLabel>Email</ControlLabel>
        <FormControl name="email" type="email"/>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Mot de passe</ControlLabel>
        <FormControl name="password" type="password"/>
      </FormGroup>
      <FormGroup>
        <Button appearance="primary" block={true} size="lg">Se connecter</Button>
      </FormGroup>
    </Form>
  }
}
export default withRouter(connect(null, null)(Signin));