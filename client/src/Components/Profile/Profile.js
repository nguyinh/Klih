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
  Icon,
  InputGroup,
  Input
} from 'rsuite';

import { setUserAuth, setAvatar } from '../../redux/actions/index.actions.js';
import axios from 'axios';
import str from '../../constants/labels.constants.js'

const mapDispatchToProps = dispatch => {
  return ({
    setUserAuth: (value) => {
      dispatch(setUserAuth(value))
    },
    setAvatar: (value) => {
      dispatch(setAvatar(value))
    }
  })
}

const mapStateToProps = state => {
  return { isConnected: state.isConnected, avatar: state.avatar };
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      searchedTeam: {},
      inputTeamTag: '',
      loadingJoin: false
    }
    this.uploaderRef = React.createRef();

    this.logout = this.logout.bind(this);
  }

  logout() {
    axios.post('/api/logout', { credentials: 'include' }).then((res) => {
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

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  uploadHandler = async () => {
    // Format image file
    const formData = new FormData();
    formData.append('myAvatar', this.state.selectedFile)
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    try {
      const avatarResponse = await axios.post('api/profile/avatar', formData, config);
      var base64Flag = 'data:image/jpeg;base64,';
      var imageStr = this.arrayBufferToBase64(avatarResponse.data.data.data);
      this.setState({
        image: base64Flag + imageStr
      });
      this.props.setAvatar(base64Flag + imageStr);
    } catch (err) {
      console.log(err);
    }
    // TODO: Save avatar to redux and display in Navigation + Profile
  }

  searchTeamByTag = async () => {
    try {
      const teamResponse = await axios.get('api/team/info/' + this.state.inputTeamTag, {});
      this.setState({ searchedTeam: teamResponse.data.team });
    } catch (err) {
      console.log(err);
    }
  }

  handleChange = (content) => {
    this.setState({
      inputTeamTag: content
    })
  }

  joinTeamButton = async () => {
    try {
      this.setState({ loadingJoin: true });
      const joinResponse = await axios.post('api/team/join', { teamTag: this.state.searchedTeam.teamTag });
      console.log(joinResponse);
    } catch (err) {

    } finally {
      this.setState({ loadingJoin: false });
    }
    // TODO: Do something on join
    // TODO: Popup on Join
    // TODO: Popup on Error
  }

  render() {
    Object.size = (obj) => {
      let size = 0,
        key;
      for (key in obj)
        if (obj.hasOwnProperty(key)) size++;
      return size;
    };

    return <div>
    {
      this.props.isConnected === undefined ?
      'Loading' :
        this.props.isConnected ?
        <Grid>
          <Row>
            <Col xs={6} onClick={() => {this.uploaderRef.current.click()}}>
              { this.props.avatar ?
                <img
                  src={this.props.avatar}
                  className='profileAvatarImage' /> :
                <img
                  src={require('./../../profile.png')}
                  className='profileAvatarImage'
                  alt='Avatar'></img>
              }
            </Col>
          </Row>


          <Row>
            <Col xs={12}>
              <InputGroup>
                <Input onChange={this.handleChange} />
                <InputGroup.Button onClick={this.searchTeamByTag}>
                  <Icon icon="search" />
                </InputGroup.Button>
              </InputGroup>
            </Col>
            <Col xs={6}>
              <span>{this.state.searchedTeam.name}</span>
            </Col>
            <Col xs={6}>
              {Object.size(this.state.searchedTeam) != 0 &&
                <Button
                  block
                  color='blue'
                  onClick={this.joinTeamButton}
                  disabled={this.state.loadingJoin}>Join</Button>}
            </Col>
          </Row>


          <Row>
            <Col xsOffset={1} xs={22}>
              <input
                type="file"
                name="myAvatar"
                accept="image/*"
                onChange={this.fileChangedHandler}
                style={{display: 'none'}}
                ref={this.uploaderRef}/>
              <Button
                block="block"
                type="submit"
                value="submit"
                color='blue'
                onClick={this.uploadHandler}>
                Upload
              </Button>
            </Col>

            <Col xsOffset={1} xs={22}>
              <Button onClick={this.logout} block color='red'>{str.LOGOUT}</Button>
            </Col>
          </Row>
        </Grid> :
        <Auth/>
    }


    </div>
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));