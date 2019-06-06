import React, { Component } from 'react';
import './HistoryEntryLeft.scss';
import {
  Row,
  Col
} from 'rsuite';
import { CSSTransition } from 'react-transition-group';

class HistoryEntryLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    console.log('true');
  }

  componentWillUnmount() {
    this.setState({ isLoading: false });
  }

  shouldComponentUpdate(prevProps, prevState) {
    return prevProps.index !== this.props.index ||
      prevState.isLoading !== this.state.isLoading;
  }

  openRemoveConfirmation = (e, index) => {
    this.props.openRemoveConfirmation(e, index);
  }

  removeGoalEvent = (e, index) => {
    this.props.removeGoalEvent(e, index);
  }

  render() {
    return <CSSTransition
      timeout={500}
      classNames='leftTeamAnim'
      in={this.state.isLoading}
      onClick={(e) => this.openRemoveConfirmation(e, this.props.index)}
      unmountOnExit>
      <Row className='goalEventContainer'>
        <Col xs={4}>
          <span className='goalTime'>{this.props.goalTime}&rsquo;</span>
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
        <Col xs={16}>
          <span className='goalPlayer'>{this.props.fullName}</span>
        </Col>

        <div
          className='removeOverlay left'
          id={'removeOverlay' + this.props.index}
          onClick={(e) => this.removeGoalEvent(e, this.props.index)}>
          <span>
            Supprimer
          </span>
        </div>
      </Row>
    </CSSTransition>;
  }
}

export default HistoryEntryLeft;