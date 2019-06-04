import React, { PureComponent } from 'react';
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

class Match extends PureComponent {
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

    socket.on('onConnectedPlayersChange', ({ playersArray, playerName }) => {
      if ((playersArray.includes('P1') || playersArray.includes('P2')) &&
        (playersArray.includes('P3') || playersArray.includes('P4'))) {
        const userID = this.props.currentUser._id;
        const player1ID = this.state.P1._id;
        const player2ID = this.state.P2._id;
        const player3ID = this.state.P3._id;
        const player4ID = this.state.P4._id;
        if (userID === player1ID ||
          userID === player2ID) {
          this.setState({
            teamToDisplay: 'Team1'
          });
        } else if (userID === player3ID ||
          userID === player4ID) {
          this.setState({
            teamToDisplay: 'Team2'
          });
        }
      } else {
        this.setState({ teamToDisplay: '' });
      }

      this.resetPointState();

      if (playersArray.length > this.state.playersArray.length &&
        this.state.playersArray.length !== 0) {
        Alert.info(playerName ? playerName + ' a rejoint la partie' : 'Un joueur a rejoint la partie ');
      } else if (playersArray.length < this.state.playersArray.length) {
        Alert.info('Un joueur a quitté la partie');
      }
      this.setState({ playersArray });
    });

    socket.on('placementChange', ({ P1Placement, P2Placement, P3Placement, P4Placement }) => {
      this.setState(prevState => ({
        P1: { ...prevState.P1, placement: P1Placement },
        P2: { ...prevState.P2, placement: P2Placement },
        P3: { ...prevState.P3, placement: P3Placement },
        P4: { ...prevState.P4, placement: P4Placement },
      }));
    });

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

