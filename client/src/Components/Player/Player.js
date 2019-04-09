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
      // image: props.image,
      selected: false,
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
    if (nextProps !== this.props)
      this.setState({
        ...nextProps
      });
  }

  onPlayerClick = (e) => {
    console.log(this.state.name);
    this.setState({
      selected: true
    });
  }

  render() {
    return <div
      className={'playerContainer ' + (!this.state.selected || 'colorTest')}
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
export default withRouter(connect(null, null)(Player));