import React, { Component } from 'react';
import './MatchHistory.scss';
import swordImage from '../../sword.png';
import shieldImage from '../../shield.png';
import plusImage from '../../plus-sign.png';
import minusImage from '../../minus-sign.png';
import MatchPlayer from '../MatchPlayer/MatchPlayer';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { setMatch } from './../../redux/actions/index.actions.js';
import {
  Button,
  Grid,
  Row,
  Col,
  Checkbox
} from 'rsuite';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapDispatchToProps = dispatch => {
  return ({
    setMatch: (value) => {
      dispatch(setMatch(value))
    }
  })
}

const mapStateToProps = state => {
  return {
    P1: state.P1,
    P2: state.P2,
    P3: state.P3,
    P4: state.P4,
    match: state.match,
    score1: state.score1,
    score2: state.score2,
    history: state.history,
    team1: state.team1,
    team2: state.team2
  };
};

const cmp = (o1, o2) => JSON.stringify(o1) === JSON.stringify(o2);

class MatchHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score1: props.score1 || 0,
      score2: props.score2 || 0,
      history: props.history || [],
      imageP1: props.imageP1,
      imageP2: props.imageP2,
      imageP3: props.imageP3,
      imageP4: props.imageP4,
      matchTimer: props.recordTime && setInterval(this.updateTime, 10000),
      startedAt: Date.now()
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    clearInterval(this.state.matchTimer);
  }

  updateTime = () => {
    this.props.setMatch({
      ...this.props.match,
      minutesElapsed: parseInt((Date.now() - this.state.startedAt) / 60000)
    });
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      await this.setState({
        // ...nextProps
        score1: nextProps.score1,
        score2: nextProps.score2,
        history: nextProps.history
      });
    }
  }

  // ====== Player and Placement ======


  render() {
    // console.log(this.state.history);

    return <Grid className='matchHistoryContainer'>
      <Row>
        <Col
          xs={5}
          xsOffset={1}
          className='team1'>
          {this.state.imageP1 &&
            <img
              src={this.state.imageP1}
              className='avatarImage imageP1'
              alt='Avatar'/>}
          {this.state.imageP2 &&
            <img
              src={this.state.imageP2}
              className={'avatarImage imageP2 ' + (this.state.imageP1 ? 'translateTop ' : '')}
              alt='Avatar'/>}
        </Col>

        <Col
          xs={4}
          className='scoreContainer'>
          <span className="verticalHelper"></span>
          <span
            className='score1'>
            {this.state.score1}
          </span>
        </Col>

        <Col
          xs={4}
          className='timerContainer'>
          <span className="verticalHelper"></span>
          <span className='timer'>
            {this.props.match.minutesElapsed}&rsquo;
          </span>
        </Col>

        <Col
          xs={4}
          className='scoreContainer'>
          <span className="verticalHelper"></span>
          <span
            className='score2'>
            {this.state.score2}
          </span>
        </Col>

        <Col
          xs={5}
          className='team2'>
          {this.state.imageP3 &&
            <img
              src={this.state.imageP3}
              className='avatarImage imageP3'
              alt='Avatar'/>}
          {this.state.imageP4 &&
            <img
              src={this.state.imageP4}
              className={'avatarImage imageP4 ' + (this.state.imageP3 ? 'translateTop ' : '')}
              alt='Avatar'/>}
        </Col>
      </Row>

      <Row className='history'>
        <Col
          xs={12}
          className='team1History'>
          <TransitionGroup component={null}>
            {
              this.props.history.map((goal, i) => {
                if (goal.team === 'Team2') {
                  return  <CSSTransition
                            timeout={300}
                            classNames="team2Anim"
                            key={i}>
                            <Row className='goalEventContainer'>
                              <Col xs={3}>
                                <span className='goalTime'>{goal.goalTime}&rsquo;</span>
                              </Col>
                              <Col xs={4} className={'goalScoreContainer ' + (goal.deltaScore > 0 ? 'plus ' : 'minus ')}>
                                <span className={'goalScore'}> {
                                    (goal.deltaScore > 0 ? '+' : '') + goal.deltaScore
                                  }</span>
                              </Col>
                              <Col xs={17}>
                                <span className='goalPlayer'>{goal.fullName}</span>
                              </Col>
                            </Row>
                          </CSSTransition>;
                }
              })
            }
          </TransitionGroup>
        </Col>

        <Col
          xs={12}
          className='team2History'>
          <TransitionGroup component={null}>
            {
              this.props.history.map((goal, i) => {
                if (goal.team === 'Team1') {
                  return <CSSTransition
                            timeout={300}
                            classNames="team1Anim"
                            key={i}>
                            <Row className='goalEventContainer' key={i}>
                              <Col xs={17}>
                                <span className='goalPlayer'>{goal.fullName}</span>
                              </Col>
                              <Col xs={4} className={'goalScoreContainer ' + (goal.deltaScore > 0 ? 'plus ' : 'minus ')}>
                                <span className={'goalScore'}> {
                                    (goal.deltaScore > 0 ? '+' : '') + goal.deltaScore
                                  }</span>
                              </Col>
                              <Col xs={3}>
                                <span className='goalTime'>{goal.goalTime}&rsquo;</span>
                              </Col>
                            </Row>
                          </CSSTransition>;
                }
              })
            }
          </TransitionGroup>
        </Col>
      </Row>

    </Grid>;
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MatchHistory));