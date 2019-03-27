import React, { Component } from 'react';
import './Lobby.scss';
import { withRouter, Link } from "react-router-dom";
import Player from '../Player/Player';
import { connect } from 'react-redux';
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
      playersArray: [{
        name: 'Florent Dupont',
        score: 28
      }, {
        name: 'Claire Lescure',
        score: 203
      }, {
        name: 'Rémi Forsan',
        score: 182
      }, {
        name: 'Jérémy Dos Santos',
        score: 382
      }, {
        name: 'Florent Dupont',
        score: 28
      }, {
        name: 'Claire Lescure',
        score: 203
      }, {
        name: 'Rémi Forsan',
        score: 182
      }, {
        name: 'Jérémy Dos Santos',
        score: 382
      }, {
        name: 'Florent Dupont',
        score: 28
      }, {
        name: 'Claire Lescure',
        score: 203
      }, {
        name: 'Rémi Forsan',
        score: 182
      }, {
        name: 'Jérémy Dos Santos',
        score: 382
      }]
    }
  }

  render() {
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

                <Row>
                  <Grid>
                    <Row>
                      {this.state.playersArray.map((player) =>
                        <Col xs={6}>
                          <Player
                            name={player.name}
                            score={player.score}/>
                        </Col>
                      )}
                    </Row>
                  </Grid>
                </Row>

                <Row>
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
              </Grid>
          </Col>
        </Row>

        <Row>
          <Col
            xs={24}
            className=''>


          </Col>
        </Row>

        <Row>
          <Col xs={22} xsOffset={1}>
            <h1>Create a match</h1>
            <span>{this.props.match.params.tableTag}</span>
            <Link to='/match/test'>hey</Link>
          </Col>
        </Row>
      </Grid>

    </div>;
  }
}
export default withRouter(connect(null, null)(Lobby));