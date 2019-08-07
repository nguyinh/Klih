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
      image: undefined
    }
  }

  render() {
    return <Col xs={8}>

      <Grid className='tagContainer'>
        <Row>
          <Col xs={24} className='nameContainer'>
            <Button>
              <h5>{this.state.name}</h5>
            </Button>
          </Col>
      </Row>
        <Row>
          <Col xs={12} xsOffset={3}>
            <span className='tagText'>TeamTag</span>
          </Col>
        </Row>
        <Row>
          <Col xs={12} xsOffset={3}>
            <span>{this.state.tag}</span>
          </Col>
        </Row>
      </Grid>

    </Col>
  }
}
export default withRouter(connect(null, null)(Team));