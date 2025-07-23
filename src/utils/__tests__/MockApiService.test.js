import MockApiService from '../MockApiService';

describe('MockApiService', () => {
  beforeEach(() => {
    // Reset failure rate to 0 for predictable tests
    MockApiService.failureRate = 0;
    // Set a shorter delay for faster tests
    MockApiService.delay = 10;
  });

  describe('fetchUserProfile', () => {
    it('should fetch user profile successfully', async () => {
      const userId = 'user123';
      const result = await MockApiService.fetchUserProfile(userId);
      
      expect(result).toHaveProperty('id', userId);
      expect(result).toHaveProperty('firstName', 'Ahmet');
      expect(result).toHaveProperty('lastName', 'Yılmaz');
    });

    it('should throw 404 error for non-existent user', async () => {
      await expect(MockApiService.fetchUserProfile('nonexistent')).rejects.toThrow('HTTP error 404');
    });

    it('should simulate network failures when failure rate > 0', async () => {
      MockApiService.failureRate = 1; // Always fail
      
      await expect(MockApiService.fetchUserProfile('user123')).rejects.toThrow('HTTP error');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const updatedProfile = {
        id: 'user123',
        firstName: 'Updated',
        lastName: 'User'
      };
      
      const result = await MockApiService.updateUserProfile(updatedProfile);
      
      expect(result.firstName).toBe('Updated');
      expect(result.lastName).toBe('User');
      expect(result.updatedAt).not.toBe(MockApiService.mockUserData['user123'].updatedAt);
    });

    it('should throw 400 error for invalid profile data', async () => {
      await expect(MockApiService.updateUserProfile(null)).rejects.toThrow('HTTP error 400');
      await expect(MockApiService.updateUserProfile({})).rejects.toThrow('HTTP error 400');
    });

    it('should throw 404 error for non-existent user', async () => {
      await expect(MockApiService.updateUserProfile({ id: 'nonexistent' })).rejects.toThrow('HTTP error 404');
    });
  });

  describe('uploadProfilePhoto', () => {
    it('should upload profile photo successfully', async () => {
      const mockFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });
      const result = await MockApiService.uploadProfilePhoto(mockFile);
      
      expect(result).toMatch(/^https:\/\/randomuser\.me\/api\/portraits\/(men|women)\/\d+\.jpg$/);
    });

    it('should throw 400 error for invalid file', async () => {
      await expect(MockApiService.uploadProfilePhoto(null)).rejects.toThrow('HTTP error 400');
    });
  });

  describe('deleteProfilePhoto', () => {
    it('should delete profile photo successfully', async () => {
      const result = await MockApiService.deleteProfilePhoto('photo123');
      
      expect(result).toBe(true);
    });

    it('should throw 400 error for invalid photo ID', async () => {
      await expect(MockApiService.deleteProfilePhoto(null)).rejects.toThrow('HTTP error 400');
    });
  });

  describe('getCurrentUserId', () => {
    it('should return a valid user ID', () => {
      const userId = MockApiService.getCurrentUserId();
      
      expect(userId).toBe('user123');
      expect(MockApiService.mockUserData).toHaveProperty(userId);
    });
  });

  describe('simulateNetworkDelay', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await MockApiService.simulateNetworkDelay();
      const elapsed = Date.now() - start;
      
      expect(elapsed).toBeGreaterThanOrEqual(MockApiService.delay - 5); // Allow small timing variations
    });
  });

  describe('simulateFailure', () => {
    it('should not throw error when failure rate is 0', () => {
      MockApiService.failureRate = 0;
      
      expect(() => MockApiService.simulateFailure()).not.toThrow();
    });

    it('should throw error when failure rate is 1', () => {
      MockApiService.failureRate = 1;
      
      expect(() => MockApiService.simulateFailure()).toThrow('HTTP error');
    });
  });
});