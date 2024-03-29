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
  WinStreak,
  BestOpponent,
  BestTeammate,
  WeekSummary
} from '../components/statistics';


class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  

  render() {

    return <Grid className='statistics-page'>
      <Row>
      <Col xs={22} xsOffset={1}>
          <Row className='statistics-container'>
            <WeekSummary/>
          </Row>
        </Col>

        <Col xs={10} xsOffset={1}>
          <Row className='statistics-container'>
            <WinLossRatio/>
          </Row>

          <Row className='statistics-container'>
            <WinStreak/>
          </Row>

          <Row className='statistics-container'>
            <BestTeammate/>
          </Row>
        </Col>
          
        <Col xs={10} xsOffset={2}>
          <Row className='statistics-container'>
            <GoalAnalysis/>
          </Row>

          <Row className='statistics-container'>
            <BestOpponent/>
          </Row>
        </Col>

        
      </Row>
    </Grid>
  }
}
export default withRouter(connect(null, null)(Statistics));