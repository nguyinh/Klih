import React, {Component} from 'react';
import './Signin.scss';
import {withRouter, Link} from "react-router-dom";
import {connect} from 'react-redux';
import {setUserAuth} from '../../redux/actions/index.actions.js'

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <div>Signin
    </div>
  }
}
export default withRouter(connect(null, null)(Signin));
