import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import styles from './DailyLogsStyles';

const screenWidth = Dimensions.get('window').width;

export const Chart = ({ chartData }) => (
  <View style={styles.chartContainer}>
    <BarChart
      data={chartData}
      width={screenWidth - 32}
      height={190}
      yAxisSuffix=" hrs"
      yAxisInterval={0.5}
      chartConfig={{
        barPercentage: 0.6,
        backgroundColor: "#f4f4f8",
        backgroundGradientFrom: "#f4f4f8",
        backgroundGradientTo: "#f4f4f8",
        decimalPlaces: 1,
        color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "4",
          strokeWidth: "1",
          stroke: "#1f77b4",
        },
        propsForBackgroundLines: {
          stroke: "#e3e3e3",
        },
        propsForLabels: {
          fontSize: 12,
          fontWeight: "bold",
          padding: 4,
        },
      }}
      style={{
        borderRadius: 16,
        marginVertical: 2,
        marginHorizontal: 8,
      }}
      fromZero={true}
    />
  </View>
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
