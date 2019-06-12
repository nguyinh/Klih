import React, { Component } from 'react';
import './Welcome.scss';
import { Redirect, withRouter } from 'react-router-dom';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <div className='welcome-container'>
      <h1 className='app-title'>Klih</h1>

      <div className='spinner'>
        <div className='bounce1'></div>
        <div className='bounce2'></div>
        <div className='bounce3'></div>
      </div>

      {
        this.props.isAppLoaded && !this.props.userId && this.props.location.pathname !== '/profile' && <Redirect to={'/profile'}/>
      }
    </div>
  }
}
export default withRouter(Welcome);