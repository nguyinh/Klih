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
    return <div></div>
  }
}
export default withRouter(connect(null, null)(Monitor));