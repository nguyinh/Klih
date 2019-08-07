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
      imageTest: ''
    };
  }

  async componentDidMount() {
    try {
      const {
        data
      } = await axios.get('api/statistics/bestOpponents');
      console.log(data);
      this.setState({
        bestOpponents: data,
        imageTest: 'data:image/jpeg;base64,' + arrayBufferToBase64(data[0].avatar.data.data)
      });
    } catch (err) {
      console.log(err);
    }
  }

  

  render() {
    const height = 90;

    return <div className='graph-container'>
      <ParentSize>
        {parent => {
          const vbX = parent.width - parent.width / 1.135;
          const vbY = parent.height - parent.height / 1.1;
          const vbsX = parent.width - parent.width / 4;
          const vbsY = parent.height - parent.height / 4;
          const vb = `${vbX} ${vbY} ${vbsX} ${vbsY}`;

          if (this.state.bestOpponents.length === 1) {
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
              </>
            }
          }
        }
      </ParentSize>
    </div>
  }
}
export default BestOpponent;