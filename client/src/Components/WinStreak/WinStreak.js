import React, { Component } from 'react';
import './WinStreak.scss';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { ParentSize } from '@vx/responsive';
import {
  LegendOrdinal,
  LegendItem,
  LegendLabel
} from '@vx/legend';
import { scaleOrdinal } from '@vx/scale';
import { Text } from '@vx/text';


class WinStreak extends Component {
  constructor(props) {
    super(props);
    this.state = {
      WinStreak: [
        {
          status: 'Wins',
          count: 0,
          average: 0
        },
        {
          status: 'Losses',
          count: 0,
          average: 0
        }
    ],
    matchCount: 0
  };
  }

  async componentDidMount() {
    try {
      const {
        data: {
          winStreak
        }
      } = await axios.get('api/statistics/winStreak');

      this.setState({
        winStreak
      });
    } catch (err) {
      console.log(err);
    }
  }

  

  render() {
    const height = 130;

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
          </svg>
          }
        }
      </ParentSize>
    </div>
  }
}
export default withRouter(connect(null, null)(WinStreak));