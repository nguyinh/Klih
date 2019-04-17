import React, { Component } from 'react';
import './Match.scss';
import { withRouter, Link } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
} from 'rsuite';

class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <Grid>
      <Row>
        <Col
          xs={22}
          xsOffset={1}
          className='container'>
          TROLOLOL
        </Col>
      </Row>
    </Grid>;
  }
}
export default withRouter(connect(null, null)(Match));