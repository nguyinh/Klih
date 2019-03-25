import React, { Component } from 'react';
import './Statistics.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <div></div>
  }
}
export default withRouter(connect(null, null)(Statistics));