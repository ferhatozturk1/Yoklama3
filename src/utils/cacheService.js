/**
 * Enhanced in-memory cache service for API responses with memory management
 */
class CacheService {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map(); // Time-to-live for each cache entry
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.maxCacheSize = 100; // Maximum number of items in cache
    this.accessCount = new Map(); // Track access frequency for LRU eviction
    
    // Set up periodic cleanup
    if (typeof window !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Clean up every minute
    }
  }
  
  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if not found or expired
   */
  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }
    
    // Check if the cache entry has expired
    const expiryTime = this.ttl.get(key);
    if (expiryTime && Date.now() > expiryTime) {
      this.delete(key);
      return null;
    }
    
    // Update access count for LRU algorithm
    this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1);
    
    return this.cache.get(key);
  }
  
  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time-to-live in milliseconds (optional)
   */
  set(key, value, ttl = this.defaultTTL) {
    // Check if we need to evict items before adding new one
    if (this.cache.size >= this.maxCacheSize && !this.cache.has(key)) {
      this.evictLRU();
    }
    
    this.cache.set(key, value);
    
    if (ttl > 0) {
      this.ttl.set(key, Date.now() + ttl);
    }
    
    // Initialize access count
    this.accessCount.set(key, 1);
  }
  
  /**
   * Delete a value from the cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
    this.accessCount.delete(key);
  }
  
  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.ttl.clear();
    this.accessCount.clear();
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * @param {string} key - Cache key
   * @returns {boolean} - True if the key exists and is not expired
   */
  has(key) {
    if (!this.cache.has(key)) {
      return false;
    }
    
    // Check if the cache entry has expired
    const expiryTime = this.ttl.get(key);
    if (expiryTime && Date.now() > expiryTime) {
      this.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Evict least recently used items from cache
   * @private
   */
  evictLRU() {
    // Find the item with the lowest access count
    let minKey = null;
    let minCount = Infinity;
    
    for (const [key, count] of this.accessCount.entries()) {
      if (count < minCount) {
        minCount = count;
        minKey = key;
      }
    }
    
    // Delete the least recently used item
    if (minKey) {
      this.delete(minKey);
    }
  }
  
  /**
   * Clean up expired items
   * @private
   */
  cleanup() {
    const now = Date.now();
    
    // Check all TTL entries and remove expired ones
    for (const [key, expiryTime] of this.ttl.entries()) {
      if (now > expiryTime) {
        this.delete(key);
      }
    }
  }
  
  /**
   * Dispose of resources when no longer needed
   */
  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Create a singleton instance
const cacheService = new CacheService();

export default cacheService;