import React, { Component } from 'react';
import './GoalAnalysis.scss';
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


class GoalAnalysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goalAnalysis: [
        {
          type: 'Buts',
          average: 0.33,
          count: 0,
          color: ''
        },
        {
          type: 'Gamelles',
          average: 0.33,
          count: 0,
          color: ''
        },
        {
          type: 'Contre son camp',
          average: 0.33,
          count: 0,
          color: ''
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
          goalAverage, 
          minusAverage,
          betrayAverage,
          goalCount, 
          minusCount,
          betrayCount,
          matchCount
        }
      } = await axios.get('api/statistics/goalsAveragePerMatch');

      this.setState({
        goalAnalysis: [
          {
            type: 'Buts',
            average: Math.floor(goalAverage * 100),
            count: goalCount
          },
          {
            type: 'Gamelles',
            average: Math.floor(minusAverage * 100),
            count: minusCount
          },
          {
            type: 'Contre son camp',
            average: Math.floor(betrayAverage * 100),
            count: betrayCount
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
    const type = d => d.type;
    const count = d => d.count;
    const average = d => d.average;
    const pi = 3.14;
    const ordinalColorScale = scaleOrdinal({
      domain: ['Buts', 'Gamelles', 'Contre son camp'],
      range: ['#5550de', '#984bd8', '#da52a1']
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
                    data={this.state.goalAnalysis}
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
                          <g key={`${arc.data.type}-${i}`}>
                            <path 
                              d={pie.path(arc)} 
                              fill={
                                arc.data.type === 'Buts' ?
                                  '#5550de' : 
                                  arc.data.type === 'Gamelles' ?
                                    '#984bd8' :
                                    '#da52a1'}
                              />
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
export default GoalAnalysis;