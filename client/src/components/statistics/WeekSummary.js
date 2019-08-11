import React, { Component } from 'react';
import './WeekSummary.scss';
import axios from 'axios';
import { ParentSize } from '@vx/responsive';
import { Text } from '@vx/text';
import {
  Icon
} from 'rsuite';
import {
  LegendOrdinal,
  LegendItem,
  LegendLabel
} from '@vx/legend';
import { 
  scaleLinear,
  scaleOrdinal
} from '@vx/scale';

const DayBar = ({x, y, width, height, winValue, loseValue, dayName}) => {
  const offsetY = y + height * 0.05;
  height = height - offsetY;

  // Set a minimum height for low count (win/lose) values 
  const minimumHeight = h => {
    if (h <= 0)
      return 0;
    else if (h < height * 0.06)
      return height * 0.06;
    else
      return h;
  };

  // Baseline
  const baselineWidth = width;
  const baselineHeight = 4;
  const baselineOriginX = x;
  const baselineOriginY = offsetY + y + height/2 - baselineHeight/2;

  // X axis
  const dataWidth = baselineWidth * 0.85;
  const dataOriginX = x + (baselineWidth - dataWidth) / 2;

  // Win
  const dataWinHeight = minimumHeight(winValue - offsetY);
  const dataWinOriginY = offsetY + y + -dataWinHeight + baselineHeight/2 + height/2;

  // Lose
  const dataLoseHeight = minimumHeight(loseValue - offsetY);
  const dataLoseOriginY = offsetY + y + (-baselineHeight/2 + 1) + height/2;

  // Day name
  const dataDayOriginX = x + width/2;
  const dataDayOriginY = y + offsetY/2;

  return <>
    {/* Wins count */}
    <rect
      x={dataOriginX} 
      y={dataWinOriginY} 
      width={dataWidth} 
      height={dataWinHeight} 
      ry={4}
      className='wins-histogram'/>

    {/* Losses count */}
    <rect
      x={dataOriginX} 
      y={dataLoseOriginY} 
      width={dataWidth} 
      height={dataLoseHeight} 
      ry={4}
      className='losses-histogram'/>

    {/* Baseline */}
    <rect
      x={baselineOriginX} 
      y={baselineOriginY} 
      width={baselineWidth} 
      height={baselineHeight} 
      ry={2}
      className='baseline-histogram'/>

    {/* Day name */}
    <Text
      x={dataDayOriginX} 
      y={dataDayOriginY} 
      className='day-label'>
      {dayName}
    </Text>
  </>;
}

class WeekSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekSummary: [],
      isFetching: true
    };
  }

  async componentDidMount() {
    try {
      const {
        data
      } = await axios.get('api/statistics/weekSummary');

      this.setState({
        weekSummary: data,
        isFetching: false
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const componentHeight = 150;
    const { weekSummary, isFetching } = this.state;

    const ordinalColorScale = scaleOrdinal({
      domain: ['Victoires', 'Défaites'],
      range: ['#3fab3f', '#f16262']
    });

    return <div className='graph-container'>
      { !isFetching ? 
        <>
          <ParentSize>
            {({width, height}) => {
              const vbX = 0;
              const vbY = 0;
              const vbsX = width;
              const vbsY = height;
              const vb = `${vbX} ${vbY} ${vbsX} ${vbsY}`;

              const contentOffsetX = width * 0.04; // margin-left
              const contentOffsetY = 10; // margin-top
              
              const contentHeight = height - contentOffsetY;
              const barWidth = 25;

              const daysCount = weekSummary.length;

              // Letting 1 as 'minimal' maximum to avoid scale problems
              const maxCount = Math.max(
                ...weekSummary.map(d => d.wins),
                ...weekSummary.map(d => d.losses),
                1
              );

              const countScale = scaleLinear({
                range: [0, contentHeight/2],
                domain: [0, maxCount],
              });

              return <svg 
                width={width}
                height={componentHeight}
                viewBox={vb}
                className='histogram-container'>

                {weekSummary.map((d, i) => {
                  return <DayBar
                    x={ (width * i / daysCount) * 0.9 + barWidth/2 + contentOffsetX }
                    y={contentOffsetY}
                    width={barWidth}
                    height={contentHeight}
                    winValue={Math.floor(countScale(d.wins))}
                    loseValue={Math.floor(countScale(d.losses))}
                    dayName={d.day}
                    key={`week-summary-${i}`}/>
                })}
              </svg>
              }
            }
          </ParentSize>

          <LegendOrdinal scale={ordinalColorScale} labelFormat={label => `${label}`}>
            {labels => {
              return (
                <div className='week-summary-legend'>
                  {labels.map((label, i) => {
                    const size = 15;
                    return (
                      <LegendItem
                        key={`legend-summary-${i}`}
                        margin={'0 25px'}
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
        </>

        :

        <Icon
          icon='circle-o-notch' 
          spin 
          size="lg" 
          className='statistic-spinner'/>
      }
    </div>
  }
}
export default WeekSummary;