import React, { Component } from 'react';
import './MatchPlayer.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import swordImage from '../../sword.png';
import shieldImage from '../../shield.png';
import {
  setPlayerCursor,
  setP1,
  setP2,
  setP3,
  setP4
} from '../../redux/actions/index.actions.js'

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

const cmp = (o1, o2) => JSON.stringify(o1) === JSON.stringify(o2);

class MatchPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      score: props.score,
      data: props.data,
      image: props.image,
      placement: props.placement || ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data || nextProps.placement !== this.props.placement)
      this.setState({
        ...nextProps
      });
  }

  onPlayerClick = () => {
    // Check if player already choosen
    if (cmp(this.state, this.props.P1) ||
      cmp(this.state, this.props.P2) ||
      cmp(this.state, this.props.P3) ||
      cmp(this.state, this.props.P4))
      return;

    switch (this.props.playerCursor) {
      case 'P1':
        this.props.setP1({
          ...this.state
        });
        break;
      case 'P2':
        this.props.setP2({
          ...this.state
        });
        break;
      case 'P3':
        this.props.setP3({
          ...this.state
        });
        break;
      case 'P4':
        this.props.setP4({
          ...this.state
        });
        break;
      default:
        break;
    }
  }

  render() { { /* If player not added, don't render anything */ }
    if (!this.state.name)
      return null;

    const isSelected = false;
    const teamColor =
      (cmp(this.props.P1, this.state) || cmp(this.props.P2, this.state)) ?
      'blueTeam ' :
      (cmp(this.props.P3, this.state) || cmp(this.props.P4, this.state)) ?
      'orangeTeam ' :
      '';


    return <div
      className={'matchPlayerContainer ' + teamColor}>
      <img
        src= {
          !this.state.image ?
          require('./../../profile.png') :
          this.state.image
        }
        className='avatarImage'
        alt='Avatar'/>

      {this.state.placement &&
        <div className='placementBadgeContainer'>
        {this.state.placement === 'Attack' ?

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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MatchPlayer));