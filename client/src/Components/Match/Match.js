import React, { Component } from 'react';
import './Match.scss';
import MatchPlayer from '../MatchPlayer/MatchPlayer';
import { withRouter, Link } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
} from 'rsuite';

const mapStateToProps = state => {
  return {
    P1: state.P1,
    P2: state.P2,
    P3: state.P3,
    P4: state.P4
  };
};

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

          <Row>
            <Col
              xs={22}
              xsOffset={1}>

              <Row gutter={0}>
                <Col
                  xs={10}>
                  <Col
                    xs={12}
                    className='test1'>
                    <MatchPlayer
                      name={this.props.P1.name}
                      image={this.props.P1.image}/>
                  </Col>

                  <Col
                    xs={12}
                    className='test2'>
                    <MatchPlayer
                      name={this.props.P2.name}
                      image={this.props.P2.image}/>
                  </Col>
                </Col>

                <Col
                  xs={4}
                  className='test3'>
                  A/D
                </Col>

                <Col
                  xs={10}>
                  <Col
                    xs={12}
                    className='test4'>
                    <MatchPlayer
                      name={this.props.P3.name}
                      image={this.props.P3.image}/>
                  </Col>

                  <Col
                    xs={12}
                    className='test5'>
                    <MatchPlayer
                      name={this.props.P4.name}
                      image={this.props.P4.image}/>
                  </Col>
                </Col>
              </Row>

            </Col>
          </Row>

        </Col>
      </Row>

      <Row>
        <Col
          xs={22}
          xsOffset={1}
          className='container'>

          <Row>
            <Col
              xs={22}
              xsOffset={1}>
              History
            </Col>
          </Row>

        </Col>
      </Row>
    </Grid>;
  }
}
export default withRouter(connect(mapStateToProps, null)(Match));