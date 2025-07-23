/**
 * Mock API Service for profile management
 * Used for development and testing without a real backend
 */
class MockApiService {
  /**
   * Simulated network delay in milliseconds
   */
  static delay = 800;
  
  /**
   * Simulated failure rate (0-1)
   * Set to 0 for no failures, 1 for always fail
   */
  static failureRate = 0.1;
  
  /**
   * Mock user data storage
   */
  static mockUserData = {
    'user123': {
      id: 'user123',
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
      createdAt: new Date('2023-01-15').toISOString(),
      updatedAt: new Date('2023-06-22').toISOString()
    },
    'user456': {
      id: 'user456',
      firstName: 'Ayşe',
      lastName: 'Demir',
      name: 'Ayşe Demir',
      title: 'Prof.',
      email: 'ayse.demir@example.com',
      phone: '+90 555 987 6543',
      university: 'İstanbul Teknik Üniversitesi',
      faculty: 'Fen Bilimleri Fakültesi',
      department: 'Fizik',
      profilePhoto: 'https://randomuser.me/api/portraits/women/44.jpg',
      compulsoryEducation: 'Lisans: Fizik, Doktora: Kuantum Fiziği',
      otherDetails: 'Parçacık fiziği alanında araştırmalar yapmaktadır.',
      createdAt: new Date('2023-02-10').toISOString(),
      updatedAt: new Date('2023-05-15').toISOString()
    }
  };
  
  /**
   * Simulate network delay
   * @returns {Promise<void>}
   */
  static async simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }
  
  /**
   * Simulate random failures
   * @throws {Error} - Random error based on failure rate
   */
  static simulateFailure() {
    if (Math.random() < this.failureRate) {
      const errors = [
        { status: 400, message: 'Validation error' },
        { status: 401, message: 'Unauthorized' },
        { status: 403, message: 'Forbidden' },
        { status: 404, message: 'Not found' },
        { status: 500, message: 'Server error' }
      ];
      
      const randomError = errors[Math.floor(Math.random() * errors.length)];
      throw new Error(`HTTP error ${randomError.status}`);
    }
  }
  
  /**
   * Fetch user profile data
   * @param {string} userId - User ID to fetch profile for
   * @returns {Promise<Object>} - User profile data
   */
  static async fetchUserProfile(userId) {
    await this.simulateNetworkDelay();
    this.simulateFailure();
    
    const user = this.mockUserData[userId];
    if (!user) {
      throw new Error('HTTP error 404');
    }
    
    return { ...user };
  }
  
  /**
   * Update user profile data
   * @param {Object} profile - Updated profile data
   * @returns {Promise<Object>} - Updated profile data
   */
  static async updateUserProfile(profile) {
    await this.simulateNetworkDelay();
    this.simulateFailure();
    
    if (!profile || !profile.id) {
      throw new Error('HTTP error 400');
    }
    
    const user = this.mockUserData[profile.id];
    if (!user) {
      throw new Error('HTTP error 404');
    }
    
    // Update user data
    const updatedUser = {
      ...user,
      ...profile,
      updatedAt: new Date().toISOString()
    };
    
    // Update mock storage
    this.mockUserData[profile.id] = updatedUser;
    
    return { ...updatedUser };
  }
  
  /**
   * Upload profile photo
   * @param {File} file - Image file to upload
   * @returns {Promise<string>} - URL of the uploaded photo
   */
  static async uploadProfilePhoto(file) {
    await this.simulateNetworkDelay();
    this.simulateFailure();
    
    if (!file) {
      throw new Error('HTTP error 400');
    }
    
    // Generate random photo URL
    const randomId = Math.floor(Math.random() * 100);
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const photoUrl = `https://randomuser.me/api/portraits/${gender}/${randomId}.jpg`;
    
    return photoUrl;
  }
  
  /**
   * Delete profile photo
   * @param {string} photoId - ID of the photo to delete
   * @returns {Promise<boolean>}
   */
  static async deleteProfilePhoto(photoId) {
    await this.simulateNetworkDelay();
    this.simulateFailure();
    
    if (!photoId) {
      throw new Error('HTTP error 400');
    }
    
    return true;
  }
  
  /**
   * Get current user ID (for demo purposes)
   * @returns {string} - User ID
   */
  static getCurrentUserId() {
    // In a real app, this would come from authentication
    return 'user123';
  }
}

export default MockApiService;