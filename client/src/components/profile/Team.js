import React, { Component } from 'react';
import './Team.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col
} from 'rsuite';


class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      tag: props.tag,
      avatar: undefined
    }
  }

  render() {
    console.log(this.props)
    return <Col xs={12}>

      

    </Col>
  }
}
export default withRouter(connect(null, null)(Team));