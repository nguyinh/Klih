import React, {Component} from 'react';
import './Profile.scss';
import Auth from '../Auth/Auth';
import {withRouter, Link} from "react-router-dom";
import {connect} from 'react-redux';
import {Button} from 'rsuite';
import {setUserAuth} from '../../redux/actions/index.actions.js'

const mapDispatchToProps = dispatch => {
  return ({
    setUserAuth: (value) => {
      dispatch(setUserAuth(value))
    }
  })
}

const mapStateToProps = state => {
  return {isConnected: state.isConnected};
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return <div>{
        this.props.isConnected
          ? 'Connected'
          : <Auth/>
      }
    </div>
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
