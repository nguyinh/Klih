import React, { Component } from 'react';
import './Welcome.scss';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <div className='welcome-container'>
      <h1 className='app-title'>Klih</h1>

        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
    </div>
  }
}
export default Welcome;