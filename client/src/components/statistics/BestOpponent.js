import React, { Component } from 'react';
import './BestOpponent.scss';
import axios from 'axios';
import { ParentSize } from '@vx/responsive';
import { Text } from '@vx/text';
import { arrayBufferToBase64 } from '../../utils';
import {
  Icon
} from 'rsuite';

class BestOpponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bestOpponents: [],
      isFetching: true
    };
  }

  async componentDidMount() {
    try {
      const {
        data
      } = await axios.get('api/statistics/bestOpponents');
      
      this.setState({
        bestOpponents: data,
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

                if (this.state.bestOpponents.length === 0) {
                  const height = 110;

                  return <svg 
                    width={parent.width}
                    height={height}
                    viewBox={vb}>
                    <Text
                      x={parent.width/2}
                      y={height/2.2}
                      className='no-best-opponent'
                    >
                      Pas de meilleur
                    </Text>
                    <Text
                      x={parent.width/2}
                      y={height/1.5}
                      className='no-best-opponent'
                    >
                      adversaire 🤷‍♂️
                    </Text>
                  </svg>;
                }
                else if (this.state.bestOpponents.length === 1) {
                  const height = 90;

                  return <>
                    <img
                      src={'data:image/jpeg;base64,' + arrayBufferToBase64(this.state.bestOpponents[0].avatar.data.data)}
                      className='best-opponent-avatar'
                      alt='Opponent avatar'/>
                    <svg 
                    width={parent.width}
                    height={height}
                    viewBox={vb}>
                      <Text
                        x={parent.width/2}
                        y={height/2.25}
                        className='best-opponent-name'
                      >
                        {this.state.bestOpponents[0].firstName}
                      </Text>
                      <Text
                        x={parent.width/2}
                        y={height/1.2}
                        className='best-opponent-text-solo-1'
                      >
                        Meilleur adversaire
                      </Text>
                      <Text
                        x={parent.width/2}
                        y={height/0.9}
                        className='best-opponent-text-solo-2'
                      >
                        {`avec ${this.state.bestOpponents[0].matchesLoss} défaites 💥 `} 
                      </Text>
                    </svg>
                  </>;
                }
                else if (this.state.bestOpponents.length > 1) {
                  const height = 70;

                  return <div className='best-opponents-container'>
                    {this.state.bestOpponents.map((opponent) => {
                      return (
                        <div
                          key={opponent.firstName + opponent.lastName}
                          className='opponent-row'>
                          <img
                            src={'data:image/jpeg;base64,' + arrayBufferToBase64(opponent.avatar.data.data)}
                            className='best-opponent-avatar multiple'
                            alt='Opponent avatar'/>
                          <span>{opponent.firstName}</span>
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
                        className='best-opponent-text-multi-1'
                      >
                        Meilleurs adversaires
                      </Text>
                      <Text
                        x={parent.width/2}
                        y={height/0.75}
                        className='best-opponent-text-multi-2'
                      >
                        {`avec ${this.state.bestOpponents[0].matchesLoss} défaites 💥 `} 
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
export default BestOpponent;