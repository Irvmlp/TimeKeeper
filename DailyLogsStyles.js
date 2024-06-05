import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  chartTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
  },
  timeFrameButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  timeFrameButton: {
    margin: 4,
    padding: 8,
    color: 'black',
    borderRadius: 5,
  },
  timeFrameButtonText: {
    color: '#000',
    fontSize: 14,
  },
  selectedTimeFrame: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth - 32,
    margin: 4,
    padding: 3,
    borderBottomWidth: 0.4,
    borderBottomColor: 'gray',
    shadowRadius: 2,
    elevation: 4,
  },
  goodItem: {
    backgroundColor: 'lightgreen',
  },
  badItem: {
    backgroundColor: 'lightcoral',
  },
  itemContent: {
    flex: 1,
    gap: 6,
    flexDirection: 'row',
  },
  itemEmoji: {
    fontSize: 12,
    padding: 3,
    backgroundColor: 'white',
  },
  itemText2: {
    width: 90,
  },
  editButton: {
    color: 'blue',
    fontWeight: 'bold',
    marginRight: 8,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
  selectedTimeFrameButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  moreOptionsButton: {
    fontSize: 18,
    padding: 2,
    color: 'gray',
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 4,
  },
  selectedItem: {
    backgroundColor: 'rgba(0, 0, 255, 0.1)', // Light blue background for selected items
  },
  deleteCheck: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
