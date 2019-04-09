import React, { Component } from 'react';
import './TeamContainer.scss';
import Player from '../Player/Player';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col
} from 'rsuite';

class TeamContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      players: props.players
    };
  }

  onPlayerClick = (content) => {
    console.log(content);
  }

  render() {
    return <Grid className='teamContainer'>
      <hr/>
      <Row>
        <Col xs={24}>
          <h1>{this.state.name}</h1>
        </Col>
        {this.state.players.map((player) =>
          <Col xs={6}>
            <Player
              name={player.fullName ? player.fullName : player.firstName + ' ' + player.lastName}
              score={player.score}
              image={player.avatar}
              data={player}/>
          </Col>
        )}

      </Row>
    </Grid>;
  }
}
export default withRouter(connect(null, null)(TeamContainer));