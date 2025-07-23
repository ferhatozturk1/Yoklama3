import { compressImage, createThumbnail } from '../imageCompression';
import cacheService from '../cacheService';
import ApiService from '../ApiService';
import { debounce, throttle } from '../debounce';

// Mock global objects
global.URL = {
  createObjectURL: jest.fn(() => 'blob:mock-url'),
  revokeObjectURL: jest.fn()
};

// Mock canvas and context
const mockContext = {
  drawImage: jest.fn()
};

const mockCanvas = {
  getContext: jest.fn(() => mockContext),
  toBlob: jest.fn((callback) => callback(new Blob(['test'], { type: 'image/jpeg' }))),
};

global.document = {
  createElement: jest.fn(() => mockCanvas)
};

// Mock Image
global.Image = class {
  constructor() {
    setTimeout(() => {
      this.onload();
    }, 0);
    this.width = 1000;
    this.height = 800;
  }
};

// Mock FileReader
global.FileReader = class {
  constructor() {
    this.result = 'data:image/jpeg;base64,test';
  }
  readAsDataURL() {
    setTimeout(() => {
      this.onload({ target: { result: this.result } });
    }, 0);
  }
};

// Mock fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'test' }),
    blob: () => Promise.resolve(new Blob(['test'], { type: 'image/jpeg' }))
  })
);

describe('Performance Optimizations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Image Compression', () => {
    test('compressImage should optimize images efficiently', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      const start = Date.now();
      const result = await compressImage(file);
      const end = Date.now();
      
      expect(result).toBeDefined();
      expect(end - start).toBeLessThan(100); // Should be fast
    });
    
    test('createThumbnail should generate thumbnails efficiently', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      const start = Date.now();
      const result = await createThumbnail(file);
      const end = Date.now();
      
      expect(result).toBeDefined();
      expect(end - start).toBeLessThan(100); // Should be fast
    });
    
    test('should skip compression for small files', async () => {
      const smallFile = new File(['small'], 'small.jpg', { 
        type: 'image/jpeg',
      });
      
      // Mock file size to be small
      Object.defineProperty(smallFile, 'size', { value: 50 * 1024 }); // 50KB
      
      const result = await compressImage(smallFile);
      
      // Should return the original file for small files
      expect(result).toBe(smallFile);
    });
  });
  
  describe('Cache Service', () => {
    test('should efficiently retrieve cached items', () => {
      const key = 'test-key';
      const value = { data: 'test-data' };
      
      cacheService.set(key, value);
      
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        cacheService.get(key);
      }
      const end = Date.now();
      
      expect(end - start).toBeLessThan(50); // Should be very fast
    });
    
    test('should handle cache eviction efficiently', () => {
      // Fill the cache to max size
      for (let i = 0; i < 100; i++) {
        cacheService.set(`key-${i}`, { data: `value-${i}` });
      }
      
      // Add one more to trigger eviction
      const start = Date.now();
      cacheService.set('new-key', { data: 'new-value' });
      const end = Date.now();
      
      expect(end - start).toBeLessThan(10); // Eviction should be fast
      expect(cacheService.get('new-key')).toBeDefined();
    });
  });
  
  describe('API Service', () => {
    test('should handle API requests efficiently', async () => {
      const start = Date.now();
      await ApiService.fetchUserProfile('user123');
      const end = Date.now();
      
      expect(end - start).toBeLessThan(100); // Should be fast
    });
    
    test('should use cache for repeated requests', async () => {
      // First request
      await ApiService.fetchUserProfile('user123');
      
      // Second request should be faster due to caching
      const start = Date.now();
      await ApiService.fetchUserProfile('user123');
      const end = Date.now();
      
      expect(end - start).toBeLessThan(10); // Should be very fast with cache
    });
  });
  
  describe('Debounce and Throttle', () => {
    test('debounce should limit function calls efficiently', () => {
      jest.useFakeTimers();
      
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      // Call multiple times in quick succession
      for (let i = 0; i < 10; i++) {
        debouncedFn();
      }
      
      // No immediate calls
      expect(mockFn).not.toHaveBeenCalled();
      
      // Fast forward time
      jest.advanceTimersByTime(150);
      
      // Should be called exactly once
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      jest.useRealTimers();
    });
    
    test('throttle should limit function calls efficiently', () => {
      jest.useFakeTimers();
      
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);
      
      // Call multiple times in quick succession
      for (let i = 0; i < 10; i++) {
        throttledFn();
        jest.advanceTimersByTime(20); // Advance time a bit between calls
      }
      
      // Should be called only a few times due to throttling
      expect(mockFn.mock.calls.length).toBeLessThan(5);
      
      jest.useRealTimers();
    });
  });
});