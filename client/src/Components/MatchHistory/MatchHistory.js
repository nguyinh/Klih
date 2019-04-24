import React, { Component } from 'react';
import './MatchHistory.scss';
import swordImage from '../../sword.png';
import shieldImage from '../../shield.png';
import plusImage from '../../plus-sign.png';
import minusImage from '../../minus-sign.png';
import MatchPlayer from '../MatchPlayer/MatchPlayer';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
  Checkbox
} from 'rsuite';

const mapStateToProps = state => {
  return {
    P1: state.P1,
    P2: state.P2,
    P3: state.P3,
    P4: state.P4
  };
};

const cmp = (o1, o2) => JSON.stringify(o1) === JSON.stringify(o2);

class MatchHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // ====== Player and Placement ======


  render() {

    return <Grid className='matchHistoryContainer'>
      <Row>
        <Col
          xs={22}
          xsOffset={1}
          className='container'>

        </Col>
      </Row>
    </Grid>;
  }
}
export default withRouter(connect(mapStateToProps, null)(MatchHistory));