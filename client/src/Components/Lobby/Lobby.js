import React, { Component } from 'react';
import './Lobby.scss';
import { withRouter, Link, Redirect } from "react-router-dom";
import PlayerChoose from '../PlayerChoose/PlayerChoose';
import TeamContainer from '../TeamContainer/TeamContainer';
import { connect } from 'react-redux';
import {
  setPlayerCursor,
  setP1,
  setP2,
  setP3,
  setP4,
  setCurrentMatchId
} from '../../redux/actions/index.actions.js'
import axios from 'axios';
import plusImage from './../../plus.png';
import {
  Button,
  Grid,
  Row,
  Col,
  Input,
  InputGroup,
  Icon,
  Alert
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
    },
    setCurrentMatchId: (value) => {
      dispatch(setCurrentMatchId(value))
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
    P4: state.P4,
    currentUser: state.currentUser,
    currentMatchId: state.currentMatchId,
    noPlayer: state.noPlayer
  };
};

const cmp = (o1, o2) => JSON.stringify(o1) === JSON.stringify(o2);

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
};

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  let bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return window.btoa(binary);
};


class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playersData: undefined,
      selectedPlayer: '',
      isMatchReady: false,
      beginMatch: false,
      matchId: ''
    }
  }

  async componentDidMount() {
    try {
      const response = await axios.get('/api/playingMatch', {});
      // TODO: if response, load Lobby state
      if (response.data.player1) {
        const resP1 = await axios.get('/api/players/' + response.data.player1, {});
        this.props.setP1({
          name: resP1.data.firstName + ' ' + resP1.data.lastName,
          firstName: resP1.data.firstName,
          lastName: resP1.data.lastName,
          score: resP1.data.score,
          data: resP1.data,
          image: 'data:image/jpeg;base64,' + arrayBufferToBase64(resP1.data.avatar.data.data),
          _id: resP1.data._id
        });
      }

      if (response.data.player2) {
        const resP2 = await axios.get('/api/players/' + response.data.player2, {});
        this.props.setP2({
          name: resP2.data.firstName + ' ' + resP2.data.lastName,
          firstName: resP2.data.firstName,
          lastName: resP2.data.lastName,
          score: resP2.data.score,
          data: resP2.data,
          image: 'data:image/jpeg;base64,' + arrayBufferToBase64(resP2.data.avatar.data.data),
          _id: resP2.data._id
        });
      }

      if (response.data.player3) {
        const resP3 = await axios.get('/api/players/' + response.data.player3, {});
        this.props.setP3({
          name: resP3.data.firstName + ' ' + resP3.data.lastName,
          firstName: resP3.data.firstName,
          lastName: resP3.data.lastName,
          score: resP3.data.score,
          data: resP3.data,
          image: 'data:image/jpeg;base64,' + arrayBufferToBase64(resP3.data.avatar.data.data),
          _id: resP3.data._id
        });
      }

      if (response.data.player4) {
        const resP4 = await axios.get('/api/players/' + response.data.player4, {});
        this.props.setP4({
          name: resP4.data.firstName + ' ' + resP4.data.lastName,
          firstName: resP4.data.firstName,
          lastName: resP4.data.lastName,
          score: resP4.data.score,
          data: resP4.data,
          image: 'data:image/jpeg;base64,' + arrayBufferToBase64(resP4.data.avatar.data.data),
          _id: resP4.data._id
        });
      }

      this.props.setCurrentMatchId(response.data._id);
    } catch (err) {
      // console.log(err);

      // If match not found, fetch for players
      try {
        const players = await axios('/api/team/getAllPlayers', {});
        this.setState({ playersData: players.data });
      } catch (err) {
        console.log(err);
      }
    }
  }

  componentWillUnmount() {
    // socket.off('isMatchPlaying');
    // socket.off('goalEvent');
  }

  // DEBUG
  async componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser._id && !this.props.currentUser._id) {
      const players = await axios('/api/team/getAllPlayers', {});
      this.setState({ playersData: players.data });
    }
  }
  // DEBUG END

  player1Click = () => {
    // If cursor already on P1
    if (this.props.playerCursor === 'P1') {
      this.props.setP1(this.props.noPlayer);
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
      this.props.setP2(this.props.noPlayer);
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
      this.props.setP3(this.props.noPlayer);
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
      this.props.setP4(this.props.noPlayer);
    } else {
      this.setState({
        selectedPlayer: 'P4'
      });

      this.props.setPlayerCursor('P4');
    }
  }

  onRandomButtonTouch = async () => {
    // socket.emit('goalEvent', this.state.matchId);
    // console.log(await axios.post('/api/playingMatch', {}));
  }

  beginMatch = async () => {
    // TODO: transition logic between lobby and match HERE

    try {
      const response = await axios.post('/api/playingMatch', {
        player1: this.props.P1._id || '',
        player2: this.props.P2._id || '',
        player3: this.props.P3._id || '',
        player4: this.props.P4._id || '',
        publisher: this.props.currentUser._id
        // table: TODO
      });

      this.props.setCurrentMatchId(response.data._id);

      this.setState({
        beginMatch: true
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 409)
        Alert.error('Un joueur ou plus sont déjà dans un match',
          3000);
    }
  }

  render() {
    let { playersData } = this.state;
    let selectedP1 = this.props.P1;
    let selectedP2 = this.props.P2;
    let selectedP3 = this.props.P3;
    let selectedP4 = this.props.P4;
    let selectedPlayer = this.props.playerCursor;

    const isMatchReady = (selectedP1.name || selectedP2.name) && (selectedP3.name || selectedP4.name);

    let fetchedPlayers = [];
    let i = 0;
    for (let team in playersData) {
      fetchedPlayers.push(
        <TeamContainer
          name={team}
          players={playersData[team]}
          key={i++}/>)
    }

    if (this.state.beginMatch || this.props.currentMatchId) {
      return <Redirect push to="/match" />;
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
                        <Col
                          xs={12}
                          onClick={this.player1Click}>
                          <PlayerChoose
                            name={selectedP1.name}
                            image={selectedP1.image}
                            score={selectedP1.score}
                            selected={selectedPlayer === 'P1'}/>
                        </Col>
                        <Col
                          xs={12}
                          onClick={this.player2Click}>
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
                        <Col
                          xs={12}
                          onClick={this.player3Click}>
                          <PlayerChoose
                            name={selectedP3.name}
                            image={selectedP3.image}
                            score={selectedP3.score}
                            selected={selectedPlayer === 'P3'}/>
                        </Col>
                        <Col
                          xs={12}
                          onClick={this.player4Click}>
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
                        <Button
                          block
                          size='lg'
                          className='roundButton violet'
                          onClick={this.onRandomButtonTouch}>
                          <Icon icon='random'/> Aléatoire
                        </Button>
                      </Col>
                      <Col xs={12}>

                          <Button
                            block
                            size='lg'
                            className={'roundButton green beginMatchButton ' + (isMatchReady ? 'ready ' : '')}
                            disabled={!isMatchReady}
                            onClick={this.beginMatch}>
                            Commencer ⚽️
                          </Button>

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
        </Row>
      </Grid>

    </div>;
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lobby));