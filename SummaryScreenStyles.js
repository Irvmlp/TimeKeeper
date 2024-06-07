import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  totalDuration: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  activityList: {
    width: '100%',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  activityTextContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityDuration: {
    fontSize: 14,
  },
  activityIsGood: {
    fontSize: 14,
  },
  activityCriticalness: {
    fontSize: 14,
  },
});

export default styles;
