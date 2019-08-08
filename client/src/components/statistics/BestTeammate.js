import React, { Component } from 'react';
import './BestTeammate.scss';
import axios from 'axios';
import { ParentSize } from '@vx/responsive';
import { Text } from '@vx/text';
import { arrayBufferToBase64 } from '../../utils';
import {
  Icon
} from 'rsuite';

class BestTeammate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bestTeammates: [],
      isFetching: true
    };
  }

  async componentDidMount() {
    try {
      const {
        data
      } = await axios.get('api/statistics/bestTeammates');

      this.setState({
        bestTeammates: data,
        isFetching: false
      });
    } catch (err) {
      console.log(err);
    }
  }

  

  render() {
    return <div className='graph-container'>
      { !this.state.isFetching ? 
        <>
          <ParentSize>
            {
              parent => {
                const vbX = parent.width - parent.width / 1.135;
                const vbY = parent.height - parent.height / 1.1;
                const vbsX = parent.width - parent.width / 4;
                const vbsY = parent.height - parent.height / 4;
                const vb = `${vbX} ${vbY} ${vbsX} ${vbsY}`;

                if (this.state.bestTeammates.length === 0) {
                  const height = 110;

                  return <svg 
                    width={parent.width}
                    height={height}
                    viewBox={vb}>
                    <Text
                      x={parent.width/2}
                      y={height/2.2}
                      className='no-best-teammate'
                    >
                      Pas de meilleur
                    </Text>
                    <Text
                      x={parent.width/2}
                      y={height/1.5}
                      className='no-best-teammate'
                    >
                      partenaire 🤷‍
                    </Text>
                  </svg>;
                }
                else if (this.state.bestTeammates.length === 1) {
                  const height = 90;

                  return <>
                    <img
                      src={'data:image/jpeg;base64,' + arrayBufferToBase64(this.state.bestTeammates[0].avatar.data.data)}
                      className='best-teammate-avatar'
                      alt='Teammate avatar'/>
                    <svg 
                    width={parent.width}
                    height={height}
                    viewBox={vb}>
                      <Text
                        x={parent.width/2}
                        y={height/2.25}
                        className='best-teammate-name'
                      >
                        {this.state.bestTeammates[0].firstName}
                      </Text>
                      <Text
                        x={parent.width/2}
                        y={height/1.2}
                        className='best-teammate-text-solo-1'
                      >
                        Meilleur partenaire
                      </Text>
                      <Text
                        x={parent.width/2}
                        y={height/0.9}
                        className='best-teammate-text-solo-2'
                      >
                        {`avec ${this.state.bestTeammates[0].matchesWon} victoires 🤝`} 
                      </Text>
                    </svg>
                  </>;
                }
                else if (this.state.bestTeammates.length > 1) {
                  const height = 70;

                  return <div className='best-teammates-container'>
                    {this.state.bestTeammates.map((teammate) => {
                      return (
                        <div
                          key={teammate.firstName + teammate.lastName}
                          className='teammate-row'>
                          <img
                            src={'data:image/jpeg;base64,' + arrayBufferToBase64(teammate.avatar.data.data)}
                            className='best-teammate-avatar multiple'
                            alt='Teammate avatar'/>
                          <span>{teammate.firstName}</span>
                        </div>
                      );
                    })}
                    <svg 
                    width={parent.width}
                    height={height}
                    viewBox={vb}>
                      <Text
                        x={parent.width/2}
                        y={height/1.4}
                        className='best-teammate-text-multi-1'
                      >
                        Meilleurs partenaires
                      </Text>
                      <Text
                        x={parent.width/2}
                        y={height/0.75}
                        className='best-teammate-text-multi-2'
                      >
                        {`avec ${this.state.bestTeammates[0].matchesWon} victoires 🤝`} 
                      </Text>
                    </svg>
                  </div>;
                }
              }
            }
          </ParentSize>
        </> :
        <Icon
          icon='circle-o-notch' 
          spin 
          size="lg" 
          className='statistic-spinner'/>
      }
    </div>
  }
}
export default BestTeammate;