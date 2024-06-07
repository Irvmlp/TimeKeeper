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
    width: screenWidth - 26,
    margin: 4,
    padding: 3,
    borderBottomWidth: 0.4,
    borderBottomColor: 'gray',
    shadowRadius: 2,
    elevation: 4,
    backgroundColor: '#F0F4F8',
    borderColor: '#E0E4ED',
    borderRadius: 4, 
  },
  goodItem: {
    backgroundColor: 'lightgreen',
    /* backgroundColor: '#F0F4F8', */
    borderColor: '#E0E4ED',
  },
  badItem: {
    backgroundColor: 'lightcoral',
    /* backgroundColor: '#F0F4F8', */
    borderColor: '#E0E4ED',
  },
  unloggedTimeItem: {
    backgroundColor: 'lightgray',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  itemEmoji: {
    fontSize: 14,
    paddingHorizontal: 3,
  },
  itemText2: {
    flex: 1,
    color: '#291F58',
    paddingHorizontal: 3,
  },
  exclamationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 3,
  },
  itemText3: {
    fontFamily: 'bold',
    color: '#291F58',
    textAlign: 'left',
  },
  exclamationMark: {
    fontSize: 14,
    fontFamily: 'bold',
    color: '#291F58',
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
    backgroundColor: '#F3D2CE', // Light blue background for selected items
  },
  deleteCheck: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 2, 
  },
  sortButton: {
    backgroundColor: '#F0F4F8',
    padding: 8,
    borderRadius: 4,
    margin: 4,
    borderWidth: 1, // Add border width
    borderColor: '#E0E4ED', // Add border color
  },
  selectedButton: {
    backgroundColor: 'white', // Light blue for selected button
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,

  },
  selectedText: {
    color: 'white', // Change text color to white when selected
  },
  buttonText: {
    fontSize: 12,
    color: '#291F58',
  },
  deleteToggle: {
    padding: 8,
    borderRadius: 4,
    margin: 4,
    backgroundColor: '#F0F4F8',
    borderColor: '#E0E4ED',
  },
  deleteToggleText: {
    color: 'lightred',
    fontSize: 12,
  },
  chartContainer: {
    borderWidth: 1,
    borderColor: '#E0E4ED',
    borderRadius: 4,
    marginBottom: 8, 
    marginTop: 0, 
  },
});
