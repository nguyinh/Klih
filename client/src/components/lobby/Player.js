import React, { Component } from 'react';
import './Player.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
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

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      firstName: props.firstName,
      lastName: props.lastName,
      score: props.score,
      data: props.data,
      image: undefined,
      _id: props._id
    };
  }

  componentDidMount() {
    let base64Flag = 'data:image/jpeg;base64,';
    let imageStr = this.state.data.avatar.data;
    this.setState({
      image: base64Flag + imageStr
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data)
      this.setState({
        ...nextProps
      });
  }

  onPlayerClick = () => {
    // Check if player already choosen
    if (this.state._id === this.props.P1._id ||
      this.state._id === this.props.P2._id ||
      this.state._id === this.props.P3._id ||
      this.state._id === this.props.P4._id)
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
        this.props.setP1({
          ...this.state
        });
        break;
    }
  }

  render() {

    const teamColor =
      (this.props.P1._id === this.state._id || this.props.P2._id === this.state._id) ?
      'blueTeam ' :
      (this.props.P3._id === this.state._id || this.props.P4._id === this.state._id) ?
      'orangeTeam ' :
      '';

    return <div
      className={'playerContainer ' + (teamColor ? teamColor : (this.props.playerCursor ? 'highlight ' : ''))}
      onClick={this.onPlayerClick}>
      <img
        src= {
          !this.state.image ?
          require('../../res/images/profile.png') :
          this.state.image
        }
        className='avatarImage'
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Player));