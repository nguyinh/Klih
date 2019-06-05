import React, { Component } from 'react';
import './Match.scss';
import swordImage from '../../sword.png';
import shieldImage from '../../shield.png';
import plusImage from '../../plus-sign.png';
import minusImage from '../../minus-sign.png';
import MatchPlayer from '../MatchPlayer/MatchPlayer';
import MatchHistory from '../MatchHistory/MatchHistory';
import MatchInput from '../MatchInput/MatchInput';
import { withRouter, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
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
import { setMatch, setScore1, setScore2, setHistory, addToMatch, resetMatch } from './../../redux/actions/index.actions.js';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
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

    // socket.on('onConnectedPlayersChange', ({ playersArray, playerName }) => {
    //   if ((playersArray.includes('P1') || playersArray.includes('P2')) &&
    //     (playersArray.includes('P3') || playersArray.includes('P4'))) {
    //     const userID = this.props.currentUser._id;
    //     const player1ID = this.state.P1._id;
    //     const player2ID = this.state.P2._id;
    //     const player3ID = this.state.P3._id;
    //     const player4ID = this.state.P4._id;
    //     if (userID === player1ID ||
    //       userID === player2ID) {
    //       this.setState({
    //         teamToDisplay: 'Team1'
    //       });
    //     } else if (userID === player3ID ||
    //       userID === player4ID) {
    //       this.setState({
    //         teamToDisplay: 'Team2'
    //       });
    //     }
    //   } else {
    //     this.setState({ teamToDisplay: '' });
    //   }
    //
    //   this.resetPointState();
    //
    //   if (playersArray.length > this.state.playersArray.length &&
    //     this.state.playersArray.length !== 0) {
    //     Alert.info(playerName ? playerName + ' a rejoint la partie' : 'Un joueur a rejoint la partie ');
    //   } else if (playersArray.length < this.state.playersArray.length) {
    //     Alert.info('Un joueur a quitté la partie');
    //   }
    //   this.setState({ playersArray });
    // });

    // socket.on('placementChange', ({ P1Placement, P2Placement, P3Placement, P4Placement }) => {
    //   this.setState(prevState => ({
    //     P1: { ...prevState.P1, placement: P1Placement },
    //     P2: { ...prevState.P2, placement: P2Placement },
    //     P3: { ...prevState.P3, placement: P3Placement },
    //     P4: { ...prevState.P4, placement: P4Placement },
    //   }));
    // });

    socket.on('matchEnded', ({ reason }) => {
      if (reason === 'MATCH_ENDED')
        Alert.error('Ce match est terminé', 5000);
      else
        Alert.success('Le match a bien été enregistré', 3000);
      this.props.resetMatch();
      // TODO: some things on match end
    });

    socket.on('matchCancelled', (data) => {
      Alert.warning(data.self ? 'Match annulé' : (data.reason === 'ENDED_BY_USER' ?
          (data.user ? 'Match annulé par ' + data.user : 'Ce match a été annulé par un autre joueur') :
          'Match annulé pour inactivité'),
        10000);
      this.props.resetMatch();
    });

    socket.on('reconnect', (attemptNumber) => {
      socket.emit('joinMatch', {
        matchId: this.props.currentMatchId,
        playerId: this.props.currentUser._id
      });
    });
  }

  // async componentWillReceiveProps(nextProps) {
  //   if (nextProps.P1.name !== this.props.P1.name ||
  //     nextProps.P2.name !== this.props.P2.name ||
  //     nextProps.P3.name !== this.props.P3.name ||
  //     nextProps.P4.name !== this.props.P4.name) {
  //     await this.setState({
  //       P1: nextProps.P1,
  //       P2: nextProps.P2,
  //       P3: nextProps.P3,
  //       P4: nextProps.P4
  //     });
  //   }
  // }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(this.props);
    console.log(nextProps);
    return true;
  }

  componentWillUnmount() {
    socket.off('onConnectedPlayersChange');
    socket.off('placementChange');
    socket.off('matchEnded');
    socket.off('matchCancelled');
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
    // TODO: add some security
    this.setState({ isMatchLoading: true });

    socket.emit('cancelMatch', {
      matchId: this.props.currentMatchId,
      playerId: this.props.currentUser._id
    });
  }


  render() {
    console.log('rerender');
    const { P1, P2, P3, P4, placement } = this.state;

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
                imageP1={this.state.P1.name !== '' ? this.state.P1.image : ''}
                imageP2={this.state.P2.name !== '' ? this.state.P2.image : ''}
                imageP3={this.state.P3.name !== '' ? this.state.P3.image : ''}
                imageP4={this.state.P4.name !== '' ? this.state.P4.image : ''}
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