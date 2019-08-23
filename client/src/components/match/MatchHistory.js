import React, { Component } from 'react';
import './MatchHistory.scss';
import { 
  HistoryEntry
} from './';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Grid,
  Row,
  Col,
  Icon,
} from 'rsuite';
import { socket } from './../../socket';

const mapStateToProps = state => {
  return {
    currentMatchId: state.currentMatchId,
    currentUser: state.currentUser
  };
};

class MatchHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score1: props.score1 || 0,
      score2: props.score2 || 0,
      goalHistory: [],
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
    if (this.props.currentMatchId && this.props.currentUser._id)
      socket.emit('joinMatch', {
        matchId: this.props.currentMatchId,
        playerId: this.props.currentUser._id
      });

    socket.on('goalEvent', (data) => {
      this.setState({
        score1: data.score1,
        score2: data.score2,
        goalHistory: data.history.reverse(),
      });
    });

    socket.on('joinMatch', (data) => {
      this.setState({
        score1: data.score1,
        score2: data.score2,
        goalHistory: data.history.reverse(),
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


  render() {
    const { goalHistory } = this.state;

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
        <div>
          <div className='time-line'/>
        </div>

        <Col
          xs={24}
          className='goal-history'>
            {
              goalHistory.map((goal, i) => (
                <HistoryEntry
                  index={goal.index}
                  goalTime={
                    i === goalHistory.length-1 || (
                      (i+1) < goalHistory.length &&
                      goalHistory[i+1].goalTime !== goal.goalTime
                    ) ? 
                      goal.goalTime :
                      ''
                  }
                  deltaScore={goal.deltaScore}
                  team={goal.team}
                  fullName={goal.fullName}
                  currentMatchId={this.props.currentMatchId}
                  currentUserId={this.props.currentUser._id}
                  key={goal.index}
                  openRemoveConfirmation={this.openRemoveConfirmation}
                  removeGoalEvent={this.removeGoalEvent}
                  toLoad={true}/>
              ))
            }
        </Col>
      </Row>
    </Grid>;
  }
}
export default withRouter(connect(mapStateToProps, null)(MatchHistory));