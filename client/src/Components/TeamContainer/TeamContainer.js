import React, { Component } from 'react';
import './TeamContainer.scss';
import Player from '../Player/Player';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
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

  render() {
    return <Grid className='teamContainer'>
      <hr/>
      <Row>
        <Col xs={24}>
          <h1>{this.state.name}</h1>
        </Col>
        {this.state.players.map((player, i) =>
          <Col xs={6} key={i}>
            <Player
              name={player.fullName ? player.fullName : player.firstName + ' ' + player.lastName}
              firstName={player.firstName}
              lastName={player.lastName}
              score={player.score}
              image={player.avatar}
              data={player}
              _id={player._id}/>
          </Col>
        )}

      </Row>
    </Grid>;
  }
}
export default withRouter(connect(null, null)(TeamContainer));