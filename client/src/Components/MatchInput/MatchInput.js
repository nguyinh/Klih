import React, { PureComponent } from 'react';
import './MatchInput.scss';
import swordImage from '../../sword.png';
import shieldImage from '../../shield.png';
import switchImage from '../../switch.png';
import plusImage from '../../plus-sign.png';
import minusImage from '../../minus-sign.png';
import MatchPlayer from '../MatchPlayer/MatchPlayer';

import { withRouter, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Grid,
  Row,
  Col,
  Icon,
  Alert
} from 'rsuite';
import { setMatch, setScore1, setScore2, setHistory, addToMatch, resetMatch } from './../../redux/actions/index.actions.js';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { socket } from './../../socket';
import { p } from '../../utils';

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

class MatchInput extends PureComponent {
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

      // Initialize placements
      if ((this.state.P1._id && !P1Placement) ||
        (this.state.P2._id && !P2Placement) ||
        (this.state.P3._id && !P3Placement) ||
        (this.state.P4._id && !P4Placement)) {
        socket.emit('placementChange', {
          matchId: this.props.currentMatchId,
          playerId: this.props.currentUser._id,
          P1Placement: this.state.P1._id ? p.DEFENCE : '',
          P2Placement: this.state.P2._id ? p.ATTACK : '',
          P3Placement: this.state.P3._id ? p.ATTACK : '',
          P4Placement: this.state.P4._id ? p.DEFENCE : ''
        });

        this.setState(prevState => ({
          P1: { ...prevState.P1, placement: this.state.P1._id ? p.DEFENCE : '', },
          P2: { ...prevState.P2, placement: this.state.P2._id ? p.ATTACK : '' },
          P3: { ...prevState.P3, placement: this.state.P3._id ? p.ATTACK : '' },
          P4: { ...prevState.P4, placement: this.state.P4._id ? p.DEFENCE : '' },
        }));
      } else
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
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.P1._id !== this.props.P1._id ||
      nextProps.P2._id !== this.props.P2._id ||
      nextProps.P3._id !== this.props.P3._id ||
      nextProps.P4._id !== this.props.P4._id) {
      await this.setState({
        P1: nextProps.P1,
        P2: nextProps.P2,
        P3: nextProps.P3,
        P4: nextProps.P4
      });
    }
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
  }

  // ====== Player and Placement ======
  deselectPlayers = async () => {
    this.resetErrors();

    await this.setState({
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
    const { P1, changingScore } = this.state;
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
    const { P2, changingScore } = this.state;
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
    const { P3, changingScore } = this.state;
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
    const { P4, changingScore } = this.state;
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

    if (this.state.P1.isSelected || this.state.P2.isSelected) {
      this.setState({
        P1: {
          ...this.state.P1,
          placement: this.state.P1._id ? (P1.placement === p.ATTACK ? p.DEFENCE : p.ATTACK) : '',
          isSelected: false
        },
        P2: {
          ...this.state.P2,
          placement: this.state.P2._id ? (P2.placement === p.ATTACK ? p.DEFENCE : p.ATTACK) : '',
          isSelected: false
        }
      }, () => {
        socket.emit('placementChange', {
          matchId: this.props.currentMatchId,
          playerId: this.props.currentUser._id,
          P1Placement: this.state.P1.placement,
          P2Placement: this.state.P2.placement
        });
      });
    } else if (this.state.P3.isSelected || this.state.P4.isSelected) {
      this.setState({
        P3: {
          ...this.state.P3,
          placement: this.state.P3._id ? (P3.placement === p.ATTACK ? p.DEFENCE : p.ATTACK) : '',
          isSelected: false
        },
        P4: {
          ...this.state.P4,
          placement: this.state.P4._id ? (P4.placement === p.ATTACK ? p.DEFENCE : p.ATTACK) : '',
          isSelected: false
        }
      }, () => {
        socket.emit('placementChange', {
          matchId: this.props.currentMatchId,
          playerId: this.props.currentUser._id,
          P3Placement: this.state.P3.placement,
          P4Placement: this.state.P4.placement
        });
      });
    }
  }




  // onPlacementChange = (placementType) => {
  //   this.resetErrors();
  //
  //   const { P1, P2, P3, P4 } = this.state;
  //
  //   if (this.state.P1.isSelected) {
  //     this.setState({
  //       P1: {
  //         ...this.state.P1,
  //         placement: (P1.placement === placementType ? '' : placementType)
  //       },
  //       P2: {
  //         ...this.state.P2,
  //         placement: (P1.placement === placementType ? P2.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
  //       },
  //       placement: (P1.placement === placementType ? '' : placementType)
  //     });
  //
  //     socket.emit('placementChange', {
  //       matchId: this.props.currentMatchId,
  //       playerId: this.props.currentUser._id,
  //       P1Placement: (P1.placement === placementType ? '' : placementType),
  //       P2Placement: (P1.placement === placementType ? P2.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
  //     });
  //
  //   } else if (this.state.P2.isSelected) {
  //     this.setState({
  //       P2: {
  //         ...this.state.P2,
  //         placement: (P2.placement === placementType ? '' : placementType)
  //       },
  //       P1: {
  //         ...this.state.P1,
  //         placement: (P2.placement === placementType ? P1.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
  //       },
  //       placement: (P2.placement === placementType ? '' : placementType)
  //     });
  //
  //     socket.emit('placementChange', {
  //       matchId: this.props.currentMatchId,
  //       playerId: this.props.currentUser._id,
  //       P1Placement: (P2.placement === placementType ? P1.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : ''))),
  //       P2Placement: (P2.placement === placementType ? '' : placementType)
  //     });
  //
  //   } else if (this.state.P3.isSelected) {
  //     this.setState({
  //       P3: {
  //         ...this.state.P3,
  //         placement: (P3.placement === placementType ? '' : placementType)
  //       },
  //       P4: {
  //         ...this.state.P4,
  //         placement: (P3.placement === placementType ? P4.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
  //       },
  //       placement: (P3.placement === placementType ? '' : placementType)
  //     });
  //
  //     socket.emit('placementChange', {
  //       matchId: this.props.currentMatchId,
  //       playerId: this.props.currentUser._id,
  //       P3Placement: (P3.placement === placementType ? '' : placementType),
  //       P4Placement: (P3.placement === placementType ? P4.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
  //     });
  //
  //   } else if (this.state.P4.isSelected) {
  //     this.setState({
  //       P4: {
  //         ...this.state.P4,
  //         placement: (P4.placement === placementType ? '' : placementType)
  //       },
  //       P3: {
  //         ...this.state.P3,
  //         placement: (P4.placement === placementType ? P3.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : '')))
  //       },
  //       placement: (P4.placement === placementType ? '' : placementType)
  //     });
  //
  //     socket.emit('placementChange', {
  //       matchId: this.props.currentMatchId,
  //       playerId: this.props.currentUser._id,
  //       P3Placement: (P4.placement === placementType ? P3.placement : (placementType === 'Attack' ? 'Defense' : (placementType ? 'Attack' : ''))),
  //       P4Placement: (P4.placement === placementType ? '' : placementType)
  //     });
  //   }
  // }


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
    const { P1, P2, P3, P4, changingScore, betrayPoint } = this.state;

    this.setState({
      playersMissing: (!P1.isSelected && !P2.isSelected && !P3.isSelected && !P4.isSelected),
      pointMissing: this.state.changingScore === 0,
    });

    // If error, don't save goal
    if ((!P1.isSelected && !P2.isSelected && !P3.isSelected && !P4.isSelected) ||
      this.state.changingScore === 0 ||
      this.state.saveInProgress)
      return;

    const getPlayer = ({ data, firstName, placement }) => {
      return {
        _id: data._id,
        fullName: firstName,
        placement: placement
      };
    };
    const selectedPlayer = getPlayer([P1, P2, P3, P4].filter(player => player.isSelected)[0]);

    // Save in history
    // let { match, score1, score2, history, minutesElapsed } = this.props;

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


  render() {
    const { P1, P2, P3, P4, placement } = this.state;

    if (!P1._id && !P2._id && !P3._id && !P4._id)
      return <Redirect push to="/lobby" />;

    return <Grid className='matchContainer'>
      <Row>
        <Col
          xs={22}
          xsOffset={1}
          className='container goalSelectionContainer'>

          {/* Player and placement selection */}
          <Row>
            <Col xs={22} xsOffset={1}>
              <h2 className='select-goal-title'>Selectionnez le buteur</h2>
            </Col>

            <Col
              xs={22}
              xsOffset={1}
              className='playersContainer'>

              <Row gutter={0}>
                {
                  this.state.teamToDisplay !== 'Team2' &&
                  <Col
                    xs={this.state.teamToDisplay === 'Team1' ? 20 : 10}>

                    <Row gutter={0}>
                      {this.state.P1._id &&
                        <Col
                          xs={12}
                          className={'P1Container ' +
                            (this.state.P1.isSelected ? 'selected ' : '') +
                            (this.state.playersMissing ? 'error ' : '')}
                          onClick={this.onP1Touch}>
                          <MatchPlayer
                            name={this.state.P1.name}
                            firstName={this.state.P1.firstName}
                            image={this.state.P1.image}
                            placement={this.state.P1.placement}/>
                        </Col>
                      }


                      {this.state.P2._id &&
                        <Col
                          xs={12}
                          className={'P2Container ' +
                            (this.state.P2.isSelected ? 'selected ' : '') +
                            (this.state.playersMissing ? 'error ' : '')}
                          onClick={this.onP2Touch}>
                          <MatchPlayer
                            name={this.state.P2.name}
                            firstName={this.state.P2.firstName}
                            image={this.state.P2.image}
                            placement={this.state.P2.placement}/>
                        </Col>
                      }
                    </Row>
                  </Col>
                }

                <Col
                  xs={4}
                  className='playerPlacementContainer'>

                  <div
                    onClick={this.onPlacementChange}>
                    <img
                      src={switchImage}
                      className={'switchImage ' + ((!P1.isSelected && !P2.isSelected && !P3.isSelected && !P4.isSelected) && 'disabled ')}
                      alt='Switch'/>
                  </div>

                </Col>

                {
                  this.state.teamToDisplay !== 'Team1' &&
                  <Col
                    xs={this.state.teamToDisplay === 'Team2' ? 20 : 10}>
                    <Row gutter={0}>
                      {this.state.P3._id &&
                        <Col
                          xs={12}
                          className={'P3Container ' +
                            (this.state.P3.isSelected ? 'selected ' : '') +
                            (this.state.playersMissing ? 'error ' : '')}
                          onClick={this.onP3Touch}>
                          <MatchPlayer
                            name={this.state.P3.name}
                            firstName={this.state.P3.firstName}
                            image={this.state.P3.image}
                            placement={this.state.P3.placement}/>
                        </Col>
                      }


                      {this.state.P4._id &&
                        <Col
                          xs={12}
                          className={'P4Container ' +
                            (this.state.P4.isSelected ? 'selected ' : '') +
                            (this.state.playersMissing ? 'error ' : '')}
                          onClick={this.onP4Touch}>
                          <MatchPlayer
                            name={this.state.P4.name}
                            firstName={this.state.P4.firstName}
                            image={this.state.P4.image}
                            placement={this.state.P4.placement}/>
                        </Col>
                      }
                    </Row>
                  </Col>
                }
              </Row>

            </Col>
          </Row>

          <hr/>

          {/* Adding/removing points */}
          <Row className='pointsSelector'>
            <Col xs={22} xsOffset={1}>
              <h2 className='goals-title'>Points marqués</h2>
            </Col>

            <Col
              xs={9}>
              <div
                className={'removePointButton ' +
                  (P1.isSelected || P2.isSelected || P3.isSelected || P4.isSelected ? '' : 'disabled ') +
                  (this.state.pointMissing ? 'error ' : '')}
                onClick={this.removePoint}>
                <span className="verticalHelper"></span>
                <img
                  src={minusImage}
                  alt='minus'
                  className='minusImage'/>
              </div>
            </Col>

            <Col
              xs={6}>
              <span className="verticalHelper"></span>
              <span className='changingScore'>{(this.state.changingScore > 0 ? '+' : '') + this.state.changingScore}</span>
            </Col>

            <Col
              xs={9}>
              <div
                className={'addPointButton ' +
                  (P1.isSelected || P2.isSelected || P3.isSelected || P4.isSelected ? '' : 'disabled ') +
                  (this.state.pointMissing ? 'error ' : '')}
                onClick={this.addPoint}>
                <span className="verticalHelper"></span>
                <img
                  src={plusImage}
                  alt='plus'
                  className='plusImage'/>
              </div>
            </Col>

          </Row>

          <Row className='matchButtonsContainer'>
            <Col
              xs={11}
              xsOffset={1}>
              <div
                className={'betrayToggle ' +
                  (P1.isSelected || P2.isSelected || P3.isSelected || P4.isSelected ? '' : 'disabled ') +
                  (this.state.betrayPoint ? 'active' : '')}
                onClick={this.onBetrayButtonTouch}>
                {this.state.betrayPoint ?
                  <>
                    <span>BOUH </span>
                    <span role='img' aria-label="Thumb down" style={{fontSize: '18px'}}>👎</span>
                  </>
                  :
                  <span>Contre son camp</span>
                }
              </div>
            </Col>

            {/* Add score button */}
            <TransitionGroup component={null}>
              {
                this.state.isGoalValid &&
                <CSSTransition
                          timeout={300}
                          classNames="addGoalButtonAnim">
                  <Col xs={11} className='addButtonContainer'>
                    <div
                      className='addGoalButton'
                      onClick={this.onAddGoalButtonTouch}>
                      {
                        this.state.saveInProgress ?
                        <Icon icon='circle-o-notch' spin size="lg"/> :
                        <span>Ajouter</span>
                      }
                    </div>
                  </Col>
                </CSSTransition>
              }
            </TransitionGroup>
          </Row>

        </Col>
      </Row>
    </Grid>;
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MatchInput));