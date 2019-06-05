import React, { Component } from 'react';
import './HistoryEntryRight.scss';
import {
  Button,
  Grid,
  Row,
  Col,
  Checkbox,
  Icon,
  Alert,
  Modal
} from 'rsuite';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { socket } from './../../socket';

class HistoryEntryRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true });
  }

  componentWillUnmount() {
    console.log('byebye');
    this.setState({ isLoading: false });
  }

  shouldComponentUpdate(prevProps, prevState) {
    return prevProps.index !== this.props.index || prevState.isLoading !== this.state.isLoading;
  }

  openRemoveConfirmation = (e, index) => {
    Array.from(document.getElementsByClassName('displayOverlay')).forEach((overlay) => {
      clearTimeout(this.state.removeTimer);
      overlay.classList.remove('displayOverlay');
    });
    document.getElementById('removeOverlay' + index).classList.add('displayOverlay');
    this.setState({
      removeTimer: setTimeout(() => {
        if (document.getElementById('removeOverlay' + index))
          document.getElementById('removeOverlay' + index).classList.remove('displayOverlay');
      }, 1500)
    });
  }

  removeGoalEvent = (e, index) => {
    e.stopPropagation();
    console.log('removeOverlay' + index);
    if (document.getElementById('removeOverlay' + index)) {
      clearTimeout(this.state.removeTimer);
      document.getElementById('removeOverlay' + index).classList.remove('displayOverlay');
    }

    socket.emit('removeGoalEvent', {
      matchId: this.props.currentMatchId,
      playerId: this.props.currentUserId,
      index: this.props.index
    });
  }

  render() {
    console.log('render', this.props.index);
    return <CSSTransition
      timeout={300}
      in={this.state.isLoading}
      classNames='rightTeamAnim'
      key={this.props.index}
      onClick={(e) => this.openRemoveConfirmation(e, 't2-' + this.props.index)}
      unmountOnExit>
      <Row className='goalEventContainer'>
        <Col xs={16}>
          <span className='goalPlayer'>{this.props.fullName}</span>
        </Col>
        <Col xs={4} className={'goalScoreContainer ' + (
            this.props.deltaScore > 0
            ? 'plus '
            : 'minus ') + (
            this.props.isBetray
            ? 'betray '
            : '')}>
          <span className={'goalScore'}>
            {
              (
                this.props.deltaScore > 0
                ? '+'
                : '') + this.props.deltaScore
            }
          </span>
        </Col>
        <Col xs={4}>
          <span className='goalTime'>{this.props.goalTime}&rsquo;</span>
        </Col>

        <div className='removeOverlay right' id={'removeOverlay' + 't2-' + this.props.index} onClick={(e) => this.removeGoalEvent(e, 't2-' + this.props.index)}>
          <span>
            Supprimer
          </span>
        </div>
      </Row>
    </CSSTransition>;
  }
}

export default HistoryEntryRight;