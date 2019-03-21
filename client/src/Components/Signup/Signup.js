import React, {Component} from 'react';
import './Signup.scss';
import {withRouter, Link} from "react-router-dom";
import {connect} from 'react-redux';
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

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <Form fluid={true}>
      <FormGroup>
        <ControlLabel>Username</ControlLabel>
        <FormControl name="name"/>
        <HelpBlock>Required</HelpBlock>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Email</ControlLabel>
        <FormControl name="email" type="email"/>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Password</ControlLabel>
        <FormControl name="password" type="password"/>
      </FormGroup>
      <FormGroup>
        <ControlLabel>Textarea</ControlLabel>
        <FormControl rows={5} name="textarea" componentClass="textarea"/>
      </FormGroup>
      <FormGroup>
        <ButtonToolbar>
          <Button appearance="primary">Submit</Button>
          <Button appearance="default">Cancel</Button>
        </ButtonToolbar>
      </FormGroup>
    </Form>
  }
}
export default withRouter(connect(null, null)(Signup));
