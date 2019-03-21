import React, {Component} from 'react';
import './Match.scss';
import {withRouter, Link} from "react-router-dom";
import {connect} from 'react-redux';

class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <div>
      <h1>Create a match</h1>
      <span>{this.props.match.params.tableTag}</span>
      <Link to='/match/test'>hey</Link>
    </div>;
  }
}
export default withRouter(connect(null, null)(Match));
