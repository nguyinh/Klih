import React, { Component } from 'react';
import './WinLossRatio.scss';
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
import {
  Icon
} from 'rsuite';


class WinLossRatio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winLossRatio: [
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
    matchCount: 0,
    isFetching: true
  };
  }

  async componentDidMount() {
    try {
      const {
        data: {
          wins, 
          losses,
          matchCount
        }
      } = await axios.get('api/statistics/winLossRatio');

      this.setState({
        winLossRatio: [
          {
            status: 'Wins',
            count: wins,
            average: Math.floor(wins / matchCount * 100)
          },
          {
            status: 'Losses',
            count: losses,
            average: Math.floor(losses / matchCount * 100)
          }
        ],
        matchCount,
        isFetching: false
      });
    } catch (err) {
      console.log(err);
    }
  }

  

  render() {
    const width = 150;
    const height = 130;
    const radius = Math.min(width, height);
    // const status = d => d.status;
    const count = d => d.count;
    const pi = 3.14;
    const ordinalColorScale = scaleOrdinal({
      domain: ['Victoires', 'Défaites'],
      range: ['#3fab3f', '#f16262']
    });

    return <div className='graph-container'>
      { !this.state.isFetching ? 
        <>
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
                <Group 
                  top={parent.top + parent.height / 2}
                  left={parent.left + parent.width / 2}> 
                  <Pie
                    data={this.state.winLossRatio}
                    pieValue={count}
                    outerRadius={radius / 2.5}
                    innerRadius={radius / 5}
                    cornerRadius={5}
                    padAngle={2*pi*0.02}
                  >
                    {pie => {
                      return pie.arcs.map((arc, i) => {
                        const [centroidX, centroidY] = pie.path.centroid(arc);
                        return (
                          <g key={`letters-${arc.data.label}-${i}`}>
                            <path
                              d={pie.path(arc)}
                              fill={
                                i === 0 ? 
                                  '#3fab3f' :
                                  '#f16262'
                              }/>
                              <text
                                x={centroidX}
                                y={centroidY}
                                dy=".33em"
                                className='graph-label'
                              >
                                {arc.data.average + '%'}
                              </text>
                          </g>
                        );
                      });
                    }}
                  </Pie>
                </Group>
              </svg>
              }
            }
          </ParentSize>

          <LegendOrdinal scale={ordinalColorScale} labelFormat={label => `${label}`}>
            {labels => {
              return (
                <div className='legend'>
                  {labels.map((label, i) => {
                    const size = 15;
                    return (
                      <LegendItem
                        key={`legend-goals-${i}`}
                        margin={'0 5px'}
                        onClick={event => {
                          alert(`clicked: ${JSON.stringify(label)}`);
                        }}
                      >
                        <svg width={size} height={size}>
                          <circle fill={label.value} cx={size/2} cy={size/2} r={size/2} />
                        </svg>
                        <LegendLabel align={'left'} margin={'0 0 0 4px'}>
                          {label.text}
                        </LegendLabel>
                      </LegendItem>
                    );
                  })}
                </div>
              );
            }}
          </LegendOrdinal>
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
export default withRouter(connect(null, null)(WinLossRatio));