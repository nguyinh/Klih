import React, { Component } from 'react';
import './Player.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      score: props.score
    }
  }

  render() {
    return <div className='playerHolder'>
      <img src={require('./../../profile.png')} className='avatarImage' alt='Avatar'></img>
      <br/>
      <div className='playerName'>
        {this.state.name}
      </div>

      {
        this.state.score &&
        <div className='playerScore'>
          {this.state.score} 🏆
        </div>
      }
    </div>
  }
}
export default withRouter(connect(null, null)(Player));