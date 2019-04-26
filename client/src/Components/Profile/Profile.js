import React, { Component } from 'react';
import './Profile.scss';
import Auth from '../Auth/Auth';
import Team from '../Team/Team';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
  Icon,
  InputGroup,
  Input,
  Modal
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
      createTeamShow: false,
      teams: [],
      joinModal: {
        display: false,
        inputTeamTag: '',
        searchedTeam: {},
        message: '',
        loading: false,
        errorMessage: ''
      },
      createModal: {
        display: false,
        nameInput: '',
        descriptionInput: '',
        errorMessage: '',
        loading: false
      }
    }
    this.uploaderRef = React.createRef();

    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.fetchUserTeams();
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

  fetchUserTeams = async () => {
    const fetchResponse = await axios.get('/api/teams', {});
    console.log(fetchResponse);
    this.setState({ teams: fetchResponse.data.teams });
  }

  // ----- Avatar upload -----
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


  // ----- Create team -----
  openCreateTeamModal = () => {
    this.setState({
      createModal: {
        ...this.state.createModal,
        display: true
      }
    });
  }

  closeCreateTeamModal = () => {
    this.setState({
      createModal: {
        ...this.state.createModal,
        display: false,
        nameInput: '',
        descriptionInput: '',
        errorMessage: '',
        message: '',
        loading: false,
      }
    })
  }

  nameHandleChange = changes => {
    this.setState({
      createModal: {
        ...this.state.createModal,
        nameInput: changes,
        errorMessage: ''
      }
    });
  }

  descriptionHandleChange = changes => {
    this.setState({
      createModal: {
        ...this.state.createModal,
        descriptionInput: changes,
        errorMessage: ''
      }
    });
  }

  createTeamButton = async () => {
    if (!this.state.createModal.nameInput) {
      this.setState({
        createModal: {
          ...this.state.createModal,
          errorMessage: '🚫 Il manque un joli nom d\'équipe'
        }
      })
      return;
    }

    try {
      this.setState({
        createModal: {
          ...this.state.createModal,
          loading: true
        }
      });
      const createResponse = await axios.post('api/team/create', {
        name: this.state.createModal.nameInput,
        description: this.state.createModal.descriptionInput
      });

      this.setState({
        createModal: {
          ...this.state.createModal,
          message: 'Vous avez créé l\'équipe ' + createResponse.data.team.name + ' 👌'
        }
      });
      this.fetchUserTeams();
      // TODO: Update Profile Teams container
    } catch (err) {
      console.log(err.response);
      // if (err.response.status === 409)
      //   this.setState({
      //     joinModal: {
      //       ...this.state.joinModal,
      //       errorMessage: '👍 Vous êtes déjà membre de cette équipe'
      //     }
      //   });
    } finally {
      this.setState({
        createModal: {
          ...this.state.createModal,
          loading: false
        }
      });
    }
  }
  // -----------------------


  // ----- Join team -----
  openJoinTeamModal = () => {
    this.setState({
      joinModal: {
        ...this.state.joinModal,
        display: true
      }
    })
  }

  closeJoinTeamModal = () => {
    this.setState({
      joinModal: {
        ...this.state.joinModal,
        display: false,
        searchedTeam: {},
        inputTeamTag: '',
        message: '',
        errorMessage: ''
      }
    })
  }

  joinHandleChange = async changes => {
    await this.setState({
      joinModal: {
        ...this.state.joinModal,
        inputTeamTag: changes,
        errorMessage: '',
        searchedTeam: {},
        message: ''
      }
    });

    if (this.state.joinModal.inputTeamTag.length !== 6)
      return;

    // Search team on input change
    try {
      const teamResponse = await axios.get('api/team/info/' + this.state.joinModal.inputTeamTag, {});
      this.setState({
        joinModal: {
          ...this.state.joinModal,
          searchedTeam: teamResponse.data.team
        }
      });
    } catch (err) {
      // console.log(err);
    }
  }

  searchTeamByTagButton = async () => {
    if (!this.state.joinModal.inputTeamTag) {
      this.setState({
        joinModal: {
          ...this.state.joinModal,
          errorMessage: '🤦‍ Essayez quand même d\'écrire quelque chose'
        }
      });
      return;
    }

    try {
      const teamResponse = await axios.get('api/team/info/' + this.state.joinModal.inputTeamTag, {});
      this.setState({
        joinModal: {
          ...this.state.joinModal,
          searchedTeam: teamResponse.data.team
        }
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 404)
        this.setState({
          joinModal: {
            ...this.state.joinModal,
            errorMessage: '🙅 Cette équipe n\'existe pas'
          }
        });
      else if (err.response.status === 500)
        this.setState({
          joinModal: {
            ...this.state.joinModal,
            errorMessage: '🔥 Nos serveurs sont en feu, veuillez réessayer plus tard'
          }
        });
    }
  }

  joinTeamButton = async () => {
    try {
      this.setState({
        joinModal: {
          ...this.state.joinModal,
          loading: true
        }
      });
      await axios.post('api/team/join', { teamTag: this.state.joinModal.searchedTeam.teamTag });
      this.setState({
        joinModal: {
          ...this.state.joinModal,
          message: 'Vous avez bien rejoint ' + this.state.joinModal.searchedTeam.name + ' 👌',
          searchedTeam: {}
        }
      });
      this.fetchUserTeams();
      // TODO: Update Profile Teams container
    } catch (err) {
      // console.log(err.response);
      if (err.response.status === 409)
        this.setState({
          joinModal: {
            ...this.state.joinModal,
            errorMessage: '👍 Vous êtes déjà membre de cette équipe'
          }
        });
    } finally {
      this.setState({
        joinModal: {
          ...this.state.joinModal,
          loading: false
        }
      });
    }
  }
  // ---------------------


  render() {
    Object.size = (obj) => {
      let size = 0,
        key;
      for (key in obj)
        if (obj.hasOwnProperty(key)) size++;
      return size;
    };

    return <div className='profile'>
    {
      this.props.isConnected === undefined ?
      'Loading' :
        this.props.isConnected ?
        <Grid>
          <Row>
            <Col
              xs={22}
              xsOffset={1}
              className='container'>
              <Row>
                <Col
                  xs={22}
                  xsOffset={1}>

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

                    <Col xsOffset={2} xs={12}>
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
                        color='blue'
                        value="submit"
                        onClick={this.uploadHandler}
                        className='roundButton'>
                        Upload
                      </Button>
                    </Col>
                  </Row>

                  <Row>

                  </Row>

                  <hr/>

                  <Row className='teamButtons'>
                    <Col xs={12}>
                      <Button
                        block
                        onClick={this.openCreateTeamModal}
                        className='roundButton green'>Créer une équipe</Button>
                    </Col>

                    <Col xs={12}>
                      <Button
                        block
                        onClick={this.openJoinTeamModal}
                        className='roundButton blue'>Rejoindre une équipe</Button>
                    </Col>
                  </Row>


                  <hr/>

                  <Row>
                    <Col xs={24}>
                      <h2>Vos équipes 👥</h2>
                    </Col>
                  </Row>

                  <Row className='teamsContainer'>
                    {this.state.teams.map((team) => {
                      return <Team
                        name={team.name}
                        tag={team.teamTag}/>;
                    })}
                  </Row>

                  <hr/>

                  <Row className='logoutButton'>
                    <Col xsOffset={1} xs={22}>
                      <Button
                        onClick={this.logout}
                        block
                        className='roundButton red'>{str.LOGOUT}</Button>
                    </Col>
                  </Row>


                </Col>
              </Row>
            </Col>
          </Row>

          <Modal
            show={this.state.createModal.display}
            onHide={this.closeCreateTeamModal}
            size='xs'>
            <Modal.Header>
              <Modal.Title>Créer une équipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InputGroup className='createInput'>
                <Input
                  onChange={this.nameHandleChange}
                  placeholder="Nom de l'équipe"
                  size="lg"/>
                <Input
                  onChange={this.descriptionHandleChange}
                  placeholder='Description (falcultatif)'/>
              </InputGroup>

              <span className='errorMessage'>{this.state.createModal.errorMessage}</span>
              <span className='createMessage'>{this.state.createModal.message}</span>

              {!this.state.createModal.message && <Button
                block
                onClick={this.createTeamButton}
                disabled={this.state.createModal.loading}
                loading={this.state.createModal.loading}
                className='roundButton green'>Créer l'équipe</Button>}
            </Modal.Body>
          </Modal>

          <Modal
                              show={this.state.joinModal.display}
                              onHide={this.closeJoinTeamModal}
                              size='xs'>
                              <Modal.Header>
                                <Modal.Title>Rejoindre une équipe</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <InputGroup className='joinInput'>
                                  <Input
                                    onChange={this.joinHandleChange}
                                    placeholder='Team Tag'
                                    size="lg"/>
                                  <InputGroup.Button onClick={this.searchTeamByTagButton}>
                                    <Icon icon="search" />
                                  </InputGroup.Button>
                                </InputGroup>

                                <span className='errorMessage'>{this.state.joinModal.errorMessage}</span>
                                <span className='joinMessage'>{this.state.joinModal.message}</span>

                                {Object.size(this.state.joinModal.searchedTeam) !== 0 &&
                                  <><h3 className='searchedTeamTitle'>{this.state.joinModal.searchedTeam.name}</h3>
                                  <Button
                                    block
                                    onClick={this.joinTeamButton}
                                    disabled={this.state.joinModal.loading}
                                    loading={this.state.joinModal.loading}
                                    className='roundButton blue'>Rejoindre</Button></>}
                              </Modal.Body>
                            </Modal>
        </Grid> :
        <Auth/>
    }


    </div>
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));