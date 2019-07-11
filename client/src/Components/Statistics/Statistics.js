import React, { Component } from 'react';
import './Statistics.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
} from 'rsuite';
import WinLossRatio from '../WinLossRatio/WinLossRatio';
import GoalAnalysis from '../GoalAnalysis/GoalAnalysis';


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
            {/* <GoalAnalysis/> */}
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