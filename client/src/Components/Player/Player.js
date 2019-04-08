import React, { Component } from 'react';
import './Player.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      score: props.score,
      image: props.image,
      selected: props.selected || false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props)
      this.setState({
        ...nextProps
      });
  }

  render() {
    return <div className='playerHolder'>
      <img
        src= {
          !this.state.image ?
          require('./../../profile.png') :
          this.state.image
        }
        className={'avatarImage ' + (!this.state.selected || 'selectAnimation')}
        alt='Avatar'/>
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