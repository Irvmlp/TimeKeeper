// frontend/apiService.js
import axios from 'axios';
import { getFromCache, setToCache } from './cache';

const BASE_URL = 'http://localhost:3000'; // Ensure this URL matches your backend server

export const fetchData = async (id) => {
  const cacheKey = `data-${id}`;
  const cachedData = getFromCache(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${BASE_URL}/data/${id}`);
    const data = response.data;
    setToCache(cacheKey, data); // Cache the data
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
