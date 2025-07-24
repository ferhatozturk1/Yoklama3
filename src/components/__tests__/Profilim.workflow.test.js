import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profilim from '../Profilim';
import ApiService from '../../utils/ApiService';
import MockApiService from '../../utils/MockApiService';

// Mock the API services
jest.mock('../../utils/ApiService');
jest.mock('../../utils/MockApiService');

describe('Profilim Component Complete Workflow', () => {
  const mockProfile = {
    id: 'user123',
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
    jest.clearAllMocks();
    
    // Mock API responses
    ApiService.fetchUserProfile.mockResolvedValue(mockProfile);
    ApiService.updateUserProfile.mockImplementation(async (profile) => ({
      ...profile,
      updatedAt: new Date().toISOString(),
    }));
    ApiService.uploadProfilePhoto.mockResolvedValue('https://example.com/new-photo.jpg');
    
    // Mock URL.createObjectURL
    URL.createObjectURL = jest.fn(() => 'blob:https://example.com/mock-object-url');
    URL.revokeObjectURL = jest.fn();
  });

  test('complete profile editing workflow', async () => {
    // Render component
    render(<Profilim userProfile={mockProfile} />);
    
    // 1. Initial state check
    expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument();
    expect(screen.getByText('Manisa Celal Bayar Üniversitesi')).toBeInTheDocument();
    
    // 2. Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // 3. Verify edit mode is active
    expect(screen.getByText('Profili Kaydet')).toBeInTheDocument();
    expect(screen.getByText('İptal')).toBeInTheDocument();
    
    // 4. Edit form fields
    const firstNameInput = screen.getAllByLabelText('Ad')[0];
    const lastNameInput = screen.getAllByLabelText('Soyad')[0];
    const emailInput = screen.getAllByLabelText('E-posta')[0];
    const universityInput = screen.getByLabelText('Üniversite');
    
    fireEvent.change(firstNameInput, { target: { value: 'Mehmet' } });
    fireEvent.change(lastNameInput, { target: { value: 'Demir' } });
    fireEvent.change(emailInput, { target: { value: 'mehmet.demir@example.com' } });
    fireEvent.change(universityInput, { target: { value: 'İstanbul Teknik Üniversitesi' } });
    
    // 5. Upload a new profile photo
    const file = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      configurable: true
    });
    
    fireEvent.change(fileInput);
    
    // 6. Save changes
    const saveButton = screen.getByText('Profili Kaydet');
    fireEvent.click(saveButton);
    
    // 7. Verify API calls
    await waitFor(() => {
      expect(ApiService.uploadProfilePhoto).toHaveBeenCalledWith(file);
      expect(ApiService.updateUserProfile).toHaveBeenCalled();
      
      const updatedProfile = ApiService.updateUserProfile.mock.calls[0][0];
      expect(updatedProfile.firstName).toBe('Mehmet');
      expect(updatedProfile.lastName).toBe('Demir');
      expect(updatedProfile.email).toBe('mehmet.demir@example.com');
      expect(updatedProfile.university).toBe('İstanbul Teknik Üniversitesi');
      expect(updatedProfile.profilePhoto).toBe('https://example.com/new-photo.jpg');
    });
    
    // 8. Verify success message
    expect(screen.getByText('Profil başarıyla kaydedildi.')).toBeInTheDocument();
    
    // 9. Verify component returned to view mode with updated data
    expect(screen.getByText('Mehmet Demir')).toBeInTheDocument();
    expect(screen.getByText('İstanbul Teknik Üniversitesi')).toBeInTheDocument();
  });
  
  test('cancel editing workflow', async () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // Make changes
    const firstNameInput = screen.getAllByLabelText('Ad')[0];
    fireEvent.change(firstNameInput, { target: { value: 'Mehmet' } });
    
    // Cancel changes
    const cancelButton = screen.getByText('İptal');
    fireEvent.click(cancelButton);
    
    // Verify we're back in view mode with original data
    expect(screen.getByText('Profili Düzenle')).toBeInTheDocument();
    expect(screen.getByText('Ahmet Yılmaz')).toBeInTheDocument();
    
    // Verify no API calls were made
    expect(ApiService.updateUserProfile).not.toHaveBeenCalled();
  });
  
  test('validation error workflow', async () => {
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // Clear required field
    const firstNameInput = screen.getAllByLabelText('Ad')[0];
    fireEvent.change(firstNameInput, { target: { value: '' } });
    
    // Try to save
    const saveButton = screen.getByText('Profili Kaydet');
    fireEvent.click(saveButton);
    
    // Verify error message
    expect(screen.getByText('Bu alan zorunludur.')).toBeInTheDocument();
    
    // Verify we're still in edit mode
    expect(screen.getByText('Profili Kaydet')).toBeInTheDocument();
    
    // Verify no API calls were made
    expect(ApiService.updateUserProfile).not.toHaveBeenCalled();
  });
  
  test('API error workflow', async () => {
    // Mock API error
    ApiService.updateUserProfile.mockRejectedValue(new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.'));
    
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // Make valid changes
    const firstNameInput = screen.getAllByLabelText('Ad')[0];
    fireEvent.change(firstNameInput, { target: { value: 'Mehmet' } });
    
    // Save changes
    const saveButton = screen.getByText('Profili Kaydet');
    fireEvent.click(saveButton);
    
    // Verify error message
    await waitFor(() => {
      expect(screen.getByText('Sunucu hatası. Lütfen daha sonra tekrar deneyin.')).toBeInTheDocument();
    });
    
    // Verify we're still in edit mode
    expect(screen.getByText('Profili Kaydet')).toBeInTheDocument();
  });
  
  test('photo upload error workflow', async () => {
    // Mock photo upload error but successful profile update
    ApiService.uploadProfilePhoto.mockRejectedValue(new Error('Dosya yükleme başarısız. Lütfen tekrar deneyin.'));
    
    render(<Profilim userProfile={mockProfile} />);
    
    // Enter edit mode
    const editButton = screen.getByText('Profili Düzenle');
    fireEvent.click(editButton);
    
    // Upload a photo
    const file = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      configurable: true
    });
    
    fireEvent.change(fileInput);
    
    // Save changes
    const saveButton = screen.getByText('Profili Kaydet');
    fireEvent.click(saveButton);
    
    // Verify error message for photo upload
    await waitFor(() => {
      expect(screen.getByText('Dosya yükleme başarısız. Lütfen tekrar deneyin.')).toBeInTheDocument();
    });
    
    // But profile update should still be called
    expect(ApiService.updateUserProfile).toHaveBeenCalled();
  });
});