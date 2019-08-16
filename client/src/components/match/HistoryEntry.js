import React, { Component } from 'react';
import './HistoryEntry.scss';
import {
  Row,
  Col
} from 'rsuite';
import { CSSTransition } from 'react-transition-group';

class HistoryEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  componentDidMount() {
    this.setState({ isLoading: this.props.toLoad });
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
    const { 
      team,
      deltaScore,
      isBetray,
      fullName,
      goalTime,
      index
    } = this.props;

    return <>
    {
      team === 'Team1' ? 
        <CSSTransition
          timeout={500}
          in={this.state.isLoading}
          classNames='rightTeamAnim'
          onClick={(e) => this.openRemoveConfirmation(e, index)}
          unmountOnExit>
          <Row className='goalEventContainer'>
            <Col xsOffset={1} xs={2} className={'goalScoreContainer ' + (
                deltaScore > 0
                ? 'plus '
                : 'minus ') + (
                isBetray
                ? 'betray '
                : '')}>
              <span className={'goalScore'}>
                {
                  (
                    deltaScore > 0
                    ? '+'
                    : '') + deltaScore
                }
              </span>
            </Col>
            <Col xs={8} style={{textAlign: 'left'}}>
              <span className='goalPlayer'>{fullName}</span>
            </Col>
            <Col xs={2} style={{textAlign: 'right'}}>
              {goalTime === '' ? 
                '' :
                <span className='goalTime'>{goalTime + 1}'</span>
              }
            </Col>

            <div
              className='removeOverlay left'
              id={'removeOverlay' + index}
              onClick={(e) => this.removeGoalEvent(e, index)}>
              <span>
                Supprimer
              </span>
            </div>
          </Row>
        </CSSTransition> :
        <CSSTransition
          timeout={500}
          in={this.state.isLoading}
          classNames='leftTeamAnim'
          onClick={(e) => this.openRemoveConfirmation(e, index)}
          unmountOnExit>
          <Row className='goalEventContainer'>
            <Col xsOffset={11} xs={2} style={{textAlign: 'right'}}>
              {goalTime === '' ? 
                '' :
                <span className='goalTime'>{goalTime + 1}'</span>
              }
            </Col>
            <Col xs={8} style={{textAlign: 'right'}}>
              <span className='goalPlayer'>{fullName}</span>
            </Col>
            <Col xs={2} className={'goalScoreContainer ' + (
                deltaScore > 0
                ? 'plus '
                : 'minus ') + (
                isBetray
                ? 'betray '
                : '')}>
              <span className={'goalScore'}>
                {
                  (
                    deltaScore > 0
                    ? '+'
                    : '') + deltaScore
                }
              </span>
            </Col>

            <div
              className='removeOverlay right'
              id={'removeOverlay' + index}
              onClick={(e) => this.removeGoalEvent(e, index)}>
              <span>
                Supprimer
              </span>
            </div>
          </Row>
        </CSSTransition>
    }
    </>;
  }
}

export default HistoryEntry;