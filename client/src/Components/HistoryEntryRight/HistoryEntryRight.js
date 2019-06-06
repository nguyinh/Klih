import React, { Component } from 'react';
import './HistoryEntryRight.scss';
import {
  Row,
  Col
} from 'rsuite';
import { CSSTransition } from 'react-transition-group';

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
    this.setState({ isLoading: false });
  }

  shouldComponentUpdate(prevProps, prevState) {
    return prevProps.index !== this.props.index || prevState.isLoading !== this.state.isLoading;
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
      in={this.state.isLoading}
      classNames='rightTeamAnim'
      onClick={(e) => this.openRemoveConfirmation(e, this.props.index)}
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

        <div
          className='removeOverlay right'
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

export default HistoryEntryRight;