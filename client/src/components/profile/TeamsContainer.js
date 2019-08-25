import React from 'react';
import './TeamsContainer.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Row,
  Col
} from 'rsuite';
import { PlayerAvatar, TeamAvatar } from '../common';

const Team = ({name, players, teamTag, createdAt, isUploading, isAdmin, _id, avatar, teamImageUpload}) => {
  let uploaderRef = React.createRef();

  return <Col xs={12}>
    <div className='team-content'>
      <Row className='team-header-container'>
        <Col xs={8}>
          
        </Col>

        <Col xs={8} onClick={() => {isAdmin && uploaderRef.current.click()}}> 
          <TeamAvatar image={avatar} edit={isAdmin} loading={isUploading}/>
          { 
            isAdmin &&
            <input
              type="file"
              name="teamAvatar"
              accept="image/*"
              onChange={(evt) => {teamImageUpload(evt, _id)}}
              style={{display: 'none'}}
              ref={uploaderRef}/>
          }
        </Col>

        <Col xs={8} className='team-id-container'>
          <span className='team-id-label'>{name}</span>
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

const TeamsContainer = ({teams, createTeam, teamImageUpload}) => {
  return <>
  {
    teams.map((t, i) =>
      <Team 
        {...t} 
        key={`team-${i}`} 
        teamImageUpload={teamImageUpload}
        isAdmin={t.players.some(p => p.actualPlayer && p.isAdmin)}
      />
    )
  }

  <Col xs={12}>
    <div className='team-content add' onClick={createTeam}>
      <Row className='team-header-container'>
        <Col xsOffset={8} xs={8}>
          <TeamAvatar adding/>
        </Col>
      </Row>
    </div>
  </Col>
</>;
}

export default withRouter(connect(null, null)(TeamsContainer));