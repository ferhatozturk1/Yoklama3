import ApiService from '../ApiService';
import { getLocalizedText } from '../localization';

// Mock fetch and localization
global.fetch = jest.fn();
jest.mock('../localization', () => ({
  getLocalizedText: jest.fn(key => {
    const translations = {
      networkError: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.',
      serverError: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
      validationError: 'Girilen bilgiler geçersiz. Lütfen kontrol edin.'
    };
    return translations[key] || key;
  })
}));

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  describe('fetchUserProfile', () => {
    test('fetches user profile successfully', async () => {
      const mockProfile = {
        id: 'user123',
        name: 'Ahmet Yılmaz'
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile
      });
      
      const result = await ApiService.fetchUserProfile('user123');
      
      expect(result).toEqual(mockProfile);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ApiService.baseUrl}/users/user123/profile`,
        expect.objectContaining({
          signal: expect.any(Object)
        })
      );
    });
    
    test('handles HTTP error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });
      
      await expect(ApiService.fetchUserProfile('user123')).rejects.toThrow('Profil bulunamadı.');
    });
    
    test('handles network error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
      
      await expect(ApiService.fetchUserProfile('user123')).rejects.toThrow(getLocalizedText('networkError'));
    });
    
    test('handles timeout', async () => {
      global.fetch.mockImplementationOnce(() => {
        return new Promise((_, reject) => {
          setTimeout(() => {}, ApiService.timeout + 100);
        });
      });
      
      const fetchPromise = ApiService.fetchUserProfile('user123');
      jest.advanceTimersByTime(ApiService.timeout + 10);
      
      await expect(fetchPromise).rejects.toThrow(getLocalizedText('networkError'));
    });
  });
  
  describe('updateUserProfile', () => {
    test('updates user profile successfully', async () => {
      const mockProfile = {
        id: 'user123',
        name: 'Ahmet Yılmaz'
      };
      
      const updatedProfile = {
        ...mockProfile,
        name: 'Mehmet Yılmaz'
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedProfile
      });
      
      const result = await ApiService.updateUserProfile(mockProfile);
      
      expect(result).toEqual(updatedProfile);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ApiService.baseUrl}/users/${mockProfile.id}/profile`,
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockProfile)
        })
      );
    });
    
    test('handles validation error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400
      });
      
      await expect(ApiService.updateUserProfile({ id: 'user123' })).rejects.toThrow(getLocalizedText('validationError'));
    });
  });
  
  describe('uploadProfilePhoto', () => {
    test('uploads photo successfully', async () => {
      const mockPhotoUrl = 'https://example.com/photo.jpg';
      const mockFile = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ photoUrl: mockPhotoUrl })
      });
      
      const result = await ApiService.uploadProfilePhoto(mockFile);
      
      expect(result).toEqual(mockPhotoUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ApiService.baseUrl}/profile/photo`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
    });
  });
  
  describe('deleteProfilePhoto', () => {
    test('deletes photo successfully', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true
      });
      
      const result = await ApiService.deleteProfilePhoto('photo123');
      
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        `${ApiService.baseUrl}/profile/photo/photo123`,
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });
  
  describe('handleApiError', () => {
    test('handles AbortError', () => {
      const error = new Error('The operation was aborted');
      error.name = 'AbortError';
      
      expect(() => ApiService.handleApiError(error)).toThrow(getLocalizedText('networkError'));
    });
    
    test('handles offline state', () => {
      const originalNavigator = global.navigator;
      Object.defineProperty(global, 'navigator', {
        value: { onLine: false },
        writable: true
      });
      
      expect(() => ApiService.handleApiError(new Error('Some error'))).toThrow(getLocalizedText('networkError'));
      
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true
      });
    });
    
    test('handles different HTTP status codes', () => {
      const testCases = [
        { status: 400, expectedMessage: getLocalizedText('validationError') },
        { status: 401, expectedMessage: 'Yetkilendirme hatası. Lütfen tekrar giriş yapın.' },
        { status: 403, expectedMessage: 'Yetkilendirme hatası. Lütfen tekrar giriş yapın.' },
        { status: 404, expectedMessage: 'Profil bulunamadı.' },
        { status: 500, expectedMessage: getLocalizedText('serverError') }
      ];
      
      testCases.forEach(({ status, expectedMessage }) => {
        const error = new Error(`HTTP error ${status}`);
        expect(() => ApiService.handleApiError(error)).toThrow(expectedMessage);
      });
    });
  });
  
  describe('getMockUserProfile', () => {
    test('returns mock profile data', () => {
      const mockProfile = ApiService.getMockUserProfile();
      
      expect(mockProfile).toHaveProperty('id');
      expect(mockProfile).toHaveProperty('firstName');
      expect(mockProfile).toHaveProperty('lastName');
      expect(mockProfile).toHaveProperty('name');
      expect(mockProfile).toHaveProperty('email');
      expect(mockProfile).toHaveProperty('phone');
      expect(mockProfile).toHaveProperty('university');
      expect(mockProfile.university).toBe('Manisa Celal Bayar Üniversitesi');
    });
  });
});