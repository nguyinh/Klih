import React, { Component } from 'react';
import './Profile.scss';
import Auth from '../Auth/Auth';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
  Icon
} from 'rsuite';

import { setUserAuth } from '../../redux/actions/index.actions.js';
import axios from 'axios';
import str from '../../constants/labels.constants.js'

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
    this.state = {
      selectedFile: null
    }

    this.logout = this.logout.bind(this);
    // this.fileChangedHandler = this.fileChangedHandler.bind(this);
    // this.uploadHandler = this.uploadHandler.bind(this);
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

  fileChangedHandler = event => {
    this.setState({ selectedFile: event.target.files[0] })
  }

  uploadHandler = async () => {
    // Format image file
    const formData = new FormData();
    formData.append('myAvatar', this.state.selectedFile)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    const response = await axios.post('api/profile/avatar', formData, config);
    console.log(response);
    // TODO: Save avatar to redux and display in Navigation + Profile
  }

  render() {
    return <div>
    {
      this.props.isConnected === undefined ?
      'Loading' :
        this.props.isConnected ?
        <Grid>
          <Row>
            <Col xsOffset={1} xs={22}>
              <Button onClick={this.logout} block color='red'>{str.LOGOUT}</Button>
            </Col>

            <Col xsOffset={1} xs={22}>

              <input
                type="file" 
                name="myAvatar" 
                accept="image/*" 
                onChange={this.fileChangedHandler}/>
              <Button
                block="block"
                type="submit"
                value="submit"
                color='blue'
                onClick={this.uploadHandler}>
                Upload
              </Button>
            </Col>
          </Row>
        </Grid> :
        <Auth/>
    }


    </div>
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));