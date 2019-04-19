import React, { Component } from 'react';
import './Match.scss';
import swordImage from '../../sword.png';
import shieldImage from '../../shield.png';
import MatchPlayer from '../MatchPlayer/MatchPlayer';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import {
  Button,
  Grid,
  Row,
  Col,
} from 'rsuite';

const mapStateToProps = state => {
  return {
    P1: state.P1,
    P2: state.P2,
    P3: state.P3,
    P4: state.P4
  };
};

const cmp = (o1, o2) => JSON.stringify(o1) === JSON.stringify(o2);

class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {
      P1: {
        ...this.props.P1,
        name: 'debug man',
        placement: '',
        isSelected: false
      },
      P2: {
        ...this.props.P2,
        name: 'hello you',
        placement: '',
        isSelected: false
      },
      P3: {
        ...this.props.P3,
        name: 'debug woman',
        placement: '',
        isSelected: false
      },
      P4: {
        ...this.props.P4,
        name: 'coucou toi',
        placement: '',
        isSelected: false
      },
      placement: '',
      selectedPlayer: ''
    }
  }

  deselectPlayers = async () => {
    await this.setState({
      P1: {
        ...this.state.P1,
        isSelected: false
      },
      P2: {
        ...this.state.P2,
        isSelected: false
      },
      P3: {
        ...this.state.P3,
        isSelected: false
      },
      P4: {
        ...this.state.P4,
        isSelected: false
      },
    })
  }

  onP1Touch = async () => {
    this.deselectPlayers();
    const { P1, placement } = this.state;
    await this.setState({
      P1: {
        ...P1,
        placement: (!P1.placement ? '' : P1.placement),
        isSelected: true
      },
      placement: (!P1.placement ? '' : P1.placement)
    });
  }

  onP2Touch = async () => {
    this.deselectPlayers();
    const { P2, placement } = this.state;
    await this.setState({
      P2: {
        ...P2,
        placement: (!P2.placement ? '' : P2.placement),
        isSelected: true
      },
      placement: (!P2.placement ? '' : P2.placement)
    });
  }

  onP3Touch = async () => {
    this.deselectPlayers();
    const { P3, placement } = this.state;
    this.setState({
      P3: {
        ...P3,
        placement: (!P3.placement ? '' : P3.placement),
        isSelected: true
      },
      placement: (!P3.placement ? '' : P3.placement)
    });
  }

  onP4Touch = async () => {
    this.deselectPlayers();
    const { P4, placement } = this.state;
    this.setState({
      P4: {
        ...P4,
        placement: (!P4.placement ? '' : P4.placement),
        isSelected: true
      },
      placement: (!P4.placement ? '' : P4.placement)
    });
  }

  onPlacementChange = (placementType) => {
    const { P1, P2, P3, P4, selectedPlayer } = this.state;
    if (this.state.P1.isSelected) {
      this.setState({
        P1: {
          ...this.state.P1,
          placement: placementType
        }
      });
    } else if (this.state.P2.isSelected) {
      this.setState({
        P2: {
          ...this.state.P2,
          placement: placementType
        }
      });
    } else if (this.state.P3.isSelected) {
      this.setState({
        P3: {
          ...this.state.P3,
          placement: placementType
        }
      });
    } else if (this.state.P4.isSelected) {
      this.setState({
        P4: {
          ...this.state.P4,
          placement: placementType
        }
      });
    }

    this.setState({ placement: placementType });
  }

  render() {
    const { selectedPlayer, P1, P2, P3, P4, placement } = this.state;
    return <Grid className='matchContainer'>
      <Row>
        <Col
          xs={22}
          xsOffset={1}
          className='container'>

          <Row>
            <Col
              xs={22}
              xsOffset={1}
              className='playersContainer'>

              <Row gutter={0}>
                <Col
                  xs={10}>

                  <Row gutter={0}>
                    {this.state.P1.name &&
                      <Col
                        xs={12}
                        className={'P1Container ' + (this.state.P1.isSelected ? 'selected' : '')}
                        onClick={this.onP1Touch}>
                        <MatchPlayer
                          name={this.state.P1.name}
                          image={this.state.P1.image}/>
                      </Col>
                    }


                    {this.state.P2.name &&
                      <Col
                        xs={12}
                        className={'P2Container ' + (this.state.P2.isSelected ? 'selected' : '')}
                        onClick={this.onP2Touch}>
                        <MatchPlayer
                          name={this.state.P2.name}
                          image={this.state.P2.image}/>
                      </Col>
                    }
                  </Row>
                </Col>

                <Col
                  xs={4}
                  className='playerPlacementContainer'>

                  <div
                    className='swordContainer'
                    onClick={() => this.onPlacementChange(swordImage)}>
                    <img
                      src={swordImage}
                      className={'placementImage sword ' + (cmp(placement, swordImage) ? 'selected' : '')}
                      alt='attack'/>
                  </div>

                  <div
                    className='shieldContainer'
                    onClick={() => this.onPlacementChange(shieldImage)}>
                  <img
                    src={shieldImage}
                    className={'placementImage shield ' + (cmp(placement, shieldImage) ? 'selected' : '')}
                    alt='defense'/>
                  </div>

                </Col>

                <Col
                  xs={10}>
                  <Row gutter={0}>
                    {this.state.P3.name &&
                      <Col
                        xs={12}
                        className={'P3Container ' + (this.state.P3.isSelected ? 'selected' : '')}
                        onClick={this.onP3Touch}>
                        <MatchPlayer
                          name={this.state.P3.name}
                          image={this.state.P3.image}/>
                      </Col>
                    }


                    {this.state.P4.name &&
                      <Col
                        xs={12}
                        className={'P4Container ' + (this.state.P4.isSelected ? 'selected' : '')}
                        onClick={this.onP4Touch}>
                        <MatchPlayer
                          name={this.state.P4.name}
                          image={this.state.P4.image}/>
                      </Col>
                    }
                  </Row>
                </Col>
              </Row>

            </Col>
          </Row>

        </Col>
      </Row>

      <Row>
        <Col
          xs={22}
          xsOffset={1}
          className='container'>

          <Row>
            <Col
              xs={22}
              xsOffset={1}>
              History
            </Col>
          </Row>

        </Col>
      </Row>
    </Grid>;
  }
}
export default withRouter(connect(mapStateToProps, null)(Match));