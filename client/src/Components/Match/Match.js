import React, { Component } from 'react';
import './Match.scss';
import MatchHistory from '../MatchHistory/MatchHistory';
import MatchInput from '../MatchInput/MatchInput';
import { withRouter, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
  Icon,
  Modal
} from 'rsuite';
import { setMatch, setScore1, setScore2, setHistory, addToMatch, resetMatch } from './../../redux/actions/index.actions.js';
import { socket } from './../../socket';

const mapDispatchToProps = dispatch => {
  return ({
    setMatch: (value) => {
      dispatch(setMatch(value))
    },
    setScore1: (value) => {
      dispatch(setScore1(value))
    },
    setScore2: (value) => {
      dispatch(setScore2(value))
    },
    setHistory: (value) => {
      dispatch(setHistory(value))
    },
    addToMatch: (value) => {
      dispatch(addToMatch(value))
    },
    resetMatch: (value) => {
      dispatch(resetMatch())
    },
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
    minutesElapsed: state.minutesElapsed,
    currentMatchId: state.currentMatchId,
    currentUser: state.currentUser,
    saveInProgress: false,
    playersArray: []
  };
};

// const cmp = (o1, o2) => JSON.stringify(o1) === JSON.stringify(o2);

class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {
      P1: {
        ...this.props.P1,
        placement: '',
        isSelected: false
      },
      P2: {
        ...this.props.P2,
        placement: '',
        isSelected: false
      },
      P3: {
        ...this.props.P3,
        placement: '',
        isSelected: false
      },
      P4: {
        ...this.props.P4,
        placement: '',
        isSelected: false
      },
      placement: '',
      changingScore: 0,
      betrayPoint: false,
      playersMissing: false,
      pointMissing: false,
      startedAt: Date.now(),
      playersArray: [],
      validateModalDisplay: false,
      isMatchLoading: false
    }
  }

  async componentDidMount() {
    // Condition if User go directly on /match
    if (!this.props.currentMatchId)
      return;

    socket.on('reconnect', (attemptNumber) => {
      socket.emit('joinMatch', {
        matchId: this.props.currentMatchId,
        playerId: this.props.currentUser._id
      });
      // TODO: Alert on reconnection
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(this.props);
  //   console.log(nextProps);
  // return false;
  // }

  componentWillUnmount() {
    socket.off('reconnect');
  }

  onSaveButton = () => {
    this.setState({ isMatchLoading: true });

    socket.emit('saveMatch', {
      matchId: this.props.currentMatchId,
      playerId: this.props.currentUser._id
    });
  }

  onCancelButton = () => {
    this.setState({ isMatchLoading: true });

    console.log(this.props.currentMatchId);
    console.log(this.props.currentUser._id);
    socket.emit('cancelMatch', {
      matchId: this.props.currentMatchId,
      playerId: this.props.currentUser._id
    });
  }


  render() {
    console.log(this.state);
    return <Grid className='matchContainer'>
      <MatchInput/>

      <Row>
        <Col
          xs={22}
          xsOffset={1}
          className='container historyContainer'>

          <Row>
            <Col
              xs={24}>
              <MatchHistory
                imageP1={this.state.P1._id ? this.state.P1.image : ''}
                imageP2={this.state.P2._id ? this.state.P2.image : ''}
                imageP3={this.state.P3._id ? this.state.P3.image : ''}
                imageP4={this.state.P4._id ? this.state.P4.image : ''}
                recordTime
                startedAt={Date.now()}/>
            </Col>
          </Row>

          <Row className='matchValidation'>
            <Col
              xs={11}
              xsOffset={1}>
              <Button
                size='lg'
                block
                className='roundButton red'
                onClick={() => {this.setState({cancelModalDisplay: true})}}>
                Quitter
              </Button>
            </Col>

            <Col
              xs={11}>
              <Button
                size='lg'
                block
                className='roundButton green'
                onClick={() => {this.setState({validateModalDisplay: true})}}>
                Sauvegarder
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>


      <Modal
        show={this.state.validateModalDisplay}
        onHide={() => {this.setState({validateModalDisplay: false})}}
        size='xs'>
        <Modal.Header>
          <Modal.Title>Valider le match ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>En validant le match, vous ne pourrez plus le modifier. Est ce votre dernier mot Jean-Pierre ?</span>
        </Modal.Body>
        <Modal.Footer>
          <Grid style={{marginTop: '15px'}}>
            <Row>
              <Col xs={12}>
                <Button
                  onClick={() => {this.setState({validateModalDisplay: false})}}
                  className='roundButton blue'
                  block>
                  Retour
                </Button>
              </Col>

              <Col xs={12}>
                <Button
                  onClick={this.onSaveButton}
                  className='roundButton green'
                  block>
                  {this.state.isMatchLoading ? <Icon icon='circle-o-notch' spin size="lg" style={{fontSize: '15px'}}/> : 'Valider'}
                </Button>
              </Col>
            </Row>
          </Grid>
        </Modal.Footer>
      </Modal>

      <Modal
        show={this.state.cancelModalDisplay}
        onHide={() => {this.setState({cancelModalDisplay: false})}}
        size='xs'>
        <Modal.Header>
          <Modal.Title>Annuler le match ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>En annulant le match, vous perdrez toutes ses données. Est ce votre dernière bafouille ?</span>
        </Modal.Body>
        <Modal.Footer>
          <Grid style={{marginTop: '15px'}}>
            <Row>
              <Col xs={12}>
                <Button
                  onClick={() => {this.setState({cancelModalDisplay: false})}}
                  className='roundButton blue'
                  block>
                  Retour
                </Button>
              </Col>

              <Col xs={12}>
                <Button
                  onClick={this.onCancelButton}
                  className='roundButton red'
                  block>
                  {this.state.isMatchLoading ? <Icon icon='circle-o-notch' spin size="lg" style={{fontSize: '15px'}}/> : 'Supprimer'}
                </Button>
              </Col>
            </Row>
          </Grid>
        </Modal.Footer>
      </Modal>
    </Grid>;
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Match));