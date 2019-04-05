import React, { Component } from 'react';
import './Lobby.scss';
import { withRouter, Link } from "react-router-dom";
import Player from '../Player/Player';
import TeamContainer from '../TeamContainer/TeamContainer';
import { connect } from 'react-redux';
import axios from 'axios';
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

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: undefined
    }
  }

  async componentDidMount() {
    const players = await axios('/api/team/getAllPlayers', {});
    this.setState({ players: players.data });
  }

  render() {
    let fetchedPlayers = [];
    for (let team in this.state.players)
      fetchedPlayers.push(
        <TeamContainer
          name={team}
          players={this.state.players[team]}/>)

    return <div>
      <Grid className='test'>
        <Row>
          <Col
            xs={22}
            xsOffset={1}
            className='container'>

            <Grid>
              <Row>
                <Col
                  xs={9}
                  xsOffset={0}
                  className=''>
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
                        <Col xs={12}>
                          <Player name='Joueur'/>
                        </Col>
                        <Col xs={12}>
                          <Player name='Joueur'/>
                        </Col>
                      </Row>
                    </Grid>

                  </Col>

                  <Col xs={12}>

                    <Grid>
                      <Row>
                        <Col xs={12}>
                          <Player name='Joueur'/>
                        </Col>
                        <Col xs={12}>
                          <Player name='Joueur'/>
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