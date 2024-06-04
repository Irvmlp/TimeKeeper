// CustomBarChart.js
import React from 'react';
import { Svg, Rect, Text as SvgText } from 'react-native-svg';

const CustomBarChart = ({ data, width, height }) => {
  const maxDuration = Math.max(...data.map(d => d.duration));
  const barWidth = width / data.length - 10;

  return (
    <Svg height={height} width={width}>
      {data.map((d, index) => {
        const barHeight = (d.duration / maxDuration) * height;
        const greenHeight = Math.min(d.desiredDuration, d.duration) / maxDuration * height;
        const redHeight = Math.max(0, d.duration - d.desiredDuration) / maxDuration * height;
        const grayHeight = d.title === 'Unaccounted Time' ? barHeight : 0;

        return (
          <React.Fragment key={index}>
            <Rect
              x={index * (barWidth + 10)}
              y={height - greenHeight - grayHeight}
              width={barWidth}
              height={greenHeight}
              fill="green"
            />
            {redHeight > 0 && (
              <Rect
                x={index * (barWidth + 10)}
                y={height - greenHeight - redHeight - grayHeight}
                width={barWidth}
                height={redHeight}
                fill="red"
              />
            )}
            {grayHeight > 0 && (
              <Rect
                x={index * (barWidth + 10)}
                y={height - grayHeight}
                width={barWidth}
                height={grayHeight}
                fill="gray"
              />
            )}
            <SvgText
              x={index * (barWidth + 10) + barWidth / 2}
              y={height - barHeight - 10}
              fontSize="10"
              fill="black"
              textAnchor="middle"
            >
              {d.title}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
};

export default CustomBarChart;