  async componentWillReceiveProps(nextProps) {
    // if (nextProps.P1.name !== this.props.P1.name ||
    //   nextProps.P2.name !== this.props.P2.name ||
    //   nextProps.P3.name !== this.props.P3.name ||
    //   nextProps.P4.name !== this.props.P4.name) {
    //   await this.setState({
    //     P1: nextProps.P1,
    //     P2: nextProps.P2,
    //     P3: nextProps.P3,
    //     P4: nextProps.P4
    //   });
    // }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(this.state);
  //   console.log(nextState);
  //   return this.state !== nextState;
  // }

  componentWillUnmount() {
    socket.off('onConnectedPlayersChange');
    socket.off('placementChange');
    socket.off('matchEnded');
    socket.off('matchCancelled');
    socket.off('reconnect');
  }

  // ====== Player and Placement ======
  deselectPlayers = async () => {
    this.resetErrors();

    this.setState({
      P1: {
        ...this.state.P1,
        isSelected: false
      },
      P2: {
        ...this.state.P2,
        isSelected: false
      },
      P3: {
        ...this.state.P3,
        isSelected: false
      },
      P4: {
        ...this.state.P4,
        isSelected: false
      },
    })
  }

  onP1Touch = () => {
    if (this.state.P1.isSelected)
      return;
    this.deselectPlayers();
    const { P1, placement, changingScore } = this.state;
    this.setState({
      P1: {
        ...P1,
        placement: (!P1.placement ? '' : P1.placement),
        isSelected: true
      },
      placement: (!P1.placement ? '' : P1.placement),
      isGoalValid: (changingScore !== 0)
    });
  }

  onP2Touch = () => {
    if (this.state.P2.isSelected)
      return;
    this.deselectPlayers();
    const { P2, placement, changingScore } = this.state;
    this.setState({
      P2: {
        ...P2,
        placement: (!P2.placement ? '' : P2.placement),
        isSelected: true
      },
      placement: (!P2.placement ? '' : P2.placement),
      isGoalValid: (changingScore !== 0)
    });
  }

  onP3Touch = () => {
    if (this.state.P3.isSelected)
      return;
    this.deselectPlayers();
    const { P3, placement, changingScore } = this.state;
    this.setState({
      P3: {
        ...P3,
        placement: (!P3.placement ? '' : P3.placement),
        isSelected: true
      },
      placement: (!P3.placement ? '' : P3.placement),
      isGoalValid: (changingScore !== 0)
    });
  }

  onP4Touch = () => {
    if (this.state.P4.isSelected)
      return;
    this.deselectPlayers();
    const { P4, placement, changingScore } = this.state;
    this.setState({
      P4: {
        ...P4,
        placement: (!P4.placement ? '' : P4.placement),
        isSelected: true
      },
      placement: (!P4.placement ? '' : P4.placement),
      isGoalValid: (changingScore !== 0)
    });
  }

  onPlacementChange = (placementType) => {
    this.resetErrors();

    const { P1, P2, P3, P4 } = this.state;

    if (this.state.P1.isSelected) {
      this.setState({
        P1: {
          ...this.state.P1,
          placement: (P1.placement === placementType ? '' : placementType)
        },
        P2: {
          ...this.state.P2,
          placement: (P1.placement === placementType ? P2.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
        },
        placement: (P1.placement === placementType ? '' : placementType)
      });

      socket.emit('placementChange', {
        matchId: this.props.currentMatchId,
        playerId: this.props.currentUser._id,
        P1Placement: (P1.placement === placementType ? '' : placementType),
        P2Placement: (P1.placement === placementType ? P2.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
      });

    } else if (this.state.P2.isSelected) {
      this.setState({
        P2: {
          ...this.state.P2,
          placement: (P2.placement === placementType ? '' : placementType)
        },
        P1: {
          ...this.state.P1,
          placement: (P2.placement === placementType ? P1.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
        },
        placement: (P2.placement === placementType ? '' : placementType)
      });

      socket.emit('placementChange', {
        matchId: this.props.currentMatchId,
        playerId: this.props.currentUser._id,
        P1Placement: (P2.placement === placementType ? P1.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : ''))),
        P2Placement: (P2.placement === placementType ? '' : placementType)
      });

    } else if (this.state.P3.isSelected) {
      this.setState({
        P3: {
          ...this.state.P3,
          placement: (P3.placement === placementType ? '' : placementType)
        },
        P4: {
          ...this.state.P4,
          placement: (P3.placement === placementType ? P4.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
        },
        placement: (P3.placement === placementType ? '' : placementType)
      });

      socket.emit('placementChange', {
        matchId: this.props.currentMatchId,
        playerId: this.props.currentUser._id,
        P3Placement: (P3.placement === placementType ? '' : placementType),
        P4Placement: (P3.placement === placementType ? P4.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
      });

    } else if (this.state.P4.isSelected) {
      this.setState({
        P4: {
          ...this.state.P4,
          placement: (P4.placement === placementType ? '' : placementType)
        },
        P3: {
          ...this.state.P3,
          placement: (P4.placement === placementType ? P3.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
        },
        placement: (P4.placement === placementType ? '' : placementType)
      });

      socket.emit('placementChange', {
        matchId: this.props.currentMatchId,
        playerId: this.props.currentUser._id,
        P3Placement: (P4.placement === placementType ? P3.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : ''))),
        P4Placement: (P4.placement === placementType ? '' : placementType)
      });
    }
  }


  // ====== Adding/removing points ======
  addPoint = () => {
    if (this.state.P1.isSelected ||
      this.state.P2.isSelected ||
      this.state.P3.isSelected ||
      this.state.P4.isSelected) {
      this.resetErrors();

      this.setState((state, props) => {
        return {
          changingScore: state.changingScore + 1,
          isGoalValid: ((state.P1.isSelected || state.P2.isSelected || state.P3.isSelected || state.P4.isSelected) &&
            (state.changingScore + 1) !== 0)
        }
      });
    }
  }

  removePoint = () => {
    if (this.state.P1.isSelected ||
      this.state.P2.isSelected ||
      this.state.P3.isSelected ||
      this.state.P4.isSelected) {
      this.resetErrors();

      this.setState((state, props) => {
        return {
          changingScore: state.changingScore - 1,
          isGoalValid: ((state.P1.isSelected || state.P2.isSelected || state.P3.isSelected || state.P4.isSelected) &&
            (state.changingScore - 1) !== 0)
        }
      });
    }
  }

  onBetrayButtonTouch = () => {
    if (this.state.P1.isSelected ||
      this.state.P2.isSelected ||
      this.state.P3.isSelected ||
      this.state.P4.isSelected) {
      this.resetErrors();

      this.setState((state, props) => {
        return {
          betrayPoint: !state.betrayPoint
        }
      });
    }
  }


  // ====== Adding score to history ======
  onAddGoalButtonTouch = () => {
    const { P1, P2, P3, P4, changingScore, betrayPoint, startedAt } = this.state;

    this.setState({
      playersMissing: (!P1.isSelected && !P2.isSelected && !P3.isSelected && !P4.isSelected),
      pointMissing: this.state.changingScore === 0,
    });

    // If error, don't save goal
    if ((!P1.isSelected && !P2.isSelected && !P3.isSelected && !P4.isSelected) ||
      this.state.changingScore === 0 ||
      this.state.saveInProgress)
      return;

    const getPlayer = ({ data, name, placement }) => {
      return {
        _id: data._id,
        fullName: name,
        placement: placement
      };
    };
    const selectedPlayer = getPlayer([P1, P2, P3, P4].filter(player => player.isSelected)[0]);

    const beginTime = Date.now();

    // Save in history
    let { match, score1, score2, history, minutesElapsed } = this.props;

    this.setState({
      saveInProgress: true
    });

    socket.emit('goalEvent', {
      matchId: this.props.currentMatchId,
      playerId: this.props.currentUser._id,
      match: {
        score1: (
          (changingScore > 0 && !betrayPoint && (P1.isSelected || P2.isSelected)) ||
          (changingScore > 0 && betrayPoint && (P3.isSelected || P4.isSelected)) ||
          (changingScore < 0 && !betrayPoint && (P3.isSelected || P4.isSelected)) ||
          (changingScore < 0 && betrayPoint && (P1.isSelected || P2.isSelected)) ?
          changingScore :
          0
        ),
        score2: (
          (changingScore > 0 && !betrayPoint && (P3.isSelected || P4.isSelected)) ||
          (changingScore > 0 && betrayPoint && (P1.isSelected || P2.isSelected)) ||
          (changingScore < 0 && !betrayPoint && (P1.isSelected || P2.isSelected)) ||
          (changingScore < 0 && betrayPoint && (P3.isSelected || P4.isSelected)) ?
          changingScore :
          0
        ),
        history: {
          goalTime: Date.now(),
          deltaScore: this.state.changingScore,
          byPlayer: selectedPlayer._id,
          placement: selectedPlayer.placement,
          fullName: selectedPlayer.fullName,
          isBetray: this.state.betrayPoint,
          team: (
            ((P1.isSelected || P2.isSelected) && !this.state.betrayPoint) ||
            ((P3.isSelected || P4.isSelected) && this.state.betrayPoint) ?
            'Team1' :
            'Team2'
          )
        }
      }
    }, () => {
      this.resetPointState();
    });
  }

  resetPointState = () => {
    this.setState({
      P1: {
        ...this.state.P1,
        isSelected: false,
      },
      P2: {
        ...this.state.P2,
        isSelected: false,
      },
      P3: {
        ...this.state.P3,
        isSelected: false,
      },
      P4: {
        ...this.state.P4,
        isSelected: false,
      },
      placement: '',
      changingScore: 0,
      betrayPoint: false,
      isGoalValid: false,
      saveInProgress: false
    });
  }

  resetErrors = () => {
    this.setState({
      playersMissing: false,
      pointMissing: false
    });
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

    if (!P1._id && !P2._id && !P3._id && !P4._id)
      return <Redirect push to="/lobby" />;

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