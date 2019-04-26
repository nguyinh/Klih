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
    P4: state.P4,
    playerCursor: state.playerCursor
  };
};

const cmp = (o1, o2) => JSON.stringify(o1) === JSON.stringify(o2);

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      score: props.score,
      data: props.data,
      image: undefined
    }
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  componentDidMount() {
    let base64Flag = 'data:image/jpeg;base64,';
    // let imageStr = this.arrayBufferToBase64(this.state.data.avatar.data);
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

  render() {

    const teamColor =
      (cmp(this.props.P1, this.state) || cmp(this.props.P2, this.state)) ?
      'blueTeam ' :
      (cmp(this.props.P3, this.state) || cmp(this.props.P4, this.state)) ?
      'orangeTeam ' :
      '';

    return <div
      className={'playerContainer ' + (teamColor ? teamColor : (this.props.playerCursor ? 'highlight ' : ''))}
      onClick={this.onPlayerClick}>
      <img
        src= {
          !this.state.image ?
          require('./../../profile.png') :
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