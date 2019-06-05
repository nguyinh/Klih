import React, { Component } from 'react';
import './MatchHistory.scss';
import HistoryEntryLeft from '../HistoryEntryLeft/HistoryEntryLeft.js';
import HistoryEntryRight from '../HistoryEntryRight/HistoryEntryRight.js';
import swordImage from '../../sword.png';
import shieldImage from '../../shield.png';
import plusImage from '../../plus-sign.png';
import minusImage from '../../minus-sign.png';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { setMatch, setElapsedTime } from './../../redux/actions/index.actions.js';
import {
  Button,
  Grid,
  Row,
  Col,
  Checkbox,
  Icon,
  Alert,
  Modal
} from 'rsuite';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { socket } from './../../socket';

const mapDispatchToProps = dispatch => {
  return ({
    setMatch: (value) => {
      dispatch(setMatch(value))
    },
    setElapsedTime: (value) => {
      dispatch(setElapsedTime(value))
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
    history: state.matchHistory,
    team1: state.team1,
    team2: state.team2,
    minutesElapsed: state.minutesElapsed,
    currentMatchId: state.currentMatchId,
    currentUser: state.currentUser
  };
};

// const cmp = (o1, o2) => JSON.stringify(o1) === JSON.stringify(o2);

class MatchHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score1: props.score1 || 0,
      score2: props.score2 || 0,
      history: props.history || [],
      team1History: [],
      team2History: [],
      imageP1: props.imageP1,
      imageP2: props.imageP2,
      imageP3: props.imageP3,
      imageP4: props.imageP4,
      matchTimer: props.recordTime && setInterval(this.updateTime, 10000),
      startedAt: props.startedAt,
      createdAt: '',
      minutesElapsed: 1,
      removeTimer: undefined
    }
  }

  componentDidMount() {
    socket.emit('joinMatch', {
      matchId: this.props.currentMatchId,
      playerId: this.props.currentUser._id
    });

    socket.on('goalEvent', (data) => {
      this.setState({
        score1: data.score1,
        score2: data.score2,
        history: data.history,
        team1History: data.history.filter(h => h.team === 'Team1').reverse(),
        team2History: data.history.filter(h => h.team === 'Team2').reverse()
      });
    });

    socket.on('joinMatch', (data) => {
      this.setState({
        score1: data.score1,
        score2: data.score2,
        // history: data.history,
        team1History: data.history.filter(h => h.team === 'Team1').reverse(),
        team2History: data.history.filter(h => h.team === 'Team2').reverse(),
        createdAt: Date.parse(data.createdAt)
      });

      this.updateTime();
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.matchTimer);
    socket.off('goalEvent');
    socket.off('joinMatch');
  }

  shouldComponentUpdate(prevProps, prevState) {
    // Increase performance
    return prevState.score1 !== this.state.score1 ||
      prevState.score2 !== this.state.score2 ||
      prevState.history !== this.state.history ||
      prevState.minutesElapsed !== this.state.minutesElapsed;
  }

  updateTime = () => {
    this.setState({
      minutesElapsed: parseInt((Date.now() - this.state.createdAt) / 60000) + 1
    });
  }

  openRemoveConfirmation = (e, index) => {
    Array.from(document.getElementsByClassName('displayOverlay')).forEach((overlay) => {
      clearTimeout(this.state.removeTimer);
      overlay.classList.remove('displayOverlay');
    });
    document.getElementById('removeOverlay' + index).classList.add('displayOverlay');
    this.setState({
      removeTimer: setTimeout(() => {
        if (document.getElementById('removeOverlay' + index))
          document.getElementById('removeOverlay' + index).classList.remove('displayOverlay');
      }, 1500)
    });
  }

  removeGoalEvent = (e, index) => {
    e.stopPropagation();
    console.log('removeOverlay' + index);
    if (document.getElementById('removeOverlay' + index)) {
      clearTimeout(this.state.removeTimer);
      document.getElementById('removeOverlay' + index).classList.remove('displayOverlay');
    }

    socket.emit('removeGoalEvent', {
      matchId: this.props.currentMatchId,
      playerId: this.props.currentUser._id,
      index: index
    });
  }

  // async componentWillReceiveProps(nextProps) {
  // if (nextProps !== this.props) {
  //   await this.setState({
  //     // ...nextProps
  //     score1: nextProps.score1,
  //     score2: nextProps.score2,
  //     history: nextProps.history
  //   });
  // }
  // }


  render() {
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
            <Icon icon='clock-o'/> {this.state.minutesElapsed}
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
            {
              this.state.team1History.map((goal, i) => {
                return <HistoryEntryLeft
                          index={goal.index}
                          goalTime={goal.goalTime}
                          deltaScore={goal.deltaScore}
                          fullName={goal.fullName}
                          currentMatchId={this.props.currentMatchId}
                          currentUserId={this.props.currentUser._id}
                          key={goal.index}/>;
              })
            }
        </Col>

        <Col
          xs={12}
          className='team2History'>
            {
              this.state.team2History.map((goal, i) => {
                return <HistoryEntryRight
                          index={goal.index}
                          goalTime={goal.goalTime}
                          deltaScore={goal.deltaScore}
                          fullName={goal.fullName}
                          currentMatchId={this.props.currentMatchId}
                          currentUserId={this.props.currentUser._id}
                          key={goal.index}/>;
              })
            }
        </Col>
      </Row>
    </Grid>;
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MatchHistory));