import MockApiService from '../MockApiService';

describe('MockApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    // Reset mock data to original state
    MockApiService.mockUserData = {
      'user123': {
        id: 'user123',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        name: 'Ahmet Yılmaz',
        // other properties...
      },
      'user456': {
        id: 'user456',
        firstName: 'Ayşe',
        lastName: 'Demir',
        name: 'Ayşe Demir',
        // other properties...
      }
    };
    
    // Set failure rate to 0 for predictable tests
    MockApiService.failureRate = 0;
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  describe('simulateNetworkDelay', () => {
    test('delays for the specified time', async () => {
      const delayPromise = MockApiService.simulateNetworkDelay();
      
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), MockApiService.delay);
      
      jest.advanceTimersByTime(MockApiService.delay);
      await expect(delayPromise).resolves.toBeUndefined();
    });
  });
  
  describe('simulateFailure', () => {
    test('does not throw when failure rate is 0', () => {
      MockApiService.failureRate = 0;
      expect(() => MockApiService.simulateFailure()).not.toThrow();
    });
    
    test('always throws when failure rate is 1', () => {
      MockApiService.failureRate = 1;
      expect(() => MockApiService.simulateFailure()).toThrow(/HTTP error/);
    });
  });
  
  describe('fetchUserProfile', () => {
    test('fetches existing user profile', async () => {
      const spy = jest.spyOn(MockApiService, 'simulateNetworkDelay');
      
      const result = await MockApiService.fetchUserProfile('user123');
      
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        id: 'user123',
        name: 'Ahmet Yılmaz'
      }));
    });
    
    test('throws 404 for non-existent user', async () => {
      await expect(MockApiService.fetchUserProfile('nonexistent')).rejects.toThrow('HTTP error 404');
    });
  });
  
  describe('updateUserProfile', () => {
    test('updates existing user profile', async () => {
      const updatedProfile = {
        id: 'user123',
        firstName: 'Mehmet',
        lastName: 'Yılmaz',
        name: 'Mehmet Yılmaz'
      };
      
      const result = await MockApiService.updateUserProfile(updatedProfile);
      
      expect(result).toEqual(expect.objectContaining({
        id: 'user123',
        firstName: 'Mehmet',
        name: 'Mehmet Yılmaz',
        updatedAt: expect.any(String)
      }));
      
      // Check that the mock data was updated
      expect(MockApiService.mockUserData['user123'].firstName).toBe('Mehmet');
    });
    
    test('throws 400 for profile without ID', async () => {
      await expect(MockApiService.updateUserProfile({})).rejects.toThrow('HTTP error 400');
    });
    
    test('throws 404 for non-existent user', async () => {
      await expect(MockApiService.updateUserProfile({ id: 'nonexistent' })).rejects.toThrow('HTTP error 404');
    });
  });
  
  describe('uploadProfilePhoto', () => {
    test('uploads photo and returns URL', async () => {
      const mockFile = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });
      
      const result = await MockApiService.uploadProfilePhoto(mockFile);
      
      expect(result).toMatch(/^https:\/\/randomuser\.me\/api\/portraits\/(men|women)\/\d+\.jpg$/);
    });
    
    test('throws 400 for null file', async () => {
      await expect(MockApiService.uploadProfilePhoto(null)).rejects.toThrow('HTTP error 400');
    });
  });
  
  describe('deleteProfilePhoto', () => {
    test('deletes photo successfully', async () => {
      const result = await MockApiService.deleteProfilePhoto('photo123');
      
      expect(result).toBe(true);
    });
    
    test('throws 400 for null photoId', async () => {
      await expect(MockApiService.deleteProfilePhoto(null)).rejects.toThrow('HTTP error 400');
    });
  });
  
  describe('getCurrentUserId', () => {
    test('returns default user ID', () => {
      expect(MockApiService.getCurrentUserId()).toBe('user123');
    });
  });
});