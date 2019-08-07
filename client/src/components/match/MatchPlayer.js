import React, { Component } from 'react';
import './MatchPlayer.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import swordImage from '../../res/images/sword.png';
import shieldImage from '../../res/images/shield.png';
import {
  setPlayerCursor,
  setP1,
  setP2,
  setP3,
  setP4
} from '../../redux/actions/index.actions.js'
import { p } from '../../utils';

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
    playerCursor: state.playerCursor,
    P1: state.P1,
    P2: state.P2,
    P3: state.P3,
    P4: state.P4
  };
};

class MatchPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      firstName: props.firstName,
      score: props.score,
      data: props.data,
      image: props.image,
      placement: props.placement || ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps._id !== this.props._id || nextProps.placement !== this.props.placement)
      this.setState({
        ...nextProps
      });
  }

  render() { { /* If player not added, don't render anything */ }
    if (!this.state.name)
      return null;

    const teamColor =
      (this.props.P1._id === this.state._id || this.props.P2._id === this.state._id) ?
      'blueTeam ' :
      (this.props.P3._id === this.state._id || this.props.P4._id === this.state._id) ?
      'orangeTeam ' :
      '';


    return <div
        className={'matchPlayerContainer ' + teamColor}>
        <img
          src= {
            !this.state.image ?
            require('../../res/images/profile.png') :
            this.state.image
          }
          className='avatarImage'
          alt='Avatar'/>

        {this.state.placement &&
          <div className='placementBadgeContainer'>
          {this.state.placement === p.ATTACK ?

              <img
                src={swordImage}
                className='swordBadge'
                alt='atk'/> :
              <img
                src={shieldImage}
                className='shieldBadge'
                alt='atk'/>}

            </div>

        }

        <br/>
        <div className='playerName'>
          {this.state.firstName}
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MatchPlayer));