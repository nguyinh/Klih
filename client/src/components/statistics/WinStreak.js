import React, { Component } from 'react';
import './WinStreak.scss';
import axios from 'axios';
import { ParentSize } from '@vx/responsive';
import { Text } from '@vx/text';


class WinStreak extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winStreak: 0,
      matchCount: 0
    };
  }

  async componentDidMount() {
    try {
      const {
        data: {
          winStreak,
          matchCount
        }
      } = await axios.get('api/statistics/winStreak');

      this.setState({
        winStreak,
        matchCount
      });
    } catch (err) {
      console.log(err);
    }
  }

  

  render() {
    const height = this.state.winStreak !== 0 ? 130 : 100;

    return <div className='graph-container'>
      <ParentSize>
        {parent => {
          const vbX = parent.width - parent.width / 1.07;
          const vbY = parent.height - parent.height / 1.07;
          const vbsX = parent.width - parent.width / 7;
          const vbsY = parent.height - parent.height / 7;
          const vb = `${vbX} ${vbY} ${vbsX} ${vbsY}`;

          return <svg 
            width={parent.width}
            height={height}
            viewBox={vb}>
              { this.state.winStreak !== 0 ? 
                <>
                  <Text
                    fill="white"
                    textAnchor="middle"
                    dy="0.5em"
                    font-size="50px"
                    x={parent.width/2}
                    y={height/2}
                    className='win-streak-text'
                  >
                    {this.state.winStreak}
                  </Text>
                  <Text
                    fill="white"
                    textAnchor="middle"
                    font-size="15px"
                    x={parent.width/2}
                    y={height/1.25}
                    className='win-streak-text'
                  >
                    { this.state.winStreak === 1 ? 
                      'Victoire d\'affilée' : 
                      'Victoires d\'affilée'
                    }
                  </Text>
                </> :
                <>
                  <Text
                    fill="white"
                    textAnchor="middle"
                    font-size="15px"
                    x={parent.width/2}
                    y={height/2.1}
                    className='win-streak-text'
                  >
                    Pas de victoires
                  </Text>
                  <Text
                    fill="white"
                    textAnchor="middle"
                    font-size="15px"
                    x={parent.width/2}
                    y={height/1.4}
                    className='win-streak-text'
                  >
                    dernièrement 😅
                  </Text>
                </>
              }  
          </svg>
          }
        }
      </ParentSize>
    </div>
  }
}
export default WinStreak;