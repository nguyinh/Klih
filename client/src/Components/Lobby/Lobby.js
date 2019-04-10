import React, { Component } from 'react';
import './Lobby.scss';
import { withRouter, Link } from "react-router-dom";
import Player from '../Player/Player';
import PlayerChoose from '../PlayerChoose/PlayerChoose';
import TeamContainer from '../TeamContainer/TeamContainer';
import { connect } from 'react-redux';
import {
  setPlayerCursor,
  setP1,
  setP2,
  setP3,
  setP4
} from '../../redux/actions/index.actions.js'
import axios from 'axios';
import plusImage from './../../plus.png';
import {
  Button,
  Grid,
  Row,
  Col,
  Message,
  Input,
  InputGroup,
  Icon
} from 'rsuite';

const mapDispatchToProps = dispatch => {
  return ({
    setPlayerCursor: (value) => {
      dispatch(setPlayerCursor(value))
    },
    setP1: (value) => {
      dispatch(setP1(value))
    },
    setP2: (value) => {
      dispatch(setP2(value))
    },
    setP3: (value) => {
      dispatch(setP3(value))
    },
    setP4: (value) => {
      dispatch(setP4(value))
    }
  })
}

const mapStateToProps = state => {
  return {
    isConnected: state.isConnected,
    playerCursor: state.playerCursor,
    P1: state.P1,
    P2: state.P2,
    P3: state.P3,
    P4: state.P4
  };
};

const noPlayer = {
  name: '',
  image: plusImage,
  score: undefined
};

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playersData: undefined,
      selectedPlayer: ''
    }
  }

  async componentDidMount() {
    const players = await axios('/api/team/getAllPlayers', {});
    this.setState({ playersData: players.data });
  }

  // DEBUG
  async componentWillReceiveProps(nextProps) {
    if (nextProps.isConnected && !this.props.isConnected) {
      const players = await axios('/api/team/getAllPlayers', {});
      this.setState({ playersData: players.data });
    }
  }
  // DEBUG END

  player1Click = () => {
    // If cursor already on P1
    if (this.props.playerCursor === 'P1') {
      this.props.setP1(noPlayer);
    } else {
      this.setState({
        selectedPlayer: 'P1'
      });

      this.props.setPlayerCursor('P1');
    }
  }

  player2Click = () => {
    // If cursor already on P2
    if (this.props.playerCursor === 'P2') {
      this.props.setP2(noPlayer);
    } else {
      this.setState({
        selectedPlayer: 'P2'
      });

      this.props.setPlayerCursor('P2');
    }
  }

  player3Click = () => {
    // If cursor already on P3
    if (this.props.playerCursor === 'P3') {
      this.props.setP3(noPlayer);
    } else {
      this.setState({
        selectedPlayer: 'P3'
      });

      this.props.setPlayerCursor('P3');
    }
  }

  player4Click = () => {
    // If cursor already on P4
    if (this.props.playerCursor === 'P4') {
      this.props.setP4(noPlayer);
    } else {
      this.setState({
        selectedPlayer: 'P4'
      });

      this.props.setPlayerCursor('P4');
    }
  }

  isPlayerTaken = (player) => {


    return;
  }

  onPlayerSelect = (e) => {
    // console.log(e.target);
  }

  render() {
    let { playersData } = this.state;
    let selectedP1 = this.props.P1;
    let selectedP2 = this.props.P2;
    let selectedP3 = this.props.P3;
    let selectedP4 = this.props.P4;
    let selectedPlayer = this.props.playerCursor;

    let fetchedPlayers = [];
    let i = 0;
    for (let team in playersData) {
      fetchedPlayers.push(
        <TeamContainer
          name={team}
          players={playersData[team]}
          key={i++}/>)
    }

    return <div>
      <Grid>
        <Row>
          <Col
            xs={22}
            xsOffset={1}
            className='container'>

            <Grid>
              <Row>
                <Col
                  xs={9}
                  xsOffset={0}>
                  <span>Un <strong>KlihTag</strong> à disposition ?</span>
                </Col>

                <Col
                  xs={15}
                  xsOffset={0}
                  className='tableTagSearch'>
                    <InputGroup>
                      <InputGroup.Addon>KlihTag-</InputGroup.Addon>
                      <Input placeholder='XXXXXX' size='lg'/>
                      <InputGroup.Button color='blue'>
                        <Icon icon="search"/>
                      </InputGroup.Button>
                    </InputGroup>
                </Col>
              </Row>
            </Grid>

          </Col>
        </Row>

        <Row>
          <Col
            xs={22}
            xsOffset={1}
            className='container'>

              <Grid>
                <Row className='playersPlaceholder'>
                  <div className='versusSeparator'>
                    <hr/>
                  </div>

                  <Col xs={12}>

                    <Grid>
                      <Row>
                        <Col xs={12} onClick={this.player1Click}>
                          <PlayerChoose
                            name={selectedP1.name}
                            image={selectedP1.image}
                            score={selectedP1.score}
                            selected={selectedPlayer === 'P1'}/>
                        </Col>
                        <Col xs={12} onClick={this.player2Click}>
                          <PlayerChoose
                            name={selectedP2.name}
                            image={selectedP2.image}
                            score={selectedP2.score}
                            selected={selectedPlayer === 'P2'}/>
                        </Col>
                      </Row>
                    </Grid>

                  </Col>

                  <Col xs={12}>

                    <Grid>
                      <Row>
                        <Col xs={12} onClick={this.player3Click}>
                          <PlayerChoose
                            name={selectedP3.name}
                            image={selectedP3.image}
                            score={selectedP3.score}
                            selected={selectedPlayer === 'P3'}/>
                        </Col>
                        <Col xs={12} onClick={this.player4Click}>
                          <PlayerChoose
                            name={selectedP4.name}
                            image={selectedP4.image}
                            score={selectedP4.score}
                            selected={selectedPlayer === 'P4'}/>
                        </Col>
                      </Row>
                    </Grid>

                  </Col>
                </Row>

                <Row className='buttonsContainer'>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <Button block color='yellow' size='lg'><Icon icon='random'/> Aléatoire</Button>
                      </Col>
                      <Col xs={12}>
                        <Button block color='green' size='lg'>Commencer ⚽️</Button>
                      </Col>
                    </Row>
                  </Grid>
                </Row>

                <Row>
                  <Grid>
                    <Row onClick={this.onPlayerSelect}>
                      {fetchedPlayers}
                    </Row>
                  </Grid>
                </Row>


              </Grid>
          </Col>
          <Link to='/match/test'>hey</Link>
        </Row>
      </Grid>

    </div>;
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lobby));