const cache = new Map();

export const getFromCache = (key) => {
  const cachedData = cache.get(key);
  if (cachedData && cachedData.expiry > Date.now()) {
    return cachedData.value;
  }
  cache.delete(key); // Remove expired cache
  return null;
};

export const setToCache = (key, value, ttl = 6000000) => { // Default TTL: 60 seconds
  const expiry = Date.now() + ttl;
  cache.set(key, { value, expiry });
};
