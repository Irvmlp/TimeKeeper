import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  ItemContainerMaster: {
    flexGrow: 1, 
    paddingHorizontal: 11,

  },
  itemContainer: {
    padding: 11,
    marginVertical: 3, 
    marginHorizontal: 1.2, 
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowRadius: 2,
    elevation: 4,
    backgroundColor: '#F0F4F8',
    borderColor: '#E0E4ED',
    borderRadius: 4,
      justifyContent: 'center', // Center the item vertically in the container
      alignItems: 'center', // Center the item horizontally in the container
    

  },
  item: {
    width: 19,
    height: 19,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextContainer: {
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  durationText: {
    fontSize: 20,
    marginHorizontal: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#007AFF',
  },
  errorText: {
    color: 'red',
    marginTop: 12,
    fontSize: 16,
  },
  button: {
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  adjustButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E4ED',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  adjustButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  
});

