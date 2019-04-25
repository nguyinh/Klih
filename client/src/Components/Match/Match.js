import React, { Component } from 'react';
import './Match.scss';
import swordImage from '../../sword.png';
import shieldImage from '../../shield.png';
import plusImage from '../../plus-sign.png';
import minusImage from '../../minus-sign.png';
import MatchPlayer from '../MatchPlayer/MatchPlayer';
import MatchHistory from '../MatchHistory/MatchHistory';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
  Checkbox
} from 'rsuite';
import { setMatch, setScore1, setScore2, setHistory, addGoalTeam1 } from './../../redux/actions/index.actions.js';

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
    addGoalTeam1: (value) => {
      dispatch(addGoalTeam1(value))
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
    history: state.history
  };
};

const cmp = (o1, o2) => JSON.stringify(o1) === JSON.stringify(o2);

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
      pointMissing: false
    }
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

  onP1Touch = async () => {
    this.deselectPlayers();
    const { P1, placement } = this.state;
    await this.setState({
      P1: {
        ...P1,
        placement: (!P1.placement ? '' : P1.placement),
        isSelected: true
      },
      placement: (!P1.placement ? '' : P1.placement)
    });
  }

  onP2Touch = async () => {
    this.deselectPlayers();
    const { P2, placement } = this.state;
    await this.setState({
      P2: {
        ...P2,
        placement: (!P2.placement ? '' : P2.placement),
        isSelected: true
      },
      placement: (!P2.placement ? '' : P2.placement)
    });
  }

  onP3Touch = async () => {
    this.deselectPlayers();
    const { P3, placement } = this.state;
    this.setState({
      P3: {
        ...P3,
        placement: (!P3.placement ? '' : P3.placement),
        isSelected: true
      },
      placement: (!P3.placement ? '' : P3.placement)
    });
  }

  onP4Touch = async () => {
    this.deselectPlayers();
    const { P4, placement } = this.state;
    this.setState({
      P4: {
        ...P4,
        placement: (!P4.placement ? '' : P4.placement),
        isSelected: true
      },
      placement: (!P4.placement ? '' : P4.placement)
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
        placement: (P1.placement === placementType ? '' : placementType)
      });
    } else if (this.state.P2.isSelected) {
      this.setState({
        P2: {
          ...this.state.P2,
          placement: (P2.placement === placementType ? '' : placementType)
        },
        placement: (P2.placement === placementType ? '' : placementType)
      });
    } else if (this.state.P3.isSelected) {
      this.setState({
        P3: {
          ...this.state.P3,
          placement: (P3.placement === placementType ? '' : placementType)
        },
        placement: (P3.placement === placementType ? '' : placementType)
      });
    } else if (this.state.P4.isSelected) {
      this.setState({
        P4: {
          ...this.state.P4,
          placement: (P4.placement === placementType ? '' : placementType)
        },
        placement: (P4.placement === placementType ? '' : placementType)
      });
    }
  }


  // ====== Adding/removing points ======
  addPoint = () => {
    this.resetErrors();

    this.setState((state, props) => {
      return {
        changingScore: state.changingScore + 1
      }
    });
  }

  removePoint = () => {
    this.resetErrors();

    this.setState((state, props) => {
      return {
        changingScore: state.changingScore - 1
      }
    });
  }

  onBetrayButtonTouch = () => {
    this.resetErrors();

    this.setState((state, props) => {
      return {
        betrayPoint: !state.betrayPoint
      }
    });
  }


  // ====== Adding score to history ======
  onAddButtonTouch = () => {
    const { P1, P2, P3, P4, changingScore, betrayPoint } = this.state;

    this.setState({
      playersMissing: (!P1.isSelected && !P2.isSelected && !P3.isSelected && !P4.isSelected),
      pointMissing: this.state.changingScore === 0,
    });

    // If error, don't save goal
    if ((!P1.isSelected && !P2.isSelected && !P3.isSelected && !P4.isSelected) ||
      this.state.changingScore === 0)
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
    // console.log('save begin');
    // console.log(beginTime);

    // let newScore1 = 0;
    // if (((changingScore > 0 && !betrayPoint && (P1.isSelected || P2.isSelected)) ||
    //   (changingScore > 0 && betrayPoint && (P3.isSelected || P4.isSelected)) ||
    //   (changingScore < 0 && !betrayPoint && (P3.isSelected || P4.isSelected)) ||
    //   (changingScore < 0 && betrayPoint && (P1.isSelected || P2.isSelected))))
    // const newScore1 =

    // Save in history
    let { match, score1, score2, history } = this.props;
    // let newScore1,

    // Method #1
    // history.push({
    //   goalTime: match.minutesElapsed,
    //   deltaScore: this.state.changingScore,
    //   byPlayer: selectedPlayer._id,
    //   placement: selectedPlayer.placement,
    //   fullName: selectedPlayer.fullName,
    //   isBetray: this.state.betrayPoint,
    //   team: (
    //     ((P1.isSelected || P2.isSelected) && !this.state.betrayPoint) ||
    //     ((P3.isSelected || P4.isSelected) && this.state.betrayPoint) ?
    //     'Team1' :
    //     'Team2'
    //   )
    // });
    // Method #2
    // this.props.setHistory(history);
    // Method #3
    this.props.setHistory([...history, {
      goalTime: match.minutesElapsed,
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
    }]);

    // this.props.addGoalTeam1({
    //   goalTime: match.minutesElapsed,
    //   deltaScore: this.state.changingScore,
    //   byPlayer: selectedPlayer._id,
    //   placement: selectedPlayer.placement,
    //   fullName: selectedPlayer.fullName,
    //   isBetray: this.state.betrayPoint
    // });


    if (((changingScore > 0 && !betrayPoint && (P1.isSelected || P2.isSelected)) ||
        (changingScore > 0 && betrayPoint && (P3.isSelected || P4.isSelected)) ||
        (changingScore < 0 && !betrayPoint && (P3.isSelected || P4.isSelected)) ||
        (changingScore < 0 && betrayPoint && (P1.isSelected || P2.isSelected))))
      this.props.setScore1(score1 + changingScore);
    else if ((changingScore > 0 && !betrayPoint && (P3.isSelected || P4.isSelected)) ||
      (changingScore > 0 && betrayPoint && (P1.isSelected || P2.isSelected)) ||
      (changingScore < 0 && !betrayPoint && (P1.isSelected || P2.isSelected)) ||
      (changingScore < 0 && betrayPoint && (P3.isSelected || P4.isSelected)))
      this.props.setScore2(score2 + changingScore);


    // console.log('save end');
    // console.log('time : ' + (Date.now() - beginTime));
    // this.props.setHistory(history);
    // this.props.setHistory(history.push({
    //   goalTime: match.minutesElapsed,
    //   deltaScore: this.state.changingScore,
    //   byPlayer: selectedPlayer._id,
    //   placement: selectedPlayer.placement,
    //   fullName: selectedPlayer.fullName,
    //   isBetray: this.state.betrayPoint,
    //   team: (
    //     ((P1.isSelected || P2.isSelected) && !this.state.betrayPoint) ||
    //     ((P3.isSelected || P4.isSelected) && this.state.betrayPoint) ?
    //     'Team1' :
    //     'Team2'
    //   )
    // }));

    // this.props.setMatch({
    //   ...match,
    //   score1: (
    //     ((changingScore > 0 && !betrayPoint && (P1.isSelected || P2.isSelected)) ||
    //       (changingScore > 0 && betrayPoint && (P3.isSelected || P4.isSelected)) ||
    //       (changingScore < 0 && !betrayPoint && (P3.isSelected || P4.isSelected)) ||
    //       (changingScore < 0 && betrayPoint && (P1.isSelected || P2.isSelected))) ?
    //     match.score1 + changingScore :
    //     match.score1
    //   ),
    //   score2: (
    //     ((changingScore > 0 && !betrayPoint && (P3.isSelected || P4.isSelected)) ||
    //       (changingScore > 0 && betrayPoint && (P1.isSelected || P2.isSelected)) ||
    //       (changingScore < 0 && !betrayPoint && (P1.isSelected || P2.isSelected)) ||
    //       (changingScore < 0 && betrayPoint && (P3.isSelected || P4.isSelected))) ?
    //     match.score2 + changingScore :
    //     match.score2
    //   ),
    //   history: [
    //     ...match.history,
    //     {
    //       goalTime: match.minutesElapsed,
    //       deltaScore: this.state.changingScore,
    //       byPlayer: selectedPlayer._id,
    //       placement: selectedPlayer.placement,
    //       fullName: selectedPlayer.fullName,
    //       isBetray: this.state.betrayPoint,
    //       team: (
    //         ((P1.isSelected || P2.isSelected) && !this.state.betrayPoint) ||
    //         ((P3.isSelected || P4.isSelected) && this.state.betrayPoint) ?
    //         'Team1' :
    //         'Team2'
    //       )
    //     }
    //   ]
    // });

    this.resetPointState();
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
      betrayPoint: false
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
    return <Grid className='matchContainer'>
      <Row>
        <Col
          xs={22}
          xsOffset={1}
          className='container'>

          {/* Player and placement selection */}
          <Row>
            <Col xs={22} xsOffset={1}>
              <h2 style={{margin: '0'}}>Buteur</h2>
            </Col>

            <Col
              xs={22}
              xsOffset={1}
              className='playersContainer'>

              <Row gutter={0}>
                <Col
                  xs={10}>

                  <Row gutter={0}>
                    {this.state.P1.name &&
                      <Col
                        xs={12}
                        className={'P1Container ' +
                          (this.state.P1.isSelected ? 'selected ' : '') +
                          (this.state.playersMissing ? 'error ' : '')}
                        onClick={this.onP1Touch}>
                        <MatchPlayer
                          name={this.state.P1.name}
                          image={this.state.P1.image}/>
                      </Col>
                    }


                    {this.state.P2.name &&
                      <Col
                        xs={12}
                        className={'P2Container ' +
                          (this.state.P2.isSelected ? 'selected ' : '') +
                          (this.state.playersMissing ? 'error ' : '')}
                        onClick={this.onP2Touch}>
                        <MatchPlayer
                          name={this.state.P2.name}
                          image={this.state.P2.image}/>
                      </Col>
                    }
                  </Row>
                </Col>

                <Col
                  xs={4}
                  className='playerPlacementContainer'>

                  <div
                    className='swordContainer'
                    onClick={() => this.onPlacementChange('Attack')}>
                    <img
                      src={swordImage}
                      className={'placementImage sword ' + (cmp(placement, 'Attack') ? 'selected' : '')}
                      alt='attack'/>
                  </div>

                  <div
                    className='shieldContainer'
                    onClick={() => this.onPlacementChange('Defense')}>
                  <img
                    src={shieldImage}
                    className={'placementImage shield ' + (cmp(placement, 'Defense') ? 'selected' : '')}
                    alt='defense'/>
                  </div>

                </Col>

                <Col
                  xs={10}>
                  <Row gutter={0}>
                    {this.state.P3.name &&
                      <Col
                        xs={12}
                        className={'P3Container ' +
                          (this.state.P3.isSelected ? 'selected ' : '') +
                          (this.state.playersMissing ? 'error ' : '')}
                        onClick={this.onP3Touch}>
                        <MatchPlayer
                          name={this.state.P3.name}
                          image={this.state.P3.image}/>
                      </Col>
                    }


                    {this.state.P4.name &&
                      <Col
                        xs={12}
                        className={'P4Container ' +
                          (this.state.P4.isSelected ? 'selected ' : '') +
                          (this.state.playersMissing ? 'error ' : '')}
                        onClick={this.onP4Touch}>
                        <MatchPlayer
                          name={this.state.P4.name}
                          image={this.state.P4.image}/>
                      </Col>
                    }
                  </Row>
                </Col>
              </Row>

            </Col>
          </Row>

          <hr/>

          {/* Adding/removing points */}
          <Row className='pointsSelector'>
            <Col xs={22} xsOffset={1}>
              <h2 style={{margin: '0', textAlign: 'initial'}}>Points</h2>
            </Col>

            <Col
              xs={9}>
              <div
                className={'removeButton ' + (this.state.pointMissing ? 'error ' : '')}
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
              <span className='changingScore'>{this.state.changingScore}</span>
            </Col>

            <Col
              xs={9}>
              <div
                className={'addButton ' + (this.state.pointMissing ? 'error ' : '')}
                onClick={this.addPoint}>
                <span className="verticalHelper"></span>
                <img
                  src={plusImage}
                  alt='plus'
                  className='plusImage'/>
              </div>
            </Col>


            <Col
              xs={10} xsOffset={7}>
              <div
                className={'betrayToggle ' + (this.state.betrayPoint ? 'active' : '')}
                onClick={this.onBetrayButtonTouch}>
                {this.state.betrayPoint ?
                  <>
                    <span>BOUH </span>
                    <span role='img' style={{fontSize: '12px'}}>👎</span>
                  </>
                  :
                  <span> Contre son camp</span>
                }
              </div>
            </Col>

          </Row>

          {/* Add score button */}
          <Row className='addButtonContainer'>
            <Col xs={22} xsOffset={1}>
              <Button
                className='roundButton blue addButton'
                block
                size='lg'
                onClick={this.onAddButtonTouch}>
                Ajouter
              </Button>
            </Col>
          </Row>

        </Col>
      </Row>

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
                recordTime/>
            </Col>
          </Row>

          <Row>
            <Col
              xs={22}
              xsOffset={1}>
              <Button
                size='lg'
                block
                className='roundButton green matchValidation'>
                Valider
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Grid>;
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Match));