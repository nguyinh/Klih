import React, { Component } from 'react';
import './Statistics.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Grid,
  Row,
  Col,
} from 'rsuite';

import { 
  WinLossRatio,
  GoalAnalysis,
  WinStreak
} from '../components/statistics';


class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  

  render() {

    return <Grid>
      <Row>
        <Col xs={10} xsOffset={1}>
          <Row className='statistics-container'>
            <WinLossRatio/>
          </Row>
          <Row className='statistics-container'>
            <WinStreak/>
          </Row>
        </Col>
          
        <Col xs={10} xsOffset={2}>
          <Row className='statistics-container'>
            <GoalAnalysis/>
          </Row>
          <Row className='statistics-container'>
            {/* <WinLossRatio/> */}
          </Row>
        </Col>
      </Row>
    </Grid>
  }
}
export default withRouter(connect(null, null)(Statistics));