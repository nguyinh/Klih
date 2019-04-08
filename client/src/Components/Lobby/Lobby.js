import React, { Component } from 'react';
import './Lobby.scss';
import { withRouter, Link } from "react-router-dom";
import Player from '../Player/Player';
import TeamContainer from '../TeamContainer/TeamContainer';
import { connect } from 'react-redux';
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
      selectedPlayer: '',
      selectedP1: noPlayer,
      selectedP2: noPlayer,
      selectedP3: noPlayer,
      selectedP4: noPlayer,
    }

    this.player1Click = this.player1Click.bind(this);
    this.player2Click = this.player2Click.bind(this);
  }

  async componentDidMount() {
    const players = await axios('/api/team/getAllPlayers', {});
    this.setState({ playersData: players.data });
  }

  player1Click = () => {
    this.setState({
      selectedP1: (
        this.state.selectedPlayer === 'P1' ?
        noPlayer :
        this.state.selectedP1
      ),
      selectedPlayer: 'P1'
    });
  }

  player2Click = () => {
    this.setState({
      selectedP2: (
        this.state.selectedPlayer === 'P2' ?
        noPlayer :
        this.state.selectedP2
      ),
      selectedPlayer: 'P2'
    });
  }

  player3Click = () => {
    this.setState({
      selectedP3: (
        this.state.selectedPlayer === 'P3' ?
        noPlayer :
        this.state.selectedP3
      ),
      selectedPlayer: 'P3'
    });
  }

  player4Click = () => {
    this.setState({
      selectedP4: (
        this.state.selectedPlayer === 'P4' ?
        noPlayer :
        this.state.selectedP4
      ),
      selectedPlayer: 'P4'
    });
  }

  render() {
    let { playersData, selectedPlayer, selectedP1, selectedP2, selectedP3, selectedP4 } = this.state;
    let fetchedPlayers = [];
    for (let team in playersData) {
      fetchedPlayers.push(
        <TeamContainer
          name={team}
          players={playersData[team]}/>)
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
                          <Player
                            name={selectedP1.name}
                            image={selectedP1.image}
                            score={selectedP1.score}
                            selected={selectedPlayer === 'P1'}/>
                        </Col>
                        <Col xs={12} onClick={this.player2Click}>
                          <Player
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
                          <Player
                            name={selectedP3.name}
                            image={selectedP3.image}
                            score={selectedP3.score}
                            selected={selectedPlayer === 'P3'}/>
                        </Col>
                        <Col xs={12} onClick={this.player4Click}>
                          <Player
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
                    <Row>
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
export default withRouter(connect(null, null)(Lobby));