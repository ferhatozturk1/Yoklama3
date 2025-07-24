import { getLocalizedText } from './localization';
import cacheService from './cacheService';

/**
 * API Service for profile management
 * Handles all API communications for user profile data
 */
class ApiService {
  /**
   * Base URL for API requests
   * This should be configured based on environment
   */
  static baseUrl = process.env.REACT_APP_API_URL || 'https://api.example.com';
  
  /**
   * Default request timeout in milliseconds
   */
  static timeout = 10000;
  
  /**
   * Fetch user profile data from the API
   * @param {string} userId - User ID to fetch profile for
   * @param {boolean} bypassCache - Whether to bypass the cache
   * @returns {Promise<Object>} - User profile data
   */
  static async fetchUserProfile(userId, bypassCache = false) {
    const cacheKey = `profile_${userId}`;
    
    // Check cache first if not bypassing
    if (!bypassCache) {
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }
    
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/users/${userId}/profile`);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the result for 5 minutes
      cacheService.set(cacheKey, data, 5 * 60 * 1000);
      
      return data;
    } catch (error) {
      this.handleApiError(error);
    }
  }
  
  /**
   * Update user profile data
   * @param {Object} profile - Updated profile data
   * @returns {Promise<Object>} - Updated profile data from server
   */
  static async updateUserProfile(profile) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/users/${profile.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update the cache with the new data
      const cacheKey = `profile_${profile.id}`;
      cacheService.set(cacheKey, data);
      
      return data;
    } catch (error) {
      this.handleApiError(error);
    }
  }
  
  /**
   * Upload profile photo
   * @param {File} file - Image file to upload
   * @returns {Promise<string>} - URL of the uploaded photo
   */
  static async uploadProfilePhoto(file) {
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await this.fetchWithTimeout(`${this.baseUrl}/profile/photo`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      return data.photoUrl;
    } catch (error) {
      this.handleApiError(error);
    }
  }
  
  /**
   * Delete profile photo
   * @param {string} photoId - ID of the photo to delete
   * @returns {Promise<void>}
   */
  static async deleteProfilePhoto(photoId) {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/profile/photo/${photoId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      return true;
    } catch (error) {
      this.handleApiError(error);
    }
  }
  
  /**
   * Fetch with timeout utility
   * @param {string} url - URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} - Fetch response
   */
  static async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);
    
    // Add default headers for better performance
    const headers = {
      ...options.headers,
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };
    
    // Add cache control headers for GET requests
    if (!options.method || options.method === 'GET') {
      headers['Cache-Control'] = 'max-age=300'; // 5 minutes
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        // Use keep-alive for better connection reuse
        keepalive: true
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }
  
  /**
   * Handle API errors with appropriate Turkish error messages
   * @param {Error} error - Error object
   * @throws {Error} - Rethrows error with localized message
   */
  static handleApiError(error) {
    // Network errors
    if (error.name === 'AbortError') {
      throw new Error(getLocalizedText('networkError'));
    }
    
    if (error.message === 'Failed to fetch' || !navigator.onLine) {
      throw new Error(getLocalizedText('networkError'));
    }
    
    // HTTP errors
    if (error.message.includes('HTTP error')) {
      const status = error.message.split(' ').pop();
      
      switch (status) {
        case '400':
          throw new Error(getLocalizedText('validationError'));
        case '401':
        case '403':
          throw new Error('Yetkilendirme hatası. Lütfen tekrar giriş yapın.');
        case '404':
          throw new Error('Profil bulunamadı.');
        case '500':
        case '502':
        case '503':
          throw new Error(getLocalizedText('serverError'));
        default:
          throw new Error(getLocalizedText('serverError'));
      }
    }
    
    // Default error
    throw new Error(getLocalizedText('serverError'));
  }
  
  /**
   * Get mock user profile data for development
   * @returns {Object} - Mock user profile
   */
  static getMockUserProfile() {
    return {
      id: 'user123',
<<<<<<< HEAD
      firstName: 'MEHMET NURİ',
      lastName: 'ÖĞÜT',
      name: 'MEHMET NURİ ÖĞÜT',
      title: 'Öğretim Görevlisi',
      email: 'mehmetnuri.ogut@cbu.edu.tr',
      phone: '+90 236 201 1163',
      university: 'MANİSA TEKNİK BİLİMLER MESLEK YÜKSEKOKULU',
      faculty: 'MAKİNE VE METAL TEKNOLOJİLERİ',
      department: 'ENDÜSTRİYEL KALIPÇILIK',
      profilePhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
      webUrl: 'https://avesis.mcbu.edu.tr/mehmetnuri.ogut',
      otherDetails: 'WoS Araştırma Alanları: Bilgisayar Bilimi, Yapay Zeka, Matematik\nDiğer E-posta: mehmetnuri.ogut@gmail.com',
=======
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      name: 'Ahmet Yılmaz',
      title: 'Dr.',
      email: 'ahmet.yilmaz@example.com',
      phone: '+90 555 123 4567',
      university: 'Manisa Celal Bayar Üniversitesi',
      faculty: 'Mühendislik Fakültesi',
      department: 'Bilgisayar Mühendisliği',
      profilePhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
      compulsoryEducation: 'Lisans: Bilgisayar Mühendisliği, Yüksek Lisans: Yapay Zeka',
      otherDetails: 'Veri bilimi ve makine öğrenmesi alanlarında uzmanlaşmış.',
>>>>>>> b458935077ae6d999bd4305048ef9f3ae0601500
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-06-22')
    };
  }
}

export default ApiService;