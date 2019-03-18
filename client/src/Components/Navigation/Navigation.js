import React, {Component} from 'react';
import './Navigation.scss';
import {
  Button,
  Grid,
  Row,
  Col,
  Nav,
  Panel
} from 'rsuite';
import {Link, Redirect} from "react-router-dom";
import {connect} from 'react-redux';
import {setNavigationState} from './../../redux/actions/index.actions.js'

const mapDispatchToProps = dispatch => {
  return ({
    setNavigationState: (value) => {
      dispatch(setNavigationState(value))
    }
  })
}

const mapStateToProps = state => {
  return {actualPage: state.actualPage};
};

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: undefined
    }

    this.matchPage = this.matchPage.bind(this);
    this.profilePage = this.profilePage.bind(this);
    this.teamPage = this.teamPage.bind(this);
    this.openPanel = this.openPanel.bind(this);
  }

  matchPage() {
    this.props.setNavigationState('Match');
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
      this.setState({expanded: false})
    else 
      this.setState({expanded: true})
  }

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
            <span>Alias
            </span>
            <img src={require('./../../image.jpg')} className='avatarImage' alt='Avatar'></img>
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

          <Nav.Item eventKey="statistics" active={this.props.actualPage === 'Statistics'} onClick={this.listPage}>
            <Link to={'/'}>
              <Button block="block" appearance="subtle">Statistiques</Button>
            </Link>
          </Nav.Item>

          <Nav.Item eventKey="solutions">
            <Link to={'/'}>
              <Button block="block" appearance="subtle" onClick={this.teamPage}>Historique</Button>
            </Link>
          </Nav.Item>

          <Nav.Item eventKey="profile" active={this.props.actualPage === 'Profile'}>
            <Link to={'/profile'}>
              <Button block="block" appearance="subtle" onClick={this.profilePage}>Profil</Button>
            </Link>
          </Nav.Item>

          <Nav.Item eventKey="about">
            <Link to={'/'}>
              <Button block="block" appearance="subtle">Hello world</Button>
            </Link>
          </Nav.Item>
        </Nav>
      </Panel>
    </div>
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
