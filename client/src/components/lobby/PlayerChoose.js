import React, { Component } from 'react';
import './PlayerChoose.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import swordImage from '../../res/images/sword.png';
import shieldImage from '../../res/images/shield.png';
import { p } from '../../utils';

class PlayerChoose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      score: props.score,
      image: props.image,
      selected: props.selected || false,
      placement: props.placement
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({
        ...nextProps
      });
    }
  }

  render() {
    return <div className='playerHolder'>
      <img src={!this.state.image
          ? require('../../res/images/profile.png')
          : this.state.image
        }
        className={'avatarImage ' + (!this.state.selected || 'selectAnimation')}
        alt='Avatar'/>
        <div className='placementBadgeContainer'>

          {this.state.placement === p.ATTACK &&
            <img
              src={swordImage}
              className='swordBadge'
              alt='Attack'/>
          }
          {this.state.placement === p.DEFENCE &&
            <img
              src={shieldImage}
              className='shieldBadge'
              alt='Defence'/>
          }

          </div>
      <br/>
      <div className='playerName'>
        {this.state.name || <div>&nbsp;</div>}
      </div>

      {
        this.state.score && <div className='playerScore'>
            {this.state.score}
            🏆
          </div>
      }
    </div>
  }
}
export default withRouter(connect(null, null)(PlayerChoose));