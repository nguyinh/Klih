import React, { Component } from 'react';
import './History.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <div></div>
  }
}
export default withRouter(connect(null, null)(History));