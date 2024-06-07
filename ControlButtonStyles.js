import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 0,
    marginHorizontal: 10,
  },
  sortButton: {
    backgroundColor: '#F0F4F8',
    padding: 8,
    borderRadius: 4,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E0E4ED',
  },
  selectedButton: {
    backgroundColor: 'white',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  selectedText: {
    color: 'white',
  },
  buttonText: {
    fontSize: 12,
    color: '#291F58',
  },
  deleteToggle: {
    padding: 8,
    borderRadius: 4,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E0E4ED',
    backgroundColor: '#F0F4F8',
  },
  deleteToggleText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'light',
    marginRight: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E4ED',
    borderRadius: 4,
    backgroundColor: '#F0F4F8',
  },
  dropdownButtonText: {
    marginRight: 0,
    marginLeft: 18,
    fontSize: 14,
    color: '#291F58',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
  },
  modalItem: {
    padding: 10,
  },
  modalItemText: {
    fontSize: 16,
    color: '#291F58',
  },
  ChevronDown: {
    paddingTop: 9,
    marginLeft: 10,
    position: 'absolute',
    fontFamily: 'bold',
    color: 'darkblue'
  }
});
