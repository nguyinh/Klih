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
import { Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { setNavigationState, setUserAuth, setAvatar, setAppState } from './../../redux/actions/index.actions.js'
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
      intervalId: null,
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
    axios.defaults.withCredentials = true;
    await axios.post('/api/connect', {}).then(async (res) => {
      this.props.setUserAuth(true);
      this.setState({
        playerName: res.data.fullName
      });

      try {
        const avatarResponse = await axios.get('/api/profile/avatar', {});
        var base64Flag = 'data:image/jpeg;base64,';
        var imageStr = this.arrayBufferToBase64(avatarResponse.data.avatar.data.data);
        this.setState({
          image: base64Flag + imageStr
        });
        this.props.setAvatar(base64Flag + imageStr);
      } catch (err) {
        console.log(err);
      }

      this.setState({ isStarting: false })
    }).catch((err) => {
      console.error(err.response);
      this.props.setUserAuth(false);
    });

    if (this.state.isStarting && process.env.NODE_ENV === 'development') {
      var intervalId = setInterval(this.timer.bind(this), 500);
      this.setState({ intervalId: intervalId });
    }
  }

  // DEBUG
  timer() {
    if (this.state.isStarting) {
      // Fetch user session with token in cookies
      axios.defaults.withCredentials = true;
      axios.post('/api/connect', {}).then(async (res) => {
        this.props.setUserAuth(true);
        this.setState({
          playerName: res.data.fullName
        });

        try {
          const avatarResponse = await axios.get('/api/profile/avatar', {});
          var base64Flag = 'data:image/jpeg;base64,';
          var imageStr = this.arrayBufferToBase64(avatarResponse.data.avatar.data.data);
          this.setState({
            image: base64Flag + imageStr
          });
          this.props.setAvatar(base64Flag + imageStr);
        } catch (err) {
          console.log(err);
        }

        this.setState({ isStarting: false });
      }).catch((err) => {
        console.error(err.response);
        this.props.setUserAuth(false);
      });
    } else {
      clearInterval(this.state.intervalId);
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
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

          <Nav.Item eventKey="match" active={this.props.actualPage === 'Match'} onClick={this.matchPage}>
            <Link to={'/match'}>
              <Button block="block" appearance="subtle">Match</Button>
            </Link>
          </Nav.Item>

          <Nav.Item eventKey="statistics" active={this.props.actualPage === 'Statistics'} onClick={this.statisticsPage}>
            <Link to={'/statistics'}>
              <Button block="block" appearance="subtle">Statistiques</Button>
            </Link>
          </Nav.Item>

          <Nav.Item eventKey="history" active={this.props.actualPage === 'History'} onClick={this.historyPage}>
            <Link to={'/history'}>
              <Button block="block" appearance="subtle">Historique</Button>
            </Link>
          </Nav.Item>

          <Nav.Item eventKey="monitor" active={this.props.actualPage === 'Monitor'} onClick={this.monitorPage}>
            <Link to={'/monitor'}>
              <Button block="block" appearance="subtle">Trouver un babyfoot</Button>
            </Link>
          </Nav.Item>

          <Nav.Item eventKey="profile" active={this.props.actualPage === 'Profile'} onClick={this.profilePage}>
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