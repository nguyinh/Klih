import React, { Component } from 'react';
import './BestOpponent.scss';
import axios from 'axios';
import { ParentSize } from '@vx/responsive';
import { Text } from '@vx/text';
import { arrayBufferToBase64 } from '../../utils';


class BestOpponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bestOpponents: [],
    };
  }

  async componentDidMount() {
    try {
      const {
        data
      } = await axios.get('api/statistics/bestOpponents');
      console.log(data);
      this.setState({
        bestOpponents: data
      });
    } catch (err) {
      console.log(err);
    }
  }

  

  render() {
    return <div className='graph-container'>
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
                  fill="white"
                  textAnchor="middle"
                  font-size="14px"
                  font-weight="500"
                  x={parent.width/2}
                  y={height/2.2}
                  className='best-opponent-name'
                >
                  Pas de meilleur
                </Text>
                <Text
                  fill="white"
                  textAnchor="middle"
                  font-size="14px"
                  font-weight="500"
                  x={parent.width/2}
                  y={height/1.5}
                  className='best-opponent-name'
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
                    fill="white"
                    textAnchor="middle"
                    font-size="23px"
                    font-weight="500"
                    x={parent.width/2}
                    y={height/2.25}
                    className='best-opponent-name'
                  >
                    {this.state.bestOpponents[0].firstName}
                  </Text>
                  <Text
                    fill="white"
                    textAnchor="middle"
                    font-size="19px"
                    x={parent.width/2}
                    y={height/1.2}
                    className='best-opponent-text'
                  >
                    Meilleur adversaire
                  </Text>
                  <Text
                    fill="white"
                    textAnchor="middle"
                    font-size="16px"
                    x={parent.width/2}
                    y={height/0.9}
                    className='best-opponent-text'
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
                    fill="white"
                    textAnchor="middle"
                    font-size="23px"
                    x={parent.width/2}
                    y={height/1.4}
                    className='best-opponent-text'
                  >
                    Meilleurs adversaires
                  </Text>
                  <Text
                    fill="white"
                    textAnchor="middle"
                    font-size="21px"
                    x={parent.width/2}
                    y={height/0.75}
                    className='best-opponent-text'
                  >
                    {`avec ${this.state.bestOpponents[0].matchesLoss} défaites 💥 `} 
                  </Text>
                </svg>
              </div>;
            }
          }
        }
      </ParentSize>
    </div>
  }
}
export default BestOpponent;