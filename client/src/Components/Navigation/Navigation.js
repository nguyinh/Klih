import React, { Component } from 'react';
import './Navigation.scss';
import {
  Button,
  Grid,
  Row,
  Col,
  Nav,
  Panel
} from 'rsuite';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { setNavigationState, setUserAuth, setAvatar, setUser } from './../../redux/actions/index.actions.js'
require('dotenv').config()

const mapDispatchToProps = dispatch => {
  return ({
    setNavigationState: (value) => {
      dispatch(setNavigationState(value))
    },
    setUserAuth: (value) => {
      dispatch(setUserAuth(value))
    },
    setAvatar: (value) => {
      dispatch(setAvatar(value))
    },
    setUser: (value) => {
      dispatch(setUser(value))
    }
  })
}

const mapStateToProps = state => {
  return {
    actualPage: state.actualPage,
    avatar: state.avatar,
    currentUser: state.currentUser
  };
};

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStarting: true,
      expanded: undefined,
      image: null,
      playerName: ''
    }

    this.matchPage = this.matchPage.bind(this);
    this.historyPage = this.historyPage.bind(this);
    this.statisticsPage = this.statisticsPage.bind(this);
    this.monitorPage = this.monitorPage.bind(this);
    this.profilePage = this.profilePage.bind(this);
    this.teamPage = this.teamPage.bind(this);
    this.openPanel = this.openPanel.bind(this);
  }


  matchPage() {
    this.props.setNavigationState('Match');
  }

  monitorPage() {
    this.props.setNavigationState('Monitor');
  }

  historyPage() {
    this.props.setNavigationState('History');
  }

  statisticsPage() {
    this.props.setNavigationState('Statistics');
  }

  profilePage() {
    this.props.setNavigationState('Profile');
  }


  teamPage() {
    this.props.setNavigationState('Team');
    // return <Redirect to={'/list'}/>;
  }

  openPanel(e) {
    if (e.target.type === 'button' || (e.target.type !== 'button' && this.state.expanded))
      this.setState({ expanded: false })
    else
      this.setState({ expanded: true })
  }
  // {
  //   this.state.image && <img src={'data:image/png;base64,' + this.state.image.data} className='avatarImage' alt='Avatar'></img>
  // }
  render() {
    const header = <Grid justify="space-between">
      <Row>
        <Col xs={6}>
          <div className='title'>
            <h1>Klih</h1>
          </div>
        </Col>
        <Col xs={16}>
          <div className='playerInfo'>
            <span>
              {
                this.props.currentUser.fullName ?
                  this.props.currentUser.fullName :
                  'Se connecter'
              }
            </span>
            { this.props.currentUser.avatar ?
              <img
                src={this.props.currentUser.avatar}
                className='avatarImage'
                alt='User avatar'/> :
              <img
                src={require('./../../profile.png')}
                className='avatarImage'
                alt='Avatar'></img>
            }
          </div>
        </Col>
      </Row>
    </Grid>

    return <div>
      <Panel header={header} collapsible="collapsible" className='navigationBar' expanded={this.state.expanded} onClick={this.openPanel}>
        <Nav vertical="vertical" appearance="subtle" className='mainNavbar'>

          <Nav.Item eventKey="match" active={this.props.actualPage === 'Match'} onClick={this.matchPage} componentClass='div'>
            <Link to={'/lobby'}>
              <Button block="block" appearance="subtle">Match</Button>
            </Link>
          </Nav.Item>

          <Nav.Item eventKey="statistics" active={this.props.actualPage === 'Statistics'} onClick={this.statisticsPage} componentClass='div'>
            <Link to={'/statistics'}>
              <Button block="block" appearance="subtle">Statistiques</Button>
            </Link>
          </Nav.Item>

          <Nav.Item eventKey="history" active={this.props.actualPage === 'History'} onClick={this.historyPage} componentClass='div'>
            <Link to={'/history'}>
              <Button block="block" appearance="subtle">Historique</Button>
            </Link>
          </Nav.Item>

          <Nav.Item eventKey="monitor" active={this.props.actualPage === 'Monitor'} onClick={this.monitorPage} componentClass='div'>
            <Link to={'/monitor'}>
              <Button block="block" appearance="subtle">Trouver un babyfoot</Button>
            </Link>
          </Nav.Item>

          <Nav.Item eventKey="profile" active={this.props.actualPage === 'Profile'} onClick={this.profilePage} componentClass='div'>
            <Link to={'/profile'}>
              <Button block="block" appearance="subtle">Profil</Button>
            </Link>
          </Nav.Item>

        </Nav>
      </Panel>
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);