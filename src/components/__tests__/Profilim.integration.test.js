import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profilim from '../Profilim';
import ApiService from '../../utils/ApiService';
import MockApiService from '../../utils/MockApiService';

// Mock the API services
jest.mock('../../utils/ApiService');
jest.mock('../../utils/MockApiService');

describe('Profilim Component API Integration', () => {
  const mockUserId = 'user123';
  const mockProfile = {
    id: mockUserId,
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@example.com',
    phone: '+90 555 123 4567',
    university: 'Manisa Celal Bayar Üniversitesi',
    faculty: 'Mühendislik Fakültesi',
    department: 'Bilgisayar Mühendisliği',
    profilePhoto: 'https://example.com/photo.jpg',
    compulsoryEducation: 'Lisans: Bilgisayar Mühendisliği',
    otherDetails: 'Veri bilimi uzmanı',
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock API responses
    ApiService.fetchUserProfile.mockResolvedValue(mockProfile);
    ApiService.updateUserProfile.mockResolvedValue({
      ...mockProfile,
      updatedAt: new Date().toISOString(),
    });
    ApiService.uploadProfilePhoto.mockResolvedValue('https://example.com/new-photo.jpg');
    
    // Mock environment variable
    process.env.REACT_APP_USE_MOCK_API = 'false';
  });

  test('fetches user profile data on component mount', async () => {
    render(<Profilim userId={mockUserId} />);
    
    // Should show loading state initially
    expect(screen.getByText(/yükleniyor/i)).toBeInTheDocument();
    
    // Wait for profile data to load
    await waitFor(() => {
      expect(ApiService.fetchUserProfile).toHaveBeenCalledWith(mockUserId);
      expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument();
    });
  });

  test('handles API error when fetching profile', async () => {
    // Mock API error
    ApiService.fetchUserProfile.mockRejectedValue(new Error('Bağlantı hatası. İnternet bağlantınızı kontrol edin.'));
    
    // Mock fallback data
    MockApiService.mockUserData = {
      [mockUserId]: mockProfile
    };
    
    render(<Profilim userId={mockUserId} />);
    
    // Wait for error handling
    await waitFor(() => {
      expect(screen.getByText('Bağlantı hatası. İnternet bağlantınızı kontrol edin.')).toBeInTheDocument();
      // Should still render with fallback data
      expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument();
    });
  });

  test('updates profile via API when saving changes', async () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // Change some profile data
    const firstNameInput = screen.getAllByLabelText('Ad')[0];
    fireEvent.change(firstNameInput, { target: { value: 'Mehmet' } });
    
    // Save changes
    const saveButton = screen.getByText('Profili Kaydet');
    fireEvent.click(saveButton);
    
    // Wait for API call and success message
    await waitFor(() => {
      expect(ApiService.updateUserProfile).toHaveBeenCalled();
      expect(ApiService.updateUserProfile.mock.calls[0][0]).toHaveProperty('firstName', 'Mehmet');
      expect(screen.getByText('Profil başarıyla kaydedildi.')).toBeInTheDocument();
    });
  });

  test('handles API error when saving profile', async () => {
    // Mock API error for update
    ApiService.updateUserProfile.mockRejectedValue(new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.'));
    
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // Save changes
    const saveButton = screen.getByText('Profili Kaydet');
    fireEvent.click(saveButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(ApiService.updateUserProfile).toHaveBeenCalled();
      expect(screen.getByText('Sunucu hatası. Lütfen daha sonra tekrar deneyin.')).toBeInTheDocument();
    });
  });

  test('uploads profile photo when saving with new photo', async () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // Mock file upload
    const file = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });
    const photoUploadButton = screen.getByText('Fotoğraf Yükle');
    
    // Create a mock file input change event
    const fileInput = screen.getByAcceptText('image/jpeg,image/jpg,image/png,image/gif');
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    fireEvent.change(fileInput);
    
    // Save changes
    const saveButton = screen.getByText('Profili Kaydet');
    fireEvent.click(saveButton);
    
    // Wait for both API calls
    await waitFor(() => {
      expect(ApiService.uploadProfilePhoto).toHaveBeenCalledWith(file);
      expect(ApiService.updateUserProfile).toHaveBeenCalled();
      expect(ApiService.updateUserProfile.mock.calls[0][0].profilePhoto).toBe('https://example.com/new-photo.jpg');
    });
  });

  test('handles photo upload error but continues with profile update', async () => {
    // Mock photo upload error
    ApiService.uploadProfilePhoto.mockRejectedValue(new Error('Dosya yükleme başarısız. Lütfen tekrar deneyin.'));
    
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // Mock file upload
    const file = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByAcceptText('image/jpeg,image/jpg,image/png,image/gif');
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    fireEvent.change(fileInput);
    
    // Save changes
    const saveButton = screen.getByText('Profili Kaydet');
    fireEvent.click(saveButton);
    
    // Wait for error handling and profile update
    await waitFor(() => {
      expect(ApiService.uploadProfilePhoto).toHaveBeenCalled();
      expect(screen.getByText('Dosya yükleme başarısız. Lütfen tekrar deneyin.')).toBeInTheDocument();
      // Should still update profile
      expect(ApiService.updateUserProfile).toHaveBeenCalled();
    });
  });

  test('uses mock API service when environment variable is set', async () => {
    // Set environment to use mock API
    process.env.REACT_APP_USE_MOCK_API = 'true';
    
    // Mock MockApiService methods
    MockApiService.fetchUserProfile.mockResolvedValue(mockProfile);
    
    render(<Profilim userId={mockUserId} />);
    
    // Wait for profile data to load using mock service
    await waitFor(() => {
      expect(MockApiService.fetchUserProfile).toHaveBeenCalledWith(mockUserId);
      expect(ApiService.fetchUserProfile).not.toHaveBeenCalled();
      expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument();
    });
  });
});