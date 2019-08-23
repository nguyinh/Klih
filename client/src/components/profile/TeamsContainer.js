import React, { Component } from 'react';
import './TeamsContainer.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col
} from 'rsuite';
// import { 
//   Team
// } from '../profile';
import { PlayerAvatar, TeamAvatar } from '../common';
import axios from 'axios';

const Team = ({name, players, teamTag, createdAt, _id, avatar}) => {
  console.log(name, players, teamTag, createdAt, _id);
  return <Col xs={12}>
    <div className='team-content'>
      <Row className='team-header-container'>
        <Col xs={8}>
          
        </Col>

        <Col xs={8}>
          <TeamAvatar image={avatar} className='test-test'/>
        </Col>

        <Col xs={8} className='team-id-container'>
          <span className='team-id-label'>TeamId</span>
          <div className='team-id'>{teamTag}</div>
        </Col>
      </Row>

      <Row className='players-container' gutter={7}>
        {players.map((p, i) => {
          return <Col xs={6} className='team-player-avatar' key={`team-player-avatar-${i}`}>
            <PlayerAvatar image={p.avatar}/>
          
          

          </Col>
        })}
      </Row>
    </div>
  </Col>
}

class TeamsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: []
    }
  }

  async componentDidMount() {
    try {
      const {data} = await axios.get('api/team/getTeams');
      console.log(data);
      this.setState({ teams: data });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { teams } = this.state;

    return <>
      {
        teams.map((t, i) => <Team {...t} key={`team-${i}`}/>)
      }
    </>;
  }
}
export default withRouter(connect(null, null)(TeamsContainer));