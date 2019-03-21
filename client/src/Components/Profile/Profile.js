import React, { Component } from 'react';
import './Profile.scss';
import Auth from '../Auth/Auth';
import { withRouter, Link } from "react-router-dom";
import { connect } from 'react-redux';
import { Button } from 'rsuite';
import { setUserAuth } from '../../redux/actions/index.actions.js';
import axios from 'axios';

const mapDispatchToProps = dispatch => {
  return ({
    setUserAuth: (value) => {
      dispatch(setUserAuth(value))
    }
  })
}

const mapStateToProps = state => {
  return { isConnected: state.isConnected };
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.logout = this.logout.bind(this);
  }

  logout() {
    axios.post('/api/logout', { credentials: 'include' }).then((res) => {
      console.log(res);
      if (res.status === 202) {
        this.props.setUserAuth(false);
      }
    }).catch((err) => {
      console.error(err);
      this.props.setUserAuth(false);
    });
  }

  render() {
    return <div>
      {
        this.props.isConnected === undefined
        ? 'Loading'
        :
          this.props.isConnected
            ? <Button onClick={this.logout}>Log out</Button>
            : <Auth/>

      }

    </div>
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));