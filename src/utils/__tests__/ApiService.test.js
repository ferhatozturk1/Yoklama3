import ApiService from '../ApiService';

// Mock fetch globally
global.fetch = jest.fn();

// Mock AbortController
global.AbortController = class {
  constructor() {
    this.signal = {};
    this.abort = jest.fn();
  }
};

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

describe('ApiService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('fetchUserProfile', () => {
    it('should fetch user profile successfully', async () => {
      // Mock successful response
      const mockProfile = { id: 'user123', name: 'Test User' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile
      });

      const result = await ApiService.fetchUserProfile('user123');
      
      expect(fetch).toHaveBeenCalledWith(
        `${ApiService.baseUrl}/users/user123/profile`,
        expect.objectContaining({ signal: expect.anything() })
      );
      expect(result).toEqual(mockProfile);
    });

    it('should handle HTTP errors', async () => {
      // Mock error response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(ApiService.fetchUserProfile('user123')).rejects.toThrow('Profil bulunamadı.');
    });

    it('should handle network errors', async () => {
      // Mock network error
      fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

      await expect(ApiService.fetchUserProfile('user123')).rejects.toThrow('Bağlantı hatası. İnternet bağlantınızı kontrol edin.');
    });

    it('should handle timeout', async () => {
      // Mock timeout
      fetch.mockImplementationOnce(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {
            const error = new Error('AbortError');
            error.name = 'AbortError';
            reject(error);
          }, 11000);
        });
      });

      const promise = ApiService.fetchUserProfile('user123');
      jest.advanceTimersByTime(11000);
      
      await expect(promise).rejects.toThrow('Bağlantı hatası. İnternet bağlantınızı kontrol edin.');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      // Mock successful response
      const mockProfile = { id: 'user123', name: 'Updated User' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile
      });

      const result = await ApiService.updateUserProfile(mockProfile);
      
      expect(fetch).toHaveBeenCalledWith(
        `${ApiService.baseUrl}/users/user123/profile`,
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockProfile)
        })
      );
      expect(result).toEqual(mockProfile);
    });

    it('should handle validation errors', async () => {
      // Mock validation error
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      });

      await expect(ApiService.updateUserProfile({ id: 'user123' })).rejects.toThrow('Girilen bilgiler geçersiz. Lütfen kontrol edin.');
    });
  });

  describe('uploadProfilePhoto', () => {
    it('should upload profile photo successfully', async () => {
      // Mock successful response
      const mockResponse = { photoUrl: 'https://example.com/photo.jpg' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const mockFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });
      const result = await ApiService.uploadProfilePhoto(mockFile);
      
      expect(fetch).toHaveBeenCalledWith(
        `${ApiService.baseUrl}/profile/photo`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
      expect(result).toEqual(mockResponse.photoUrl);
    });

    it('should handle upload errors', async () => {
      // Mock error response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const mockFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });
      await expect(ApiService.uploadProfilePhoto(mockFile)).rejects.toThrow('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    });
  });

  describe('deleteProfilePhoto', () => {
    it('should delete profile photo successfully', async () => {
      // Mock successful response
      fetch.mockResolvedValueOnce({
        ok: true
      });

      const result = await ApiService.deleteProfilePhoto('photo123');
      
      expect(fetch).toHaveBeenCalledWith(
        `${ApiService.baseUrl}/profile/photo/photo123`,
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result).toBe(true);
    });

    it('should handle delete errors', async () => {
      // Mock error response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(ApiService.deleteProfilePhoto('photo123')).rejects.toThrow('Profil bulunamadı.');
    });
  });

  describe('getMockUserProfile', () => {
    it('should return a mock user profile', () => {
      const mockProfile = ApiService.getMockUserProfile();
      
      expect(mockProfile).toHaveProperty('id');
      expect(mockProfile).toHaveProperty('firstName');
      expect(mockProfile).toHaveProperty('lastName');
      expect(mockProfile).toHaveProperty('email');
      expect(mockProfile).toHaveProperty('profilePhoto');
    });
  });
});