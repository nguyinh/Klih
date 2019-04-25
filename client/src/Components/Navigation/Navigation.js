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
import { setNavigationState, setUserAuth, setAvatar } from './../../redux/actions/index.actions.js'
import axios from 'axios';
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
    }
  })
}

const mapStateToProps = state => {
  return { actualPage: state.actualPage, avatar: state.avatar };
};

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isStarting: true,
      retryCount: 0,
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

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  async componentDidMount() {
    // Fetch user session with token in cookies
    this.tryConnect();
  }

  // DEBUG
  async tryConnect() {
    axios.defaults.withCredentials = true;
    try {
      const res = await axios.post('/api/connect', {})

      this.props.setUserAuth(true);
      this.setState({
        playerName: res.data.fullName
      });

      const avatarResponse = await axios.get('/api/profile/avatar', {});
      var base64Flag = 'data:image/jpeg;base64,';
      var imageStr = this.arrayBufferToBase64(avatarResponse.data.avatar.data.data);
      this.setState({
        image: base64Flag + imageStr
      });
      this.props.setAvatar(base64Flag + imageStr);


    } catch (err) {
      // TODO: handle image error
      this.props.setUserAuth(false);
      // DEBUG: if status==500, then back-end not initialized, retry connect until back-end up
      this.setState({
        playerName: ''
      });
      if (err.response.status === 500) {
        this.tryConnect();
      }
    }
  }
  // DEBUG END

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
              {this.state.playerName ? this.state.playerName : 'Se connecter'}
            </span>
            { this.props.avatar ?
              <img
                src={this.props.avatar}
                className='avatarImage' /> :
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