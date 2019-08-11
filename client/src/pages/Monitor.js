import React, { Component } from 'react';
import './Monitor.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

class Monitor extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <div className='WIP'>
      <img 
        src='https://netsuiteblogs.curiousrubik.com/hubfs/WIP.png' 
        alt='WIP' 
        className='WIP-image'/>
    </div>
  }
}
export default withRouter(connect(null, null)(Monitor));