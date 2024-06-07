import React from 'react';
import { Dimensions, View, TouchableOpacity, Text, Alert } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import styles from './DailyLogsStyles';

const screenWidth = Dimensions.get('window').width;

export const Chart = ({ chartData }) => (
  <BarChart
    data={chartData}
    width={screenWidth - 26}
    height={220}
    yAxisSuffix=" hrs"
    yAxisInterval={0.5}
    chartConfig={{
      barPercentage: 0.5,
      backgroundColor: "white",
      backgroundGradientFrom: "white",
      backgroundGradientTo: "white",
      decimalPlaces: 1,
      color: (opacity = 1) => `rgba(55, 81, 95, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 3,
      },
      propsForDots: {
        r: "2",
        strokeWidth: ".5",
        stroke: "black"
      },
      propsForBackgroundLines: {
        stroke: "white",
      },
      propsForLabels: {
        fontSize: "14",
        fontWeight: 500,
        padding: 2,
      },
    }}
    style={{
      borderRadius: 4,
      marginTop: -10,
    }}
    fromZero={true}
  />
);

export const getStartDate = (timeFrame) => {
  const now = new Date();
  let startDate;

  switch (timeFrame) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      const firstDayOfWeek = now.getDate() - now.getDay();
      startDate = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case '3months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      break;
    case '6months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case '5years':
      startDate = new Date(now.getFullYear() - 5, 0, 1);
      break;
    default:
      startDate = new Date(0);
  }

  return startDate;
};

export const sortLogs = (logs, order) => {
  if (order === 'chronological') {
    return logs;
  } else if (order === 'duration') {
    return logs.sort((a, b) => b.duration - a.duration);
  } else if (order === 'goodBad') {
    const goodLogs = logs.filter(log => log.isGood).sort((a, b) => b.duration - a.duration);
    const badLogs = logs.filter(log => !log.isGood).sort((a, b) => b.duration - a.duration);
    return [...goodLogs, ...badLogs];
  }
};

export const filterLogs = (logs, timeFrame) => {
  const startDate = getStartDate(timeFrame);
  return logs.filter(log => new Date(log.timestamp) >= startDate);
};

export const calculateAverages = (logs) => {
  const aggregatedLogs = {};
  logs.forEach(log => {
    if (aggregatedLogs[log.title]) {
      aggregatedLogs[log.title].duration += log.duration;
      aggregatedLogs[log.title].count += 1;
    } else {
      aggregatedLogs[log.title] = { duration: log.duration, count: 1 };
    }
  });

  return Object.keys(aggregatedLogs).map(title => ({
    title,
    duration: aggregatedLogs[title].duration / aggregatedLogs[title].count
  }));
};
